import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, ChevronUp, MessageSquare, Link2, Copy, Check, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const SourceProductAnalytics = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["source-product-analytics", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("source_products")
        .select("*")
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Views count
  const { data: viewCount = 0 } = useQuery({
    queryKey: ["product-views", product?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("source_product_views")
        .select("*", { count: "exact", head: true })
        .eq("product_id", product!.id);
      return count || 0;
    },
    enabled: !!product,
  });

  // Vote counts
  const { data: votes = { buyer: 0, community: 0 } } = useQuery({
    queryKey: ["product-votes", product?.id],
    queryFn: async () => {
      const [b, c] = await Promise.all([
        supabase.from("source_buyer_votes").select("*", { count: "exact", head: true }).eq("product_id", product!.id),
        supabase.from("source_community_votes").select("*", { count: "exact", head: true }).eq("product_id", product!.id).eq("verified", true),
      ]);
      return { buyer: b.count || 0, community: c.count || 0 };
    },
    enabled: !!product,
  });

  // Enquiry count
  const { data: enquiryCount = 0 } = useQuery({
    queryKey: ["product-enquiries", product?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("source_enquiries")
        .select("*", { count: "exact", head: true })
        .eq("product_id", product!.id);
      return count || 0;
    },
    enabled: !!product,
  });

  const voteLink = product ? `${window.location.origin}/source/${product.slug}/vote` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(voteLink);
    setCopied(true);
    toast({ title: "Vote link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    navigate("/auth?redirect=/source/analytics");
    return null;
  }

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardShell>
    );
  }

  if (!product || product.user_id !== user.id) {
    return (
      <DashboardShell>
        <div className="text-center py-20">
          <h2 className="text-foreground font-bold text-lg">Product not found</h2>
          <p className="text-muted-foreground text-sm mt-1">You can only view analytics for your own listings.</p>
        </div>
      </DashboardShell>
    );
  }

  const stats = [
    { label: "Page Views", value: viewCount, icon: Eye, color: "text-primary" },
    { label: "Buyer Votes", value: votes.buyer, icon: ChevronUp, color: "text-primary" },
    { label: "Community Votes", value: votes.community, icon: ChevronUp, color: "text-muted-foreground" },
    { label: "Enquiries", value: enquiryCount, icon: MessageSquare, color: "text-[hsl(var(--cta))]" },
  ];

  return (
    <DashboardShell>
      <div className="max-w-[800px] mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-xl font-extrabold text-foreground mb-1">{product.product_name}</h1>
        <p className="text-muted-foreground text-sm mb-8">Listing Analytics</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={cn("w-4 h-4", s.color)} />
                <span className="text-muted-foreground text-xs">{s.label}</span>
              </div>
              <p className="text-foreground text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Shareable Vote Link */}
        <div className="bg-card border border-border rounded-xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="w-4 h-4 text-primary" />
            <h2 className="text-foreground font-bold text-sm">Shareable Vote Link</h2>
          </div>
          <p className="text-muted-foreground text-xs mb-3">
            Share this link on social media, newsletters, or your website. Anyone can vote — no Spottail account required.
          </p>
          <div className="flex gap-2">
            <Input
              readOnly
              value={voteLink}
              className="font-mono text-xs bg-secondary border-border"
            />
            <Button
              onClick={copyLink}
              variant="outline"
              className="shrink-0 gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        {/* Verified Badge Status */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-primary" />
            <h2 className="text-foreground font-bold text-sm">Verified Brand Status</h2>
          </div>
          {product.is_verified ? (
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                ✓ Verified
              </span>
              <span className="text-muted-foreground text-xs">Your brand is verified and displays the badge.</span>
            </div>
          ) : (
            <div>
              <p className="text-muted-foreground text-xs mb-3">
                Verified brands get a trust badge, priority placement, and higher conversion rates.
              </p>
              <Button
                onClick={() => navigate(`/source/${slug}/verify`)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm"
              >
                Apply for Verification
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
};

export default SourceProductAnalytics;
