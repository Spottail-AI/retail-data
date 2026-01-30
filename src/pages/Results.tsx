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

  // Number of results to show for free users
  const FREE_PREVIEW_COUNT = 2;

  // Clean up URL params helper
  const cleanUpUrlParams = () => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("payment");
    newUrl.searchParams.delete("checkout_session_id");
    window.history.replaceState({}, "", newUrl.toString());
  };

  // Handle payment success - verify with checkout_session_id
  useEffect(() => {
    // Prevent multiple verification attempts
    if (hasStartedVerification.current) return;
    
    if (paymentStatus === "success" && checkoutSessionId && !hasPaid) {
      hasStartedVerification.current = true;
      setVerifyingCheckout(true);
      
      toast({
        title: "Payment successful!",
        description: "Verifying your subscription...",
      });
      
      // Verify payment with the checkout session ID
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
        
        // Initial check
        await poll();
        
        // Continue polling if not paid yet
        if (!hasPaid && attempts < maxAttempts) {
          pollIntervalRef.current = setInterval(poll, 2000);
        }
      };
      
      verifyPayment();
    } else if (paymentStatus === "cancelled") {
      toast({
        title: "Payment cancelled",
        description: "You can try again when you're ready.",
        variant: "destructive",
      });
      cleanUpUrlParams();
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [paymentStatus, checkoutSessionId, checkPaymentStatus, toast, hasPaid]);

  // Show success toast when hasPaid becomes true after payment
  useEffect(() => {
    if (hasPaid && paymentStatus === "success" && !hasShownSuccessToast.current) {
      hasShownSuccessToast.current = true;
      
      // Clear polling interval
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      
      toast({
        title: "Results unlocked!",
        description: "You now have full access to all trend results.",
      });
      
      cleanUpUrlParams();
    }
  }, [hasPaid, paymentStatus, toast]);

  // Associate search with user if they're logged in
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
      if (!sessionId) {
        navigate("/");
        return;
      }

      try {
        // Try to get results from localStorage first
        const storedResults = localStorage.getItem(`trends_${sessionId}`);
        if (storedResults) {
          setResults(JSON.parse(storedResults));
          setResultsLoading(false);
          return;
        }

        // If not in localStorage, try database
        const { data, error } = await supabase
          .from("trend_results")
          .select("results")
          .eq("session_id", sessionId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching results:", error);
          toast({
            title: "Error loading results",
            description: "Could not load your trend analysis. Please try again.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        if (data?.results) {
          setResults(data.results as unknown as TrendResult[]);
        } else {
          toast({
            title: "No results found",
            description: "Could not find your trend analysis. Please generate a new one.",
            variant: "destructive",
          });
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
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { sessionId },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Store the Stripe session ID for verification after redirect
        if (data.sessionId) {
          localStorage.setItem("pending_checkout_session_id", data.sessionId);
        }
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: "Could not initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  // Compute stable view state - determines what to show
  const canViewFullResults = hasPaid;
  
  // Determine if we're in a loading/verification state that should block content
  const isVerifying = authLoading || checkingPayment || verifyingCheckout;
  const isLoadingResults = resultsLoading;

  // STATE 1: Show skeleton while loading results or verifying payment
  // This prevents any flash of preview/full content
  if (isLoadingResults || isVerifying) {
    const message = isVerifying 
      ? "Verifying your subscription..." 
      : "Loading your trend analysis...";
    return <ResultsSkeleton message={message} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
      {/* Logo */}
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2 bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700/50">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">Trend Analysis Results</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Your Trending Products
          </h1>
          <p className="text-slate-600">
            {canViewFullResults 
              ? `Showing all ${results.length} trending products`
              : `Previewing ${FREE_PREVIEW_COUNT} of ${results.length} results`}
          </p>
        </div>

        {/* Payment status indicator - only shows stable states now */}
        {user && (
          <div className="flex justify-center mb-6">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              hasPaid 
                ? "bg-emerald-100 text-emerald-700" 
                : "bg-amber-100 text-amber-700"
            }`}>
              {hasPaid ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Full Access Unlocked</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">Limited Preview</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4 mb-8">
          {results.slice(0, canViewFullResults ? results.length : FREE_PREVIEW_COUNT).map((result, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-slate-200/50 p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-800">{result.product}</h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">{result.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {result.timeframe}
                    </span>
                    <span>Platform: {result.platform}</span>
                    <span>Risk: <span className={
                      result.risk === "Low" ? "text-emerald-600" :
                      result.risk === "Medium" ? "text-amber-600" : "text-red-600"
                    }>{result.risk}</span></span>
                    <span>Volume: {result.searchVolume}</span>
                    <span>Competition: {result.competitionLevel}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="flex items-center text-emerald-600 font-bold text-xl mb-1">
                    <ArrowUp className="w-5 h-5 mr-1" />
                    {result.trend}
                  </div>
                  <div className="flex items-center justify-end text-amber-600 text-sm">
                    <Star className="w-4 h-4 mr-1" />
                    {result.confidence}% confidence
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Locked results preview */}
        {!canViewFullResults && results.length > FREE_PREVIEW_COUNT && (
          <div className="relative mb-8">
            {/* Blurred preview of remaining results */}
            <div className="space-y-4 filter blur-sm pointer-events-none select-none">
              {results.slice(FREE_PREVIEW_COUNT, FREE_PREVIEW_COUNT + 2).map((result, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-slate-200/50 p-6 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-slate-100 text-slate-500 text-xs font-semibold px-2 py-1 rounded">
                          #{FREE_PREVIEW_COUNT + index + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-slate-800">{result.product}</h3>
                      </div>
                      <p className="text-slate-600 text-sm mb-3">{result.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center text-emerald-600 font-bold text-xl">
                        <ArrowUp className="w-5 h-5 mr-1" />
                        {result.trend}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Overlay with unlock CTA */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-slate-50/90 via-slate-50/70 to-transparent">
              <Card className="bg-white shadow-2xl border-0 p-8 max-w-md text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {canViewFullResults ? (
                    <Eye className="w-8 h-8 text-white" />
                  ) : (
                    <EyeOff className="w-8 h-8 text-white" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Unlock All {results.length} Trending Products
                </h3>
                <p className="text-slate-600 mb-6">
                  Get full access to detailed trend analysis, competition insights, and timing predictions.
                </p>
                <div className="text-3xl font-bold text-slate-800 mb-4">
                  $20 <span className="text-base font-normal text-slate-500">monthly</span>
                </div>
                
                {!user ? (
                  <Button
                    onClick={() => navigate(`/auth?redirect=/results?session_id=${sessionId}`)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold py-3"
                  >
                    Sign Up to Unlock
                  </Button>
                ) : (
                  <Button
                    onClick={handlePayment}
                    disabled={processingPayment}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold py-3"
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

        {/* Generate new analysis button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Generate New Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
