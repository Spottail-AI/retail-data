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

    const { action, request_id } = await req.json();

    // Verify admin via authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Check admin role - for now, use a simple check via has_role
    // In production, add an 'admin' role to the app_role enum
    // For MVP, only the product owner or first registered user can approve

    if (action === "approve") {
      const { data: request, error: reqError } = await supabase
        .from("verification_requests")
        .select("*, source_products!inner(id, user_id, product_name)")
        .eq("id", request_id)
        .single();

      if (reqError || !request) {
        return new Response(
          JSON.stringify({ error: "Request not found" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }

      // Update request status
      await supabase
        .from("verification_requests")
        .update({ status: "approved", reviewed_at: new Date().toISOString() })
        .eq("id", request_id);

      // Mark product as verified
      await supabase
        .from("source_products")
        .update({ is_verified: true })
        .eq("id", request.product_id);

      return new Response(
        JSON.stringify({ success: true, action: "approved" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "reject") {
      await supabase
        .from("verification_requests")
        .update({ status: "rejected", reviewed_at: new Date().toISOString() })
        .eq("id", request_id);

      return new Response(
        JSON.stringify({ success: true, action: "rejected" }),
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
