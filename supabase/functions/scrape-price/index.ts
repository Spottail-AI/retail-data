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
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const { url, tracked_price_id } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlKey) {
      return new Response(
        JSON.stringify({ error: "Firecrawl not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log("Scraping price from:", formattedUrl);

    // Use Firecrawl to scrape the page with JSON extraction for price data
    const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firecrawlKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: [
          "markdown",
          {
            type: "json",
            prompt:
              "Extract the main product price, currency, product name, stock/availability status, and whether it's on sale with any discount percentage. If there are multiple prices, use the primary selling price (not the original/strikethrough price).",
            schema: {
              type: "object",
              properties: {
                product_name: { type: "string", description: "The product name/title" },
                price: { type: "number", description: "The current selling price as a number (no currency symbol)" },
                currency: { type: "string", description: "Currency code (USD, EUR, GBP, etc.)" },
                stock_status: {
                  type: "string",
                  enum: ["in_stock", "limited", "out_of_stock", "unknown"],
                  description: "Product availability status",
                },
                is_on_sale: { type: "boolean", description: "Whether the product is currently on sale/discounted" },
                discount_percent: {
                  type: "number",
                  description: "Discount percentage if on sale, null otherwise",
                },
                original_price: {
                  type: "number",
                  description: "Original price before discount, null if not on sale",
                },
              },
              required: ["price", "currency"],
            },
          },
        ],
        onlyMainContent: true,
        waitFor: 3000,
      }),
    });

    const scrapeData = await scrapeResponse.json();

    if (!scrapeResponse.ok) {
      console.error("Firecrawl API error:", scrapeData);

      // Update error state if tracked_price_id provided
      if (tracked_price_id) {
        await supabase
          .from("tracked_prices")
          .update({
            status: "error",
            last_error: scrapeData.error || "Failed to scrape page",
            error_count: supabase.rpc ? undefined : 1,
            last_checked: new Date().toISOString(),
          })
          .eq("id", tracked_price_id)
          .eq("user_id", userId);
      }

      return new Response(
        JSON.stringify({
          error: "Failed to scrape price",
          details: scrapeData.error || `Status ${scrapeResponse.status}`,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract price data from Firecrawl response
    const jsonData = scrapeData?.data?.json || scrapeData?.json || {};
    const metadata = scrapeData?.data?.metadata || scrapeData?.metadata || {};

    const priceResult = {
      product_name: jsonData.product_name || metadata?.title || "Unknown Product",
      price: jsonData.price ?? null,
      currency: jsonData.currency || "USD",
      stock_status: jsonData.stock_status || "unknown",
      is_on_sale: jsonData.is_on_sale || false,
      discount_percent: jsonData.discount_percent || null,
      original_price: jsonData.original_price || null,
      source_url: formattedUrl,
      scraped_at: new Date().toISOString(),
    };

    if (priceResult.price === null || priceResult.price === undefined) {
      // Update error if we couldn't find a price
      if (tracked_price_id) {
        await supabase
          .from("tracked_prices")
          .update({
            status: "error",
            last_error: "Could not locate price on page",
            last_checked: new Date().toISOString(),
          })
          .eq("id", tracked_price_id)
          .eq("user_id", userId);
      }

      return new Response(
        JSON.stringify({
          error: "Could not find price on this page",
          product_name: priceResult.product_name,
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If tracked_price_id is provided, save to price_history and update tracked_prices
    if (tracked_price_id) {
      // Insert price history record
      const { error: historyError } = await supabase.from("price_history").insert({
        tracked_price_id,
        user_id: userId,
        price: priceResult.price,
        currency: priceResult.currency,
        stock_status: priceResult.stock_status,
        is_on_sale: priceResult.is_on_sale,
        discount_percent: priceResult.discount_percent,
        notes: priceResult.is_on_sale ? `On sale (was ${priceResult.original_price})` : null,
      });

      if (historyError) {
        console.error("Error saving price history:", historyError);
      }

      // Update tracked_prices with latest info
      await supabase
        .from("tracked_prices")
        .update({
          status: "active",
          last_checked: new Date().toISOString(),
          last_error: null,
          error_count: 0,
          currency: priceResult.currency,
          product_name: priceResult.product_name,
        })
        .eq("id", tracked_price_id)
        .eq("user_id", userId);
    }

    return new Response(JSON.stringify({ success: true, data: priceResult }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in scrape-price:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
