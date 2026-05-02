import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Heart, TrendingUp, Sparkles } from "lucide-react";
import { BuyerShell } from "@/components/dashboard/BuyerShell";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const FILTER_CHIPS = ["All", "TikTok", "Reddit", "Beauty", "Health", "Home", "On Spottail"];
const PLATFORM_COLORS: Record<string, string> = {
  TikTok: "bg-[#ff0050]/10 text-[#ff0050] border-[#ff0050]/20",
  Reddit: "bg-[#ff4500]/10 text-[#ff4500] border-[#ff4500]/20",
  Instagram: "bg-[#c13584]/10 text-[#c13584] border-[#c13584]/20",
  Amazon: "bg-[#ff9900]/10 text-[#ff9900] border-[#ff9900]/20",
  Pinterest: "bg-[#e60023]/10 text-[#e60023] border-[#e60023]/20",
  Google: "bg-[#4285f4]/10 text-[#4285f4] border-[#4285f4]/20",
};

const BuyerTrendingNow = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (!authLoading && !user) navigate("/login?redirect=/trending-now");
  }, [user, authLoading, navigate]);

  // Fetch trends from the generate-trends edge function
  const { data: trends = [], isLoading: trendsLoading, refetch: refetchTrends } = useQuery({
    queryKey: ["buyer-trends"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-trends`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            country: "United States",
            niche: "trending consumer products",
            platforms: ["TikTok", "Reddit", "Amazon", "Instagram", "Pinterest"],
            sessionId: `buyer_${Date.now()}`,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to fetch trends");
      }

      const data = await res.json();
      return data.results || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // cache 5 min
    retry: 1,
  });

  // Shortlist data
  const { data: shortlistedIds = [] } = useQuery({
    queryKey: ["buyer-shortlist-ids", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("source_shortlists")
        .select("product_id")
        .eq("user_id", user!.id);
      return data?.map((s) => s.product_id) || [];
    },
    enabled: !!user,
  });

  // For shortlisting trend items, we'll use a local state since trends aren't source_products
  const [localShortlisted, setLocalShortlisted] = useState<Set<string>>(new Set());

  const toggleShortlist = (productName: string) => {
    setLocalShortlisted((prev) => {
      const next = new Set(prev);
      if (next.has(productName)) {
        next.delete(productName);
        toast.info("Removed from shortlist");
      } else {
        next.add(productName);
        toast.success("Added to shortlist");
      }
      return next;
    });
  };

  // Filter logic
  const filteredTrends = trends.filter((t: any) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "On Spottail") return false; // placeholder
    if (["TikTok", "Reddit"].includes(activeFilter)) {
      return t.platform_source?.toLowerCase().includes(activeFilter.toLowerCase());
    }
    // Category-based filters
    const cats = ["Beauty", "Health", "Home"];
    if (cats.includes(activeFilter)) {
      return t.product_name?.toLowerCase().includes(activeFilter.toLowerCase()) ||
        t.description?.toLowerCase().includes(activeFilter.toLowerCase());
    }
    return true;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#4f8ef7]" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <BuyerShell>
      <main className="max-w-[900px] mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-[#ff4f17]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">Trending Now</h1>
          </div>
          <p className="text-[#94a3b8] text-sm">
            Products gaining momentum across TikTok, Reddit, Pinterest and more.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveFilter(chip)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all",
                activeFilter === chip
                  ? "bg-[#4f8ef7]/10 text-[#4f8ef7] border-[#4f8ef7]/30"
                  : "text-[#94a3b8] border-[#1e2d4a] hover:border-[#4f8ef7]/20"
              )}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Trend Feed */}
        {trendsLoading ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#4f8ef7]" />
            <p className="text-[#94a3b8] text-sm">Scanning platforms for emerging trends...</p>
          </div>
        ) : filteredTrends.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="w-10 h-10 text-[#4f8ef7] mx-auto mb-3 opacity-50" />
            <p className="text-white font-semibold mb-1">No trends found for this filter</p>
            <p className="text-[#94a3b8] text-sm">Try selecting a different filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTrends.map((trend: any, idx: number) => {
              const platform = trend.platform_source || "Unknown";
              const platformClass = PLATFORM_COLORS[platform] || "bg-[#1e2d4a] text-[#94a3b8] border-[#1e2d4a]";
              const isShortlisted = localShortlisted.has(trend.product_name);

              return (
                <div
                  key={idx}
                  className="bg-[#111827] border border-[#1e2d4a] rounded-xl p-4 flex items-center gap-4"
                >
                  {/* Image / emoji */}
                  <div className="w-11 h-11 rounded-lg bg-[#1e2d4a] flex items-center justify-center text-xl shrink-0">
                    {trend.image_url ? (
                      <img
                        src={trend.image_url}
                        alt=""
                        className="w-full h-full rounded-lg object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      "📦"
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h3 className="text-white font-bold text-sm truncate">{trend.product_name}</h3>
                      <span className={cn("text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border", platformClass)}>
                        {platform}
                      </span>
                    </div>
                    <p className="text-[#94a3b8] text-xs truncate">{trend.description?.slice(0, 100)}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      {trend.growth_rate && (
                        <span className="text-[#c5f135] text-xs font-bold">+{trend.growth_rate}%</span>
                      )}
                      <span className="text-[#64748b] text-[10px]">7d volume</span>
                    </div>
                  </div>

                  {/* Shortlist button */}
                  <button
                    onClick={() => toggleShortlist(trend.product_name)}
                    className={cn(
                      "w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 transition-all",
                      isShortlisted
                        ? "border-[#c5f135]/40 bg-[#c5f135]/10 text-[#c5f135]"
                        : "border-[#1e2d4a] text-[#64748b] hover:border-[#c5f135]/30 hover:text-[#c5f135]"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", isShortlisted && "fill-current")} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </BuyerShell>
  );
};

export default BuyerTrendingNow;
