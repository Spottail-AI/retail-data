import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Truck, Users, Sparkles, ArrowUpRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface KpiCardProps {
  title: string;
  value: number | null;
  subtitle: string;
  icon: React.ReactNode;
  loading: boolean;
  error: boolean;
  emptyMessage: string;
  emptyCta: string;
  onRetry?: () => void;
  onClick?: () => void;
  onEmptyCta?: () => void;
  color: string;
}

const KpiCard = ({
  title, value, subtitle, icon, loading, error, emptyMessage, emptyCta,
  onRetry, onClick, onEmptyCta, color
}: KpiCardProps) => {
  if (loading) {
    return (
      <Card className="bg-card border-border p-6 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-32" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border-border p-6">
        <div className="flex items-center gap-2 text-destructive mb-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Failed to load</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">Could not fetch {title.toLowerCase()} data.</p>
        <Button variant="outline" size="sm" onClick={onRetry}>Retry</Button>
      </Card>
    );
  }

  if (value === null || value === 0) {
    return (
      <Card className="bg-card border-border p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1.5 rounded-lg ${color}`}>{icon}</div>
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">{emptyMessage}</p>
        <Button variant="outline" size="sm" onClick={onEmptyCta} className="text-xs">{emptyCta}</Button>
      </Card>
    );
  }

  return (
    <Card
      className="bg-card border-border p-6 hover:border-primary/30 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${color}`}>{icon}</div>
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </Card>
  );
};

export const KpiCards = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: trackedProducts, isLoading: loadingProducts, isError: errorProducts, refetch: refetchProducts } = useQuery({
    queryKey: ["tracked-products-count", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracked_products")
        .select("id, price_change_pct")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data?.filter(p => Math.abs(Number(p.price_change_pct) || 0) > 2).length ?? 0;
    },
    enabled: !!user,
  });

  const { data: supplierCount, isLoading: loadingSuppliers, isError: errorSuppliers, refetch: refetchSuppliers } = useQuery({
    queryKey: ["suppliers-count", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("suppliers")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: competitorCount, isLoading: loadingCompetitors, isError: errorCompetitors, refetch: refetchCompetitors } = useQuery({
    queryKey: ["competitors-count", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("tracked_competitors")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: trendCount, isLoading: loadingTrends, isError: errorTrends, refetch: refetchTrends } = useQuery({
    queryKey: ["trend-signals-count", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("trend_results")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        title="Price Movements"
        value={trackedProducts ?? null}
        subtitle="Products with significant changes"
        icon={<TrendingUp className="w-4 h-4 text-primary" />}
        color="bg-primary/10"
        loading={loadingProducts}
        error={errorProducts}
        emptyMessage="Track products to see price movements."
        emptyCta="Add Products"
        onRetry={() => refetchProducts()}
        onClick={() => navigate("/dashboard/prices")}
        onEmptyCta={() => navigate("/dashboard/prices")}
      />
      <KpiCard
        title="Suppliers Found"
        value={supplierCount ?? null}
        subtitle="Matching your tracked products"
        icon={<Truck className="w-4 h-4 text-success" />}
        color="bg-success/10"
        loading={loadingSuppliers}
        error={errorSuppliers}
        emptyMessage="Find suppliers for your products."
        emptyCta="Search Suppliers"
        onRetry={() => refetchSuppliers()}
        onClick={() => navigate("/dashboard/suppliers")}
        onEmptyCta={() => navigate("/dashboard/suppliers")}
      />
      <KpiCard
        title="Competitor Changes"
        value={competitorCount ?? null}
        subtitle="Detected positioning shifts"
        icon={<Users className="w-4 h-4 text-warning" />}
        color="bg-warning/10"
        loading={loadingCompetitors}
        error={errorCompetitors}
        emptyMessage="Add competitors to track changes."
        emptyCta="Add Competitors"
        onRetry={() => refetchCompetitors()}
        onClick={() => navigate("/dashboard/competitors")}
        onEmptyCta={() => navigate("/dashboard/competitors")}
      />
      <KpiCard
        title="Trend Signals"
        value={trendCount ?? null}
        subtitle="Products exceeding growth threshold"
        icon={<Sparkles className="w-4 h-4 text-cta" />}
        color="bg-cta/10"
        loading={loadingTrends}
        error={errorTrends}
        emptyMessage="Discover trending products."
        emptyCta="Explore Trends"
        onRetry={() => refetchTrends()}
        onClick={() => navigate("/dashboard/trends")}
        onEmptyCta={() => navigate("/dashboard/trends")}
      />
    </div>
  );
};
