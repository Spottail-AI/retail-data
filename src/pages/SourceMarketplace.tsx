import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronUp, Sparkles, CheckCircle, TrendingUp, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

type SortTab = "top" | "trending" | "newest" | "verified";

const SourceMarketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSort, setActiveSort] = useState<SortTab>("top");

  useEffect(() => {
    document.title = "Spottail Source — Discover Retail-Ready Products";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Browse trending products from verified suppliers. Upvote, shortlist, and source products before they peak.");
  }, []);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["source-products", activeSort],
    queryFn: async () => {
      let query = supabase
        .from("source_products")
        .select("*");

      switch (activeSort) {
        case "trending":
          query = query.eq("is_trending", true).order("launched_at", { ascending: false });
          break;
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "verified":
          query = query.eq("is_verified", true).order("launched_at", { ascending: false });
          break;
        default:
          query = query.order("launched_at", { ascending: false });
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data;
    },
  });

  // Fetch vote counts per product
  const { data: voteCounts = {} } = useQuery({
    queryKey: ["source-vote-counts", products.map((p: any) => p.id)],
    queryFn: async () => {
      if (!products.length) return {};
      const ids = products.map((p: any) => p.id);
      
      const [buyerRes, communityRes] = await Promise.all([
        supabase.from("source_buyer_votes").select("product_id").in("product_id", ids),
        supabase.rpc("get_community_vote_counts", { p_product_ids: ids }),
      ]);

      const counts: Record<string, { buyer: number; community: number }> = {};
      ids.forEach((id: string) => {
        counts[id] = { buyer: 0, community: 0 };
      });

      buyerRes.data?.forEach((v: any) => {
        if (counts[v.product_id]) counts[v.product_id].buyer++;
      });
      (communityRes.data as any[] | null)?.forEach((row: any) => {
        if (counts[row.product_id]) counts[row.product_id].community = row.vote_count;
      });

      return counts;
    },
    enabled: products.length > 0,
  });

  // Current user's votes
  const { data: userVotes = [] } = useQuery({
    queryKey: ["source-user-votes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("source_buyer_votes")
        .select("product_id")
        .eq("user_id", user.id);
      return data?.map((v: any) => v.product_id) || [];
    },
    enabled: !!user,
  });

  const handleVote = async (e: React.MouseEvent, productId: string, productSlug: string) => {
    e.stopPropagation();
    if (!user) {
      // Navigate to the product page so the guest can use the CAPTCHA vote dialog
      navigate(`/source/${productSlug}`);
      return;
    }

    const hasVoted = userVotes.includes(productId);
    if (hasVoted) {
      await supabase.from("source_buyer_votes").delete().eq("product_id", productId).eq("user_id", user.id);
    } else {
      await supabase.from("source_buyer_votes").insert({ product_id: productId, user_id: user.id });
    }
  };

  const sortTabs: { key: SortTab; label: string; icon: React.ReactNode }[] = [
    { key: "top", label: "Top Today", icon: <ChevronUp className="w-4 h-4" /> },
    { key: "trending", label: "About to Trend", icon: <TrendingUp className="w-4 h-4" /> },
    { key: "newest", label: "Newest", icon: <Clock className="w-4 h-4" /> },
    { key: "verified", label: "Verified Only", icon: <CheckCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#c5f135]" />
            <span className="text-[#c5f135] text-xs font-semibold uppercase tracking-wider">Spottail Source</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">Today's Launches</h1>
          <p className="text-[#64748b] text-sm font-mono">spottail.ai/source</p>
        </div>

        {/* Sort Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {sortTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSort(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                activeSort === tab.key
                  ? "bg-[#4f8ef7]/10 text-[#4f8ef7] border border-[#4f8ef7]/30"
                  : "text-[#94a3b8] border border-[#1e2d4a] hover:border-[#4f8ef7]/20 hover:text-white"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#111827] border border-[#1e2d4a] rounded-xl p-5 animate-pulse h-24" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-10 h-10 text-[#4f8ef7] mx-auto mb-4 opacity-50" />
            <h3 className="text-white font-semibold text-lg mb-2">No products launched yet</h3>
            <p className="text-[#94a3b8] text-sm max-w-md mx-auto">
              Products will appear here as suppliers list them on Spottail Source.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product: any, idx: number) => {
              const votes = voteCounts[product.id] || { buyer: 0, community: 0 };
              const hasVoted = userVotes.includes(product.id);
              const productImages = (product.product_images as string[] | null) || [];
              const coverImage = productImages.length > 0 && typeof productImages[0] === "string" && productImages[0].startsWith("http") ? productImages[0] : null;

              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/source/${product.slug}`)}
                  className={cn(
                    "bg-[#111827] border rounded-xl p-4 sm:p-5 flex items-center gap-4 cursor-pointer transition-all hover:border-[#4f8ef7]/30 group",
                    product.is_featured ? "border-[#c5f135]/40" : "border-[#1e2d4a]"
                  )}
                >
                  {/* Product Image */}
                  <div className="w-[46px] h-[46px] rounded-lg bg-[#1e2d4a] flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                    {coverImage ? (
                      <img src={coverImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>📦</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h3 className="text-white font-bold text-sm sm:text-base truncate group-hover:text-[#4f8ef7] transition-colors">
                        {product.product_name}
                      </h3>
                      {product.is_featured && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#c5f135]/10 text-[#c5f135] border border-[#c5f135]/20">
                          Product of the Week
                        </span>
                      )}
                      {product.is_trending && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ff4f17]/10 text-[#ff4f17] border border-[#ff4f17]/20">
                          🔥 Trending
                        </span>
                      )}
                    </div>
                    <p className="text-[#64748b] text-xs font-mono mb-1 hidden sm:block">
                      spottail.ai/source/{product.slug}
                    </p>
                    <p className="text-[#94a3b8] text-xs sm:text-sm truncate">{product.tagline}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {product.category && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1e2d4a] text-[#94a3b8]">
                          {product.category}
                        </span>
                      )}
                      {product.is_verified && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4f8ef7]/10 text-[#4f8ef7] border border-[#4f8ef7]/20">
                          ✓ Verified Brand
                        </span>
                      )}
                      {product.moq && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1e2d4a] text-[#94a3b8]">
                          MOQ: {product.moq}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Vote Column */}
                  <div className="flex flex-col items-center shrink-0 ml-2">
                    <button
                      onClick={(e) => handleVote(e, product.id, product.slug)}
                      className={cn(
                        "w-12 sm:w-14 flex flex-col items-center gap-0.5 py-2 px-2 rounded-lg border transition-all",
                        hasVoted
                          ? "border-[#4f8ef7] bg-[#4f8ef7]/10 text-[#4f8ef7]"
                          : "border-[#1e2d4a] text-[#94a3b8] hover:border-[#4f8ef7]/40 hover:text-[#4f8ef7]"
                      )}
                    >
                      <ChevronUp className="w-4 h-4" />
                      <span className="text-white font-bold text-sm">{votes.buyer}</span>
                    </button>
                    <span className="text-[#4f8ef7] text-[9px] mt-1 font-medium">Buyer votes</span>
                    {votes.community > 0 && (
                      <span className="text-[#64748b] text-[9px]">+ {votes.community} community</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SourceMarketplace;
