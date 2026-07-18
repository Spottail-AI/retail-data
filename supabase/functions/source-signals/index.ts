// source-signals: web-grounded trend evidence for a Source launch page.
// Honesty rules: every claim needs a live source link; no links -> "quiet" with
// a neutral summary. Cached per product, refreshed when older than 7 days.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type Signal = {
  platform: "tiktok" | "reddit" | "search";
  strength: "strong" | "moderate" | "quiet";
  summary: string;
  links: { title: string; url: string }[];
};

const STALE_MS = 7 * 24 * 60 * 60 * 1000;

const checkLink = async (url: string): Promise<boolean> => {
  for (const method of ["HEAD", "GET"] as const) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);
      const resp = await fetch(url, { method, redirect: "follow", signal: controller.signal });
      clearTimeout(timer);
      if (resp.ok || resp.status < 500) return true;
    } catch { /* try GET next */ }
  }
  return false;
};

const QUIET: Record<Signal["platform"], Signal> = {
  tiktok: { platform: "tiktok", strength: "quiet", summary: "Limited public TikTok conversation found for this niche yet — an early-category position.", links: [] },
  reddit: { platform: "reddit", strength: "quiet", summary: "No significant Reddit discussion found yet — the conversation is still up for grabs.", links: [] },
  search: { platform: "search", strength: "quiet", summary: "Low search volume for this exact product type — early-category position, not saturation.", links: [] },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { product_id, force } = await req.json();
    if (!product_id) {
      return new Response(JSON.stringify({ error: "product_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: product } = await admin.from("source_products")
      .select("id, product_name, tagline, category").eq("id", product_id).maybeSingle();
    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Serve cache when fresh.
    const { data: cached } = await admin.from("source_trend_signals")
      .select("signals, refreshed_at").eq("product_id", product_id).maybeSingle();
    if (cached && !force && Date.now() - new Date(cached.refreshed_at).getTime() < STALE_MS) {
      return new Response(JSON.stringify({ signals: cached.signals, refreshed_at: cached.refreshed_at, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      // No AI available: return cache (even stale) or quiet defaults; never an error page.
      const fallback = cached?.signals || Object.values(QUIET);
      return new Response(JSON.stringify({ signals: fallback, refreshed_at: cached?.refreshed_at || null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You research consumer-trend evidence for a retail product, GROUNDED IN LIVE GOOGLE WEB SEARCH.

PRODUCT: "${product.product_name}"${product.tagline ? ` — ${product.tagline}` : ""}${product.category ? ` (category: ${product.category})` : ""}

For each of THREE platforms, find real, current evidence of consumer interest in this product's CATEGORY (not the brand itself):
1. "tiktok" — creator/video activity, hashtags, view counts you actually saw reported
2. "reddit" — real threads/subreddits discussing this product type
3. "search" — search-interest evidence (Google Trends coverage, articles citing demand)

RULES (violating any = failure):
- Every claim must come from a source you actually read. Include 1-3 REAL urls per platform.
- RELEVANCE IS ABSOLUTE: a source counts ONLY if it directly discusses this product category or its consumer trend. Celebrity news, entertainment, politics, or generic articles that merely appeared in search results are NOT evidence — never cite them, never stretch a connection ("suggests broader interest" from unrelated content is a failure). If your search results are off-topic, the correct answer is "quiet" with links [].
- If you find little or nothing for a platform, set strength "quiet", give a neutral one-liner, links [].
- NEVER invent statistics, view counts, or URLs. Round numbers only as sources state them.
- strength: "strong" = clear active category trend with multiple on-topic sources; "moderate" = real but limited on-topic evidence; "quiet" = little or nothing on-topic found.
- summary: ONE sentence, max 180 chars, concrete and neutral, about the CATEGORY.
- links: each needs a "title" copied from the actual page/thread — titles must visibly relate to the category.

Return ONLY: {"signals":[{"platform":"tiktok|reddit|search","strength":"strong|moderate|quiet","summary":"...","links":[{"title":"short label","url":"https://..."}]}]}`;

    let signals: Signal[] | null = null;
    try {
      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          plugins: [{ id: "web" }],
          messages: [
            { role: "system", content: "You are a careful trend researcher. Ground everything in live web search. Return only valid JSON. Never fabricate sources or numbers." },
            { role: "user", content: prompt },
          ],
        }),
      });
      if (aiRes.ok) {
        const data = await aiRes.json();
        const raw = (data.choices?.[0]?.message?.content || "").replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(raw) as { signals?: Signal[] };
        if (Array.isArray(parsed.signals)) signals = parsed.signals;
      }
    } catch (e) {
      console.error("source-signals AI failure:", e);
    }

    // Relevance keywords from the product itself: a link title or summary must
    // touch at least one, or the evidence is treated as off-topic noise.
    const STOPWORDS = new Set(["the", "and", "with", "for", "from", "this", "that", "your", "our", "their", "food", "beverage", "product", "brand"]);
    const keywords = [
      ...(product.product_name || "").toLowerCase().split(/[^a-z0-9]+/),
      ...(product.tagline || "").toLowerCase().split(/[^a-z0-9]+/),
      ...(product.category || "").toLowerCase().split(/[^a-z0-9]+/),
    ].filter((w) => w.length > 3 && !STOPWORDS.has(w));
    // Include simple plural/singular variants.
    const kwSet = new Set(keywords.flatMap((w) => [w, w.endsWith("s") ? w.slice(0, -1) : `${w}s`]));
    const isRelevant = (text: string) => {
      const t = (text || "").toLowerCase();
      return [...kwSet].some((w) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "")}\\b`).test(t));
    };

    // Validate + enforce honesty rules.
    const platforms: Signal["platform"][] = ["tiktok", "reddit", "search"];
    const result: Signal[] = [];
    for (const platform of platforms) {
      const s = (signals || []).find((x) => x?.platform === platform);
      if (!s || !["strong", "moderate", "quiet"].includes(s.strength) || typeof s.summary !== "string") {
        result.push(QUIET[platform]);
        continue;
      }
      s.summary = s.summary.slice(0, 220);
      const rawLinks = (Array.isArray(s.links) ? s.links : [])
        .filter((l) => l && typeof l.url === "string" && /^https?:\/\//.test(l.url))
        // Off-topic titles are dropped before we even bother checking liveness.
        .filter((l) => isRelevant(String(l.title || "")) || isRelevant(l.url))
        .slice(0, 3);
      const liveFlags = await Promise.all(rawLinks.map((l) => checkLink(l.url)));
      const live = rawLinks.filter((_, i) => liveFlags[i])
        .map((l) => ({ title: String(l.title || "Source").slice(0, 60), url: l.url }));
      // Claims need BOTH an on-topic summary AND at least one live on-topic source.
      // Sources gate the rating but are not stored or displayed.
      if (s.strength !== "quiet" && (live.length === 0 || !isRelevant(s.summary))) {
        result.push(QUIET[platform]);
        continue;
      }
      result.push({ platform, strength: s.strength, summary: s.summary, links: [] });
    }

    // Cache only if we got at least one non-quiet signal OR nothing was cached
    // (avoid overwriting a good cache with an all-quiet failure run).
    const allQuiet = result.every((s) => s.strength === "quiet");
    if (!allQuiet || !cached) {
      await admin.from("source_trend_signals").upsert({
        product_id, signals: result, refreshed_at: new Date().toISOString(),
      });
    }

    return new Response(JSON.stringify({ signals: (!allQuiet || !cached) ? result : cached.signals, refreshed_at: new Date().toISOString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("source-signals error:", e);
    return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
