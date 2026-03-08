import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[ANALYZE-COMPETITOR] ${step}${d}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const { competitor_id } = await req.json();
    if (!competitor_id) throw new Error("competitor_id is required");

    logStep("Analyzing competitor", { competitor_id, userId: user.id });

    // Get competitor details
    const { data: competitor, error: compError } = await supabaseClient
      .from("tracked_competitors")
      .select("*")
      .eq("id", competitor_id)
      .eq("user_id", user.id)
      .single();

    if (compError || !competitor) throw new Error("Competitor not found");

    logStep("Found competitor", { name: competitor.competitor_name });

    // Update status to analyzing
    await supabaseClient
      .from("competitor_analysis")
      .upsert({
        competitor_id,
        user_id: user.id,
        status: "analyzing",
        updated_at: new Date().toISOString(),
      }, { onConflict: "competitor_id" });

    // Use Lovable AI (Gemini) to generate analysis
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `You are a business intelligence analyst. Analyze the company "${competitor.competitor_name}" ${competitor.website_url ? `(website: ${competitor.website_url})` : ""} ${competitor.category ? `in the ${competitor.category} industry` : ""}.

Return a JSON object with the following structure. Use your best knowledge. If you don't have reliable data for a field, use null. Do NOT make up specific numbers you're not confident about - use null instead.

{
  "overview": {
    "description": "150-200 word company description",
    "founded": "year or null",
    "headquarters": "city, country or null",
    "industry": "industry name",
    "employees": "approximate number as string like '10,000+' or null",
    "countries": "number of countries or null",
    "usps": ["unique selling point 1", "usp 2", "usp 3"],
    "competitive_edge": "paragraph about their competitive edge",
    "competitive_edge_points": ["point 1", "point 2", "point 3", "point 4", "point 5"]
  },
  "financials": {
    "revenue": "formatted like '$46.7B' or null",
    "revenue_year": "FY 2024 or null",
    "revenue_growth_yoy": "+5.2%" or null,
    "gross_margin": "45.2%" or null,
    "net_margin": "12.8%" or null,
    "financial_health_score": 78 or null
  },
  "market": {
    "market_share": "12.3%" or null,
    "market_name": "Global Sportswear Market" or null,
    "market_rank": 2 or null,
    "top_competitors": [
      {"name": "Company", "market_share": "15%", "revenue": "$50B"}
    ]
  },
  "customers": {
    "total_customers": "5.2M" or null,
    "avg_rating": 4.3 or null,
    "total_reviews": "125K" or null,
    "nps_score": 62 or null,
    "positive_themes": [{"theme": "Quality", "percentage": 92}],
    "negative_themes": [{"theme": "Price", "percentage": 45}]
  },
  "digital": {
    "monthly_visitors": "245M" or null,
    "domain_authority": 92 or null,
    "referring_domains": "12.4K" or null,
    "mobile_score": 98 or null,
    "social_media": {
      "instagram": {"followers": "35.2M", "growth": "+5.2%"},
      "facebook": {"followers": "28.1M", "growth": "+2.1%"},
      "twitter": {"followers": "12.4M", "growth": "+8.3%"},
      "youtube": {"followers": "18.5M", "growth": "+3.7%"}
    },
    "marketing_channels": [
      {"channel": "Paid Social", "percentage": 35},
      {"channel": "Paid Search", "percentage": 28},
      {"channel": "Email", "percentage": 15},
      {"channel": "Content", "percentage": 12},
      {"channel": "Influencer", "percentage": 10}
    ]
  },
  "advantages": [
    {"icon": "👑", "title": "Brand Strength", "description": "description", "impact": "High"},
    {"icon": "🚀", "title": "R&D Investment", "description": "description", "impact": "High"},
    {"icon": "📦", "title": "Supply Chain", "description": "description", "impact": "High"},
    {"icon": "💰", "title": "Premium Positioning", "description": "description", "impact": "Medium"},
    {"icon": "💳", "title": "Customer Loyalty", "description": "description", "impact": "High"},
    {"icon": "💻", "title": "Digital Capabilities", "description": "description", "impact": "High"}
  ],
  "threat_level": {
    "score": 8,
    "label": "High Threat",
    "explanation": "explanation paragraph",
    "recommendation": "recommendation paragraph"
  }
}

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no explanation.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      logStep("AI API error", { status: aiResponse.status, body: errText });
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    logStep("AI response received");

    let analysisText = aiData.choices?.[0]?.message?.content || aiData.content || "";
    
    // Clean up any markdown code blocks
    analysisText = analysisText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let analysisData;
    try {
      analysisData = JSON.parse(analysisText);
    } catch (e) {
      logStep("Failed to parse AI response", { text: analysisText.substring(0, 200) });
      throw new Error("Failed to parse AI analysis response");
    }

    // Save analysis
    const { error: saveError } = await supabaseClient
      .from("competitor_analysis")
      .upsert({
        competitor_id,
        user_id: user.id,
        analysis_data: analysisData,
        status: "completed",
        migrated: true,
        last_analyzed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "competitor_id" });

    if (saveError) {
      logStep("Save error", { error: saveError });
      throw new Error("Failed to save analysis");
    }

    logStep("Analysis saved successfully");

    return new Response(
      JSON.stringify({ success: true, analysis: analysisData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });

    // Try to update status to failed
    try {
      const { competitor_id } = await req.clone().json().catch(() => ({}));
      if (competitor_id) {
        await supabaseClient
          .from("competitor_analysis")
          .update({ status: "failed", updated_at: new Date().toISOString() })
          .eq("competitor_id", competitor_id);
      }
    } catch {}

    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
