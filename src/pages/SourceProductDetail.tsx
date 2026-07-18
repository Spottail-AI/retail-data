import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/use-user-role";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Heart, CheckCircle, TrendingUp, Loader2, Globe, Package, Layers,
  ArrowLeft, Share2, Copy, Lock, Rocket, X, Mail, HelpCircle, ChevronDown, ChevronUp,
  Trophy, BarChart3, Triangle,
} from "lucide-react";
import { V2Nav, V2Footer, V2Page } from "@/components/v2/V2Shell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { z } from "zod";

/* eslint-disable @typescript-eslint/no-explicit-any */
const db = supabase as any; // new tables pending type regeneration

const emailSchema = z.string().trim().email("Please enter a valid email").max(255);

const VOTE_COUNT_THRESHOLD = 25;

type SignalRow = {
  platform: "tiktok" | "reddit" | "search";
  strength: "strong" | "moderate" | "quiet";
  summary: string;
  links: { title: string; url: string }[];
};

const PLATFORM_META: Record<string, { label: string }> = {
  tiktok: { label: "TikTok" },
  reddit: { label: "Reddit" },
  search: { label: "Search interest" },
};

const strengthPill = (s: string): React.CSSProperties =>
  s === "strong" || s === "rising"
    ? { background: "var(--v2-teal-light)", color: "var(--v2-teal)" }
    : s === "moderate"
    ? { background: "#FAEEDA", color: "#854F0B" }
    : { background: "var(--v2-surface)", color: "var(--v2-muted)" };

const cardStyle: React.CSSProperties = {
  background: "var(--v2-white)",
  border: "1px solid var(--v2-border)",
  borderRadius: 12,
  padding: 20,
};

const tagStyle: React.CSSProperties = {
  fontSize: 10, padding: "3px 10px", borderRadius: 999,
  background: "var(--v2-surface)", color: "var(--v2-muted)",
  display: "inline-flex", alignItems: "center", gap: 4,
};

// Monday 00:00 UTC of the current week.
const weekStartISO = () => {
  const d = new Date();
  const day = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - day);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
};

// Stable per-browser share ref code.
const myRefCode = () => {
  try {
    let code = localStorage.getItem("spottail_ref_code");
    if (!code) {
      code = Math.random().toString(36).slice(2, 8);
      localStorage.setItem("spottail_ref_code", code);
    }
    return code;
  } catch { return "x"; }
};

const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch { return false; }
  }
};

const SourceProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { isBuyer } = useUserRole();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [showVoteEmail, setShowVoteEmail] = useState(false);
  const [voteEmail, setVoteEmail] = useState("");
  const [voteStatus, setVoteStatus] = useState<"idle" | "submitting" | "success" | "error" | "duplicate">("idle");
  const [voteError, setVoteError] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaChallenge, setCaptchaChallenge] = useState(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { a, b };
  });
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [postVoteOpen, setPostVoteOpen] = useState(false);
  const [bannerHidden, setBannerHidden] = useState(() => {
    try { return sessionStorage.getItem("sv_banner_hidden") === "1"; } catch { return false; }
  });
  const [faqOpen, setFaqOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState<null | "contact" | "sample">(null);
  const [enquiryMsg, setEnquiryMsg] = useState("");
  const [enquiryState, setEnquiryState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [localCommunityVoted, setLocalCommunityVoted] = useState(false);
  const viewTracked = useRef(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["source-product", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("source_products").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const isOwner = !!user && !!product && (product as any).user_id === user.id;

  const track = (event: string, ref?: string | null) => {
    if (!product) return;
    db.from("source_page_events").insert({
      product_id: (product as any).id,
      event,
      ref: ref ? ref.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || null : null,
      visitor_id: user?.id || null,
    }).then(({ error }: any) => { if (error) console.warn("event insert:", error.message); });
  };

  // Legacy analytics view counter (kept — the analytics page reads this table).
  useEffect(() => {
    if (product) {
      supabase.from("source_product_views").insert({ product_id: (product as any).id, viewer_id: user?.id || null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(product as any)?.id, user?.id]);

  useEffect(() => {
    if (product) document.title = `${(product as any).product_name} — Spottail Source`;
  }, [product]);

  // New event tracking: once per session per product, never for the owner.
  useEffect(() => {
    if (!product || viewTracked.current || isOwner) return;
    const key = `sv_${(product as any).id}`;
    try { if (sessionStorage.getItem(key)) { viewTracked.current = true; return; } } catch { /* private mode */ }
    viewTracked.current = true;
    try { sessionStorage.setItem(key, "1"); } catch { /* ignore */ }
    track("view", searchParams.get("ref"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, isOwner]);

  const { data: votes = { buyer: 0, community: 0 } } = useQuery({
    queryKey: ["source-product-votes", (product as any)?.id],
    queryFn: async () => {
      const [buyerRes, communityRes] = await Promise.all([
        supabase.from("source_buyer_votes").select("id", { count: "exact" }).eq("product_id", (product as any)!.id),
        supabase.rpc("get_community_vote_count", { p_product_id: (product as any)!.id }),
      ]);
      return { buyer: buyerRes.count || 0, community: (communityRes.data as number | null) || 0 };
    },
    enabled: !!product,
  });

  const { data: hasVoted = false } = useQuery({
    queryKey: ["source-user-voted", (product as any)?.id, user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("source_buyer_votes").select("id")
        .eq("product_id", (product as any)!.id).eq("user_id", user!.id).maybeSingle();
      return !!data;
    },
    enabled: !!product && !!user,
  });

  const { data: isShortlisted = false } = useQuery({
    queryKey: ["source-user-shortlisted", (product as any)?.id, user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("source_shortlists").select("id")
        .eq("product_id", (product as any)!.id).eq("user_id", user!.id).maybeSingle();
      return !!data;
    },
    enabled: !!product && !!user,
  });

  // Does this visitor already have a launch? (suppresses the conversion modal)
  const { data: ownsAnyLaunch = false } = useQuery({
    queryKey: ["source-owns-launch", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("source_products").select("id").eq("user_id", user!.id).limit(1);
      return !!data && data.length > 0;
    },
    enabled: !!user,
  });

  // Weekly rank within category + views (momentum).
  const { data: momentum } = useQuery({
    queryKey: ["source-momentum", (product as any)?.id],
    queryFn: async () => {
      const p = product as any;
      const since = weekStartISO();
      let peersQuery = supabase.from("source_products").select("id, launched_at");
      if (p.category) peersQuery = peersQuery.eq("category", p.category);
      const { data: peers } = await peersQuery.limit(100);
      const ids: string[] = (peers || []).map((x: any) => x.id);
      if (!ids.includes(p.id)) ids.push(p.id);
      const [buyerRes, commRes, viewsRes] = await Promise.all([
        supabase.from("source_buyer_votes").select("product_id").in("product_id", ids).gte("created_at", since),
        db.rpc("get_weekly_community_vote_counts", { p_product_ids: ids, p_since: since }),
        db.rpc("get_source_weekly_views", { p_product_id: p.id, p_since: since }),
      ]);
      const totals = new Map<string, number>();
      ids.forEach((id) => totals.set(id, 0));
      (buyerRes.data || []).forEach((v: any) => totals.set(v.product_id, (totals.get(v.product_id) || 0) + 1));
      ((commRes.data as any[]) || []).forEach((r: any) => totals.set(r.product_id, (totals.get(r.product_id) || 0) + Number(r.vote_count)));
      const launchedAt = new Map((peers || []).map((x: any) => [x.id, x.launched_at]));
      const ranked = [...totals.entries()].sort((a, b) =>
        b[1] - a[1] || String(launchedAt.get(b[0]) || "").localeCompare(String(launchedAt.get(a[0]) || ""))
      );
      const myWeekly = totals.get(p.id) || 0;
      const rank = ranked.findIndex(([id]) => id === p.id) + 1;
      return {
        rank: myWeekly > 0 ? rank : null,
        weeklyVotes: myWeekly,
        viewsThisWeek: typeof viewsRes.data === "number" ? viewsRes.data : 0,
      };
    },
    enabled: !!product,
  });

  // Trend signals: cached read, refresh via edge function when stale/missing.
  const { data: signalRow, isFetched: signalsFetched } = useQuery({
    queryKey: ["source-signals", (product as any)?.id],
    queryFn: async () => {
      const { data } = await db.from("source_trend_signals")
        .select("signals, refreshed_at").eq("product_id", (product as any)!.id).maybeSingle();
      return (data as { signals: SignalRow[]; refreshed_at: string } | null) ?? null;
    },
    enabled: !!product,
  });
  const [freshSignals, setFreshSignals] = useState<SignalRow[] | null>(null);
  const [signalsLoading, setSignalsLoading] = useState(false);
  const signalsRequested = useRef(false);
  useEffect(() => {
    if (!product || !signalsFetched || signalsRequested.current) return;
    const stale = !signalRow || Date.now() - new Date(signalRow.refreshed_at).getTime() > 7 * 24 * 3600 * 1000;
    if (!stale) return;
    signalsRequested.current = true;
    setSignalsLoading(!signalRow);
    supabase.functions.invoke("source-signals", { body: { product_id: (product as any).id } })
      .then(({ data }) => {
        if (data?.signals) setFreshSignals(data.signals);
      })
      .catch(() => { /* cached or quiet fallback renders */ })
      .finally(() => setSignalsLoading(false));
  }, [product, signalRow, signalsFetched]);
  const signals: SignalRow[] = freshSignals || signalRow?.signals || [];

  const totalVotes = votes.buyer + votes.community;
  const iVoted = hasVoted || localCommunityVoted;

  const maybeOpenPostVote = () => {
    if (isOwner || ownsAnyLaunch || !product) return;
    const key = `pv_${(product as any).id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch { /* still show once */ }
    setPostVoteOpen(true);
  };

  const handleVote = async () => {
    if (!product) return;
    if (!user) { setShowVoteEmail(true); return; }
    if (hasVoted) {
      await supabase.from("source_buyer_votes").delete().eq("product_id", (product as any).id).eq("user_id", user.id);
    } else {
      const { error } = await supabase.from("source_buyer_votes").insert({ product_id: (product as any).id, user_id: user.id });
      if (!error) { track("vote_buyer"); maybeOpenPostVote(); }
    }
    queryClient.invalidateQueries({ queryKey: ["source-product-votes", (product as any).id] });
    queryClient.invalidateQueries({ queryKey: ["source-user-voted", (product as any).id, user.id] });
    queryClient.invalidateQueries({ queryKey: ["source-momentum", (product as any).id] });
  };

  const handleCommunityVote = async (e: React.FormEvent) => {
    e.preventDefault();
    setVoteError("");
    const parsed = emailSchema.safeParse(voteEmail);
    if (!parsed.success) { setVoteError(parsed.error.errors[0].message); return; }
    if (parseInt(captchaAnswer, 10) !== captchaChallenge.a + captchaChallenge.b) {
      setVoteError("Incorrect answer. Please try again.");
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      setCaptchaChallenge({ a, b });
      setCaptchaAnswer("");
      return;
    }
    setVoteStatus("submitting");
    try {
      const { data, error } = await supabase.functions.invoke("verify-vote", {
        body: { action: "submit-vote", product_id: (product as any).id, email: parsed.data },
      });
      if (error) {
        // invoke() throws on non-2xx; the 409 duplicate case lives in the error body.
        let body: any = null;
        try {
          const ctx = (error as any).context;
          if (ctx && typeof ctx.json === "function") body = await ctx.json();
        } catch { /* unreadable body */ }
        if (body?.error === "already_voted") {
          setVoteStatus("duplicate");
          setLocalCommunityVoted(true);
          return;
        }
        throw error;
      }
      if (data?.error === "already_voted") {
        setVoteStatus("duplicate");
        setLocalCommunityVoted(true);
      } else if (data?.error) {
        setVoteStatus("error");
        setVoteError("Something went wrong. Please try again.");
      } else {
        setVoteStatus("success");
        setLocalCommunityVoted(true);
        track("vote_community", searchParams.get("ref"));
        queryClient.invalidateQueries({ queryKey: ["source-product-votes", (product as any).id] });
        queryClient.invalidateQueries({ queryKey: ["source-momentum", (product as any).id] });
      }
    } catch {
      setVoteStatus("error");
      setVoteError("Something went wrong. Please try again.");
    }
  };

  const handleShortlist = async () => {
    if (!user) { navigate(`/login?redirect=/source/${slug}`); return; }
    if (!product) return;
    if (isShortlisted) {
      await supabase.from("source_shortlists").delete().eq("product_id", (product as any).id).eq("user_id", user.id);
    } else {
      await supabase.from("source_shortlists").insert({ product_id: (product as any).id, user_id: user.id });
    }
    queryClient.invalidateQueries({ queryKey: ["source-user-shortlisted", (product as any).id, user.id] });
  };

  const sendEnquiry = async () => {
    if (!product || !user || !enquiryOpen) return;
    setEnquiryState("sending");
    const prefix = enquiryOpen === "sample" ? "[Sample request] " : "";
    const { error } = await supabase.from("source_enquiries").insert({
      product_id: (product as any).id,
      buyer_id: user.id,
      supplier_id: (product as any).user_id,
      message: (prefix + enquiryMsg.trim()).slice(0, 2000) || prefix.trim() || "Interested in this product.",
      status: "pending",
    });
    if (error) { setEnquiryState("error"); return; }
    track(enquiryOpen === "sample" ? "sample_request" : "enquiry");
    setEnquiryState("sent");
  };

  // Loop CTA: new tab, never disrupts the visitor's current session.
  // Anonymous visitors land on signup; signed-in users go straight to the form.
  const openLaunchFlow = (source: string) => {
    track("cta_launch_click", source);
    window.open(user ? "/source/new" : "/signup?redirect=/source/new", "_blank", "noopener");
  };

  const shareUrl = useMemo(
    () => (slug ? `${window.location.origin}/source/${slug}?ref=${myRefCode()}` : ""),
    [slug]
  );
  const shareBlurb = product
    ? `We just launched ${(product as any).product_name} on Spottail Source — where retail buyers discover new products. A vote takes 10 seconds and helps us get on shelves: ${shareUrl}`
    : "";

  const doCopy = async (what: "link" | "blurb") => {
    const ok = await copyText(what === "link" ? shareUrl : shareBlurb);
    if (ok) {
      setCopied(what);
      track("share", what);
      setTimeout(() => setCopied(null), 2000);
    }
  };
  const openIntent = (channel: "x" | "linkedin" | "whatsapp") => {
    track("share", channel);
    const urls = {
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareBlurb)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareBlurb)}`,
    };
    window.open(urls[channel], "_blank", "noopener");
  };

  /* ─────────── render ─────────── */

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
          <button onClick={() => navigate("/source")}
            style={{ padding: "12px 22px", borderRadius: 9, fontSize: 14, fontWeight: 500, background: "var(--v2-ink)", color: "#fff", border: "none", cursor: "pointer" }}>
            Browse Source
          </button>
        </div>
        <V2Footer />
      </V2Page>
    );
  }

  const p = product as any;
  const images: string[] = ((p.product_images as string[] | null) || []).filter(
    (i) => typeof i === "string" && i.startsWith("http")
  );
  const coverImage = images[0] || null;
  const hasWholesaleData = p.wholesale_price_min || p.wholesale_price_max || p.moq || p.lead_time || p.available_skus;
  const shipsTo: string[] = ((p.shipping_countries as string[] | null) || []).filter((c) => typeof c === "string");

  const outlineBtn = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    padding: "10px 16px", borderRadius: 9, fontSize: 13, fontWeight: 500,
    background: "var(--v2-white)", color: "var(--v2-ink)", border: "1px solid var(--v2-border)", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 6, ...extra,
  });

  const UpvoteBox = ({ compact }: { compact?: boolean }) => (
    <button
      onClick={handleVote}
      aria-label={iVoted ? "Voted" : "Vote for this product"}
      style={{
        width: compact ? 56 : 68,
        border: `1.5px solid ${iVoted ? "var(--v2-teal)" : "var(--v2-border)"}`,
        borderRadius: 12,
        padding: compact ? "8px 0 6px" : "11px 0 9px",
        background: iVoted ? "var(--v2-teal-light)" : "var(--v2-white)",
        color: iVoted ? "var(--v2-teal)" : "var(--v2-ink)",
        cursor: "pointer", textAlign: "center", flexShrink: 0,
        transition: "transform 120ms ease",
      }}
      onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.96)"; }}
      onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
    >
      <Triangle className={cn("mx-auto", iVoted && "fill-current")} style={{ width: compact ? 13 : 16, height: compact ? 13 : 16 }} />
      <div className="font-body" style={{ fontSize: totalVotes >= VOTE_COUNT_THRESHOLD ? 14 : 11, fontWeight: 600, marginTop: 3 }}>
        {totalVotes >= VOTE_COUNT_THRESHOLD ? totalVotes : iVoted ? "Voted" : "Vote"}
      </div>
    </button>
  );

  return (
    <V2Page>
      <V2Nav />

      <main style={{ maxWidth: 920, margin: "0 auto", padding: "110px 24px 80px" }}>
        {/* Visitor banner — the loop CTA. Hidden for the owner. */}
        {!isOwner && !bannerHidden && (
          <div className="flex items-center font-body" style={{ gap: 10, background: "var(--v2-teal-light)", borderRadius: 9, padding: "9px 14px", fontSize: 12.5, marginBottom: 16 }}>
            <Rocket style={{ width: 15, height: 15, flexShrink: 0, color: "var(--v2-teal)" }} />
            <span style={{ color: "#085041" }}>This is a Spottail Source launch page — retail brands use it to get discovered by buyers.</span>
            <button
              onClick={() => openLaunchFlow("banner")}
              style={{ marginLeft: "auto", fontWeight: 600, whiteSpace: "nowrap", background: "none", border: "none", color: "var(--v2-teal)", cursor: "pointer", fontSize: 12.5 }}>
              Launch your product free →
            </button>
            <button aria-label="Dismiss" onClick={() => { setBannerHidden(true); try { sessionStorage.setItem("sv_banner_hidden", "1"); } catch { /* ignore */ } }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--v2-teal)", padding: 0 }}>
              <X style={{ width: 13, height: 13 }} />
            </button>
          </div>
        )}

        {/* Owner toolbar */}
        {isOwner && (
          <div className="flex items-center font-body flex-wrap" style={{ gap: 10, background: "var(--v2-surface)", borderRadius: 9, padding: "9px 14px", fontSize: 12.5, color: "var(--v2-muted)", marginBottom: 16 }}>
            <span>Your launch page — this is what visitors see.</span>
            <button onClick={() => navigate(`/source/${slug}/analytics`)} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--v2-teal)", fontWeight: 600, cursor: "pointer", fontSize: 12.5, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <BarChart3 style={{ width: 13, height: 13 }} /> Analytics
            </button>
            <button onClick={() => navigate(`/source/${slug}/analytics#badge`)} style={{ background: "none", border: "none", color: "var(--v2-teal)", fontWeight: 600, cursor: "pointer", fontSize: 12.5 }}>
              Get badge
            </button>
          </div>
        )}

        <button onClick={() => navigate("/source")} className="inline-flex items-center font-body"
          style={{ gap: 6, marginBottom: 20, padding: "6px 12px 6px 8px", borderRadius: 9, fontSize: 13, fontWeight: 500, color: "var(--v2-muted)", background: "transparent", border: "1px solid var(--v2-border)", cursor: "pointer" }}>
          <ArrowLeft className="w-4 h-4" /> Return to Source
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6" style={{ marginBottom: 20 }}>
          <div className="shrink-0 overflow-hidden flex items-center justify-center" style={{ width: 64, height: 64, borderRadius: 12, background: "var(--v2-surface)" }}>
            {coverImage
              ? <img src={coverImage} alt={p.product_name} className="w-full h-full object-cover" />
              : <Package style={{ width: 26, height: 26, color: "var(--v2-muted)" }} />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 6 }}>
              <h1 className="font-display" style={{ fontSize: "clamp(24px, 3.2vw, 36px)", fontWeight: 400, letterSpacing: "-0.02em", color: "var(--v2-ink)" }}>
                {p.product_name}
              </h1>
              {momentum?.rank ? (
                <span style={{ ...tagStyle, background: "var(--v2-teal-light)", color: "var(--v2-teal)", fontSize: 11, fontWeight: 600 }}>
                  <Trophy className="w-3 h-3" /> #{momentum.rank} this week{p.category ? ` in ${p.category}` : ""}
                </span>
              ) : (
                <span style={{ ...tagStyle, fontSize: 11 }}>New this week</span>
              )}
              {p.is_verified && (
                <span style={{ ...tagStyle, background: "var(--v2-teal-light)", color: "var(--v2-teal)" }}>
                  <CheckCircle className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            {p.tagline && <p className="font-body" style={{ fontSize: 14, color: "var(--v2-muted)", marginBottom: 10 }}>{p.tagline}</p>}
            <div className="flex gap-2 flex-wrap items-center">
              {p.category && <span style={tagStyle}>{p.category}</span>}
              {shipsTo.length > 0 && <span style={tagStyle}><Globe className="w-3 h-3" /> Ships globally</span>}
              {p.available_skus && <span style={tagStyle}><Layers className="w-3 h-3" /> {p.available_skus} SKUs</span>}
              {(momentum?.weeklyVotes ?? 0) >= 3 && (
                <span className="font-body" style={{ fontSize: 11.5, color: "var(--v2-teal)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <TrendingUp className="w-3 h-3" /> rising this week
                </span>
              )}
            </div>
          </div>

          <div className="hidden sm:flex gap-2 shrink-0 items-start">
            <UpvoteBox />
            <div className="flex flex-col gap-2">
              <button onClick={() => setShareOpen(true)} style={outlineBtn()}>
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button onClick={handleShortlist} style={outlineBtn(isShortlisted ? { background: "var(--v2-teal-light)", borderColor: "var(--v2-teal)", color: "var(--v2-teal)" } : {})}>
                <Heart className={cn("w-4 h-4", isShortlisted && "fill-current")} />
                {isShortlisted ? "Saved" : "Shortlist"}
              </button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto" style={{ marginBottom: 24, paddingBottom: 4 }}>
            {images.slice(0, 4).map((img, i) => (
              <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="shrink-0 overflow-hidden" style={{ width: 140, height: 92, borderRadius: 9, background: "var(--v2-surface)" }}>
                <img src={img} alt={`${p.product_name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </a>
            ))}
            {images.length > 4 && (
              <a href={images[4]} target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center justify-center font-body" style={{ width: 140, height: 92, borderRadius: 9, border: "1px dashed var(--v2-border)", fontSize: 12, color: "var(--v2-muted)", textDecoration: "none" }}>
                +{images.length - 4} more
              </a>
            )}
          </div>
        )}

        {/* Mobile sticky actions */}
        <div className="flex sm:hidden" style={{ position: "sticky", bottom: 12, zIndex: 20, marginBottom: 24 }}>
          <div style={{ flex: 1, display: "flex", gap: 8, background: "var(--v2-white)", border: "1px solid var(--v2-border)", borderRadius: 12, padding: 8 }}>
            <UpvoteBox compact />
            <button onClick={() => setShareOpen(true)} className="flex-1" style={{ ...outlineBtn(), justifyContent: "center" }}>
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button onClick={handleShortlist} style={{ ...outlineBtn(isShortlisted ? { background: "var(--v2-teal-light)", borderColor: "var(--v2-teal)", color: "var(--v2-teal)" } : {}), justifyContent: "center" }}>
              <Heart className={cn("w-4 h-4", isShortlisted && "fill-current")} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-4">
            {p.description && (
              <div>
                <h2 className="font-display" style={{ fontSize: 20, fontWeight: 400, color: "var(--v2-ink)", marginBottom: 10 }}>About this product</h2>
                <div style={cardStyle}>
                  <p className="font-body whitespace-pre-wrap" style={{ fontSize: 14, fontWeight: 300, color: "var(--v2-ink)", lineHeight: 1.7 }}>
                    {p.description}
                  </p>
                </div>
              </div>
            )}

            {/* Trend signals */}
            <div>
              <div className="flex items-baseline gap-2 flex-wrap" style={{ marginBottom: 10 }}>
                <h2 className="font-display" style={{ fontSize: 20, fontWeight: 400, color: "var(--v2-ink)" }}>Trend signals</h2>
                <span className="font-body" style={{ fontSize: 11, color: "var(--v2-muted)" }}>
                  grounded in live web sources · refreshed weekly
                </span>
              </div>
              <div className="space-y-2">
                {signalsLoading && signals.length === 0 &&
                  [1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse" style={{ ...cardStyle, height: 68, padding: 0 }} />
                  ))}
                {!signalsLoading && signals.length === 0 && (
                  <div style={{ ...cardStyle, padding: 16 }}>
                    <p className="font-body" style={{ fontSize: 13, color: "var(--v2-muted)" }}>
                      Signals are being gathered for this launch — check back shortly.
                    </p>
                  </div>
                )}
                {signals.map((s) => (
                  <div key={s.platform} className="flex gap-3 items-start" style={{ ...cardStyle, padding: "14px 16px" }}>
                    <div className="flex items-center justify-center shrink-0" style={{ width: 34, height: 34, borderRadius: 9, background: "var(--v2-teal-light)" }}>
                      <TrendingUp className="w-4 h-4" style={{ color: "var(--v2-teal)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-body" style={{ fontSize: 13.5, fontWeight: 600, color: "var(--v2-ink)" }}>
                          {PLATFORM_META[s.platform]?.label || s.platform}
                        </span>
                        <span className="font-body" style={{ ...strengthPill(s.strength), fontSize: 10.5, fontWeight: 600, borderRadius: 999, padding: "2px 9px" }}>
                          {s.strength}
                        </span>
                      </div>
                      <p className="font-body" style={{ fontSize: 12.5, color: "var(--v2-muted)", marginTop: 3, lineHeight: 1.5 }}>{s.summary}</p>
                    </div>
                  </div>
                ))}

                {/* Spottail internal signal — always real numbers */}
                <div className="flex gap-3 items-start" style={{ ...cardStyle, padding: "14px 16px" }}>
                  <div className="flex items-center justify-center shrink-0" style={{ width: 34, height: 34, borderRadius: 9, background: "var(--v2-teal-light)" }}>
                    <BarChart3 className="w-4 h-4" style={{ color: "var(--v2-teal)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-body" style={{ fontSize: 13.5, fontWeight: 600, color: "var(--v2-ink)" }}>Spottail</span>
                      <span className="font-body" style={{ ...strengthPill((momentum?.weeklyVotes ?? 0) >= 3 ? "rising" : "quiet"), fontSize: 10.5, fontWeight: 600, borderRadius: 999, padding: "2px 9px" }}>
                        {(momentum?.weeklyVotes ?? 0) >= 3 ? "rising" : "steady"}
                      </span>
                    </div>
                    <p className="font-body" style={{ fontSize: 12.5, color: "var(--v2-muted)", marginTop: 3 }}>
                      {momentum
                        ? `${momentum.viewsThisWeek} view${momentum.viewsThisWeek === 1 ? "" : "s"} this week${momentum.rank ? ` — #${momentum.rank} on this week's ${p.category || "Source"} board` : " — newly launched"}.`
                        : "Gathering this week's activity…"}
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div style={{ border: "1px solid var(--v2-border)", borderRadius: 10, padding: "10px 14px", marginTop: 8 }}>
                <button onClick={() => setFaqOpen(!faqOpen)} className="flex items-center w-full font-body" style={{ gap: 8, fontSize: 12.5, fontWeight: 600, color: "var(--v2-ink)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <HelpCircle style={{ width: 14, height: 14, color: "var(--v2-muted)" }} />
                  How do I improve these signals?
                  {faqOpen
                    ? <ChevronUp style={{ width: 13, height: 13, marginLeft: "auto", color: "var(--v2-muted)" }} />
                    : <ChevronDown style={{ width: 13, height: 13, marginLeft: "auto", color: "var(--v2-muted)" }} />}
                </button>
                {faqOpen && (
                  <p className="font-body" style={{ fontSize: 12.5, color: "var(--v2-muted)", marginTop: 8, lineHeight: 1.6 }}>
                    Signals read the public internet, so they grow when your product does: post consistently where your
                    category lives (TikTok for snacks and beauty), take part in honest conversations in relevant
                    subreddits, and use one consistent product name so search interest accrues to a single term.
                    The Spottail signal responds directly to sharing your launch page — every share brings views and
                    votes that buyers see. Signals refresh weekly.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Side column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Wholesale — buyers and owner only */}
            <div style={cardStyle}>
              {isBuyer || isOwner ? (
                <>
                  <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
                    <span className="font-body" style={{ fontSize: 13, fontWeight: 600, color: "var(--v2-ink)" }}>Wholesale terms</span>
                    {isOwner && !isBuyer && <span style={{ ...tagStyle, fontSize: 10 }}>what buyers see</span>}
                  </div>
                  {hasWholesaleData ? (
                    <div className="font-body" style={{ fontSize: 13 }}>
                      {(p.wholesale_price_min || p.wholesale_price_max) && (
                        <div className="flex justify-between" style={{ padding: "4px 0" }}>
                          <span style={{ color: "var(--v2-muted)" }}>Wholesale</span>
                          <span style={{ fontWeight: 600, color: "var(--v2-ink)" }}>
                            {p.currency || "USD"} {p.wholesale_price_min ?? "—"}{p.wholesale_price_max ? `–${p.wholesale_price_max}` : ""} / unit
                          </span>
                        </div>
                      )}
                      {p.moq && <div className="flex justify-between" style={{ padding: "4px 0" }}><span style={{ color: "var(--v2-muted)" }}>MOQ</span><span style={{ fontWeight: 600, color: "var(--v2-ink)" }}>{p.moq}</span></div>}
                      {p.lead_time && <div className="flex justify-between" style={{ padding: "4px 0" }}><span style={{ color: "var(--v2-muted)" }}>Lead time</span><span style={{ fontWeight: 600, color: "var(--v2-ink)" }}>{p.lead_time}</span></div>}
                      {p.available_skus && <div className="flex justify-between" style={{ padding: "4px 0" }}><span style={{ color: "var(--v2-muted)" }}>SKUs</span><span style={{ fontWeight: 600, color: "var(--v2-ink)" }}>{p.available_skus}</span></div>}
                      {shipsTo.length > 0 && <div className="flex justify-between" style={{ padding: "4px 0" }}><span style={{ color: "var(--v2-muted)" }}>Ships to</span><span style={{ fontWeight: 600, color: "var(--v2-ink)", textAlign: "right" }}>{shipsTo.slice(0, 4).join(", ")}{shipsTo.length > 4 ? "…" : ""}</span></div>}
                    </div>
                  ) : (
                    <p className="font-body" style={{ fontSize: 12.5, color: "var(--v2-muted)" }}>
                      {isOwner
                        ? "You haven't added wholesale terms yet — buyers convert better with pricing and MOQ."
                        : "The brand hasn't added wholesale terms yet — send an enquiry."}
                    </p>
                  )}
                  {isBuyer && !isOwner && (
                    <div className="flex gap-2" style={{ marginTop: 12 }}>
                      <button onClick={() => { setEnquiryOpen("contact"); setEnquiryState("idle"); setEnquiryMsg(""); }} className="flex-1" style={{ ...outlineBtn(), justifyContent: "center", fontSize: 12.5 }}>
                        <Mail className="w-4 h-4" /> Contact brand
                      </button>
                      <button onClick={() => { setEnquiryOpen("sample"); setEnquiryState("idle"); setEnquiryMsg(""); }} className="flex-1" style={{ ...outlineBtn(), justifyContent: "center", fontSize: 12.5 }}>
                        <Package className="w-4 h-4" /> Request sample
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center" style={{ width: 30, height: 30, borderRadius: 8, background: "var(--v2-surface)" }}>
                      <Lock style={{ width: 14, height: 14, color: "var(--v2-muted)" }} />
                    </div>
                    <span className="font-body" style={{ fontSize: 13, fontWeight: 600, color: "var(--v2-ink)" }}>Wholesale terms</span>
                  </div>
                  <p className="font-body" style={{ fontSize: 12.5, color: "var(--v2-muted)", margin: "8px 0 0", lineHeight: 1.5 }}>
                    Pricing, MOQ, lead times, and samples are visible to verified retail buyers.
                  </p>
                  <button onClick={() => navigate(user ? "/dashboard" : `/login?redirect=/source/${slug}`)} className="w-full" style={{ ...outlineBtn(), justifyContent: "center", marginTop: 10, fontSize: 12.5 }}>
                    Are you a retail buyer? Sign in
                  </button>
                </>
              )}
            </div>

            {/* Momentum */}
            <div style={cardStyle}>
              <p className="font-body" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--v2-muted)", marginBottom: 8 }}>Momentum</p>
              <div className="font-body" style={{ fontSize: 12.5, color: "var(--v2-muted)" }}>
                <div className="flex justify-between" style={{ padding: "3px 0" }}>
                  <span>Rank this week</span>
                  <span style={{ fontWeight: 600, color: "var(--v2-ink)" }}>{momentum?.rank ? `#${momentum.rank}${p.category ? ` in ${p.category}` : ""}` : "New"}</span>
                </div>
                <div className="flex justify-between" style={{ padding: "3px 0" }}>
                  <span>Trend</span>
                  <span style={{ fontWeight: 600, color: (momentum?.weeklyVotes ?? 0) >= 3 ? "var(--v2-teal)" : "var(--v2-ink)" }}>
                    {(momentum?.weeklyVotes ?? 0) >= 3 ? "rising" : "steady"}
                  </span>
                </div>
                <div className="flex justify-between" style={{ padding: "3px 0" }}>
                  <span>Views this week</span>
                  <span style={{ fontWeight: 600, color: "var(--v2-ink)" }}>{momentum?.viewsThisWeek ?? "—"}</span>
                </div>
              </div>
              {totalVotes < VOTE_COUNT_THRESHOLD && (
                <p className="font-body" style={{ fontSize: 11, color: "var(--v2-muted)", marginTop: 8 }}>
                  Vote counts appear once a launch passes {VOTE_COUNT_THRESHOLD} votes.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Share dialog ── */}
        <Dialog open={shareOpen} onOpenChange={setShareOpen}>
          <DialogContent className="spottail-v2 sm:max-w-md" style={{ background: "#FEFEFE", border: "1px solid #E4E4E0", color: "#1A1A18" }}>
            <DialogHeader>
              <DialogTitle className="font-display" style={{ fontSize: 22, fontWeight: 400, color: "var(--v2-ink)" }}>
                Share {p.product_name}
              </DialogTitle>
            </DialogHeader>
            <p className="font-body" style={{ fontSize: 12.5, color: "var(--v2-muted)", marginTop: -6 }}>
              Every vote moves this launch up the weekly board.
            </p>
            <div className="flex gap-2">
              <Input readOnly value={shareUrl} onFocus={(e) => e.target.select()}
                className="text-xs bg-white text-[#1A1A18] border-[#E4E4E0]" />
              <button onClick={() => doCopy("link")} style={outlineBtn({ whiteSpace: "nowrap" })}>
                <Copy className="w-4 h-4" /> {copied === "link" ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => openIntent("x")} style={outlineBtn({ justifyContent: "center" })}>X</button>
              <button onClick={() => openIntent("linkedin")} style={outlineBtn({ justifyContent: "center" })}>LinkedIn</button>
              <button onClick={() => openIntent("whatsapp")} style={outlineBtn({ justifyContent: "center" })}>WhatsApp</button>
            </div>
            <div style={{ background: "var(--v2-surface)", borderRadius: 9, padding: "10px 12px" }}>
              <p className="font-body" style={{ fontSize: 12, color: "var(--v2-muted)", lineHeight: 1.5 }}>{shareBlurb}</p>
              <button onClick={() => doCopy("blurb")} style={{ background: "none", border: "none", padding: 0, marginTop: 6, fontSize: 12, fontWeight: 600, color: "var(--v2-teal)", cursor: "pointer" }}>
                {copied === "blurb" ? "Copied ✓" : "Copy blurb"}
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Post-vote conversion (buyer-vote path) ── */}
        <Dialog open={postVoteOpen} onOpenChange={setPostVoteOpen}>
          <DialogContent className="spottail-v2 sm:max-w-sm" style={{ background: "#FEFEFE", border: "1px solid #E4E4E0", color: "#1A1A18", textAlign: "center" }}>
            <div className="mx-auto flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--v2-teal-light)" }}>
              <CheckCircle style={{ width: 20, height: 20, color: "var(--v2-teal)" }} />
            </div>
            <DialogHeader>
              <DialogTitle className="font-display" style={{ fontSize: 20, fontWeight: 400, color: "var(--v2-ink)", textAlign: "center" }}>
                You just backed {p.product_name}
              </DialogTitle>
            </DialogHeader>
            <p className="font-body" style={{ fontSize: 13, color: "var(--v2-muted)", marginTop: -6, lineHeight: 1.55 }}>
              Got a product of your own? Launch it on Spottail Source free — buyers and the community are watching this week's board.
            </p>
            <button
              onClick={() => openLaunchFlow("post_vote")}
              className="w-full"
              style={{ padding: "11px 16px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, background: "var(--v2-teal)", color: "#fff", border: "none", cursor: "pointer" }}>
              Launch your product
            </button>
            <button onClick={() => setPostVoteOpen(false)} style={{ background: "none", border: "none", fontSize: 12.5, color: "var(--v2-muted)", cursor: "pointer" }}>
              Maybe later
            </button>
          </DialogContent>
        </Dialog>

        {/* ── Enquiry dialog (buyers) ── */}
        <Dialog open={!!enquiryOpen} onOpenChange={(o) => !o && setEnquiryOpen(null)}>
          <DialogContent className="spottail-v2 sm:max-w-md" style={{ background: "#FEFEFE", border: "1px solid #E4E4E0", color: "#1A1A18" }}>
            <DialogHeader>
              <DialogTitle className="font-display" style={{ fontSize: 20, fontWeight: 400, color: "var(--v2-ink)" }}>
                {enquiryOpen === "sample" ? `Request a sample of ${p.product_name}` : `Contact ${p.product_name}`}
              </DialogTitle>
            </DialogHeader>
            {enquiryState === "sent" ? (
              <div className="text-center" style={{ padding: "12px 0" }}>
                <CheckCircle className="mx-auto" style={{ width: 36, height: 36, color: "var(--v2-teal)", marginBottom: 10 }} />
                <p className="font-body" style={{ fontSize: 13, color: "var(--v2-muted)" }}>
                  Sent. The brand will reply through your enquiries inbox.
                </p>
              </div>
            ) : (
              <>
                <Textarea
                  rows={4}
                  value={enquiryMsg}
                  onChange={(e) => setEnquiryMsg(e.target.value)}
                  placeholder={enquiryOpen === "sample"
                    ? "Where should samples go, and what store are you buying for?"
                    : "What would you like to know — pricing tiers, case packs, lead times?"}
                  className="text-sm bg-white text-[#1A1A18] border-[#E4E4E0] placeholder:text-[#9A9A95]"
                />
                {enquiryState === "error" && (
                  <p className="font-body" style={{ fontSize: 12, color: "#dc2626" }}>Couldn't send — try again.</p>
                )}
                <button onClick={sendEnquiry} disabled={enquiryState === "sending"} className="w-full inline-flex items-center justify-center"
                  style={{ padding: "11px 16px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, background: "var(--v2-ink)", color: "#fff", border: "none", cursor: "pointer", gap: 6 }}>
                  {enquiryState === "sending" ? <Loader2 className="w-4 h-4 animate-spin" /> : enquiryOpen === "sample" ? "Request sample" : "Send"}
                </button>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Community vote dialog ── */}
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
                {voteStatus === "success" ? `You just backed ${p.product_name}` : voteStatus === "duplicate" ? "Already voted" : `Vote for ${p.product_name}`}
              </DialogTitle>
            </DialogHeader>
            {voteStatus === "success" ? (
              <div className="text-center" style={{ padding: "8px 0" }}>
                <CheckCircle className="mx-auto" style={{ width: 40, height: 40, color: "var(--v2-teal)", marginBottom: 12 }} />
                <p className="font-body" style={{ fontSize: 13, color: "var(--v2-muted)", marginBottom: 16 }}>
                  Your vote has been counted. Got a product of your own? Launch it on Spottail Source free.
                </p>
                <button
                  onClick={() => openLaunchFlow("post_vote")}
                  className="w-full"
                  style={{ padding: "11px 16px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, background: "var(--v2-teal)", color: "#fff", border: "none", cursor: "pointer" }}>
                  Launch your product
                </button>
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
                  <Input type="email" placeholder="you@example.com" value={voteEmail} onChange={(e) => setVoteEmail(e.target.value)}
                    className="bg-white text-[#1A1A18] border-[#E4E4E0] placeholder:text-[#9A9A95]" />
                  <div className="flex items-center gap-2">
                    <span className="font-body" style={{ fontSize: 13, color: "var(--v2-muted)", whiteSpace: "nowrap" }}>
                      What is {captchaChallenge.a} + {captchaChallenge.b}?
                    </span>
                    <Input type="number" placeholder="?" value={captchaAnswer} onChange={(e) => setCaptchaAnswer(e.target.value)}
                      className="w-20 text-center bg-white text-[#1A1A18] border-[#E4E4E0] placeholder:text-[#9A9A95]" />
                  </div>
                  <button type="submit" disabled={voteStatus === "submitting"} className="w-full inline-flex items-center justify-center"
                    style={{ padding: "12px 20px", borderRadius: 9, fontSize: 14, fontWeight: 500, background: "var(--v2-ink)", color: "#fff", border: "none", cursor: "pointer", gap: 6 }}>
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
