import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Users, AlertCircle, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export const CompetitorAnalysisSection = () => {
  const { user } = useAuth();

  const { data: competitors, isLoading, isError, refetch } = useQuery({
    queryKey: ["competitors", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracked_competitors")
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
        <Skeleton className="h-48 w-full" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-card border-border p-6">
        <div className="flex items-center gap-2 text-destructive mb-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Failed to load competitors</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
      </Card>
    );
  }

  if (!competitors || competitors.length === 0) {
    return (
      <Card className="bg-card border-border p-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-warning" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Add competitors to start analyzing</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
          Track competitor pricing and positioning to find margin opportunities.
        </p>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Competitor
        </Button>
      </Card>
    );
  }

  const chartData = competitors.map((c) => ({
    name: c.competitor_name.length > 15 ? c.competitor_name.slice(0, 15) + "…" : c.competitor_name,
    priceChange: Number(c.last_price_change) || 0,
  }));

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Competitor Analysis</h3>
        <span className="text-xs text-muted-foreground">{competitors.length} tracked</span>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
            />
            <Bar dataKey="priceChange" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} name="Price Change %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
