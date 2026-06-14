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
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

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

    const { data: hasPaid } = await supabase.rpc("has_paid", { p_user_id: user.id });
    const resultCount = 10;

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are a B2B retail intelligence engine. Find ${resultCount} REAL, currently operating retail stores and/or distributors in ${selectedCountry} that are a strong commercial fit to stock or distribute the following product.

Product: "${sanitizedProduct}"
Country: ${selectedCountry}

For each result return a deeply enriched JSON object. NEVER invent contact details — if you cannot reasonably know a real value, return an empty string for that field. Real, verifiable values only.

Required fields per result:
- name (string): the retail store or distributor's official trading name
- website (string): real, working homepage URL
- type ("retailer" | "distributor")
- channel ("Physical" | "Online" | "Both"): how this store reaches end customers
- location (string): "City, Region" or "City, State"
- fit_score ("High" | "Medium" | "Low"): how well the product matches this store's range
- why_it_matches (string, 1-2 sentences): concrete reason this store is a good fit
- pitch_angle (string, 1 sentence): a tailored pitch angle for THIS specific store
- store_type (string): e.g. "Independent boutique", "National chain", "Specialty retailer", "Wholesale distributor"
- audience_category (string): e.g. "Premium 25-45 urban", "Value-driven families"
- price_tier ("Budget" | "Mid-market" | "Premium" | "Luxury")
- stocks_similar ("Competitors" | "Complements" | "Neither")
- decision_maker_name (string): name if reliably known, else ""
- decision_maker_role (string): e.g. "Owner", "Buyer", "Category Manager"
- buy_direct_or_distributor ("Direct" | "Distributor" | "Both")
- email (string): general buying/contact email if reliably known, else ""
- phone (string): if reliably known, else ""
- whatsapp (string): if reliably known, else ""
- contact_form_url (string): URL to their contact / wholesale form if known, else ""

STRICT:
- Only stores/distributors physically operating in ${selectedCountry}.
- No marketplace listing pages — only the store/distributor's own site.
- Mix retailers and distributors when both are relevant; otherwise return whichever fits.
- Return ONLY this JSON shape, no markdown:
{"results":[{...}, ...]}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a world-class B2B retail intelligence assistant with deep knowledge of retail buying networks, distributors, and category managers worldwide. You return only valid JSON, never markdown. You never fabricate contact details — leave them empty when uncertain.",
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
    const content = aiData.choices?.[0]?.message?.content || "";
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
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

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
