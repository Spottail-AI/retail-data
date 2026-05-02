import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Shield, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const REQUIREMENTS = [
  "Active business website with product pages",
  "Registered company or business entity",
  "Consistent branding across digital presence",
  "Valid business contact information",
];

const SourceVerifyBrand = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    company_name: "",
    website_url: "",
    business_registration: "",
    additional_info: "",
  });

  const { data: product } = useQuery({
    queryKey: ["source-product-verify", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("source_products")
        .select("id, product_name, user_id, is_verified, slug")
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Check existing request
  const { data: existingRequest } = useQuery({
    queryKey: ["verification-request", product?.id, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("verification_requests")
        .select("id, status")
        .eq("product_id", product!.id)
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!product && !!user,
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product) return;

    if (!form.company_name.trim() || !form.website_url.trim()) {
      toast({ title: "Company name and website are required", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("verification_requests").insert({
        product_id: product.id,
        user_id: user.id,
        company_name: form.company_name.trim(),
        website_url: form.website_url.trim(),
        business_registration: form.business_registration.trim() || null,
        additional_info: form.additional_info.trim() || null,
      });

      if (error) throw error;

      setSubmitted(true);
      toast({ title: "Verification request submitted!", description: "We'll review your application within 2–3 business days." });
    } catch (err: any) {
      toast({ title: "Failed to submit", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (product && product.is_verified) {
    return (
      <DashboardShell>
        <div className="max-w-[560px] mx-auto px-4 py-16 text-center">
          <CheckCircle className="w-12 h-12 text-[hsl(var(--success))] mx-auto mb-4" />
          <h1 className="text-xl font-extrabold text-foreground mb-2">Already Verified</h1>
          <p className="text-muted-foreground text-sm mb-6">This product already has the Verified Brand badge.</p>
          <Button variant="outline" onClick={() => navigate(`/source/${slug}`)}>
            View Product
          </Button>
        </div>
      </DashboardShell>
    );
  }

  if (submitted || (existingRequest && existingRequest.status === "pending")) {
    return (
      <DashboardShell>
        <div className="max-w-[560px] mx-auto px-4 py-16 text-center">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-xl font-extrabold text-foreground mb-2">Application Submitted</h1>
          <p className="text-muted-foreground text-sm mb-2">
            We'll review your verification request for <span className="text-foreground font-semibold">{product?.product_name}</span> within 2–3 business days.
          </p>
          <p className="text-muted-foreground text-xs mb-6">You'll receive an email notification once approved.</p>
          <Button variant="outline" onClick={() => navigate(`/source/${slug}/analytics`)}>
            Back to Analytics
          </Button>
        </div>
      </DashboardShell>
    );
  }

  if (existingRequest && existingRequest.status === "rejected") {
    return (
      <DashboardShell>
        <div className="max-w-[560px] mx-auto px-4 py-16 text-center">
          <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-extrabold text-foreground mb-2">Verification Declined</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Your previous verification request was not approved. Please contact support for more details.
          </p>
          <Button variant="outline" onClick={() => navigate(`/source/${slug}/analytics`)}>
            Back to Analytics
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-[560px] mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-extrabold text-foreground">Apply for Verified Brand</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">
          Verified brands earn a trust badge, priority in search results, and higher buyer engagement.
        </p>

        {/* Requirements */}
        <div className="bg-card border border-border rounded-xl p-5 mb-8">
          <h2 className="text-foreground font-bold text-sm mb-3">Requirements</h2>
          <ul className="space-y-2">
            {REQUIREMENTS.map((req) => (
              <li key={req} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--success))] mt-0.5 shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Company / Brand Name *</Label>
            <Input
              value={form.company_name}
              onChange={(e) => update("company_name", e.target.value)}
              placeholder="e.g. NatureCo Organics"
              maxLength={120}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Company Website *</Label>
            <Input
              type="url"
              value={form.website_url}
              onChange={(e) => update("website_url", e.target.value)}
              placeholder="https://yourcompany.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Business Registration Number (optional)</Label>
            <Input
              value={form.business_registration}
              onChange={(e) => update("business_registration", e.target.value)}
              placeholder="e.g. EIN, VAT, ABN"
              maxLength={60}
            />
          </div>

          <div className="space-y-2">
            <Label>Additional Information</Label>
            <Textarea
              value={form.additional_info}
              onChange={(e) => update("additional_info", e.target.value)}
              placeholder="Anything else you'd like us to know about your brand?"
              rows={3}
              maxLength={1000}
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Verification Request"}
          </Button>
        </form>
      </div>
    </DashboardShell>
  );
};

export default SourceVerifyBrand;
