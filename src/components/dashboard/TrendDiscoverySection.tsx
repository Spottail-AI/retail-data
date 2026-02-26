import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertCircle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrendResult {
  id: string;
  category: string;
  results: Array<{
    product_name?: string;
    growth_percentage?: number;
    momentum_score?: number;
    risk_level?: string;
  }>;
  created_at: string;
}

const getStatusTag = (growth: number) => {
  if (growth >= 80) return { label: "Overheated", className: "bg-destructive/10 text-destructive border-destructive/20" };
  if (growth >= 30) return { label: "Surging", className: "bg-[hsl(142,71%,45.3%,0.1)] text-[hsl(142,71%,45.3%)] border-[hsl(142,71%,45.3%,0.2)]" };
  return { label: "About to Trend", className: "bg-primary/10 text-primary border-primary/20" };
};

const MiniSparkline = () => (
  <svg width="48" height="20" viewBox="0 0 48 20" className="shrink-0">
    <polyline
      points="0,16 6,14 12,10 18,12 24,7 30,8 36,4 42,5 48,2"
      fill="none"
      stroke="hsl(142, 71%, 45.3%)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TrendDiscoverySection = () => {
  const { user } = useAuth();

  const { data: trends, isLoading, isError, refetch } = useQuery({
    queryKey: ["trend-discovery", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trend_results")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data as TrendResult[];
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <Card className="bg-card border-[#E6E8EB] p-6 shadow-sm">
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-36" />)}
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-card border-[#E6E8EB] p-6 shadow-sm">
        <div className="flex items-center gap-2 text-destructive mb-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Failed to load trends</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
      </Card>
    );
  }

  if (!trends || trends.length === 0) {
    return (
      <Card className="bg-card border-[#E6E8EB] p-8 text-center shadow-sm">
        <div className="mx-auto w-12 h-12 rounded-full bg-cta/10 flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6 text-cta" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Discover products about to trend</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
          Run a trend analysis to uncover emerging products with high growth potential.
        </p>
        <Button className="bg-cta hover:bg-cta/90 text-cta-foreground font-semibold">
          <Sparkles className="w-4 h-4 mr-2" />
          Run Trend Analysis
        </Button>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-[#E6E8EB] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Trend Discovery</h3>
        <span className="text-xs text-muted-foreground">{trends.length} recent analysis</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trends.map((trend) => {
          const results = Array.isArray(trend.results) ? trend.results : [];
          const topProduct = results[0];
          const growth = topProduct?.growth_percentage ?? 0;
          const status = getStatusTag(growth);

          return (
            <Card
              key={trend.id}
              className="bg-card border-[#E6E8EB] p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-foreground truncate">
                  {topProduct?.product_name || trend.category}
                </span>
                <MiniSparkline />
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xl font-bold text-[hsl(142,71%,45.3%)]">
                  +{growth.toFixed(0)}%
                </span>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${status.className}`}>
                  {status.label}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {results.length} product{results.length !== 1 ? "s" : ""} · {new Date(trend.created_at).toLocaleDateString()}
                </p>
                <Button variant="outline" size="sm" className="h-7 text-xs text-primary border-primary/30 hover:bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Track
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
};
