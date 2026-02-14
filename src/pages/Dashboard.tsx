import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Loader2, 
  TrendingUp, 
  Calendar, 
  Lock, 
  Unlock, 
  ArrowRight,
  Search,
  LayoutDashboard,
  LogOut
} from "lucide-react";
import { format } from "date-fns";

interface SavedSearch {
  id: string;
  session_id: string;
  category: string;
  created_at: string;
  results: unknown[];
}

const Dashboard = () => {
  const { user, loading: authLoading, hasPaid, signOut, checkPaymentStatus } = useAuth();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/dashboard");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      checkPaymentStatus();
    }
  }, [user, checkPaymentStatus]);

  useEffect(() => {
    const loadSearches = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("trend_results")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading searches:", error);
        } else if (data) {
          const typedSearches: SavedSearch[] = data.map((item) => ({
            ...item,
            results: Array.isArray(item.results) ? item.results : [],
            user_id: item.user_id ?? undefined,
          }));
          setSearches(typedSearches);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadSearches();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleViewSearch = (sessionId: string) => {
    navigate(`/results?session_id=${sessionId}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between max-w-4xl mx-auto mb-8">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/6da76baf-f15f-427e-aaa0-1bd3c859bf32.png" 
            alt="Spottail" 
            className="h-8"
          />
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="border-border text-foreground hover:bg-accent"
          >
            <Search className="w-4 h-4 mr-2" />
            New Search
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-full border border-border">
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Your Dashboard</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Past Trend Searches
          </h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>

        {/* Subscription Status */}
        <div className="flex justify-center mb-8">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
            hasPaid 
              ? "bg-success/10 text-success" 
              : "bg-warning/10 text-warning"
          }`}>
            {hasPaid ? (
              <>
                <Unlock className="w-4 h-4" />
                <span>Full Access - All results unlocked</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Preview Mode - Subscribe to unlock all results</span>
              </>
            )}
          </div>
        </div>

        {/* Searches List */}
        {searches.length === 0 ? (
          <Card className="bg-card border-border p-12 text-center">
            <Search className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">No searches yet</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Start analyzing trends to see your search history here.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Start Your First Search
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {searches.map((search) => {
              const resultCount = Array.isArray(search.results) ? search.results.length : 0;
              
              return (
                <Card 
                  key={search.id} 
                  className="bg-card border-border p-5 hover:border-primary/30 transition-all cursor-pointer"
                  onClick={() => handleViewSearch(search.session_id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <h3 className="text-base font-semibold text-foreground">
                          {search.category}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          hasPaid 
                            ? "bg-success/10 text-success" 
                            : "bg-warning/10 text-warning"
                        }`}>
                          {hasPaid ? (
                            <span className="flex items-center gap-1">
                              <Unlock className="w-3 h-3" />
                              Unlocked
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              Preview
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          {format(new Date(search.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                        <span>
                          {resultCount} {resultCount === 1 ? "result" : "results"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
