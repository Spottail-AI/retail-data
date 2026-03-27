import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Heart, Trash2 } from "lucide-react";
import { BuyerShell } from "@/components/dashboard/BuyerShell";
import { toast } from "sonner";

const BuyerShortlist = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?redirect=/my-shortlist");
  }, [user, authLoading, navigate]);

  const { data: shortlisted = [], isLoading } = useQuery({
    queryKey: ["buyer-shortlist", user?.id],
    queryFn: async () => {
      // Get shortlisted product IDs
      const { data: shortlists, error: slError } = await supabase
        .from("source_shortlists")
        .select("product_id, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (slError) throw slError;
      if (!shortlists?.length) return [];

      // Fetch matching products
      const productIds = shortlists.map((s) => s.product_id);
      const { data: products, error: pError } = await supabase
        .from("source_products")
        .select("*")
        .in("id", productIds);

      if (pError) throw pError;

      return (products || []).map((p) => ({
        ...p,
        shortlisted_at: shortlists.find((s) => s.product_id === p.id)?.created_at,
      }));
    },
    enabled: !!user,
  });

  const handleRemove = async (productId: string) => {
    if (!user) return;
    await supabase
      .from("source_shortlists")
      .delete()
      .eq("product_id", productId)
      .eq("user_id", user.id);
    queryClient.invalidateQueries({ queryKey: ["buyer-shortlist", user.id] });
    toast.info("Removed from shortlist");
  };

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
            <Heart className="w-5 h-5 text-[#4f8ef7]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">My Shortlist</h1>
          </div>
          <p className="text-[#94a3b8] text-sm">Products you've saved from Spottail Source.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#4f8ef7]" />
          </div>
        ) : shortlisted.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-10 h-10 text-[#4f8ef7] mx-auto mb-3 opacity-40" />
            <p className="text-white font-semibold mb-1">No shortlisted products yet</p>
            <p className="text-[#94a3b8] text-sm mb-4">Browse Spottail Source to discover products.</p>
            <button
              onClick={() => navigate("/source")}
              className="px-5 py-2 rounded-lg bg-[#c5f135] text-[#0a0e1a] font-semibold text-sm hover:bg-[#c5f135]/90 transition-colors"
            >
              Browse Source
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {shortlisted.map((product: any) => (
              <div
                key={product.id}
                onClick={() => navigate(`/source/${product.slug}`)}
                className="bg-[#111827] border border-[#1e2d4a] rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#4f8ef7]/30 transition-all"
              >
                <div className="w-11 h-11 rounded-lg bg-[#1e2d4a] flex items-center justify-center text-xl shrink-0">
                  {product.product_images?.[0]?.startsWith?.("http") ? (
                    <img src={product.product_images[0]} alt="" className="w-full h-full rounded-lg object-cover" />
                  ) : (
                    <span>{product.product_images?.[0] || "📦"}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm truncate">{product.product_name}</h3>
                  <p className="text-[#94a3b8] text-xs truncate">{product.tagline}</p>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    {product.category && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1e2d4a] text-[#94a3b8]">
                        {product.category}
                      </span>
                    )}
                    {product.moq && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1e2d4a] text-[#94a3b8]">
                        MOQ: {product.moq}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(product.id);
                  }}
                  className="w-9 h-9 rounded-lg border border-[#1e2d4a] flex items-center justify-center text-[#64748b] hover:text-[#ff4f17] hover:border-[#ff4f17]/30 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </BuyerShell>
  );
};

export default BuyerShortlist;
