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

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/dashboard");
    }
  }, [user, authLoading, navigate]);

  // Check payment status on mount
  useEffect(() => {
    if (user) {
      checkPaymentStatus();
    }
  }, [user, checkPaymentStatus]);

  // Load past searches
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
          // Cast the results to the expected type
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
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
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            <Search className="w-4 h-4 mr-2" />
            New Search
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2 bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700/50">
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">Your Dashboard</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Past Trend Searches
          </h1>
          <p className="text-slate-600">
            {user.email}
          </p>
        </div>

        {/* Subscription Status */}
        <div className="flex justify-center mb-8">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
            hasPaid 
              ? "bg-emerald-100 text-emerald-700" 
              : "bg-amber-100 text-amber-700"
          }`}>
            {hasPaid ? (
              <>
                <Unlock className="w-4 h-4" />
                <span className="text-sm font-medium">Full Access - All results unlocked</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">Preview Mode - Subscribe to unlock all results</span>
              </>
            )}
          </div>
        </div>

        {/* Searches List */}
        {searches.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 p-12 text-center">
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">No searches yet</h2>
            <p className="text-slate-600 mb-6">
              Start analyzing trends to see your search history here.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Start Your First Search
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {searches.map((search) => {
              const resultCount = Array.isArray(search.results) ? search.results.length : 0;
              
              return (
                <Card 
                  key={search.id} 
                  className="bg-white/80 backdrop-blur-sm border-slate-200/50 p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleViewSearch(search.session_id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-lg font-semibold text-slate-800">
                          {search.category}
                        </h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          hasPaid 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-amber-100 text-amber-700"
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
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {format(new Date(search.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                        <span>
                          {resultCount} {resultCount === 1 ? "result" : "results"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-slate-400">
                      <ArrowRight className="w-5 h-5" />
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
