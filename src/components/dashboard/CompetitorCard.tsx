import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DollarSign,
  BarChart3,
  TrendingUp,
  Users,
  MoreVertical,
  Pencil,
  Trash2,
  ExternalLink,
  Lock,
} from "lucide-react";

interface CompetitorCardProps {
  competitor: {
    id: string;
    competitor_name: string;
    website_url?: string | null;
    category?: string | null;
  };
  analysis?: {
    status: string;
    analysis_data: any;
    last_analyzed_at?: string | null;
  } | null;
  isBlurred: boolean;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

export const CompetitorCard = ({
  competitor,
  analysis,
  isBlurred,
  onEdit,
  onRemove,
}: CompetitorCardProps) => {
  const navigate = useNavigate();
  const isAnalyzing = analysis?.status === "analyzing" || analysis?.status === "pending" || !analysis;
  const data = analysis?.analysis_data;

  const initials = competitor.competitor_name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const revenue = data?.financials?.revenue ?? "—";
  const marketShare = data?.market?.market_share ?? "—";
  const profitMargin = data?.financials?.net_margin ?? "—";
  const customers = data?.customers?.total_customers ?? "—";

  const marginValue = profitMargin !== "—" ? parseFloat(profitMargin) : null;
  const marginColor =
    marginValue !== null
      ? marginValue > 0
        ? "text-[hsl(142,71%,45%)]"
        : "text-destructive"
      : "text-muted-foreground";

  const lastUpdated = analysis?.last_analyzed_at
    ? new Date(analysis.last_analyzed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  if (isBlurred) {
    return (
      <Card className="relative overflow-hidden rounded-xl border border-border shadow-sm h-[320px]">
        <div className="filter blur-[5px] opacity-60 h-full p-0">
          <div className="h-[40px] bg-muted flex items-center px-4 gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20" />
            <span className="font-semibold text-sm text-foreground">{competitor.competitor_name}</span>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-5 w-20 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
          <Lock className="w-12 h-12 text-primary" />
          <h4 className="text-lg font-semibold text-foreground">Upgrade to Pro</h4>
          <p className="text-sm text-muted-foreground text-center px-6">
            Track up to 10 competitors
          </p>
          <Button
            onClick={() => navigate("/pricing")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Upgrade Now
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="overflow-hidden rounded-xl border border-border shadow-sm h-[320px] hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col"
      onClick={() => navigate(`/competitor-analysis/${competitor.id}`)}
    >
      {/* Top Section */}
      <div className="h-[40px] bg-muted flex items-center px-4 gap-3 shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
          {initials}
        </div>
        <span className="font-semibold text-sm text-foreground flex-1 truncate">
          {competitor.competitor_name}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(competitor.id); }}>
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onRemove(competitor.id); }}>
              <Trash2 className="w-4 h-4 mr-2" /> Remove
            </DropdownMenuItem>
            {competitor.website_url && (
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open(competitor.website_url!, "_blank"); }}>
                <ExternalLink className="w-4 h-4 mr-2" /> View Website
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Middle Section */}
      <div className="flex-1 p-4">
        {isAnalyzing ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
            <p className="col-span-2 text-xs text-muted-foreground animate-pulse mt-2">
              Analyzing competitor data...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <StatItem icon={<DollarSign className="w-4 h-4 text-muted-foreground" />} label="Revenue" value={revenue} />
            <StatItem icon={<BarChart3 className="w-4 h-4 text-muted-foreground" />} label="Market Share" value={marketShare} />
            <StatItem
              icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />}
              label="Profit Margin"
              value={profitMargin}
              valueClassName={marginColor}
            />
            <StatItem icon={<Users className="w-4 h-4 text-muted-foreground" />} label="Customers" value={customers} />
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="h-[40px] bg-muted flex items-center justify-between px-4 shrink-0">
        <span className="text-xs text-primary font-medium">View Full Analysis →</span>
        {lastUpdated && (
          <span className="text-[10px] text-muted-foreground">Updated: {lastUpdated}</span>
        )}
      </div>
    </Card>
  );
};

function StatItem({
  icon,
  label,
  value,
  valueClassName = "text-foreground",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`text-lg font-bold ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
}
