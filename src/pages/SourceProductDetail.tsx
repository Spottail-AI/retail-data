import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronUp, Heart, MessageSquare, ExternalLink,
  CheckCircle, TrendingUp, Loader2, Globe, Package, Layers, ArrowLeft,
} from "lucide-react";
import { V2Nav, V2Footer, V2Page } from "@/components/v2/V2Shell";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email").max(255);

const trendPlatforms = [
  { name: "TikTok", color: "#0D9B8A", urlTemplate: (q: string) => `https://tiktok.com/search?q=${encodeURIComponent(q)}` },
  { name: "Reddit", color: "#0D9B8A", urlTemplate: (q: string) => `https://reddit.com/search?q=${encodeURIComponent(q)}` },
  { name: "Google Trends", color: "#0D9B8A", urlTemplate: (q: string) => `https://trends.google.com/trends/explore?q=${encodeURIComponent(q)}` },
  { name: "Spottail", color: "#0D9B8A", urlTemplate: null },
];

const cardStyle: React.CSSProperties = {
  background: "var(--v2-white)",
  border: "1px solid var(--v2-border)",
  borderRadius: 12,
  padding: 20,
};

const tagStyle: React.CSSProperties = {
  fontSize: 10,
  padding: "3px 10px",
  borderRadius: 999,
  background: "var(--v2-surface)",
  color: "var(--v2-muted)",
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
};

const SourceProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showVoteEmail, setShowVoteEmail] = useState(false);
  const [voteEmail, setVoteEmail] = useState("");
  const [voteStatus, setVoteStatus] = useState<"idle" | "submitting" | "success" | "error" | "duplicate">("idle");
  const [voteError, setVoteError] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaChallenge, setCaptchaChallenge] = useState(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { a, b, answer: a + b };
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ["source-product", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("source_products").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  useEffect(() => {
    if (product) {
      supabase.from("source_product_views").insert({ product_id: product.id, viewer_id: user?.id || null });
    }
  }, [product?.id, user?.id]);

  useEffect(() => {
    if (product) document.title = `${product.product_name} — Spottail Source`;
  }, [product]);

  const { data: votes = { buyer: 0, community: 0 } } = useQuery({
    queryKey: ["source-product-votes", product?.id],
    queryFn: async () => {
      const [buyerRes, communityRes] = await Promise.all([
        supabase.from("source_buyer_votes").select("id", { count: "exact" }).eq("product_id", product!.id),
        supabase.rpc("get_community_vote_count", { p_product_id: product!.id }),
      ]);
      return { buyer: buyerRes.count || 0, community: (communityRes.data as number | null) || 0 };
    },
    enabled: !!product,
  });

  const { data: hasVoted = false } = useQuery({
    queryKey: ["source-user-voted", product?.id, user?.id],
    queryFn: async () => {
      if (!user || !product) return false;
      const { data } = await supabase.from("source_buyer_votes").select("id").eq("product_id", product.id).eq("user_id", user.id).maybeSingle();
      return !!data;
    },
    enabled: !!user && !!product,
  });

  const { data: isShortlisted = false } = useQuery({
    queryKey: ["source-user-shortlisted", product?.id, user?.id],
    queryFn: async () => {
      if (!user || !product) return false;
      const { data } = await supabase.from("source_shortlists").select("id").eq("product_id", product.id).eq("user_id", user.id).maybeSingle();
      return !!data;
    },
    enabled: !!user && !!product,
  });

  const handleVote = async () => {
    if (!product) return;
    if (user) {
      if (hasVoted) {
        await supabase.from("source_buyer_votes").delete().eq("product_id", product.id).eq("user_id", user.id);
      } else {
        await supabase.from("source_buyer_votes").insert({ product_id: product.id, user_id: user.id });
      }
      queryClient.invalidateQueries({ queryKey: ["source-product-votes", product.id] });
      queryClient.invalidateQueries({ queryKey: ["source-user-voted", product.id, user.id] });
    } else {
      setShowVoteEmail(true);
    }
  };

  const handleCommunityVote = async (e: React.FormEvent) => {
    e.preventDefault();
    setVoteError("");
    const parsed = emailSchema.safeParse(voteEmail);
    if (!parsed.success) {
      setVoteError(parsed.error.errors[0].message);
      return;
    }
    if (parseInt(captchaAnswer) !== captchaChallenge.answer) {
      setVoteError("Incorrect answer. Please try again.");
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      setCaptchaChallenge({ a, b, answer: a + b });
      setCaptchaAnswer("");
      return;
    }
    if (!product) return;
    setVoteStatus("submitting");
    try {
      const { data, error } = await supabase.functions.invoke("verify-vote", {
        body: { action: "submit-vote", product_id: product.id, email: parsed.data },
      });
      if (error || data?.error === "already_voted") {
        setVoteStatus("duplicate");
      } else if (data?.error) {
        setVoteStatus("error");
        setVoteError("Something went wrong. Please try again.");
      } else {
        setVoteStatus("success");
        queryClient.invalidateQueries({ queryKey: ["source-product-votes", product.id] });
      }
    } catch {
      setVoteStatus("error");
      setVoteError("Something went wrong. Please try again.");
    }
  };

  const handleShortlist = async () => {
    if (!user) { navigate("/signup&redirect=/source/" + slug); return; }
    if (!product) return;
    if (isShortlisted) {
      await supabase.from("source_shortlists").delete().eq("product_id", product.id).eq("user_id", user.id);
    } else {
      await supabase.from("source_shortlists").insert({ product_id: product.id, user_id: user.id });
    }
    queryClient.invalidateQueries({ queryKey: ["source-user-shortlisted", product.id, user.id] });
  };

  if (isLoading) {
    return (
      <V2Page>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--v2-teal)" }} />
        </div>
      </V2Page>
    );
  }

  if (!product) {
    return (
      <V2Page>
        <V2Nav />
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "120px 24px 80px", textAlign: "center" }}>
          <h1 className="font-display" style={{ fontSize: 32, fontWeight: 400, color: "var(--v2-ink)", marginBottom: 8 }}>Product not found</h1>
          <p className="font-body" style={{ fontSize: 14, color: "var(--v2-muted)", marginBottom: 24 }}>This product doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/source")}
            style={{ padding: "12px 22px", borderRadius: 9, fontSize: 14, fontWeight: 500, background: "var(--v2-ink)", color: "#fff", border: "none", cursor: "pointer" }}
          >
            Browse Source
          </button>
        </div>
        <V2Footer />
      </V2Page>
    );
  }

  const images = (product.product_images as string[] | null) || [];
  const coverImage = images.length > 0 && typeof images[0] === "string" && images[0].startsWith("http") ? images[0] : null;

  const primaryBtn = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    padding: "10px 18px", borderRadius: 9, fontSize: 13, fontWeight: 500,
    background: "var(--v2-ink)", color: "#fff", border: "none", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 6, ...extra,
  });
  const outlineBtn = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    padding: "10px 18px", borderRadius: 9, fontSize: 13, fontWeight: 500,
    background: "var(--v2-white)", color: "var(--v2-ink)", border: "1px solid var(--v2-border)", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 6, ...extra,
  });

  return (
    <V2Page>
      <V2Nav />

      <main style={{ maxWidth: 920, margin: "0 auto", padding: "120px 24px 80px" }}>
        <button
          onClick={() => navigate("/source")}
          className="inline-flex items-center font-body"
          style={{ gap: 6, marginBottom: 20, padding: "6px 12px 6px 8px", borderRadius: 9, fontSize: 13, fontWeight: 500, color: "var(--v2-muted)", background: "transparent", border: "1px solid var(--v2-border)", cursor: "pointer" }}
        >
          <ArrowLeft className="w-4 h-4" /> Return to Source
        </button>

        {/* Top Section */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6" style={{ marginBottom: 24 }}>
          <div className="shrink-0 overflow-hidden flex items-center justify-center" style={{ width: 64, height: 64, borderRadius: 12, background: "var(--v2-surface)", fontSize: 28 }}>
            {coverImage ? <img src={coverImage} alt={product.product_name} className="w-full h-full object-cover" /> : <span>📦</span>}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 6 }}>
              <h1 className="font-display" style={{ fontSize: "clamp(24px, 3.2vw, 36px)", fontWeight: 400, letterSpacing: "-0.02em", color: "var(--v2-ink)" }}>
                {product.product_name}
              </h1>
              {product.is_verified && (
                <span style={{ ...tagStyle, background: "var(--v2-teal-light)", color: "var(--v2-teal)" }}>
                  <CheckCircle className="w-3 h-3" /> Verified
                </span>
              )}
              {product.is_trending && (
                <span style={tagStyle}>🔥 Trending</span>
              )}
            </div>
            <p className="font-body" style={{ fontSize: 14, color: "var(--v2-muted)", marginBottom: 12 }}>{product.tagline}</p>
            <div className="flex gap-2 flex-wrap">
              {product.moq && <span style={tagStyle}><Package className="w-3 h-3" /> MOQ: {product.moq}</span>}
              {product.shipping_countries && (product.shipping_countries as string[]).length > 0 && (
                <span style={tagStyle}><Globe className="w-3 h-3" /> Ships globally</span>
              )}
              {product.available_skus && (
                <span style={tagStyle}><Layers className="w-3 h-3" /> {product.available_skus} SKUs</span>
              )}
            </div>
          </div>

          <div className="hidden sm:flex flex-col gap-2 shrink-0">
            <button onClick={handleVote} style={primaryBtn(hasVoted ? { background: "var(--v2-teal)" } : {})}>
              <ChevronUp className="w-4 h-4" /> {hasVoted ? "Voted" : "Vote"}
            </button>
            <button onClick={handleShortlist} style={outlineBtn(isShortlisted ? { background: "var(--v2-teal-light)", borderColor: "var(--v2-teal)", color: "var(--v2-teal)" } : {})}>
              <Heart className={cn("w-4 h-4", isShortlisted && "fill-current")} />
              {isShortlisted ? "Shortlisted" : "+ Shortlist"}
            </button>
            <button style={outlineBtn()}>
              <MessageSquare className="w-4 h-4" /> Request Sample
            </button>
          </div>
        </div>

        <div style={{ height: 1, background: "var(--v2-border)", marginBottom: 16 }} />

        {/* Mobile actions */}
        <div className="flex sm:hidden gap-2" style={{ marginBottom: 32 }}>
          <button onClick={handleVote} className="flex-1" style={{ ...primaryBtn(hasVoted ? { background: "var(--v2-teal)" } : {}), justifyContent: "center", height: 44 }}>
            <ChevronUp className="w-4 h-4" /> {hasVoted ? "Voted" : "Vote"}
          </button>
          <button onClick={handleShortlist} className="flex-1" style={{ ...outlineBtn(isShortlisted ? { background: "var(--v2-teal-light)", borderColor: "var(--v2-teal)", color: "var(--v2-teal)" } : {}), justifyContent: "center", height: 44 }}>
            <Heart className={cn("w-4 h-4", isShortlisted && "fill-current")} />
            {isShortlisted ? "Saved" : "Shortlist"}
          </button>
          <button className="flex-1" style={{ ...outlineBtn(), justifyContent: "center", height: 44 }}>
            <MessageSquare className="w-4 h-4" /> Enquire
          </button>
        </div>

        {/* Vote Stats */}
        <div className="grid grid-cols-2 gap-4" style={{ marginBottom: 24 }}>
          <div style={{ ...cardStyle, textAlign: "center" }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--v2-teal)", marginBottom: 6 }}>Buyer Votes</p>
            <p className="font-display" style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.02em", color: "var(--v2-ink)" }}>{votes.buyer}</p>
            <p className="font-body" style={{ fontSize: 12, color: "var(--v2-muted)", marginTop: 4 }}>retail buyers</p>
          </div>
          <div style={{ ...cardStyle, textAlign: "center" }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--v2-muted)", marginBottom: 6 }}>Community Votes</p>
            <p className="font-display" style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.02em", color: "var(--v2-ink)" }}>{votes.community}</p>
            <p className="font-body" style={{ fontSize: 12, color: "var(--v2-muted)", marginTop: 4 }}>via share link</p>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <h2 className="font-display" style={{ fontSize: 22, fontWeight: 400, color: "var(--v2-ink)", marginBottom: 12 }}>AI Trend Signals</h2>
            {trendPlatforms.map((platform) => (
              <div key={platform.name} className="flex items-center gap-4" style={cardStyle}>
                <div className="flex items-center justify-center shrink-0" style={{ width: 40, height: 40, borderRadius: 10, background: "var(--v2-teal-light)" }}>
                  <TrendingUp className="w-5 h-5" style={{ color: "var(--v2-teal)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-body" style={{ fontSize: 14, fontWeight: 600, color: "var(--v2-ink)" }}>{platform.name}</span>
                    {platform.urlTemplate && (
                      <a
                        href={platform.urlTemplate(product.product_name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:underline"
                        style={{ fontSize: 12, color: "var(--v2-teal)" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="font-body" style={{ fontSize: 12, color: "var(--v2-muted)", marginTop: 2 }}>
                    {platform.name === "Spottail" ? "Buyer interest signals from Spottail Source" : "Search volume and engagement data"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--v2-ink)" }}>—</span>
                  <div style={{ width: 80, height: 4, background: "var(--v2-surface)", borderRadius: 999, marginTop: 4, overflow: "hidden" }}>
                    <div style={{ width: 0, height: "100%", borderRadius: 999, background: "var(--v2-teal)" }} />
                  </div>
                </div>
              </div>
            ))}

            {product.description && (
              <div style={{ marginTop: 24 }}>
                <h2 className="font-display" style={{ fontSize: 22, fontWeight: 400, color: "var(--v2-ink)", marginBottom: 12 }}>About this Product</h2>
                <div style={cardStyle}>
                  <p className="font-body whitespace-pre-wrap" style={{ fontSize: 14, fontWeight: 300, color: "var(--v2-ink)", lineHeight: 1.7 }}>
                    {product.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div style={cardStyle}>
              <h3 className="font-body" style={{ fontSize: 13, fontWeight: 600, color: "var(--v2-ink)", marginBottom: 12 }}>Supplier</h3>
              <div className="space-y-2 font-body" style={{ fontSize: 13 }}>
                {[
                  ["Brand", "—"],
                  ["Country", "—"],
                  ["Response time", "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span style={{ color: "var(--v2-muted)" }}>{k}</span>
                    <span style={{ color: "var(--v2-ink)", fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
                {product.is_verified && (
                  <div style={{ paddingTop: 8, borderTop: "1px solid var(--v2-border)" }}>
                    <span style={{ ...tagStyle, background: "var(--v2-teal-light)", color: "var(--v2-teal)", width: "fit-content" }}>
                      <CheckCircle className="w-3 h-3" /> Verified Brand
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Vote Dialog */}
        <Dialog open={showVoteEmail} onOpenChange={(open) => {
          setShowVoteEmail(open);
          if (!open) {
            setVoteStatus("idle");
            setVoteEmail("");
            setCaptchaAnswer("");
            setVoteError("");
          }
        }}>
          <DialogContent className="spottail-v2 sm:max-w-md" style={{ background: "#FEFEFE", border: "1px solid #E4E4E0", color: "#1A1A18" }}>
            <DialogHeader>
              <DialogTitle className="font-display" style={{ fontSize: 22, fontWeight: 400, letterSpacing: "-0.02em", color: "var(--v2-ink)" }}>
                {voteStatus === "success" ? "Vote recorded!" : voteStatus === "duplicate" ? "Already voted" : `Vote for ${product.product_name}`}
              </DialogTitle>
            </DialogHeader>
            {voteStatus === "success" ? (
              <div className="text-center" style={{ padding: "16px 0" }}>
                <CheckCircle className="mx-auto" style={{ width: 40, height: 40, color: "var(--v2-teal)", marginBottom: 12 }} />
                <p className="font-body" style={{ fontSize: 13, color: "var(--v2-muted)" }}>
                  Thanks for supporting this product! Your vote has been counted.
                </p>
              </div>
            ) : voteStatus === "duplicate" ? (
              <div className="text-center" style={{ padding: "16px 0" }}>
                <CheckCircle className="mx-auto" style={{ width: 40, height: 40, color: "var(--v2-teal)", marginBottom: 12 }} />
                <p className="font-body" style={{ fontSize: 13, color: "var(--v2-muted)" }}>
                  This email has already voted for this product.
                </p>
              </div>
            ) : (
              <div>
                <p className="font-body" style={{ fontSize: 12, color: "var(--v2-muted)", marginBottom: 16 }}>
                  Enter your email and solve the challenge to cast your vote.
                </p>
                <form onSubmit={handleCommunityVote} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={voteEmail}
                    onChange={(e) => setVoteEmail(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-body" style={{ fontSize: 13, color: "var(--v2-muted)", whiteSpace: "nowrap" }}>
                      What is {captchaChallenge.a} + {captchaChallenge.b}?
                    </span>
                    <Input
                      type="number"
                      placeholder="?"
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value)}
                      className="w-20 text-center"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={voteStatus === "submitting"}
                    className="w-full inline-flex items-center justify-center"
                    style={{ padding: "12px 20px", borderRadius: 9, fontSize: 14, fontWeight: 500, background: "var(--v2-ink)", color: "#fff", border: "none", cursor: "pointer", gap: 6 }}
                  >
                    {voteStatus === "submitting" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Vote"}
                  </button>
                </form>
                {voteError && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 8 }}>{voteError}</p>}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <V2Footer />
    </V2Page>
  );
};

export default SourceProductDetail;
