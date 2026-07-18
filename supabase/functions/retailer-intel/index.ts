// retailer-intel: two modes.
//  mode "find_contact": resolve the real outreach channel for a retailer (cached in retailers.enrichment).
//  mode "add_store":    enrich a manually-added store (fit vs product profile + how_to_get_in), update its pipeline row.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const normalizeDomain = (website: string): string | null => {
  try {
    let w = website.trim().toLowerCase();
    if (!/^https?:\/\//.test(w)) w = "https://" + w;
    return new URL(w).hostname.replace(/^www\./, "") || null;
  } catch { return null; }
};

const aiJson = async (apiKey: string, system: string, prompt: string, web = true) => {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      ...(web ? { plugins: [{ id: "web" }] } : {}),
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`AI ${res.status}`);
  const data = await res.json();
  const raw = (data.choices?.[0]?.message?.content || "").replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(raw);
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

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const mode: string = body.mode;

    // ─────────────────────────── FIND CONTACT ───────────────────────────
    if (mode === "find_contact") {
      const { retailer_id, row_id } = body;
      const { data: retailer } = await admin.from("retailers")
        .select("id,name,domain,website,segment,enrichment").eq("id", retailer_id).single();
      if (!retailer) {
        return new Response(JSON.stringify({ error: "Retailer not found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const enrichment = (retailer.enrichment || {}) as Record<string, unknown>;
      let contact = enrichment.contact as Record<string, unknown> | undefined;

      if (!contact) {
        contact = await aiJson(
          apiKey,
          "You research how brands submit products to retailers/distributors. Ground answers in live web search. Return only valid JSON. NEVER invent a person's email — only published vendor-inquiry addresses or public submission channels.",
          `How does an emerging brand pitch/submit products to ${retailer.name} (${retailer.website || retailer.domain})?
Search their site (vendor/supplier/wholesale/stockist pages) and the web.
Return: {"channel": "short label, e.g. 'via RangeMe' | 'Supplier portal' | 'Vendor form' | 'Marketplace signup' | 'Public vendor email'",
 "url": "the real submission/portal/form URL, or null",
 "email": "ONLY a published vendor-inquiry email visible on their site, else null",
 "guidance": "1-2 sentences of practical advice for getting in"}`
        ) as Record<string, unknown>;
        await admin.from("retailers").update({
          enrichment: { ...enrichment, contact },
        }).eq("id", retailer.id);
      }

      if (row_id) {
        await admin.from("pipeline_rows").update({
          contact_channel: (contact.channel as string) || null,
          contact_form_url: (contact.url as string) || null,
          email: (contact.email as string) || null,
        }).eq("id", row_id).eq("user_id", user.id);
      }
      return new Response(JSON.stringify({ contact }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─────────────────────────── ADD STORE ──────────────────────────────
    if (mode === "add_store") {
      const { product_id, input } = body;
      if (!product_id || !input) {
        return new Response(JSON.stringify({ error: "product_id and input required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: product } = await admin.from("products")
        .select("id,name,profile").eq("id", product_id).eq("user_id", user.id).single();
      if (!product) {
        return new Response(JSON.stringify({ error: "Product not found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const looksLikeUrl = /\./.test(input);
      const domainGuess = looksLikeUrl ? normalizeDomain(input) : null;

      // Existing retailer?
      let retailer: { id: string; name: string; domain: string; website: string | null; segment: string | null; enrichment: Record<string, unknown> } | null = null;
      if (domainGuess) {
        const { data } = await admin.from("retailers").select("id,name,domain,website,segment,enrichment").eq("domain", domainGuess).maybeSingle();
        retailer = data as typeof retailer;
      }
      if (!retailer) {
        const { data } = await admin.from("retailers").select("id,name,domain,website,segment,enrichment").ilike("name", input).maybeSingle();
        retailer = data as typeof retailer;
      }

      let enriched: Record<string, unknown> | null = null;
      let websiteAlive = true;
      if (!retailer) {
        // Fresh enrichment via web-grounded LLM.
        enriched = await aiJson(
          apiKey,
          "You identify and classify retail stores/distributors. Ground answers in live web search. Return only valid JSON. Never fabricate contact details.",
          `Identify this retail store or distributor: "${input}".
Return: {"name": "official trading name", "website": "real homepage URL or null",
 "segment": "national_distributor|regional_distributor|retail_chain|independent_marketplace",
 "channel": "Physical|Online|Both", "location": "City, Region or Nationwide",
 "multi_brand": true/false (do they resell multiple third-party brands?),
 "how_to_get_in": {"steps": ["2-4 real steps"], "requirements": [], "submission_url": "url or null"},
 "contact_channel": "short label", "why_hint": "1 sentence on what they sell"}`
        ) as Record<string, unknown>;
        const website = (enriched.website as string) || (looksLikeUrl ? input : null);
        const domain = website ? normalizeDomain(website) : null;
        if (!domain) {
          return new Response(JSON.stringify({ error: "Couldn't identify that store — try pasting its website URL." }), {
            status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 4000);
          const resp = await fetch(`https://${domain}`, { method: "HEAD", redirect: "follow", signal: controller.signal });
          clearTimeout(timer);
          websiteAlive = resp.ok || resp.status < 500;
        } catch { websiteAlive = false; }

        const { data: upserted, error: upErr } = await admin.from("retailers").upsert(
          {
            domain, name: (enriched.name as string) || input, website,
            segment: (enriched.segment as string) || "retail_chain",
            channel: (enriched.channel as string) || "Both",
            location: (enriched.location as string) || null,
            enrichment: { how_to_get_in: enriched.how_to_get_in || null, contact_channel: enriched.contact_channel || null },
          },
          { onConflict: "domain" }
        ).select("id,name,domain,website,segment,enrichment").single();
        if (upErr || !upserted) throw new Error(`retailer upsert failed: ${upErr?.message}`);
        retailer = upserted as typeof retailer;
      }

      // Already in this pipeline?
      const { data: existingRow } = await admin.from("pipeline_rows")
        .select("id").eq("product_id", product.id).eq("retailer_id", retailer!.id).maybeSingle();
      if (existingRow) {
        return new Response(JSON.stringify({ duplicate: true, row_id: existingRow.id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fit score vs product profile (no web needed).
      let fit = 65, why: string | null = null;
      try {
        const scored = await aiJson(
          apiKey,
          "You score retail placement fit. Return only valid JSON.",
          `Score fit 0-100 for stocking this product at this retailer, rubric: category fit /30, brand-stage fit /30, channel & margin fit /25, geography /15.
PRODUCT: ${product.name} — profile: ${JSON.stringify(product.profile || {})}
RETAILER: ${retailer!.name} (${retailer!.segment || "retailer"})${enriched?.why_hint ? ` — ${enriched.why_hint}` : ""}
Return: {"fit": 0-100, "why": "1-2 sentences"}`,
          false
        ) as { fit?: number; why?: string };
        fit = Math.max(0, Math.min(100, Math.round(Number(scored.fit) || 65)));
        why = scored.why || null;
      } catch { /* keep defaults */ }

      const retailerEnrichment = (retailer!.enrichment || {}) as Record<string, unknown>;
      const { data: newRow, error: rowErr } = await admin.from("pipeline_rows").insert({
        product_id: product.id, retailer_id: retailer!.id, user_id: user.id,
        stage: "to_contact", fit,
        why: websiteAlive ? why : (why ? `${why} (couldn't verify website)` : "Couldn't verify website"),
        how_to_get_in: retailerEnrichment.how_to_get_in || null,
        contact_channel: (retailerEnrichment.contact_channel as string) || null,
        sources: ["manual"], is_new: false, user_edited: false,
      }).select("id").single();
      if (rowErr || !newRow) throw new Error(`row insert failed: ${rowErr?.message}`);
      await admin.from("pipeline_events").insert({ row_id: newRow.id, user_id: user.id, label: "Added manually" });

      return new Response(JSON.stringify({ duplicate: false, row_id: newRow.id, website_alive: websiteAlive }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown mode" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("retailer-intel error:", e);
    return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
