import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Wholesale pricing for a Source listing.
 *
 * Served by the `get_source_trade_terms` RPC rather than a direct select: the
 * columns are revoked for anon and authenticated at the database level, and the
 * function returns a row only when the caller is a retail buyer or the listing's
 * owner. Anyone else gets an empty result, so the values never reach the browser.
 *
 * Pass `enabled: false` to skip the round-trip entirely for visitors you already
 * know aren't entitled to it.
 */
export interface SourceTradeTerms {
  wholesale_price_min: number | null;
  wholesale_price_max: number | null;
  currency: string | null;
}

export function useSourceTradeTerms(slug: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ["source-trade-terms", slug],
    queryFn: async (): Promise<SourceTradeTerms | null> => {
      const { data, error } = await supabase.rpc("get_source_trade_terms", { p_slug: slug! });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      return (row as SourceTradeTerms | undefined) ?? null;
    },
    enabled: !!slug && enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
