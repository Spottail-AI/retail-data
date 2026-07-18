import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
const db = supabase as any;

/** Resolves a legacy saved-search list URL to its migrated product pipeline. */
const LegacyListRedirect = () => {
  const { listId } = useParams<{ listId: string }>();
  const [target, setTarget] = useState<string | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    (async () => {
      if (!listId) { setFallback(true); return; }
      const { data } = await db
        .from("pipeline_searches")
        .select("product_id")
        .eq("legacy_list_id", listId)
        .maybeSingle();
      if (data?.product_id) setTarget(`/pipeline/${data.product_id}`);
      else setFallback(true);
    })();
  }, [listId]);

  if (target) return <Navigate to={target} replace />;
  if (fallback) return <Navigate to={`/stockists/${listId}/legacy`} replace />;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
};

export default LegacyListRedirect;
