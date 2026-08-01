import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { SOURCE_PRODUCT_COLUMNS } from "@/lib/source-product-columns";
import { useSourceTradeTerms } from "@/hooks/use-source-trade-terms";
import { getCategoryPack } from "@/lib/retail-readiness";
import { useQuery } from "@tanstack/react-query";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

/**
 * Edit an existing Source listing.
 *
 * Deliberately narrower than the create form: it covers the commercial and
 * readiness fields, which is what the product page's retail-readiness checklist
 * asks brands to fill in. Images are left alone — the create flow uploads them and
 * replacing them needs its own handling.
 *
 * Contact details can't be pre-filled: SELECT on contact_email / contact_whatsapp
 * is revoked at the database level, so the client can't read them back. They're
 * left out here rather than shown blank and silently wiped on save.
 */
const SourceEditProduct = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["source-product-edit", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("source_products")
        .select(SOURCE_PRODUCT_COLUMNS)
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data as Record<string, any> | null;
    },
    enabled: !!slug,
  });

  const isOwner = !!user && !!product && product.user_id === user.id;
  // Pricing lives behind the trade-terms RPC, so fetch it separately to pre-fill.
  const { data: tradeTerms } = useSourceTradeTerms(slug, isOwner);

  const [form, setForm] = useState({
    product_name: "",
    brand_name: "",
    tagline: "",
    description: "",
    rrp: "",
    wholesale_price_min: "",
    wholesale_price_max: "",
    case_size: "",
    gtin: "",
    moq: "",
    lead_time: "",
    available_skus: "",
    has_liability_insurance: false,
  });
  const [declarations, setDeclarations] = useState<Record<string, boolean>>({});

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Pre-fill once the product (and its pricing) have arrived.
  useEffect(() => {
    if (!product || loaded) return;
    setForm({
      product_name: product.product_name ?? "",
      brand_name: product.brand_name ?? "",
      tagline: product.tagline ?? "",
      description: product.description ?? "",
      rrp: product.rrp != null ? String(product.rrp) : "",
      wholesale_price_min: tradeTerms?.wholesale_price_min != null ? String(tradeTerms.wholesale_price_min) : "",
      wholesale_price_max: tradeTerms?.wholesale_price_max != null ? String(tradeTerms.wholesale_price_max) : "",
      case_size: product.case_size != null ? String(product.case_size) : "",
      gtin: product.gtin ?? "",
      moq: product.moq != null ? String(product.moq) : "",
      lead_time: product.lead_time ?? "",
      available_skus: product.available_skus != null ? String(product.available_skus) : "",
      has_liability_insurance: product.has_liability_insurance === true,
    });
    setDeclarations((product.readiness_declarations as Record<string, boolean>) ?? {});
    // Wait for pricing before locking the form in, so it isn't pre-filled blank.
    if (tradeTerms !== undefined) setLoaded(true);
  }, [product, tradeTerms, loaded]);

  useEffect(() => {
    if (!authLoading && !user) navigate(`/login?redirect=/source/${slug}/edit`);
  }, [authLoading, user, navigate, slug]);

  const pack = getCategoryPack(product?.category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !isOwner) return;
    if (!form.product_name.trim()) {
      toast({ title: "Product name is required", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("source_products")
        .update({
          product_name: form.product_name.trim(),
          brand_name: form.brand_name.trim() || null,
          tagline: form.tagline.trim() || null,
          description: form.description.trim() || null,
          rrp: form.rrp ? Number(form.rrp) : null,
          wholesale_price_min: form.wholesale_price_min ? Number(form.wholesale_price_min) : null,
          wholesale_price_max: form.wholesale_price_max ? Number(form.wholesale_price_max) : null,
          case_size: form.case_size ? Number(form.case_size) : null,
          gtin: form.gtin.trim() || null,
          moq: form.moq ? Number(form.moq) : null,
          lead_time: form.lead_time.trim() || null,
          available_skus: form.available_skus ? Number(form.available_skus) : null,
          has_liability_insurance: form.has_liability_insurance,
          readiness_declarations: declarations,
        })
        .eq("id", product.id);

      if (error) throw error;
      toast({ title: "Listing updated", description: "Your changes are live." });
      navigate(`/source/${slug}`);
    } catch (err: any) {
      toast({ title: "Couldn't save changes", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardShell>
    );
  }

  if (!product) {
    return (
      <DashboardShell>
        <div className="max-w-[680px] mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <Button onClick={() => navigate("/source")}>Browse Source</Button>
        </div>
      </DashboardShell>
    );
  }

  if (!isOwner) {
    return (
      <DashboardShell>
        <div className="max-w-[680px] mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">You can't edit this listing</h1>
          <p className="text-muted-foreground text-sm mb-6">Only the brand that created it can make changes.</p>
          <Button onClick={() => navigate(`/source/${slug}`)}>Back to the listing</Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-[680px] mx-auto px-4 py-8">
        <button
          onClick={() => navigate(`/source/${slug}`)}
          className="inline-flex items-center gap-2 text-muted-foreground text-sm mb-6 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to listing
        </button>

        <h1 className="text-2xl font-bold mb-1">Edit listing</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Everything here is what retail buyers screen on. The more you complete, the further you get.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basics */}
          <section className="space-y-4">
            <h2 className="text-foreground font-bold text-sm uppercase tracking-wider">Basics</h2>
            <div className="space-y-2">
              <Label htmlFor="product_name">Product name</Label>
              <Input id="product_name" value={form.product_name} onChange={(e) => update("product_name", e.target.value)} maxLength={120} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand_name">Brand name</Label>
              <Input id="brand_name" value={form.brand_name} onChange={(e) => update("brand_name", e.target.value)} placeholder="The brand behind this product" maxLength={120} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" value={form.tagline} onChange={(e) => update("tagline", e.target.value)} maxLength={140} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} maxLength={2000} />
            </div>
          </section>

          {/* Commercials */}
          <section className="space-y-4">
            <h2 className="text-foreground font-bold text-sm uppercase tracking-wider">Pricing &amp; supply</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rrp">RRP</Label>
                <Input id="rrp" type="number" step="0.01" min="0" value={form.rrp} onChange={(e) => update("rrp", e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="case_size">Units per case</Label>
                <Input id="case_size" type="number" min="1" value={form.case_size} onChange={(e) => update("case_size", e.target.value)} placeholder="e.g. 12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wmin">Wholesale from</Label>
                <Input id="wmin" type="number" step="0.01" min="0" value={form.wholesale_price_min} onChange={(e) => update("wholesale_price_min", e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wmax">Wholesale to</Label>
                <Input id="wmax" type="number" step="0.01" min="0" value={form.wholesale_price_max} onChange={(e) => update("wholesale_price_max", e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moq">MOQ</Label>
                <Input id="moq" type="number" min="1" value={form.moq} onChange={(e) => update("moq", e.target.value)} placeholder="e.g. 100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead_time">Lead time</Label>
                <Input id="lead_time" value={form.lead_time} onChange={(e) => update("lead_time", e.target.value)} placeholder="e.g. 10–14 days" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skus">SKUs available</Label>
                <Input id="skus" type="number" min="1" value={form.available_skus} onChange={(e) => update("available_skus", e.target.value)} placeholder="e.g. 4" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gtin">Barcode / GTIN</Label>
                <Input id="gtin" value={form.gtin} onChange={(e) => update("gtin", e.target.value)} placeholder="e.g. 5012345678900" maxLength={20} />
              </div>
            </div>
            <p className="text-muted-foreground text-xs">
              RRP lets buyers see their profit-on-return calculated from your wholesale price. Listings with one convert better.
            </p>
          </section>

          {/* Retail readiness — core + category pack */}
          <section className="space-y-4">
            <h2 className="text-foreground font-bold text-sm uppercase tracking-wider">Retail readiness</h2>
            <p className="text-muted-foreground text-xs">
              {pack.items.length > 0
                ? `Requirements buyers screen on for ${pack.label.toLowerCase()}. These are your declarations — Spottail doesn't verify them, so only tick what you can evidence.`
                : "These are your declarations — Spottail doesn't verify them, so only tick what you can evidence."}
            </p>

            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={form.has_liability_insurance}
                onCheckedChange={(v) => update("has_liability_insurance", v === true)}
                className="mt-0.5"
              />
              <span className="text-sm">Product liability insurance</span>
            </label>

            {pack.items.map((item) => (
              <label key={item.key} className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={declarations[item.key] === true}
                  onCheckedChange={(v) => setDeclarations((prev) => ({ ...prev, [item.key]: v === true }))}
                  className="mt-0.5"
                />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </section>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save changes
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(`/source/${slug}`)}>
              Cancel
            </Button>
          </div>

          <p className="text-muted-foreground text-xs">
            Images and contact details aren't editable here yet.
          </p>
        </form>
      </div>
    </DashboardShell>
  );
};

export default SourceEditProduct;
