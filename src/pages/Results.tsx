import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingUp, 
  ArrowUp, 
  Star, 
  Clock, 
  Lock, 
  CheckCircle,
  Eye,
  EyeOff,
  CreditCard,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResultsSkeleton } from "@/components/ResultsSkeleton";

interface TrendResult {
  product: string;
  trend: string;
  platform: string;
  timeframe: string;
  confidence: number;
  risk: string;
  description: string;
  searchVolume: string;
  competitionLevel: string;
}

const Results = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<TrendResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [verifyingCheckout, setVerifyingCheckout] = useState(false);
  const { user, session, loading: authLoading, hasPaid, checkPaymentStatus, checkingPayment } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownSuccessToast = useRef(false);
  const hasStartedVerification = useRef(false);

  const sessionId = searchParams.get("session_id");
  const paymentStatus = searchParams.get("payment");
  const checkoutSessionId = searchParams.get("checkout_session_id");

  const FREE_PREVIEW_COUNT = 2;

  const cleanUpUrlParams = () => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("payment");
    newUrl.searchParams.delete("checkout_session_id");
    window.history.replaceState({}, "", newUrl.toString());
  };

  useEffect(() => {
    if (hasStartedVerification.current) return;
    
    if (paymentStatus === "success" && checkoutSessionId && !hasPaid) {
      hasStartedVerification.current = true;
      setVerifyingCheckout(true);
      
      toast({ title: "Payment successful!", description: "Verifying your subscription..." });
      
      const verifyPayment = async () => {
        let attempts = 0;
        const maxAttempts = 10;
        
        const poll = async () => {
          attempts++;
          const paid = await checkPaymentStatus(checkoutSessionId);
          
          if (paid) {
            setVerifyingCheckout(false);
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
            return;
          }
          
          if (attempts >= maxAttempts) {
            setVerifyingCheckout(false);
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
          }
        };
        
        await poll();
        
        if (!hasPaid && attempts < maxAttempts) {
          pollIntervalRef.current = setInterval(poll, 2000);
        }
      };
      
      verifyPayment();
    } else if (paymentStatus === "cancelled") {
      toast({ title: "Payment cancelled", description: "You can try again when you're ready.", variant: "destructive" });
      cleanUpUrlParams();
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [paymentStatus, checkoutSessionId, checkPaymentStatus, toast, hasPaid]);

  useEffect(() => {
    if (hasPaid && paymentStatus === "success" && !hasShownSuccessToast.current) {
      hasShownSuccessToast.current = true;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      toast({ title: "Results unlocked!", description: "You now have full access to all trend results." });
      cleanUpUrlParams();
    }
  }, [hasPaid, paymentStatus, toast]);

  useEffect(() => {
    const associateSearchWithUser = async () => {
      if (!user || !sessionId) return;
      try {
        await supabase
          .from("trend_results")
          .update({ user_id: user.id })
          .eq("session_id", sessionId)
          .is("user_id", null);
      } catch (error) {
        console.error("Error associating search with user:", error);
      }
    };
    associateSearchWithUser();
  }, [user, sessionId]);

  useEffect(() => {
    const loadResults = async () => {
      if (!sessionId) { navigate("/"); return; }
      try {
        const storedResults = localStorage.getItem(`trends_${sessionId}`);
        if (storedResults) {
          setResults(JSON.parse(storedResults));
          setResultsLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from("trend_results")
          .select("results")
          .eq("session_id", sessionId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching results:", error);
          toast({ title: "Error loading results", description: "Could not load your trend analysis. Please try again.", variant: "destructive" });
          navigate("/");
          return;
        }
        if (data?.results) {
          setResults(data.results as unknown as TrendResult[]);
        } else {
          toast({ title: "No results found", description: "Could not find your trend analysis. Please generate a new one.", variant: "destructive" });
          navigate("/");
        }
      } catch (error) {
        console.error("Error:", error);
        navigate("/");
      } finally {
        setResultsLoading(false);
      }
    };
    loadResults();
  }, [sessionId, navigate, toast]);

  const handlePayment = async () => {
    if (!user || !session) {
      navigate(`/auth?redirect=/results?session_id=${sessionId}`);
      return;
    }
    setProcessingPayment(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { sessionId },
      });
      if (error) throw error;
      if (data?.url) {
        if (data.sessionId) {
          localStorage.setItem("pending_checkout_session_id", data.sessionId);
        }
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({ title: "Payment failed", description: "Could not initiate payment. Please try again.", variant: "destructive" });
    } finally {
      setProcessingPayment(false);
    }
  };

  const canViewFullResults = hasPaid;
  const isVerifying = authLoading || checkingPayment || verifyingCheckout;
  const isLoadingResults = resultsLoading;

  if (isLoadingResults || isVerifying) {
    const message = isVerifying 
      ? "Verifying your subscription..." 
      : "Loading your trend analysis...";
    return <ResultsSkeleton message={message} />;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <Link to="/" className="absolute top-8 left-8 z-20">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/6da76baf-f15f-427e-aaa0-1bd3c859bf32.png" 
            alt="Spottail" 
            className="h-8"
          />
        </div>
      </Link>

      <div className="max-w-4xl mx-auto pt-16">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-full border border-border">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Trend Analysis Results</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Your Trending Products
          </h1>
          <p className="text-muted-foreground text-sm">
            {canViewFullResults 
              ? `Showing all ${results.length} trending products`
              : `Previewing ${FREE_PREVIEW_COUNT} of ${results.length} results`}
          </p>
        </div>

        {user && (
          <div className="flex justify-center mb-6">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
              hasPaid 
                ? "bg-success/10 text-success" 
                : "bg-warning/10 text-warning"
            }`}>
              {hasPaid ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Full Access Unlocked</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Limited Preview</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3 mb-8">
          {results.slice(0, canViewFullResults ? results.length : FREE_PREVIEW_COUNT).map((result, index) => (
            <Card key={index} className="bg-card border-border p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded">
                      #{index + 1}
                    </span>
                    <h3 className="text-base font-semibold text-foreground">{result.product}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{result.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {result.timeframe}
                    </span>
                    <span>Platform: {result.platform}</span>
                    <span>Risk: <span className={
                      result.risk === "Low" ? "text-success" :
                      result.risk === "Medium" ? "text-warning" : "text-destructive"
                    }>{result.risk}</span></span>
                    <span>Volume: {result.searchVolume}</span>
                    <span>Competition: {result.competitionLevel}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="flex items-center text-success font-bold text-lg mb-1">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    {result.trend}
                  </div>
                  <div className="flex items-center justify-end text-warning text-xs">
                    <Star className="w-3.5 h-3.5 mr-1" />
                    {result.confidence}%
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {!canViewFullResults && results.length > FREE_PREVIEW_COUNT && (
          <div className="relative mb-8">
            <div className="space-y-3 filter blur-sm pointer-events-none select-none">
              {results.slice(FREE_PREVIEW_COUNT, FREE_PREVIEW_COUNT + 2).map((result, index) => (
                <Card key={index} className="bg-card border-border p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded">
                          #{FREE_PREVIEW_COUNT + index + 1}
                        </span>
                        <h3 className="text-base font-semibold text-foreground">{result.product}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{result.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center text-success font-bold text-lg">
                        <ArrowUp className="w-4 h-4 mr-1" />
                        {result.trend}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/95 via-background/80 to-transparent">
              <Card className="bg-card border-border p-8 max-w-md text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {canViewFullResults ? (
                    <Eye className="w-7 h-7 text-primary" />
                  ) : (
                    <EyeOff className="w-7 h-7 text-primary" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Unlock All {results.length} Trending Products
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Get full access to detailed trend analysis, competition insights, and timing predictions.
                </p>
                <div className="text-3xl font-bold text-foreground mb-4">
                  $20 <span className="text-base font-normal text-muted-foreground">monthly</span>
                </div>
                
                {!user ? (
                  <Button
                    onClick={() => navigate(`/auth?redirect=/results?session_id=${sessionId}`)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                  >
                    Sign Up to Unlock
                  </Button>
                ) : (
                  <Button
                    onClick={handlePayment}
                    disabled={processingPayment}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                  >
                    {processingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Unlock Full Results
                      </>
                    )}
                  </Button>
                )}
              </Card>
            </div>
          </div>
        )}

        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-border text-foreground hover:bg-accent"
          >
            Generate New Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
