import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    // Find all competitors without completed analysis
    const { data: competitors, error } = await supabase
      .from("tracked_competitors")
      .select("id, user_id, competitor_name, website_url, category");

    if (error) throw error;

    const { data: existing } = await supabase
      .from("competitor_analysis")
      .select("competitor_id, status");

    const completedIds = new Set(
      (existing || []).filter((a) => a.status === "completed").map((a) => a.competitor_id)
    );

    const pending = (competitors || []).filter((c) => !completedIds.has(c.id));
    console.log(`Found ${pending.length} competitors to backfill`);

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const results: { name: string; status: string }[] = [];

    for (const comp of pending) {
      try {
        console.log(`Analyzing: ${comp.competitor_name}`);

        // Mark as analyzing
        await supabase.from("competitor_analysis").upsert(
          {
            competitor_id: comp.id,
            user_id: comp.user_id,
            status: "analyzing",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "competitor_id" }
        );

        const prompt = `You are a business intelligence analyst. Analyze the company "${comp.competitor_name}" ${comp.website_url ? `(website: ${comp.website_url})` : ""} ${comp.category ? `in the ${comp.category} industry` : ""}.

Return a JSON object with the following structure. Use your best knowledge. If you don't have reliable data for a field, use null.

{
  "overview": {
    "description": "150-200 word company description",
    "founded": "year or null",
    "headquarters": "city, country or null",
    "industry": "industry name",
    "employees": "approximate number as string or null",
    "countries": "number of countries or null",
    "usps": ["usp1", "usp2", "usp3"],
    "competitive_edge": "paragraph",
    "competitive_edge_points": ["point1", "point2", "point3", "point4", "point5"]
  },
  "financials": {
    "revenue": "formatted or null",
    "revenue_year": "year or null",
    "revenue_growth_yoy": "percent or null",
    "gross_margin": "percent or null",
    "net_margin": "percent or null",
    "financial_health_score": null
  },
  "market": {
    "market_share": null,
    "market_name": null,
    "market_rank": null,
    "top_competitors": []
  },
  "customers": {
    "total_customers": null,
    "avg_rating": null,
    "total_reviews": null,
    "nps_score": null,
    "positive_themes": [],
    "negative_themes": []
  },
  "digital": {
    "monthly_visitors": null,
    "domain_authority": null,
    "referring_domains": null,
    "mobile_score": null,
    "social_media": {},
    "marketing_channels": []
  },
  "advantages": [
    {"icon": "👑", "title": "Title", "description": "desc", "impact": "High"}
  ],
  "threat_level": {
    "score": 5,
    "label": "Medium Threat",
    "explanation": "explanation",
    "recommendation": "recommendation"
  }
}

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks.`;

        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${lovableApiKey}`,
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!aiResponse.ok) throw new Error(`AI error: ${aiResponse.status}`);

        const aiData = await aiResponse.json();
        let text = aiData.choices?.[0]?.message?.content || aiData.content || "";
        text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

        const analysisData = JSON.parse(text);

        await supabase.from("competitor_analysis").upsert(
          {
            competitor_id: comp.id,
            user_id: comp.user_id,
            analysis_data: analysisData,
            status: "completed",
            migrated: true,
            last_analyzed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "competitor_id" }
        );

        results.push({ name: comp.competitor_name, status: "completed" });
        console.log(`Completed: ${comp.competitor_name}`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`Failed: ${comp.competitor_name} - ${msg}`);
        results.push({ name: comp.competitor_name, status: `failed: ${msg}` });

        await supabase
          .from("competitor_analysis")
          .upsert(
            {
              competitor_id: comp.id,
              user_id: comp.user_id,
              status: "failed",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "competitor_id" }
          );
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
