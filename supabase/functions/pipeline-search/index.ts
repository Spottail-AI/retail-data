import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type Profile = {
  vertical: string;
  category: string;
  subcategory?: string;
  price_point?: string;
  msrp_estimate?: string;
  attributes?: string[];
  comparable_brands?: string[];
};

type Candidate = {
  name: string;
  domain: string;
  website: string;
  segment: "national_distributor" | "regional_distributor" | "retail_chain" | "independent_marketplace";
  channel?: "Physical" | "Online" | "Both";
  location?: string;
  fit: number;
  why: string;
  pitch_angle?: string;
  how_to_get_in?: { steps?: string[]; requirements?: string[]; submission_url?: string | null };
  contact_channel?: string;
  contact_form_url?: string;
  sources?: string[];
};

const normalizeDomain = (website: string): string | null => {
  try {
    let w = website.trim().toLowerCase();
    if (!/^https?:\/\//.test(w)) w = "https://" + w;
    return new URL(w).hostname.replace(/^www\./, "") || null;
  } catch {
    return null;
  }
};

const aiCall = async (apiKey: string, system: string, user: string, web = false) => {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      ...(web ? { plugins: [{ id: "web" }] } : {}),
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) throw new Error(`AI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const content: string = data.choices?.[0]?.message?.content || "";
  return content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const productInput: string = (body.product || "").trim().slice(0, 300);
    const country: string = (body.country || "United States").trim().slice(0, 100);
    const region: string | null = body.region ? String(body.region).trim().slice(0, 100) : null;
    const brandStage: string = ["dtc_only", "some_retail", "established_retail"].includes(body.brand_stage)
      ? body.brand_stage : "dtc_only";
    const mode: "normal" | "deep" = body.mode === "deep" ? "deep" : "normal";
    const existingProductId: string | null = body.product_id || null;

    if (!productInput && !existingProductId) {
      return new Response(JSON.stringify({ error: "Product name or URL is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: hasPaid } = await admin.rpc("has_paid", { p_user_id: user.id });

    // ── Resolve / create product ─────────────────────────────
    let product: { id: string; name: string; url: string | null; profile: Profile | null };
    if (existingProductId) {
      const { data, error } = await admin.from("products")
        .select("id,name,url,profile").eq("id", existingProductId).eq("user_id", user.id).single();
      if (error || !data) {
        return new Response(JSON.stringify({ error: "Product not found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      product = data as typeof product;
    } else {
      const isUrl = /^https?:\/\//i.test(productInput) || /^[\w-]+(\.[\w-]+)+\//.test(productInput);
      const name = isUrl
        ? (() => {
            try {
              const u = new URL(/^https?:\/\//i.test(productInput) ? productInput : `https://${productInput}`);
              const seg = u.pathname.split("/").filter(Boolean).pop() || u.hostname;
              return seg.replace(/[-_]+/g, " ").replace(/\.[a-z0-9]+$/i, "").trim() || u.hostname;
            } catch { return productInput; }
          })()
        : productInput;
      const { data, error } = await admin.from("products")
        .upsert(
          { user_id: user.id, name, url: isUrl ? productInput : null },
          { onConflict: "user_id,name" }
        )
        .select("id,name,url,profile").single();
      if (error || !data) throw new Error(`Product upsert failed: ${error?.message}`);
      product = data as typeof product;
    }

    // ── STAGE A: product profile (cached) ────────────────────
    let profile = product.profile as Profile | null;
    if (!profile) {
      let pageContext = "";
      const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
      if (product.url && firecrawlKey) {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 15000);
          const resp = await fetch("https://api.firecrawl.dev/v2/scrape", {
            method: "POST",
            headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({ url: product.url, formats: ["markdown"], onlyMainContent: true }),
            signal: controller.signal,
          });
          clearTimeout(timer);
          if (resp.ok) {
            const d = await resp.json().catch(() => null) as { data?: { markdown?: string }; markdown?: string } | null;
            pageContext = (d?.data?.markdown || d?.markdown || "").slice(0, 6000);
          }
        } catch { /* profile still works from name alone */ }
      }
      const profileRaw = await aiCall(
        apiKey,
        "You are a retail product analyst. Return only valid JSON, no markdown.",
        `Analyze this product and return a JSON profile.
Product: "${product.name}"${product.url ? `\nProduct URL: ${product.url}` : ""}${pageContext ? `\n\nPRODUCT PAGE CONTENT:\n${pageContext}` : ""}

Return exactly:
{"vertical": "food_beverage|beauty_personal_care|fashion_apparel|home_living|electronics|health_wellness|toys_kids|pet|other",
 "category": "short category, e.g. natural snacks",
 "subcategory": "e.g. dates & dried fruit",
 "price_point": "budget|mid|premium|luxury",
 "msrp_estimate": "e.g. $8-12",
 "attributes": ["certs/dietary/materials tags, max 6"],
 "comparable_brands": ["3-5 REAL well-known brands in this exact category"]}`
      );
      try {
        profile = JSON.parse(profileRaw) as Profile;
        await admin.from("products").update({ profile }).eq("id", product.id);
      } catch {
        profile = { vertical: "other", category: product.name };
      }
    }

    // ── Existing pipeline (for dedupe + deep-mode exclusion) ─
    const { data: existingRows } = await admin
      .from("pipeline_rows")
      .select("id,retailer_id,stage,user_edited,sources, retailers(domain,name)")
      .eq("product_id", product.id);
    const existingByDomain = new Map<string, { id: string; stage: string; user_edited: boolean; sources: string[] }>();
    for (const r of existingRows || []) {
      const dom = (r as unknown as { retailers?: { domain?: string } }).retailers?.domain;
      if (dom) existingByDomain.set(dom, { id: r.id, stage: r.stage, user_edited: r.user_edited, sources: r.sources || [] });
    }
    const excludeList = [...existingByDomain.keys()].slice(0, 120).join(", ");

    // ── STAGE B: matcher ─────────────────────────────────────
    const isNarrow = !!region;
    const targetMin = mode === "deep" ? 15 : (isNarrow ? 12 : 30);
    const targetMax = mode === "deep" ? 20 : (isNarrow ? 20 : 40);
    const geo = region ? `${region}, ${country}` : country;

    const foodBuckets = `- national_distributor: 3-5 (e.g. the major natural/specialty distributors relevant to this category)
- regional_distributor: 5-8 (regional & specialty distributors serving ${geo})
- retail_chain: 8-15 (chains & online retailers with strong category fit)
- independent_marketplace: 4-6 (wholesale marketplaces and independent-retail channels suitable for emerging brands)`;
    const generalBuckets = `- national_distributor: 2-4 (national distributors or master wholesalers for this vertical)
- regional_distributor: 4-8 (regional distributors, rep groups, or showroom networks)
- retail_chain: 8-15 (specialty chains, department stores, big-box or online retailers with category fit)
- independent_marketplace: 4-6 (wholesale marketplaces and boutique/independent channels)`;

    const buildMatcherPrompt = (excludeCsv: string, topUp: boolean) => `You are a B2B RETAIL PLACEMENT intelligence engine GROUNDED IN GOOGLE WEB SEARCH.

THE BRAND: sells "${product.name}".
PRODUCT PROFILE: ${JSON.stringify(profile)}
BRAND STAGE: ${brandStage} ${brandStage === "dtc_only" ? "(no retail presence yet — rank marketplaces and independent channels HIGH; large national distributors need retail proof, score their brand-stage fit LOW and note 'revisit once you have retail traction' in why)" : brandStage === "some_retail" ? "(in some stores — regional distributors and chains are prime targets)" : "(established — national distributors and major chains are viable)"}
TARGET GEOGRAPHY: ${geo}
${excludeCsv ? `\nALREADY IN THEIR PIPELINE (NEVER return these domains): ${excludeCsv}\n` : ""}
${topUp ? "DEEP MODE: the obvious candidates are excluded above. Search harder — comparable brands' stockist pages, regional trade coverage, category 'best retailers/distributors' lists, trade association directories. Surface less-obvious but real, verifiable candidates." : ""}

FIND ${targetMin}-${targetMax} REAL, currently-operating MULTI-BRAND retailers and distributors in ${geo} that could STOCK "${product.name}". Fill these segment buckets (counts are guidance — never pad with weak or invented entries):
${profile.vertical === "food_beverage" ? foodBuckets : generalBuckets}

If verified candidates fall below ${targetMin}, return what you verified and set "widen_suggestion" (e.g. "Widen to ${country} for more matches").

HARD EXCLUSIONS: manufacturers, factories, OEMs, co-packers, private-label producers, ingredient/packaging suppliers, sourcing agents, single-brand DTC companies (a business selling only its OWN brand cannot stock this product), trade shows, agencies, media/blogs/directories, the brand itself or direct competitors.
CRITICAL COMPETITOR CHECK: any company that primarily MAKES or SELLS ITS OWN products in the SAME category as "${profile.category}" is a COMPETITOR, not a buyer — EXCLUDE it even if it also wholesales to stockists (e.g. for a candle brand: other candle/home-fragrance brands are competitors, never matches). Before including any candidate, verify their catalog is dominated by MULTIPLE third-party brands, not their own label.
Wholesale marketplaces (Faire, Mable, etc.) ARE allowed only inside independent_marketplace, as channels the brand can list on.

VERIFY before including: real source showing they carry MULTIPLE third-party brands (brands page, stockist list, catalog). Drop anything unverifiable.

FIT SCORE 0-100 per candidate, computed from this rubric (sum the parts, show only the total):
- category fit /30 (do they sell this exact category or close adjacents?)
- brand-stage fit /30 (can THIS brand realistically get in now? big distributors score LOW for dtc_only)
- channel & margin fit /25 (price tier match, direct-buy friendliness)
- geography /15
SCORES MUST SPREAD across the list — never give more than 3 candidates scores within 2 points of each other. Never default everything to 80+.

Per candidate return:
{"name": "...", "website": "real homepage URL", "segment": "one of the 4 buckets",
 "channel": "Physical|Online|Both", "location": "City, Region or Nationwide",
 "fit": 0-100, "why": "1-2 sentences grounded in what they currently sell; cite comparable brands from the profile when true",
 "pitch_angle": "1 sentence tailored outreach angle",
 "how_to_get_in": {"steps": ["2-4 concrete steps; for major retailers/distributors name the REAL submission path (e.g. supplier portal, RangeMe, marketplace signup, vendor form)"], "requirements": ["MOQ/margin/certs if known, else fewer items"], "submission_url": "real URL or null"},
 "contact_channel": "e.g. 'via RangeMe' | 'Supplier portal' | 'Marketplace' | 'Vendor form' | 'Email unknown'",
 "contact_form_url": "wholesale/stockist/vendor form URL if found in a source, else \\"\\"",
 "sources": ["1-4 real URLs used to verify THIS entry"]}

NEVER invent a person's name, email address, or phone number. Contact info only if published in a source you actually read.
Return ONLY: {"results":[...], "widen_suggestion": "string or null"}`;

    // ── Post-process helpers: normalize, dedupe, buyer-filter, liveness ──────
    const BLOCK_PATTERNS = [
      /manufactur/i, /\bfactor(y|ies)\b/i, /\boem\b/i, /\bodm\b/i, /co-?packer/i,
      /private[- ]label/i, /white[- ]label/i, /contract manufactur/i,
      /raw material/i, /ingredient supplier/i, /packaging supplier/i,
      /sourcing agent/i, /trading (company|co\b)/i,
      /\bdtc\b/i, /direct[- ]to[- ]consumer/i, /\bour (own )?brand\b/i, /\bsingle[- ]brand\b/i,
      /\bmonobrand\b/i, /own[- ]label/i, /house brand/i, /flagship store/i,
      /\bwe (make|craft|produce|design|pour|blend)\b/i, /\btheir own (products|candles|range|line)\b/i,
      /hand[- ]?(made|poured|crafted) (by|in[- ]house)/i,
    ];
    const MULTIBRAND_HINTS = /multi[- ]brand|stockist|shop by brand|brands (we|they) (carry|stock)|over \d+ brands|hundreds of brands|curated brands|department store|specialty retailer|independent retailer|garden centre|gift shop|boutique|wholesaler|distributor|marketplace|carries.*brands|stocks.*brands/i;
    const isBuyer = (c: Candidate) => {
      const blob = `${c.name || ""} ${c.website || ""} ${c.why || ""} ${c.pitch_angle || ""}`;
      if (BLOCK_PATTERNS.some((re) => re.test(blob))) return false;
      // Distributor segments get a pass; retail/independent must show buyer evidence:
      // multi-brand language OR a real submission path (portal/form/marketplace).
      if (c.segment === "national_distributor" || c.segment === "regional_distributor") return true;
      if (MULTIBRAND_HINTS.test(blob)) return true;
      if (c.how_to_get_in?.submission_url) return true;
      if (c.contact_form_url) return true;
      return /portal|form|rangeme|wholesale|trade|marketplace/i.test(c.contact_channel || "");
    };

    const checkAlive = async (c: Candidate): Promise<Candidate | null> => {
      for (const method of ["HEAD", "GET"] as const) {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 4000);
          const resp = await fetch(`https://${c.domain}`, { method, redirect: "follow", signal: controller.signal });
          clearTimeout(timer);
          return resp.ok || resp.status < 500 ? c : null;
        } catch { /* HEAD often blocked; fall through to GET */ }
      }
      return null;
    };

    // ── Matcher passes: first pass, then one top-up pass if below target ──────
    const seen = new Set<string>();
    const verified: Candidate[] = [];
    const debug = { passes: 0, parsed: 0, filtered_out: 0, dead_sites: 0 };
    let widenSuggestion: string | null = null;

    for (let pass = 0; pass < 2 && verified.length < targetMin; pass++) {
      debug.passes++;
      const excludeCsv = [...new Set([...existingByDomain.keys(), ...seen])].slice(0, 200).join(", ");
      let raw: string;
      try {
        raw = await aiCall(
          apiKey,
          "You are a world-class B2B retail placement engine. Ground everything in live Google web search. Return only valid JSON. Never fabricate contact details or company names.",
          buildMatcherPrompt(excludeCsv, mode === "deep" || pass > 0),
          true
        );
      } catch (e) {
        if (pass === 0) throw e;
        break;
      }
      let parsed: { results?: Candidate[]; widen_suggestion?: string | null };
      try { parsed = JSON.parse(raw); } catch {
        console.error(`Matcher parse failure (pass ${pass}):`, raw.slice(0, 400));
        if (pass === 0) {
          return new Response(JSON.stringify({ error: "Failed to parse results. Please try again." }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;
      }
      widenSuggestion = parsed.widen_suggestion || widenSuggestion;
      debug.parsed += (parsed.results || []).length;

      const candidates: Candidate[] = [];
      for (const c of parsed.results || []) {
        if (!c?.name || !c?.website) continue;
        const dom = normalizeDomain(c.website);
        if (!dom || seen.has(dom)) continue;
        seen.add(dom);
        c.domain = dom;
        c.fit = Math.max(0, Math.min(100, Math.round(Number(c.fit) || 0)));
        if (!["national_distributor", "regional_distributor", "retail_chain", "independent_marketplace"].includes(c.segment)) {
          c.segment = "retail_chain";
        }
        // Normalize "unknown" contact channels to null so the UI offers Find contact.
        if (c.contact_channel && /unknown|not (found|available)|n\/a|none/i.test(c.contact_channel)) {
          c.contact_channel = undefined;
        }
        if (!isBuyer(c)) { debug.filtered_out++; continue; }
        candidates.push(c);
      }

      const alive = await Promise.all(candidates.map(checkAlive));
      for (const c of alive) {
        if (c) verified.push(c); else debug.dead_sites++;
      }
    }
    verified.sort((a, b) => b.fit - a.fit);
    console.log("pipeline-search debug:", JSON.stringify({ ...debug, verified: verified.length }));

    // Free tier: cap at 5 rows total in the pipeline.
    const freeCap = 5;
    const { count: currentCount } = await admin
      .from("pipeline_rows").select("id", { count: "exact", head: true })
      .eq("product_id", product.id);
    const room = hasPaid ? verified.length : Math.max(0, freeCap - (currentCount || 0));
    const toPersist = verified.slice(0, room);

    // ── Record search ────────────────────────────────────────
    const { data: searchRow, error: searchErr } = await admin
      .from("pipeline_searches")
      .insert({
        product_id: product.id, user_id: user.id,
        params: { country, region, brand_stage: brandStage, mode },
      })
      .select("id").single();
    if (searchErr || !searchRow) throw new Error(`search insert failed: ${searchErr?.message}`);
    const searchTag = `search:${searchRow.id}`;

    // Clear is_new from previous searches of this product.
    await admin.from("pipeline_rows").update({ is_new: false }).eq("product_id", product.id);

    // ── Upsert retailers + pipeline rows ─────────────────────
    let newCount = 0, existingCount = 0, inMotionCount = 0;
    for (const [idx, c] of toPersist.entries()) {
      const { data: retailer, error: retErr } = await admin
        .from("retailers")
        .upsert(
          {
            domain: c.domain, name: c.name.slice(0, 200), website: c.website,
            segment: c.segment, channel: c.channel || "Both", location: c.location || null,
          },
          { onConflict: "domain", ignoreDuplicates: false }
        )
        .select("id,enrichment").single();
      if (retErr || !retailer) { console.error("retailer upsert:", retErr); continue; }

      // Cache how_to_get_in on the retailer if it has none yet.
      const enrichment = (retailer.enrichment || {}) as Record<string, unknown>;
      if (!enrichment.how_to_get_in && c.how_to_get_in) {
        await admin.from("retailers").update({
          enrichment: { ...enrichment, how_to_get_in: c.how_to_get_in, contact_channel: c.contact_channel || null },
        }).eq("id", retailer.id);
      }

      const existing = existingByDomain.get(c.domain);
      if (existing) {
        existingCount++;
        if (existing.stage !== "to_contact" && existing.stage !== "passed") inMotionCount++;
        const updates: Record<string, unknown> = {
          sources: [...new Set([...existing.sources, searchTag])],
        };
        if (!existing.user_edited) { updates.fit = c.fit; updates.why = c.why; }
        await admin.from("pipeline_rows").update(updates).eq("id", existing.id);
      } else {
        newCount++;
        const { data: newRow, error: rowErr } = await admin.from("pipeline_rows").insert({
          product_id: product.id, retailer_id: retailer.id, user_id: user.id,
          stage: "to_contact", fit: c.fit, why: c.why || null, pitch_angle: c.pitch_angle || null,
          how_to_get_in: c.how_to_get_in || null,
          contact_channel: c.contact_channel || null,
          contact_form_url: c.contact_form_url || null,
          location: c.location || null,
          sources: [searchTag], is_new: true, sort_order: idx,
        }).select("id").single();
        if (rowErr) { console.error("row insert:", rowErr); newCount--; continue; }
        if (newRow) {
          await admin.from("pipeline_events").insert({
            row_id: newRow.id, user_id: user.id, label: "Added from search",
          });
        }
      }
    }

    await admin.from("pipeline_searches")
      .update({ new_count: newCount, existing_count: existingCount })
      .eq("id", searchRow.id);

    return new Response(JSON.stringify({
      product_id: product.id,
      search_id: searchRow.id,
      new_count: newCount,
      existing_count: existingCount,
      in_motion_count: inMotionCount,
      total_verified: verified.length,
      widen_suggestion: widenSuggestion,
      debug,
      hasPaid,
      upgradeRequired: !hasPaid && verified.length > toPersist.length,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("pipeline-search error:", error);
    return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
