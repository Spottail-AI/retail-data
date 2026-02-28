import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

    const { product, searchType, country } = await req.json();
    if (!product || typeof product !== "string" || product.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Product name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!searchType || !Array.isArray(searchType) || searchType.length === 0) {
      return new Response(
        JSON.stringify({ error: "At least one search type required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sanitizedProduct = product.trim().slice(0, 200);
    const selectedCountry = (country && typeof country === "string") ? country.trim().slice(0, 100) : "United States";

    // Check payment status
    const { data: hasPaid } = await supabase.rpc("has_paid", { p_user_id: user.id });
    const resultCount = hasPaid ? 10 : 10; // Always fetch 10, display limited on frontend

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const searchSelection = searchType.length === 2 ? "both" : searchType[0];
    
    let typeInstruction = "";
    if (searchSelection === "supplier") {
      typeInstruction = `Find exactly ${resultCount} SUPPLIERS (manufacturers, wholesalers, factories) for this product located in ${selectedCountry}. Every result must have type "supplier". Only include companies operating in ${selectedCountry}.`;
    } else if (searchSelection === "distributor") {
      typeInstruction = `Find exactly ${resultCount} DISTRIBUTORS (resellers, wholesale distributors, trading companies) for this product located in ${selectedCountry}. Every result must have type "distributor". Only include companies operating in ${selectedCountry}.`;
    } else {
      const half = Math.ceil(resultCount / 2);
      typeInstruction = `Find ${half} SUPPLIERS (manufacturers, wholesalers, factories) AND ${half} DISTRIBUTORS (resellers, wholesale distributors, trading companies) for this product located in ${selectedCountry}. Label each with the correct type. Only include companies operating in ${selectedCountry}.`;
    }

    const prompt = `You are a B2B trade intelligence engine. Your job is to find REAL, VERIFIED companies in ${selectedCountry}.

Product: "${sanitizedProduct}"
Country: ${selectedCountry}

${typeInstruction}

Search Strategy — you MUST consider ALL of these sources:
1. Global trade marketplaces: Alibaba, GlobalSources, Made-in-China, IndiaMART, ThomasNet, Kompass
2. Official manufacturer/brand websites
3. B2B wholesale directories
4. Industry association member directories  
5. Regional trade databases and export directories
6. Verified corporate websites with active business operations

Use search queries like:
- "${sanitizedProduct} supplier in ${selectedCountry}"
- "${sanitizedProduct} distributor in ${selectedCountry}"
- "${sanitizedProduct} manufacturer in ${selectedCountry}"
- "${sanitizedProduct} wholesale ${selectedCountry}"

STRICT RULES:
- Every company MUST be a real, currently operating business located in ${selectedCountry}
- Do NOT include companies from other countries
- Every website URL MUST be a real, working URL (not made up)
- Do NOT include marketplace listing pages (e.g. alibaba.com/product/...), only company websites
- Prioritize well-established companies with verifiable online presence

Return ONLY valid JSON in this exact format, no other text:
{"results": [{"name": "Company Name", "website": "https://example.com", "type": "supplier"}]}`;

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
            content: "You are a world-class B2B trade intelligence assistant. You have deep knowledge of global supply chains, manufacturers, wholesalers, and distributors across all industries. You ALWAYS find real companies with real websites within the specified country. You never return empty results unless the product truly does not exist in that country. Always return valid JSON only, no markdown formatting." 
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
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Failed to search. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";
    
    let parsed;
    try {
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse results. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const allResults = parsed.results || [];
    const displayLimit = hasPaid ? 10 : 2;

    // Save full results to saved_searches table
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    
    await adminClient.from("saved_searches").insert({
      user_id: user.id,
      product_name: sanitizedProduct,
      search_selection: searchSelection,
      country: selectedCountry,
      results: allResults,
      results_found: allResults.length,
    });

    return new Response(
      JSON.stringify({ 
        results: allResults, 
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
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
