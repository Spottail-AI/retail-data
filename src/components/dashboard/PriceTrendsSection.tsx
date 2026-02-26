import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertCircle, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export const PriceTrendsSection = () => {
  const { user } = useAuth();

  const { data: products, isLoading, isError, refetch } = useQuery({
    queryKey: ["tracked-products", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracked_products")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <Card className="bg-card border-border p-6">
        <Skeleton className="h-5 w-40 mb-4" />
        <Skeleton className="h-64 w-full" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-card border-border p-6">
        <div className="flex items-center gap-2 text-destructive mb-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Failed to load price data</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">Something went wrong fetching your tracked products.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
      </Card>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card className="bg-card border-border p-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Track a product to unlock price insights</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
          Start tracking commodity or product prices to see trends, volatility analysis, and AI-generated insights.
        </p>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Product
        </Button>
      </Card>
    );
  }

  // Build chart data from tracked products
  const chartData = products.map((p) => ({
    name: p.product_name.length > 12 ? p.product_name.slice(0, 12) + "…" : p.product_name,
    current: Number(p.current_price) || 0,
    previous: Number(p.previous_price) || 0,
  }));

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">Price Trends</h3>
          <p className="text-xs text-muted-foreground mt-1">{products.length} tracked product{products.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
            />
            <Line type="monotone" dataKey="current" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} name="Current Price" />
            <Line type="monotone" dataKey="previous" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Previous Price" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insight */}
      <div className="mt-4 p-4 rounded-lg bg-accent/50 border border-border">
        <p className="text-xs font-medium text-primary mb-1">AI Insight</p>
        <p className="text-sm text-muted-foreground">
          {products.some(p => Math.abs(Number(p.price_change_pct) || 0) > 5)
            ? `Significant price movement detected across ${products.filter(p => Math.abs(Number(p.price_change_pct) || 0) > 5).length} product(s). Review your pricing strategy.`
            : "Prices across your tracked products are stable. No major volatility detected."}
        </p>
      </div>
    </Card>
  );
};
