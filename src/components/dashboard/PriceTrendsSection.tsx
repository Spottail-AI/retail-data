import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertCircle, Plus, Sparkles, ArrowUp, ArrowDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Area, AreaChart } from "recharts";

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
      <Card className="bg-card border-[#E6E8EB] p-6 shadow-sm">
        <Skeleton className="h-5 w-40 mb-4" />
        <Skeleton className="h-64 w-full" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-card border-[#E6E8EB] p-6 shadow-sm">
        <div className="flex items-center gap-2 text-destructive mb-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Failed to load price data</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
      </Card>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card className="bg-card border-[#E6E8EB] p-8 text-center shadow-sm">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Track a product to unlock price insights</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
          Start tracking commodity or product prices to see trends, volatility analysis, and AI-generated insights.
        </p>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Product
        </Button>
      </Card>
    );
  }

  // Build chart data
  const chartData = products.map((p) => ({
    name: p.product_name.length > 12 ? p.product_name.slice(0, 12) + "…" : p.product_name,
    current: Number(p.current_price) || 0,
    previous: Number(p.previous_price) || 0,
  }));

  // Overall change
  const totalCurrent = products.reduce((s, p) => s + (Number(p.current_price) || 0), 0);
  const totalPrevious = products.reduce((s, p) => s + (Number(p.previous_price) || 0), 0);
  const overallChange = totalPrevious > 0 ? ((totalCurrent - totalPrevious) / totalPrevious) * 100 : 0;
  const isPositive = overallChange >= 0;

  return (
    <Card className="bg-card border-[#E6E8EB] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">Price Trends</h3>
          <p className="text-xs text-muted-foreground mt-1">{products.length} tracked product{products.length !== 1 ? "s" : ""}</p>
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${isPositive ? "bg-[hsl(142,71%,45.3%,0.1)] text-[hsl(142,71%,45.3%)]" : "bg-destructive/10 text-destructive"}`}>
          {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(Math.round(overallChange * 10) / 10)}%
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="primaryFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(217, 100%, 65.5%)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="hsl(217, 100%, 65.5%)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6E8EB" />
            <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 12 }} axisLine={{ stroke: "#E6E8EB" }} tickLine={false} />
            <YAxis tick={{ fill: "#555", fontSize: 12 }} axisLine={{ stroke: "#E6E8EB" }} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E6E8EB",
                borderRadius: "8px",
                color: "#111",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="line"
              wrapperStyle={{ fontSize: "12px", color: "#666" }}
            />
            <Area type="monotone" dataKey="current" stroke="hsl(217, 100%, 65.5%)" strokeWidth={2.5} fill="url(#primaryFill)" name="Current Price" dot={{ r: 3, fill: "hsl(217, 100%, 65.5%)" }} />
            <Area type="monotone" dataKey="previous" stroke="#A0AEC0" strokeWidth={1.5} strokeDasharray="4 4" fill="none" name="Previous Price" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insight */}
      <div className="mt-6 p-6 rounded-lg bg-[hsl(217,100%,65.5%,0.05)] border border-[hsl(217,100%,65.5%,0.15)]">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-md bg-primary/10 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">AI Insight</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {products.some(p => Math.abs(Number(p.price_change_pct) || 0) > 5)
                ? `Significant price movement detected across ${products.filter(p => Math.abs(Number(p.price_change_pct) || 0) > 5).length} product(s). Review your pricing strategy.`
                : "Prices across your tracked products are stable. No major volatility detected."}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
