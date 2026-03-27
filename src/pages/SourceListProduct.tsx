import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/use-user-role";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Package, Loader2, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Beauty & Skincare", "Fashion & Apparel", "Electronics", "Home & Living",
  "Health & Wellness", "Food & Beverage", "Toys & Games", "Sports & Outdoors",
  "Pet Supplies", "Automotive", "Office & Stationery", "Other",
];

const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "CAD"];
const MAX_IMAGES = 5;

const SourceListProduct = () => {
  const { user } = useAuth();
  const { isSupplier } = useUserRole();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    product_name: "",
    tagline: "",
    description: "",
    category: "",
    currency: "USD",
    wholesale_price_min: "",
    wholesale_price_max: "",
    moq: "",
    available_skus: "",
    lead_time: "",
    shipping_countries: "",
    contact_preference: "email",
    contact_email: "",
    contact_whatsapp: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 80) +
    "-" +
    Date.now().toString(36);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_IMAGES - images.length;
    const newFiles = files.slice(0, remaining);
    
    if (files.length > remaining) {
      toast({ title: `Maximum ${MAX_IMAGES} images allowed`, variant: "destructive" });
    }

    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(imagePreviews[idx]);
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadImages = async (userId: string): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of images) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { contentType: file.type });
      if (error) {
        console.error("Upload error:", error);
        continue;
      }
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.product_name.trim()) {
      toast({ title: "Product name is required", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const slug = generateSlug(form.product_name);
      const countries = form.shipping_countries
        ? form.shipping_countries.split(",").map((c) => c.trim()).filter(Boolean)
        : [];

      // Upload images first
      const imageUrls = await uploadImages(user.id);

      const { error } = await supabase.from("source_products").insert({
        user_id: user.id,
        product_name: form.product_name.trim(),
        tagline: form.tagline.trim() || null,
        description: form.description.trim() || null,
        category: form.category || null,
        currency: form.currency,
        wholesale_price_min: form.wholesale_price_min ? Number(form.wholesale_price_min) : null,
        wholesale_price_max: form.wholesale_price_max ? Number(form.wholesale_price_max) : null,
        moq: form.moq ? Number(form.moq) : null,
        available_skus: form.available_skus ? Number(form.available_skus) : null,
        lead_time: form.lead_time.trim() || null,
        shipping_countries: countries,
        contact_preference: form.contact_preference,
        contact_email: form.contact_email.trim() || null,
        contact_whatsapp: form.contact_whatsapp.trim() || null,
        product_images: imageUrls.length > 0 ? imageUrls : null,
        slug,
      });

      if (error) throw error;

      toast({ title: "Product listed!", description: "Your product is now live on Spottail Source." });
      navigate(`/source/${slug}`);
    } catch (err: any) {
      toast({ title: "Failed to list product", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/auth?redirect=/source/new");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <DashboardShell>
      <div className="max-w-[680px] mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-extrabold text-foreground">List a Product</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">
          Get your product in front of thousands of retail buyers. Free to list.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Images */}
          <section className="space-y-4">
            <h2 className="text-foreground font-bold text-sm uppercase tracking-wider">Product Images</h2>
            <p className="text-muted-foreground text-xs">Upload up to {MAX_IMAGES} images. First image is the cover photo.</p>
            
            <div className="flex gap-3 flex-wrap">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[8px] text-center font-bold py-0.5">
                      COVER
                    </span>
                  )}
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ImagePlus className="w-5 h-5" />
                  <span className="text-[9px]">Add</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
          </section>

          {/* Product Info */}
          <section className="space-y-4">
            <h2 className="text-foreground font-bold text-sm uppercase tracking-wider">Product Information</h2>

            <div className="space-y-2">
              <Label htmlFor="product_name">Product Name *</Label>
              <Input id="product_name" value={form.product_name} onChange={(e) => update("product_name", e.target.value)} placeholder="e.g. Organic Aloe Vera Gel" maxLength={120} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" value={form.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="Short hook — max 140 chars" maxLength={140} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="What makes this product stand out?" rows={4} maxLength={2000} />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Pricing & Supply */}
          <section className="space-y-4">
            <h2 className="text-foreground font-bold text-sm uppercase tracking-wider">Pricing & Supply</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Wholesale Price</Label>
                <Input type="number" step="0.01" min="0" value={form.wholesale_price_min} onChange={(e) => update("wholesale_price_min", e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Max Wholesale Price</Label>
                <Input type="number" step="0.01" min="0" value={form.wholesale_price_max} onChange={(e) => update("wholesale_price_max", e.target.value)} placeholder="0.00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={form.currency} onValueChange={(v) => update("currency", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>MOQ (Minimum Order Quantity)</Label>
                <Input type="number" min="1" value={form.moq} onChange={(e) => update("moq", e.target.value)} placeholder="e.g. 100" />
              </div>
              <div className="space-y-2">
                <Label>Available SKUs</Label>
                <Input type="number" min="1" value={form.available_skus} onChange={(e) => update("available_skus", e.target.value)} placeholder="e.g. 12" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lead Time</Label>
              <Input value={form.lead_time} onChange={(e) => update("lead_time", e.target.value)} placeholder="e.g. 7–14 days" maxLength={60} />
            </div>

            <div className="space-y-2">
              <Label>Shipping Countries (comma-separated)</Label>
              <Input value={form.shipping_countries} onChange={(e) => update("shipping_countries", e.target.value)} placeholder="e.g. US, UK, Germany" />
            </div>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <h2 className="text-foreground font-bold text-sm uppercase tracking-wider">Contact Preference</h2>

            <Select value={form.contact_preference} onValueChange={(v) => update("contact_preference", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>

            {(form.contact_preference === "email" || form.contact_preference === "both") && (
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input type="email" value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} placeholder="you@company.com" />
              </div>
            )}

            {(form.contact_preference === "whatsapp" || form.contact_preference === "both") && (
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input value={form.contact_whatsapp} onChange={(e) => update("contact_whatsapp", e.target.value)} placeholder="+1234567890" />
              </div>
            )}
          </section>

          <Button type="submit" disabled={submitting} className="w-full bg-[hsl(var(--cta))] hover:bg-[hsl(var(--cta))]/90 text-[hsl(var(--cta-foreground))] font-bold text-base h-12">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "List Product on Source →"}
          </Button>
        </form>
      </div>
    </DashboardShell>
  );
};

export default SourceListProduct;
