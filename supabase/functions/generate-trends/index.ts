import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface TrendRequest {
  country: string;
  niche: string;
  platform: string;
  sessionId: string;
  userId?: string;
}

interface TrendResult {
  product: string;
  trend: string;
  platform: string;
  timeframe: string;
  confidence: number;
  risk: string;
  description: string;
  searchVolume: string;
  competitionLevel: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { country, niche, platform, sessionId, userId }: TrendRequest = await req.json();

    if (!country || !niche || !platform || !sessionId) {
      throw new Error("Missing required fields: country, niche, platform, sessionId");
    }

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`[GENERATE-TRENDS] Generating trends for ${niche} in ${country} on ${platform}`);

    // Call Lovable AI to generate trend predictions
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a retail product trend analyst. Generate realistic trending product predictions based on the given market, niche, and platform. Return exactly 10 products as a JSON array. Each product should have these fields:
- product: Product name (specific, not generic)
- trend: Growth percentage like "+234%"
- platform: The platform where this is trending
- timeframe: When it will peak, like "2-3 weeks"
- confidence: Number between 75-98
- risk: "Low", "Medium", or "High"
- description: 2-3 sentences about why this product is trending
- searchVolume: "Low", "Medium", "High", or "Very High"
- competitionLevel: "Low", "Medium", "High"

Return ONLY valid JSON array, no markdown, no explanation.`
          },
          {
            role: "user",
            content: `Generate 10 trending product predictions for:
- Country/Region: ${country}
- Niche/Category: ${niche}
- Platform: ${platform === "all" ? "All major e-commerce platforms" : platform}

Consider current market conditions, seasonal trends, and emerging consumer behaviors.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error(`[GENERATE-TRENDS] AI API error: ${errorText}`);
      throw new Error(`AI service error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response
    let results: TrendResult[];
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      results = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error(`[GENERATE-TRENDS] Failed to parse AI response: ${content}`);
      throw new Error("Failed to parse trend results");
    }

    // Store results in database
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { error: insertError } = await supabaseClient
      .from("trend_results")
      .insert({
        session_id: sessionId,
        category: `${niche} in ${country}`,
        results: results,
        user_id: userId || null,
      });

    if (insertError) {
      console.error(`[GENERATE-TRENDS] Database insert error: ${insertError.message}`);
      // Continue even if insert fails - we can still return results
    }

    console.log(`[GENERATE-TRENDS] Successfully generated ${results.length} trends`);

    return new Response(JSON.stringify({ 
      success: true, 
      results,
      sessionId 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(`[GENERATE-TRENDS] Error: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
