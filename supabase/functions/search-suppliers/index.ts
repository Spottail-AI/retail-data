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

    const { data: hasPaid, error: paidErr } = await adminClient.rpc("has_paid", { p_user_id: user.id });
    if (paidErr) {
      console.error("Failed to check paid status:", paidErr);
    }
    const resultCount = 10;

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are a B2B retail intelligence engine GROUNDED IN GOOGLE WEB SEARCH. Use the live web search results provided by the tool to find EXACTLY ${resultCount} REAL, currently operating businesses in ${selectedCountry} that are a strong commercial fit to STOCK or DISTRIBUTE the following product. The user is a brand/supplier trying to PLACE this product into the market.

Product: "${sanitizedProduct}"
Country: ${selectedCountry}

MIX REQUIREMENT (very important):
- The list MUST be a mix of RETAIL STORES (independent shops, specialty retailers, boutiques, chains, online retailers that sell to end consumers) AND DISTRIBUTORS / wholesalers.
- Aim for roughly 60% retailers and 40% distributors when both exist in the category. Never return distributors-only unless retailers truly do not exist for this product category in ${selectedCountry}.
- If exact-match retailers are scarce, broaden to ADJACENT retail categories where this product would logically sell (e.g. health food shops, delis, gift shops, lifestyle stores, department stores) so you still reach ${resultCount} results.

CRITICAL GROUNDING RULES:
- You MUST issue multiple web searches and base every store's name, website, address, phone, and email ONLY on facts found in the search results you actually read.
- If a contact field (email, phone, whatsapp, address, contact_form_url) is not present in a source you've actually seen, return "" for that field. Never guess or fabricate contact details.
- For every result, include a "sources" array containing the URLs you actually used to verify that store's facts (1–5 URLs). Use the real URLs from the search results, not invented ones.
- Do NOT stop early. Keep searching across different queries and categories until you have ${resultCount} verified entries.

Required fields per result:
- name (string): official trading name from a real source
- website (string): real homepage URL found via search
- type ("retailer" | "distributor"): the list MUST contain both types
- channel ("Physical" | "Online" | "Both")
- location (string): "City, Region" or "City, State"
- address (string): full street address if found in a source, else ""
- fit_score ("High" | "Medium" | "Low"): YOUR judgment of fit
- why_it_matches (string, 1-2 sentences): YOUR reasoning grounded in what the sources say the store sells
- pitch_angle (string, 1 sentence): YOUR tailored pitch for THIS store
- store_type (string)
- audience_category (string)
- price_tier ("Budget" | "Mid-market" | "Premium" | "Luxury")
- stocks_similar ("Competitors" | "Complements" | "Neither")
- decision_maker_name (string): only if a source names them, else ""
- decision_maker_role (string)
- buy_direct_or_distributor ("Direct" | "Distributor" | "Both")
- email (string): only if found in a source, else ""
- phone (string): only if found in a source, else ""
- whatsapp (string): only if found in a source, else ""
- contact_form_url (string): URL to their contact / wholesale form if found, else ""
- sources (array of strings): URLs you used to verify this specific store

STRICT:
- Only businesses physically operating in ${selectedCountry}.
- No marketplace listing pages — only the store/distributor's own site or reputable directory sources.
- You MUST return EXACTLY ${resultCount} entries with the required retailer/distributor mix. Returning fewer is a failure.
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
              "You are a world-class B2B retail intelligence assistant. You ALWAYS ground your answers in live Google web search results provided by the tool. You return only valid JSON, never markdown. You never fabricate contact details — leave them empty when uncertain, and only include facts you actually saw in a source.",
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
    const displayLimit = hasPaid ? 10 : 2;
    const persistedResults = allResults.slice(0, displayLimit);

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
        resultsFound: allResults.length,
        upgradeRequired: !hasPaid && allResults.length > 2,
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
