import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Truck, Users, Sparkles, ArrowUp, ArrowDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface KpiCardProps {
  title: string;
  value: number | null;
  change?: number;
  subtitle: string;
  icon: React.ReactNode;
  loading: boolean;
  error: boolean;
  onRetry?: () => void;
  onClick?: () => void;
  onEmptyCta?: () => void;
  emptyCta: string;
  accentColor: string;
}

const MiniSparkline = ({ positive }: { positive: boolean }) => {
  const points = positive
    ? "0,16 4,14 8,12 12,13 16,9 20,10 24,6 28,7 32,3"
    : "0,3 4,5 8,7 12,6 16,10 20,9 24,13 28,12 32,16";
  return (
    <svg width="36" height="20" viewBox="0 0 36 20" className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "hsl(142, 71%, 45.3%)" : "hsl(0, 84.2%, 60.2%)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const KpiCard = ({
  title, value, change, subtitle, icon, loading, error,
  onRetry, onClick, onEmptyCta, emptyCta, accentColor
}: KpiCardProps) => {
  if (loading) {
    return (
      <Card className="bg-card border-[#E6E8EB] p-6 space-y-3 shadow-sm">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-3 w-32" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border-[#E6E8EB] p-6 shadow-sm">
        <div className="flex items-center gap-2 text-destructive mb-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Failed to load</span>
        </div>
        <Button variant="outline" size="sm" onClick={onRetry}>Retry</Button>
      </Card>
    );
  }

  if (value === null || value === 0) {
    return (
      <Card className="bg-card border-[#E6E8EB] p-6 shadow-sm flex flex-col items-center justify-center min-h-[130px]">
        <Button variant="outline" size="sm" onClick={onEmptyCta} className="text-xs text-primary border-primary/30 hover:bg-primary/5">
          {emptyCta}
        </Button>
      </Card>
    );
  }

  const isPositive = (change ?? 0) >= 0;
  const changeAbs = Math.abs(change ?? 0);

  return (
    <Card
      className="bg-card border-[#E6E8EB] p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">{title}</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            <div className={`flex items-center gap-0.5 text-xs font-semibold ${isPositive ? "text-[hsl(142,71%,45.3%)]" : "text-destructive"}`}>
              {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {changeAbs > 0 ? `${changeAbs}%` : "—"}
            </div>
          </div>
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        </div>
        <MiniSparkline positive={isPositive} />
      </div>
    </Card>
  );
};

export const KpiCards = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: trackedProducts, isLoading: loadingProducts, isError: errorProducts, refetch: refetchProducts } = useQuery({
    queryKey: ["tracked-products-kpi", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracked_products")
        .select("id, price_change_pct")
        .eq("user_id", user!.id);
      if (error) throw error;
      const active = data?.filter(p => Math.abs(Number(p.price_change_pct) || 0) > 2) ?? [];
      const avgChange = active.length > 0
        ? active.reduce((sum, p) => sum + (Number(p.price_change_pct) || 0), 0) / active.length
        : 0;
      return { count: active.length, avgChange: Math.round(avgChange * 10) / 10 };
    },
    enabled: !!user,
  });

  const { data: supplierData, isLoading: loadingSuppliers, isError: errorSuppliers, refetch: refetchSuppliers } = useQuery({
    queryKey: ["suppliers-kpi", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("suppliers")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id);
      if (error) throw error;
      return { count: count ?? 0 };
    },
    enabled: !!user,
  });

  const { data: competitorData, isLoading: loadingCompetitors, isError: errorCompetitors, refetch: refetchCompetitors } = useQuery({
    queryKey: ["competitors-kpi", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracked_competitors")
        .select("id, last_price_change")
        .eq("user_id", user!.id);
      if (error) throw error;
      const avgChange = data && data.length > 0
        ? data.reduce((sum, c) => sum + (Number(c.last_price_change) || 0), 0) / data.length
        : 0;
      return { count: data?.length ?? 0, avgChange: Math.round(avgChange * 10) / 10 };
    },
    enabled: !!user,
  });

  const { data: trendData, isLoading: loadingTrends, isError: errorTrends, refetch: refetchTrends } = useQuery({
    queryKey: ["trend-signals-kpi", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("trend_results")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id);
      if (error) throw error;
      return { count: count ?? 0 };
    },
    enabled: !!user,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        title="Price Movements"
        value={trackedProducts?.count ?? null}
        change={trackedProducts?.avgChange}
        subtitle="Products with significant changes"
        icon={<TrendingUp className="w-4 h-4" />}
        accentColor="primary"
        loading={loadingProducts}
        error={errorProducts}
        emptyCta="Add Products"
        onRetry={() => refetchProducts()}
        onClick={() => navigate("/dashboard/prices")}
        onEmptyCta={() => navigate("/dashboard/prices")}
      />
      <KpiCard
        title="Suppliers Found"
        value={supplierData?.count ?? null}
        change={5}
        subtitle="Matching your tracked products"
        icon={<Truck className="w-4 h-4" />}
        accentColor="success"
        loading={loadingSuppliers}
        error={errorSuppliers}
        emptyCta="Search Suppliers"
        onRetry={() => refetchSuppliers()}
        onClick={() => navigate("/dashboard/suppliers")}
        onEmptyCta={() => navigate("/dashboard/suppliers")}
      />
      <KpiCard
        title="Competitor Changes"
        value={competitorData?.count ?? null}
        change={competitorData?.avgChange}
        subtitle="Detected positioning shifts"
        icon={<Users className="w-4 h-4" />}
        accentColor="warning"
        loading={loadingCompetitors}
        error={errorCompetitors}
        emptyCta="Add Competitors"
        onRetry={() => refetchCompetitors()}
        onClick={() => navigate("/dashboard/competitors")}
        onEmptyCta={() => navigate("/dashboard/competitors")}
      />
      <KpiCard
        title="Trend Signals"
        value={trendData?.count ?? null}
        change={12}
        subtitle="Products exceeding growth threshold"
        icon={<Sparkles className="w-4 h-4" />}
        accentColor="cta"
        loading={loadingTrends}
        error={errorTrends}
        emptyCta="Explore Trends"
        onRetry={() => refetchTrends()}
        onClick={() => navigate("/dashboard/trends")}
        onEmptyCta={() => navigate("/dashboard/trends")}
      />
    </div>
  );
};
