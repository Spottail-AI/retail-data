import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Heart, Bell, MessageSquare, TrendingUp, Sparkles } from "lucide-react";
import { BuyerShell } from "@/components/dashboard/BuyerShell";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { NICHES } from "@/lib/niches";

const PLATFORM_COLORS: Record<string, string> = {
  TikTok: "bg-[#ff0050]/10 text-[#ff0050] border-[#ff0050]/20",
  Reddit: "bg-[#ff4500]/10 text-[#ff4500] border-[#ff4500]/20",
  Instagram: "bg-[#c13584]/10 text-[#c13584] border-[#c13584]/20",
  Amazon: "bg-[#ff9900]/10 text-[#ff9900] border-[#ff9900]/20",
  Pinterest: "bg-[#e60023]/10 text-[#e60023] border-[#e60023]/20",
};

const BuyerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate("/login?redirect=/dashboard");
  }, [user, authLoading, navigate]);

  // Stats queries
  const { data: shortlistCount = 0 } = useQuery({
    queryKey: ["buyer-shortlist-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("source_shortlists")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id);
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: enquiryStats = { total: 0, pending: 0 } } = useQuery({
    queryKey: ["buyer-enquiry-stats", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("source_enquiries")
        .select("status")
        .eq("buyer_id", user!.id);
      const total = data?.length || 0;
      const pending = data?.filter((e) => e.status === "pending").length || 0;
      return { total, pending };
    },
    enabled: !!user,
  });

  // Trends are input-driven: nothing generates until the buyer picks a category and
  // searches — mirrors the supplier "find stores" flow, and avoids burning AI spend on
  // a generic feed nobody asked for on every dashboard load.
  const [niche, setNiche] = useState("");
  const [trends, setTrends] = useState<any[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const runTrendSearch = async () => {
    if (!niche || trendsLoading) return;
    trackEvent("trend_search_started", { niche, country: "United States" });
    setTrendsLoading(true);
    setSearched(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setTrendsLoading(false); return; }
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-trends`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({
            country: "United States",
            niche,
            platforms: ["TikTok", "Reddit", "Amazon", "Instagram"],
            sessionId: `buyer_dash_${Date.now()}`,
          }),
        }
      );
      if (!res.ok) {
        toast.error("Couldn't load trends. Please try again.");
        setTrends([]);
      } else {
        const data = await res.json();
        setTrends((data.results || []).slice(0, 5));
      }
    } catch {
      toast.error("Couldn't load trends. Please try again.");
      setTrends([]);
    } finally {
      setTrendsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
      </div>
    );
  }
  if (!user) return null;

  const firstName = user.user_metadata?.first_name || "there";

  return (
    <BuyerShell>
      {/* Top Bar */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 sm:px-6">
        <span className="text-muted-foreground text-sm">Buyer Dashboard</span>
        <p className="text-muted-foreground text-sm">
          Hey, <span className="text-foreground font-medium">{firstName}</span> 👋
        </p>
      </header>

      <main className="max-w-[1000px] mx-auto p-4 sm:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            icon={<Heart className="w-5 h-5 text-primary" />}
            label="Shortlisted"
            value={shortlistCount}
          />
          <StatCard
            icon={<Bell className="w-5 h-5 text-warning" />}
            label="Trending Alerts"
            value={trends.length}
            highlight
          />
          <StatCard
            icon={<MessageSquare className="w-5 h-5 text-primary" />}
            label="Enquiries Sent"
            value={enquiryStats.total}
            sub={enquiryStats.pending > 0 ? `${enquiryStats.pending} awaiting reply` : undefined}
          />
        </div>

        {/* Trend search — input-first, mirrors the supplier "find stores" search */}
        <section className="bg-card border border-border rounded-xl p-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-foreground mb-0.5">See what's trending</h2>
            <p className="text-muted-foreground text-xs">
              Pick a category and we'll surface products gaining momentum across TikTok, Reddit, Amazon and more.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="flex-1">
              <Select value={niche} onValueChange={setNiche}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Choose a category" /></SelectTrigger>
                <SelectContent>
                  {NICHES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={runTrendSearch}
              disabled={!niche || trendsLoading}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {trendsLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scanning…</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> See trends</>
              )}
            </Button>
          </div>

          {!searched ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              Choose a category above to see what's about to trend.
            </div>
          ) : trendsLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-muted-foreground text-xs ml-2">Scanning platforms…</span>
            </div>
          ) : trends.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No trends found for that category — try another.
            </div>
          ) : (
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Trending in {niche}</span>
                <button
                  onClick={() => navigate(`/trending-now?niche=${encodeURIComponent(niche)}`)}
                  className="text-primary text-xs font-medium hover:underline"
                >
                  View all →
                </button>
              </div>
              <div className="space-y-2">
                {trends.map((trend: any, idx: number) => {
                  const platform = trend.platform_source || "";
                  const platformClass = PLATFORM_COLORS[platform] || "bg-muted text-muted-foreground border-border";
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">
                        📦
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-foreground text-sm font-semibold truncate">{trend.product_name}</span>
                          <span className={cn("text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full border", platformClass)}>
                            {platform}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[10px] truncate">{trend.description?.slice(0, 80)}</p>
                      </div>
                      {trend.growth_rate && (
                        <span className="text-primary text-xs font-bold shrink-0">+{trend.growth_rate}%</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>
    </BuyerShell>
  );
};

function StatCard({
  icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className={`text-2xl font-bold mt-0.5 ${highlight && value > 0 ? "text-warning" : "text-foreground"}`}>
          {value}
        </p>
        {sub && <p className="text-muted-foreground text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default BuyerDashboard;
