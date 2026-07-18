import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { row_id } = await req.json();
    if (!row_id) {
      return new Response(JSON.stringify({ error: "row_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: row, error } = await admin
      .from("pipeline_rows")
      .select("id, why, pitch_angle, contact_channel, how_to_get_in, stage, products(name, url, profile), retailers(name, segment, domain)")
      .eq("id", row_id).eq("user_id", user.id).single();
    if (error || !row) {
      return new Response(JSON.stringify({ error: "Row not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    type Joined = {
      products?: { name?: string; url?: string; profile?: Record<string, unknown> };
      retailers?: { name?: string; segment?: string; domain?: string };
    };
    const j = row as unknown as Joined;
    const productName = j.products?.name || "our product";
    const retailerName = j.retailers?.name || "the retailer";

    // Cross-pipeline warning: is this retailer active in another of the user's products?
    const { data: siblings } = await admin
      .from("pipeline_rows")
      .select("stage, products(name), retailers!inner(domain)")
      .eq("user_id", user.id)
      .eq("retailers.domain", j.retailers?.domain || "")
      .neq("id", row.id)
      .in("stage", ["contacted", "in_conversation", "sampling"]);
    const crossWarning = (siblings && siblings.length > 0)
      ? `You're already talking to ${retailerName} about ${(siblings[0] as unknown as { products?: { name?: string } }).products?.name} — consider adding ${productName} to that thread instead.`
      : null;

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You write concise, high-converting wholesale pitch emails from emerging brands to retail buyers. Return only valid JSON, no markdown.",
          },
          {
            role: "user",
            content: `Write a pitch email.
BRAND'S PRODUCT: "${productName}"${j.products?.url ? ` (${j.products.url})` : ""}
PRODUCT PROFILE: ${JSON.stringify(j.products?.profile || {})}
TARGET: ${retailerName} (${j.retailers?.segment || "retailer"})
WHY THE FIT WORKS: ${row.why || "category fit"}
PITCH ANGLE: ${row.pitch_angle || "n/a"}
SUBMISSION CHANNEL: ${row.contact_channel || "email"} ${row.how_to_get_in ? JSON.stringify(row.how_to_get_in) : ""}

Rules:
- Subject line: specific, no clickbait, under 60 chars.
- Body: ~120 words. Reference why the fit makes sense using real details above. Include "[wholesale price]" as a placeholder the user fills in. End with a CTA that matches the ACTUAL submission channel (e.g. if it's RangeMe or a supplier portal, the CTA references submitting there or asks the best path — NOT a generic "hop on a call").
- Warm, confident, zero fluff. No fake stats. No invented buyer names — open with "Hi there" or the team.
Return: {"subject": "...", "body": "..."}`,
          },
        ],
      }),
    });
    if (!aiRes.ok) throw new Error(`AI ${aiRes.status}`);
    const aiData = await aiRes.json();
    const raw = (aiData.choices?.[0]?.message?.content || "").replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    let pitch: { subject: string; body: string };
    try { pitch = JSON.parse(raw); } catch {
      pitch = { subject: `${productName} × ${retailerName} — wholesale intro`, body: raw.slice(0, 1200) };
    }

    return new Response(JSON.stringify({ ...pitch, cross_warning: crossWarning }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("draft-pitch error:", e);
    return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
