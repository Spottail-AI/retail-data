import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type EnrichedResult = {
  name: string;
  website?: string;
  type?: "supplier" | "distributor" | "retail" | "retailer";
  channel?: "Physical" | "Online" | "Both";
  location?: string;
  fit_score?: "High" | "Medium" | "Low";
  why_it_matches?: string;
  pitch_angle?: string;
  store_type?: string;
  audience_category?: string;
  price_tier?: string;
  stocks_similar?: "Competitors" | "Complements" | "Neither";
  decision_maker_name?: string;
  decision_maker_role?: string;
  buy_direct_or_distributor?: "Direct" | "Distributor" | "Both";
  email?: string;
  phone?: string;
  whatsapp?: string;
  contact_form_url?: string;
  address?: string;
  sources?: string[];
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { product, country } = await req.json();
    if (!product || typeof product !== "string" || product.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Product name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sanitizedProduct = product.trim().slice(0, 200);
    const selectedCountry = (country && typeof country === "string")
      ? country.trim().slice(0, 100)
      : "United States";

    // If the input looks like a URL, derive a human-readable product hint from the
    // last path segment + domain. This dramatically improves grounding because Gemini
    // can otherwise anchor on the URL string itself rather than the product category.
    let productHint = sanitizedProduct;
    let urlContext = "";
    try {
      const maybeUrl = /^https?:\/\//i.test(sanitizedProduct)
        ? sanitizedProduct
        : (/^[\w-]+(\.[\w-]+)+\//.test(sanitizedProduct) ? `https://${sanitizedProduct}` : "");
      if (maybeUrl) {
        const u = new URL(maybeUrl);
        const lastSeg = u.pathname.split("/").filter(Boolean).pop() || "";
        const cleaned = lastSeg.replace(/[-_]+/g, " ").replace(/\.[a-z0-9]+$/i, "").trim();
        const brand = u.hostname.replace(/^www\./, "").split(".")[0];
        if (cleaned) productHint = cleaned;
        urlContext = `\n\nADDITIONAL CONTEXT: The user pasted a product URL (${u.href}). Brand domain: "${brand}". Likely product name: "${cleaned}". Use Google to identify the product category (e.g. snack/confectionery/beauty) and search for MULTI-BRAND retailers and distributors that stock that CATEGORY — NOT the user's own brand "${brand}".`;
      }
    } catch { /* not a URL — use product as-is */ }

    const { data: hasPaid, error: paidErr } = await adminClient.rpc("has_paid", { p_user_id: user.id });
    if (paidErr) {
      console.error("Failed to check paid status:", paidErr);
    }
    // Over-fetch so strict post-filtering still leaves us with the display target.
    const displayTarget = 10;
    const resultCount = 20;

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are a B2B RETAIL PLACEMENT intelligence engine GROUNDED IN GOOGLE WEB SEARCH.

WHO THE USER IS (critical context — do not misinterpret):
- The user is a BRAND / MANUFACTURER / PRODUCT OWNER who already makes "${sanitizedProduct}".
- They are looking for THIRD-PARTY MULTI-BRAND BUYERS — RETAIL STORES that stock MANY OUTSIDE BRANDS and would add this brand to their shelves, and DISTRIBUTORS / WHOLESALERS that buy from many brands to resell to retailers.
- NOT suppliers, manufacturers, factories, OEMs, contract manufacturers, white-label producers, ingredient/packaging/raw-material vendors, sourcing agents, dropshippers, B2B marketplaces (Alibaba, Faire, Ankorstore, Tundra, Etsy wholesale), trade shows, agencies, or consultancies.
- CRITICAL: ALSO NOT other BRANDS / DTC companies / product owners in the same or adjacent category. Any business whose store only sells THEIR OWN single brand (monobrand DTC site, own-label-only shop) CANNOT stock the user's product and MUST be excluded — even if their website looks like a "shop". Only return businesses whose core model is RESELLING MULTIPLE THIRD-PARTY BRANDS.

YOUR JOB:
Use live Google web search to find EXACTLY ${resultCount} REAL, currently operating MULTI-BRAND retailers/distributors in ${selectedCountry} that could STOCK and SELL "${sanitizedProduct}".

Product the user wants to PLACE: "${sanitizedProduct}"
Country: ${selectedCountry}

MIX REQUIREMENT:
- Mix of MULTI-BRAND RETAIL STORES (independent shops, specialty retailers, boutiques, chains, department stores, online multi-brand stockists that resell brands) AND DISTRIBUTORS / wholesalers.
- Aim ~60% retailers / ~40% distributors. Never distributors-only.
- If exact-match retailers are scarce, broaden to ADJACENT multi-brand retail categories (e.g. for food: health food shops, delis, gift shops, gourmet grocers, lifestyle stores). Stay in MULTI-BRAND retail/distribution — never drift into manufacturers, suppliers, or single-brand DTC companies.

HARD EXCLUSIONS (returning any of these is a failure):
- Manufacturers, factories, OEMs, contract manufacturers, co-packers, private-label producers
- OTHER BRANDS / DTC companies / product owners — any business whose website/shop primarily sells its OWN single brand. If the catalog is dominated by one own-label, EXCLUDE. Another brand cannot stock the user's product.
- Ingredient / component / packaging / raw-material suppliers
- Sourcing agents, trading companies, import/export brokers
- Marketplaces themselves (Amazon, eBay, Alibaba, Faire, Ankorstore, Tundra, Etsy)
- Trade shows, agencies, consultancies, media sites, blogs, directories
- The user's own brand or direct competitors

VERIFY MULTI-BRAND BEFORE INCLUDING:
- For every candidate, confirm via a real source (their "Brands", "Shop by Brand", "Stockists", or product catalog) that they carry MULTIPLE third-party brands. If you can't verify multi-brand assortment, DROP them.

GROUNDING RULES:
- Issue multiple targeted Google searches (e.g. "best [product category] retailers ${selectedCountry}", "[product category] distributors ${selectedCountry}", "shops that sell [product] in [city]", "[product] wholesale ${selectedCountry}"). Base every fact on what you actually read.
- For each store, verify from a real source that they SELL TO CONSUMERS (retailer) or RESELL TO RETAILERS (distributor). If you cannot verify the business model, drop them and find another.
- If a contact field (email, phone, whatsapp, address, contact_form_url) is not present in a source you've actually seen, return "" — never fabricate.
- Include a "sources" array (1–5 real URLs) per result.
- Do NOT stop early. Keep searching until you have ${resultCount} verified entries that pass the exclusion rules.

Required fields per result:
- name (string): official trading name
- website (string): real homepage URL
- type ("retailer" | "distributor"): MUST be one of these two — never "supplier" or "manufacturer"
- channel ("Physical" | "Online" | "Both")
- location (string): "City, Region"
- address (string): full street address if found, else ""
- fit_score ("High" | "Medium" | "Low"): how well this buyer fits the product
- why_it_matches (string, 1-2 sentences): grounded in what the source says they CURRENTLY SELL — explain why they'd stock this product
- pitch_angle (string, 1 sentence): tailored outreach angle for the brand to use
- store_type (string)
- audience_category (string)
- price_tier ("Budget" | "Mid-market" | "Premium" | "Luxury")
- stocks_similar ("Competitors" | "Complements" | "Neither"): do they already stock competing or complementary products?
- decision_maker_name (string): only if a source names a buyer / category manager / owner, else ""
- decision_maker_role (string): e.g. "Head of Buying", "Owner", "Category Manager"
- buy_direct_or_distributor ("Direct" | "Distributor" | "Both"): how this retailer typically sources new brands
- email (string): only if found in a source, else ""
- phone (string): only if found, else ""
- whatsapp (string): only if found, else ""
- contact_form_url (string): wholesale / stockist / contact form URL if found, else ""
- sources (array of strings): URLs used to verify THIS store

STRICT:
- Only businesses physically operating in ${selectedCountry}.
- Only retailers and distributors — NEVER suppliers, manufacturers, or marketplaces.
- Return EXACTLY ${resultCount} entries. Returning fewer, or returning suppliers/manufacturers, is a failure.
- Return ONLY this JSON shape, no markdown, no commentary:
{"results":[{...}, ...]}`;


    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        // Lovable AI Gateway: enable Google web search grounding
        plugins: [{ id: "web" }],
        messages: [
          {
            role: "system",
            content:
              "You are a world-class B2B RETAIL PLACEMENT intelligence assistant. The user is a brand/manufacturer looking for retailers and distributors that would BUY and STOCK their product to sell onward — they are NOT looking for suppliers, factories, OEMs, packaging vendors, marketplaces, or sourcing agents. You ALWAYS ground answers in live Google web search results. You return only valid JSON, never markdown. You never fabricate contact details — leave them empty when uncertain.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });


    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Search rate limit reached. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Failed to search. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const message = aiData.choices?.[0]?.message;
    const content = message?.content || "";
    const annotations: Array<{ type?: string; url_citation?: { url?: string; title?: string } }> =
      Array.isArray(message?.annotations) ? message.annotations : [];
    const allCitedUrls = annotations
      .map((a) => a?.url_citation?.url)
      .filter((u): u is string => typeof u === "string" && u.length > 0);

    let parsed: { results?: EnrichedResult[] };
    try {
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse results. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const allResults: EnrichedResult[] = parsed.results || [];
    // Filter out anything that smells like a supplier/manufacturer/marketplace — user wants BUYERS, not sources.

    const BLOCK_PATTERNS = [
      /manufactur/i, /\bfactor(y|ies)\b/i, /\boem\b/i, /\bodm\b/i, /co-?packer/i,
      /private[- ]label/i, /white[- ]label/i, /contract manufactur/i,
      /raw material/i, /ingredient supplier/i, /packaging supplier/i,
      /sourcing agent/i, /trading (company|co\b)/i, /wholesale marketplace/i,
      /alibaba|aliexpress|made-in-china|globalsources|indiamart|thomasnet|faire\.com|ankorstore|tundra\.com/i,
      // Single-brand / DTC / own-label signals — another brand can't stock the user's product
      /\bdtc\b/i, /direct[- ]to[- ]consumer/i, /\bour (own )?brand\b/i, /\bsingle[- ]brand\b/i,
      /\bmonobrand\b/i, /own[- ]label/i, /house brand/i, /flagship store/i,
      /\bwe (make|craft|produce|design)\b/i, /\bour products\b/i,
    ];
    const MULTIBRAND_HINTS = /multi[- ]brand|stockist|shop by brand|brands we (carry|stock)|over \d+ brands|hundreds of brands|curated brands|department store|specialty retailer|independent retailer|wholesaler|distributor/i;
    const isBuyer = (r: EnrichedResult) => {
      const t = (r.type || "").toLowerCase();
      if (t === "supplier" || t === "manufacturer") return false;
      const blob = `${r.name || ""} ${r.website || ""} ${r.why_it_matches || ""} ${r.pitch_angle || ""} ${r.store_type || ""}`;
      if (BLOCK_PATTERNS.some((re) => re.test(blob))) return false;
      // Distributors get a pass; retailers must show some multi-brand signal in the rationale
      if (t === "distributor") return true;
      return MULTIBRAND_HINTS.test(blob);
    };
    const cleanResults = allResults.filter(isBuyer);
    const displayLimit = hasPaid ? 10 : 2;
    let persistedResults = cleanResults.slice(0, displayLimit);

    // Enrich missing contact details by scraping each website via Firecrawl.
    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (firecrawlKey) {
      const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const PHONE_RE = /(?:\+?\d[\d\s().-]{7,}\d)/g;
      const BAD_EMAIL = /(example|sentry|wixpress|googleapis|cloudflare|@2x|\.png|\.jpg|\.svg|\.webp)/i;
      const enrichOne = async (r: EnrichedResult): Promise<EnrichedResult> => {
        if (!r.website) return r;
        const hasAny = (r.email && r.email.length > 0) ||
          (r.phone && r.phone.length > 0) ||
          (r.whatsapp && r.whatsapp.length > 0) ||
          (r.contact_form_url && r.contact_form_url.length > 0);
        if (hasAny) return r;
        try {
          let base = r.website.trim();
          if (!/^https?:\/\//i.test(base)) base = "https://" + base;
          const origin = new URL(base).origin;
          const candidates = [
            `${origin}/contact`, `${origin}/contact-us`, `${origin}/contacts`,
            `${origin}/pages/contact`, `${origin}/about`, origin,
          ];
          for (const url of candidates) {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 12000);
            let resp: Response;
            try {
              resp = await fetch("https://api.firecrawl.dev/v2/scrape", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${firecrawlKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  url,
                  formats: ["markdown", "links"],
                  onlyMainContent: false,
                }),
                signal: controller.signal,
              });
            } catch (e) {
              clearTimeout(timer);
              continue;
            }
            clearTimeout(timer);
            if (!resp.ok) continue;
            const data = await resp.json().catch(() => null) as any;
            const md: string = data?.data?.markdown || data?.markdown || "";
            const links: string[] = data?.data?.links || data?.links || [];
            if (!r.email) {
              const emails = (md.match(EMAIL_RE) || []).filter((e) => !BAD_EMAIL.test(e));
              const mailtoLink = links.find((l) => typeof l === "string" && l.toLowerCase().startsWith("mailto:"));
              const fromMailto = mailtoLink ? mailtoLink.replace(/^mailto:/i, "").split("?")[0] : "";
              const pick = fromMailto || emails[0] || "";
              if (pick) r.email = pick;
            }
            if (!r.phone) {
              const telLink = links.find((l) => typeof l === "string" && l.toLowerCase().startsWith("tel:"));
              const fromTel = telLink ? telLink.replace(/^tel:/i, "") : "";
              const phones = md.match(PHONE_RE) || [];
              const pick = fromTel || phones[0] || "";
              if (pick) r.phone = pick.trim();
            }
            if (!r.contact_form_url) {
              const formLink = links.find((l) =>
                typeof l === "string" && /contact|stockist|wholesale|trade|enquir|inquir/i.test(l)
              );
              if (formLink) r.contact_form_url = formLink;
              else if (/\/contact/i.test(url)) r.contact_form_url = url;
            }
            const ok = (r.email && r.email.length > 0) ||
              (r.phone && r.phone.length > 0) ||
              (r.contact_form_url && r.contact_form_url.length > 0);
            if (ok) break;
          }
        } catch (e) {
          console.error("Enrich error for", r.website, e);
        }
        return r;
      };
      // Parallel with cap
      persistedResults = await Promise.all(persistedResults.map(enrichOne));
    }



    // Save list + items server-side
    const defaultTitle = `${sanitizedProduct} — ${selectedCountry}`;

    const { data: listRow, error: listErr } = await adminClient
      .from("saved_searches")
      .insert({
        user_id: user.id,
        product_name: sanitizedProduct,
        search_selection: "both",
        country: selectedCountry,
        results: persistedResults,
        results_found: persistedResults.length,
        list_title: defaultTitle,
      })
      .select("id")
      .single();

    if (listErr || !listRow) {
      console.error("Failed to create saved list:", listErr);
      return new Response(JSON.stringify({ error: "Failed to save list" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const norm = (v: string | undefined, allowed: string[], fallback: string) =>
      v && allowed.includes(v) ? v : fallback;

    const itemsToInsert = persistedResults.map((r, idx) => ({
      list_id: listRow.id,
      user_id: user.id,
      name: (r.name || "Unknown").slice(0, 200),
      website: r.website || null,
      channel: norm(r.channel, ["Physical", "Online", "Both"], "Both"),
      location: r.location || null,
      fit_score: norm(r.fit_score, ["High", "Medium", "Low"], "Medium"),
      why_it_matches: r.why_it_matches || null,
      pitch_angle: r.pitch_angle || null,
      store_type: r.store_type || null,
      audience_category: r.audience_category || null,
      price_tier: r.price_tier || null,
      stocks_similar: norm(r.stocks_similar, ["Competitors", "Complements", "Neither"], "Neither"),
      decision_maker_name: r.decision_maker_name || null,
      decision_maker_role: r.decision_maker_role || null,
      buy_direct_or_distributor: norm(r.buy_direct_or_distributor, ["Direct", "Distributor", "Both"], "Both"),
      email: r.email || null,
      phone: r.phone || null,
      whatsapp: r.whatsapp || null,
      contact_form_url: r.contact_form_url || null,
      address: r.address || null,
      sources: Array.isArray(r.sources) && r.sources.length > 0
        ? r.sources.filter((u) => typeof u === "string" && u.length > 0).slice(0, 10)
        : allCitedUrls.slice(0, 5),
      status: "To contact",
      priority: "Medium",
      sort_order: idx,
    }));

    if (itemsToInsert.length > 0) {
      const { error: itemsErr } = await adminClient.from("list_items").insert(itemsToInsert);
      if (itemsErr) console.error("Failed to insert list items:", itemsErr);
    }

    return new Response(
      JSON.stringify({
        list_id: listRow.id,
        hasPaid,
        displayLimit,
        resultsFound: cleanResults.length,
        upgradeRequired: !hasPaid && cleanResults.length > 2,

      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Service temporarily unavailable" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
