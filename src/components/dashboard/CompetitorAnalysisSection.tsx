import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Users, AlertCircle, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

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
      <Card className="bg-card border-[#E6E8EB] p-6 shadow-sm">
        <Skeleton className="h-5 w-40 mb-4" />
        <Skeleton className="h-48 w-full" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-card border-[#E6E8EB] p-6 shadow-sm">
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
      <Card className="bg-card border-[#E6E8EB] p-8 text-center shadow-sm">
        <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(38,92%,50%,0.1)] flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-[hsl(38,92%,50%)]" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Add competitors to start analyzing</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
          Track competitor pricing and positioning to find margin opportunities.
        </p>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Competitor
        </Button>
      </Card>
    );
  }

  // Add a "You" entry at the start for positioning comparison
  const chartData = [
    { name: "You", priceChange: 0, isYou: true },
    ...competitors.map((c) => ({
      name: c.competitor_name.length > 12 ? c.competitor_name.slice(0, 12) + "…" : c.competitor_name,
      priceChange: Number(c.last_price_change) || 0,
      isYou: false,
    })),
  ];

  // Find best margin opportunity
  const maxChange = Math.max(...competitors.map(c => Math.abs(Number(c.last_price_change) || 0)));

  return (
    <Card className="bg-card border-[#E6E8EB] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Competitor Analysis</h3>
          <span className="text-xs text-muted-foreground">{competitors.length} tracked</span>
        </div>
        {maxChange > 0 && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[hsl(142,71%,45.3%,0.1)] text-[hsl(142,71%,45.3%)]">
            {maxChange.toFixed(1)}% margin opportunity
          </span>
        )}
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6E8EB" />
            <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 11 }} axisLine={{ stroke: "#E6E8EB" }} tickLine={false} />
            <YAxis tick={{ fill: "#555", fontSize: 11 }} axisLine={{ stroke: "#E6E8EB" }} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E6E8EB",
                borderRadius: "8px",
                color: "#111",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <Bar dataKey="priceChange" radius={[4, 4, 0, 0]} name="Price Change %">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isYou ? "hsl(217, 100%, 65.5%)" : "#CBD5E1"}
                  strokeWidth={entry.isYou ? 2 : 0}
                  stroke={entry.isYou ? "hsl(217, 100%, 55%)" : "none"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
