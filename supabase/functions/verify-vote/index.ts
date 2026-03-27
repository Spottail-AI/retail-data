import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { action, product_id, email } = await req.json();

    if (action === "submit-vote") {
      if (!product_id || !email) {
        return new Response(
          JSON.stringify({ error: "missing_fields" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      // Check for existing vote
      const { data: existing } = await supabase
        .from("source_community_votes")
        .select("id, verified")
        .eq("product_id", product_id)
        .eq("email", email)
        .maybeSingle();

      if (existing) {
        return new Response(
          JSON.stringify({ error: "already_voted", verified: existing.verified }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 409 }
        );
      }

      // Insert verified vote directly (CAPTCHA validated on client)
      const { error: insertError } = await supabase
        .from("source_community_votes")
        .insert({
          product_id,
          email,
          verified: true,
          verification_token: crypto.randomUUID(),
        });

      if (insertError) throw insertError;

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "invalid_action" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Service temporarily unavailable" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
