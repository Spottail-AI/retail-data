import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertCircle, TrendingUp, ArrowUpRight } from "lucide-react";
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
      <Card className="bg-card border-border p-6">
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-card border-border p-6">
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
      <Card className="bg-card border-border p-8 text-center">
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
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Trend Discovery</h3>
        <span className="text-xs text-muted-foreground">{trends.length} recent analysis</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {trends.map((trend) => {
          const resultCount = Array.isArray(trend.results) ? trend.results.length : 0;
          return (
            <Card key={trend.id} className="bg-accent/30 border-border p-4 hover:border-primary/30 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">{trend.category}</Badge>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-foreground">{resultCount} product{resultCount !== 1 ? "s" : ""} found</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(trend.created_at).toLocaleDateString()}
              </p>
            </Card>
          );
        })}
      </div>
    </Card>
  );
};
