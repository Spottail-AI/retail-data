import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronUp, Heart, MessageSquare, ExternalLink,
  CheckCircle, TrendingUp, Loader2, Globe, Package, Layers, Mail,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email").max(255);

const trendPlatforms = [
  { name: "TikTok", color: "#ff0050", urlTemplate: (q: string) => `https://tiktok.com/search?q=${encodeURIComponent(q)}` },
  { name: "Reddit", color: "#ff4500", urlTemplate: (q: string) => `https://reddit.com/search?q=${encodeURIComponent(q)}` },
  { name: "Google Trends", color: "#4285f4", urlTemplate: (q: string) => `https://trends.google.com/trends/explore?q=${encodeURIComponent(q)}` },
  { name: "Spottail", color: "#1e2d4a", urlTemplate: null },
];

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
      const { data, error } = await supabase
        .from("source_products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Record view
  useEffect(() => {
    if (product) {
      supabase.from("source_product_views").insert({
        product_id: product.id,
        viewer_id: user?.id || null,
      });
    }
  }, [product?.id, user?.id]);

  useEffect(() => {
    if (product) {
      document.title = `${product.product_name} — Spottail Source`;
    }
  }, [product]);

  const { data: votes = { buyer: 0, community: 0 } } = useQuery({
    queryKey: ["source-product-votes", product?.id],
    queryFn: async () => {
      const [buyerRes, communityRes] = await Promise.all([
        supabase.from("source_buyer_votes").select("id", { count: "exact" }).eq("product_id", product!.id),
        supabase.rpc("get_community_vote_count", { p_product_id: product!.id }),
      ]);
      return {
        buyer: buyerRes.count || 0,
        community: (communityRes.data as number | null) || 0,
      };
    },
    enabled: !!product,
  });

  const { data: hasVoted = false } = useQuery({
    queryKey: ["source-user-voted", product?.id, user?.id],
    queryFn: async () => {
      if (!user || !product) return false;
      const { data } = await supabase
        .from("source_buyer_votes")
        .select("id")
        .eq("product_id", product.id)
        .eq("user_id", user.id)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user && !!product,
  });

  const { data: isShortlisted = false } = useQuery({
    queryKey: ["source-user-shortlisted", product?.id, user?.id],
    queryFn: async () => {
      if (!user || !product) return false;
      const { data } = await supabase
        .from("source_shortlists")
        .select("id")
        .eq("product_id", product.id)
        .eq("user_id", user.id)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user && !!product,
  });

  const handleVote = async () => {
    if (!product) return;
    if (user) {
      // Authenticated buyer vote
      if (hasVoted) {
        await supabase.from("source_buyer_votes").delete().eq("product_id", product.id).eq("user_id", user.id);
      } else {
        await supabase.from("source_buyer_votes").insert({ product_id: product.id, user_id: user.id });
      }
      queryClient.invalidateQueries({ queryKey: ["source-product-votes", product.id] });
      queryClient.invalidateQueries({ queryKey: ["source-user-voted", product.id, user.id] });
    } else {
      // Show email verification flow for unauthenticated users
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
    if (!user) { navigate("/auth?mode=signup&redirect=/source/" + slug); return; }
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
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4f8ef7]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0e1a]">
        <Header />
        <div className="max-w-[900px] mx-auto px-4 py-20 text-center">
          <h1 className="text-white text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-[#94a3b8] mb-6">This product doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/source")} className="bg-[#c5f135] text-black hover:bg-[#c5f135]/90 font-semibold">
            Browse Source
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = (product.product_images as string[] | null) || [];
  const coverImage = images.length > 0 && typeof images[0] === "string" && images[0].startsWith("http") ? images[0] : null;

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16">
        {/* Top Section */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
          {/* Image */}
          <div className="w-16 h-16 rounded-xl bg-[#1e2d4a] flex items-center justify-center text-3xl shrink-0 overflow-hidden">
            {coverImage ? (
              <img src={coverImage} alt={product.product_name} className="w-full h-full object-cover" />
            ) : (
              <span>📦</span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{product.product_name}</h1>
              {product.is_verified && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4f8ef7]/10 text-[#4f8ef7] border border-[#4f8ef7]/20 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Verified
                </span>
              )}
              {product.is_trending && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff4f17]/10 text-[#ff4f17] border border-[#ff4f17]/20">
                  🔥 Trending
                </span>
              )}
            </div>
            
            <p className="text-[#94a3b8] text-sm mb-3">{product.tagline}</p>
            <div className="flex gap-2 flex-wrap">
              {product.moq && (
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#1e2d4a] text-[#94a3b8] flex items-center gap-1">
                  <Package className="w-3 h-3" /> MOQ: {product.moq}
                </span>
              )}
              {product.shipping_countries && (product.shipping_countries as string[]).length > 0 && (
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#1e2d4a] text-[#94a3b8] flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Ships globally
                </span>
              )}
              {product.available_skus && (
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#1e2d4a] text-[#94a3b8] flex items-center gap-1">
                  <Layers className="w-3 h-3" /> {product.available_skus} SKUs
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons - desktop */}
          <div className="hidden sm:flex flex-col gap-2 shrink-0">
            <Button
              onClick={handleVote}
              className={cn(
                "bg-[#c5f135] text-black hover:bg-[#c5f135]/90 font-semibold px-6",
                hasVoted && "bg-[#4f8ef7] text-white hover:bg-[#4f8ef7]/90"
              )}
            >
              <ChevronUp className="w-4 h-4 mr-1" /> {hasVoted ? "Voted" : "Vote"}
            </Button>
            <Button
              onClick={handleShortlist}
              variant="outline"
              className={cn(
                "border-[#4f8ef7]/30 text-[#4f8ef7] hover:bg-[#4f8ef7]/10",
                isShortlisted && "bg-[#4f8ef7]/10 border-[#4f8ef7]"
              )}
            >
              <Heart className={cn("w-4 h-4 mr-1", isShortlisted && "fill-[#4f8ef7]")} />
              {isShortlisted ? "Shortlisted" : "+ Shortlist"}
            </Button>
            <Button
              variant="outline"
              className="border-[#4f8ef7]/30 text-[#4f8ef7] hover:bg-[#4f8ef7]/10"
            >
              <MessageSquare className="w-4 h-4 mr-1" /> Request Sample
            </Button>
          </div>
        </div>

        <div className="h-px bg-[#1e2d4a] mb-4" />

        {/* Action Buttons - mobile */}
        <div className="flex sm:hidden gap-2 mb-8">
          <Button
            onClick={handleVote}
            className={cn(
              "flex-1 bg-[#c5f135] text-black hover:bg-[#c5f135]/90 font-semibold text-sm h-11",
              hasVoted && "bg-[#4f8ef7] text-white hover:bg-[#4f8ef7]/90"
            )}
          >
            <ChevronUp className="w-4 h-4 mr-1.5" /> {hasVoted ? "Voted" : "Vote"}
          </Button>
          <Button
            onClick={handleShortlist}
            variant="outline"
            className={cn(
              "flex-1 border-[#4f8ef7]/30 text-[#4f8ef7] hover:bg-[#4f8ef7]/10 text-sm h-11",
              isShortlisted && "bg-[#4f8ef7]/10 border-[#4f8ef7]"
            )}
          >
            <Heart className={cn("w-4 h-4 mr-1.5", isShortlisted && "fill-[#4f8ef7]")} />
            {isShortlisted ? "Saved" : "Shortlist"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-[#4f8ef7]/30 text-[#4f8ef7] hover:bg-[#4f8ef7]/10 text-sm h-11"
          >
            <MessageSquare className="w-4 h-4 mr-1.5" /> Enquire
          </Button>
        </div>

        {/* Votes Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#111827] border border-[#1e2d4a] rounded-xl p-5 text-center">
            <p className="text-[#4f8ef7] text-xs font-semibold uppercase tracking-wider mb-1">Buyer Votes</p>
            <p className="text-white text-3xl font-extrabold">{votes.buyer}</p>
            <p className="text-[#94a3b8] text-xs mt-1">retail buyers</p>
          </div>
          <div className="bg-[#111827] border border-[#1e2d4a] rounded-xl p-5 text-center">
            <p className="text-[#94a3b8] text-xs font-semibold uppercase tracking-wider mb-1">Community Votes</p>
            <p className="text-white text-3xl font-extrabold">{votes.community}</p>
            <p className="text-[#94a3b8] text-xs mt-1">via share link</p>
          </div>
        </div>

        {/* Body - Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left - AI Trend Signals */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-white font-bold text-lg mb-3">AI Trend Signals</h2>
            {trendPlatforms.map((platform) => (
              <div key={platform.name} className="bg-[#111827] border border-[#1e2d4a] rounded-xl p-4 flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${platform.color}15` }}
                >
                  <TrendingUp className="w-5 h-5" style={{ color: platform.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">{platform.name}</span>
                    {platform.urlTemplate && (
                      <a
                        href={platform.urlTemplate(product.product_name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4f8ef7] hover:underline text-xs flex items-center gap-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  {platform.name === "Spottail" ? (
                    <p className="text-[#94a3b8] text-xs mt-0.5">Buyer interest signals from Spottail Source</p>
                  ) : (
                    <p className="text-[#94a3b8] text-xs mt-0.5">Search volume and engagement data</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[#c5f135] font-bold text-sm">—</span>
                  <div className="w-20 h-1.5 bg-[#1e2d4a] rounded-full mt-1 overflow-hidden">
                    <div className="h-full rounded-full w-0" style={{ backgroundColor: platform.color }} />
                  </div>
                </div>
              </div>
            ))}

            {/* Description */}
            {product.description && (
              <div className="mt-6">
                <h2 className="text-white font-bold text-lg mb-3">About this Product</h2>
                <div className="bg-[#111827] border border-[#1e2d4a] rounded-xl p-5">
                  <p className="text-[#94a3b8] text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right - Supplier */}
          <div className="lg:col-span-2 space-y-4">
            {/* Supplier Card */}
            <div className="bg-[#111827] border border-[#1e2d4a] rounded-xl p-5">
              <h3 className="text-white font-semibold text-sm mb-3">Supplier</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Brand</span>
                  <span className="text-white font-medium">—</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Country</span>
                  <span className="text-white font-medium">—</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Response time</span>
                  <span className="text-white font-medium">—</span>
                </div>
                {product.is_verified && (
                  <div className="pt-2 border-t border-[#1e2d4a]">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4f8ef7]/10 text-[#4f8ef7] border border-[#4f8ef7]/20 flex items-center gap-1 w-fit">
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
          <DialogContent className="bg-[#111827] border-[#1e2d4a] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">
                {voteStatus === "success"
                  ? "Vote recorded!"
                  : voteStatus === "duplicate"
                  ? "Already voted"
                  : `Vote for ${product.product_name}`}
              </DialogTitle>
            </DialogHeader>
            {voteStatus === "success" ? (
              <div className="text-center py-4">
                <CheckCircle className="w-10 h-10 text-[#4ade80] mx-auto mb-3" />
                <p className="text-[#94a3b8] text-sm">Thanks for supporting this product! Your vote has been counted.</p>
              </div>
            ) : voteStatus === "duplicate" ? (
              <div className="text-center py-4">
                <CheckCircle className="w-10 h-10 text-[#4ade80] mx-auto mb-3" />
                <p className="text-[#94a3b8] text-sm">This email has already voted for this product.</p>
              </div>
            ) : (
              <div>
                <p className="text-[#94a3b8] text-xs mb-4">Enter your email and solve the challenge to cast your vote.</p>
                <form onSubmit={handleCommunityVote} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={voteEmail}
                    onChange={(e) => setVoteEmail(e.target.value)}
                    className="bg-[#0a0e1a] border-[#1e2d4a] text-white placeholder:text-[#64748b]"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[#94a3b8] text-sm whitespace-nowrap">What is {captchaChallenge.a} + {captchaChallenge.b}?</span>
                    <Input
                      type="number"
                      placeholder="?"
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value)}
                      className="w-20 bg-[#0a0e1a] border-[#1e2d4a] text-white placeholder:text-[#64748b] text-center"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={voteStatus === "submitting"}
                    className="w-full bg-[#4f8ef7] hover:bg-[#4f8ef7]/90 text-white font-semibold"
                  >
                    {voteStatus === "submitting" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Vote"}
                  </Button>
                </form>
                {voteError && <p className="text-red-400 text-xs mt-2">{voteError}</p>}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default SourceProductDetail;
