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

    const { action, token, product_id, email } = await req.json();

    if (action === "submit-vote") {
      // Insert unverified vote
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

      const verification_token = crypto.randomUUID();

      const { error: insertError } = await supabase
        .from("source_community_votes")
        .insert({
          product_id,
          email,
          verified: false,
          verification_token,
        });

      if (insertError) throw insertError;

      // Get product name for the email
      const { data: product } = await supabase
        .from("source_products")
        .select("product_name, slug")
        .eq("id", product_id)
        .single();

      const verifyUrl = `${req.headers.get("origin") || "https://retail-data.lovable.app"}/source/${product?.slug}/vote?verify=${verification_token}`;

      // For now, log the verification link (email sending can be added later)
      console.log(`Verification link for ${email}: ${verifyUrl}`);

      return new Response(
        JSON.stringify({ success: true, message: "Check your email to verify your vote." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify") {
      if (!token) {
        return new Response(
          JSON.stringify({ error: "missing_token" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      const { data: vote, error: findError } = await supabase
        .from("source_community_votes")
        .select("id, verified")
        .eq("verification_token", token)
        .maybeSingle();

      if (findError || !vote) {
        return new Response(
          JSON.stringify({ error: "invalid_token" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }

      if (vote.verified) {
        return new Response(
          JSON.stringify({ success: true, already_verified: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error: updateError } = await supabase
        .from("source_community_votes")
        .update({ verified: true })
        .eq("id", vote.id);

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({ success: true, already_verified: false }),
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
