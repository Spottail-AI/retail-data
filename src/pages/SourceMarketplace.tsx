import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronUp, Sparkles, CheckCircle, TrendingUp, Clock } from "lucide-react";
import { V2Nav, V2Footer, V2Page } from "@/components/v2/V2Shell";
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
      let query = supabase.from("source_products").select("*");
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
      ids.forEach((id: string) => { counts[id] = { buyer: 0, community: 0 }; });
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

  const { data: userVotes = [] } = useQuery({
    queryKey: ["source-user-votes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from("source_buyer_votes").select("product_id").eq("user_id", user.id);
      return data?.map((v: any) => v.product_id) || [];
    },
    enabled: !!user,
  });

  const handleVote = async (e: React.MouseEvent, productId: string, productSlug: string) => {
    e.stopPropagation();
    if (!user) {
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
    <V2Page>
      <V2Nav ctaLabel="Launch your product" />

      <main style={{ maxWidth: 920, margin: "0 auto", padding: "120px 24px 96px" }}>
        {/* Page Header */}
        <div style={{ marginBottom: 40 }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
            <Sparkles className="w-4 h-4" style={{ color: "var(--v2-teal)" }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--v2-teal)" }}>
              Spottail Source
            </span>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.05, color: "var(--v2-ink)", marginBottom: 10 }}>
            Retail product <em style={{ fontStyle: "italic", color: "var(--v2-teal)" }}>launches</em>
          </h1>
          <p className="font-body" style={{ fontSize: 13, color: "var(--v2-muted)", fontFamily: "monospace" }}>
            spottail.ai/source
          </p>
        </div>

        {/* Sort Tabs */}
        <div className="flex gap-2 overflow-x-auto" style={{ marginBottom: 24, paddingBottom: 4 }}>
          {sortTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSort(tab.key)}
              className="flex items-center whitespace-nowrap font-body"
              style={{
                gap: 6,
                padding: "8px 16px",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                background: activeSort === tab.key ? "var(--v2-teal-light)" : "var(--v2-white)",
                color: activeSort === tab.key ? "var(--v2-teal)" : "var(--v2-muted)",
                border: `1px solid ${activeSort === tab.key ? "var(--v2-teal)" : "var(--v2-border)"}`,
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse" style={{ height: 96, borderRadius: 12, background: "var(--v2-surface)", border: "1px solid var(--v2-border)" }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <Sparkles className="mx-auto" style={{ width: 36, height: 36, color: "var(--v2-teal)", opacity: 0.5, marginBottom: 16 }} />
            <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, color: "var(--v2-ink)", marginBottom: 8 }}>
              No products launched yet
            </h3>
            <p className="font-body" style={{ fontSize: 14, color: "var(--v2-muted)", maxWidth: 420, margin: "0 auto" }}>
              Products will appear here as suppliers list them on Spottail Source.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product: any) => {
              const votes = voteCounts[product.id] || { buyer: 0, community: 0 };
              const hasVoted = userVotes.includes(product.id);
              const productImages = (product.product_images as string[] | null) || [];
              const coverImage = productImages.length > 0 && typeof productImages[0] === "string" && productImages[0].startsWith("http") ? productImages[0] : null;

              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/source/${product.slug}`)}
                  className="flex items-center gap-4 cursor-pointer transition-all group"
                  style={{
                    background: "var(--v2-white)",
                    border: `1px solid ${product.is_featured ? "var(--v2-teal)" : "var(--v2-border)"}`,
                    borderRadius: 12,
                    padding: 18,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--v2-ink)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = product.is_featured ? "var(--v2-teal)" : "var(--v2-border)")}
                >
                  {/* Image */}
                  <div className="flex items-center justify-center shrink-0 overflow-hidden" style={{ width: 48, height: 48, borderRadius: 10, background: "var(--v2-surface)", fontSize: 22 }}>
                    {coverImage ? (
                      <img src={coverImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>📦</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 2 }}>
                      <h3 className="font-body truncate" style={{ fontSize: 15, fontWeight: 600, color: "var(--v2-ink)" }}>
                        {product.product_name}
                      </h3>
                      {product.is_featured && (
                        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 999, background: "var(--v2-teal-light)", color: "var(--v2-teal)" }}>
                          Featured
                        </span>
                      )}
                      {product.is_trending && (
                        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 999, background: "var(--v2-surface)", color: "var(--v2-ink)", border: "1px solid var(--v2-border)" }}>
                          Trending
                        </span>
                      )}
                    </div>
                    <p className="font-body truncate" style={{ fontSize: 13, color: "var(--v2-muted)" }}>{product.tagline}</p>
                    <div className="flex gap-2 flex-wrap" style={{ marginTop: 8 }}>
                      {product.category && (
                        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "var(--v2-surface)", color: "var(--v2-muted)" }}>
                          {product.category}
                        </span>
                      )}
                      {product.is_verified && (
                        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "var(--v2-teal-light)", color: "var(--v2-teal)" }}>
                          ✓ Verified
                        </span>
                      )}
                      {product.moq && (
                        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "var(--v2-surface)", color: "var(--v2-muted)" }}>
                          MOQ: {product.moq}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Vote */}
                  <div className="flex flex-col items-center shrink-0" style={{ marginLeft: 8 }}>
                    <button
                      onClick={(e) => handleVote(e, product.id, product.slug)}
                      className={cn("flex flex-col items-center")}
                      style={{
                        width: 52,
                        gap: 2,
                        padding: "8px",
                        borderRadius: 9,
                        cursor: "pointer",
                        background: hasVoted ? "var(--v2-teal-light)" : "var(--v2-white)",
                        color: hasVoted ? "var(--v2-teal)" : "var(--v2-muted)",
                        border: `1px solid ${hasVoted ? "var(--v2-teal)" : "var(--v2-border)"}`,
                      }}
                    >
                      <ChevronUp className="w-4 h-4" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--v2-ink)" }}>{votes.buyer + votes.community}</span>
                    </button>
                    <span style={{ fontSize: 9, marginTop: 4, fontWeight: 500, color: "var(--v2-teal)" }}>Votes</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <V2Footer />
    </V2Page>
  );
};

export default SourceMarketplace;
