import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";
import { BuyerShell } from "@/components/dashboard/BuyerShell";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: "Awaiting Reply", icon: <Clock className="w-3.5 h-3.5" />, color: "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20" },
  replied: { label: "Replied", icon: <CheckCircle className="w-3.5 h-3.5" />, color: "text-[#4ade80] bg-[#4ade80]/10 border-[#4ade80]/20" },
  declined: { label: "Declined", icon: <XCircle className="w-3.5 h-3.5" />, color: "text-[#f87171] bg-[#f87171]/10 border-[#f87171]/20" },
};

const BuyerEnquiries = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?redirect=/enquiries");
  }, [user, authLoading, navigate]);

  const { data: enquiries = [], isLoading } = useQuery({
    queryKey: ["buyer-enquiries", user?.id],
    queryFn: async () => {
      const { data: enqs, error } = await supabase
        .from("source_enquiries")
        .select("*")
        .eq("buyer_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!enqs?.length) return [];

      // Fetch product details
      const productIds = [...new Set(enqs.map((e) => e.product_id))];
      const { data: products } = await supabase
        .from("source_products")
        .select("id, product_name, slug, tagline, product_images")
        .in("id", productIds);

      const productMap = new Map((products || []).map((p) => [p.id, p]));
      return enqs.map((e) => ({
        ...e,
        product: productMap.get(e.product_id),
      }));
    },
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#4f8ef7]" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <BuyerShell>
      <main className="max-w-[900px] mx-auto p-4 sm:p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-[#4f8ef7]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">Enquiries</h1>
          </div>
          <p className="text-[#94a3b8] text-sm">Track your sample requests and supplier conversations.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#4f8ef7]" />
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-10 h-10 text-[#4f8ef7] mx-auto mb-3 opacity-40" />
            <p className="text-white font-semibold mb-1">No enquiries yet</p>
            <p className="text-[#94a3b8] text-sm mb-4">Send your first sample request from a product page.</p>
            <button
              onClick={() => navigate("/source")}
              className="px-5 py-2 rounded-lg bg-[#c5f135] text-[#0a0e1a] font-semibold text-sm hover:bg-[#c5f135]/90 transition-colors"
            >
              Browse Source
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {enquiries.map((enq: any) => {
              const status = statusConfig[enq.status] || statusConfig.pending;
              const product = enq.product;

              return (
                <div
                  key={enq.id}
                  onClick={() => product && navigate(`/source/${product.slug}`)}
                  className="bg-[#111827] border border-[#1e2d4a] rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#4f8ef7]/30 transition-all"
                >
                  <div className="w-11 h-11 rounded-lg bg-[#1e2d4a] flex items-center justify-center text-xl shrink-0">
                    {product?.product_images?.[0]?.startsWith?.("http") ? (
                      <img src={product.product_images[0]} alt="" className="w-full h-full rounded-lg object-cover" />
                    ) : (
                      <span>{product?.product_images?.[0] || "📦"}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm truncate">
                      {product?.product_name || "Product"}
                    </h3>
                    <p className="text-[#94a3b8] text-xs truncate mt-0.5">{enq.message || "Sample request sent"}</p>
                    <p className="text-[#64748b] text-[10px] mt-1">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap",
                      status.color
                    )}
                  >
                    {status.icon}
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </BuyerShell>
  );
};

export default BuyerEnquiries;
