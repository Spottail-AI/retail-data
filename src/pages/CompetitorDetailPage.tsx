import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, RefreshCw, ExternalLink, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const COLORS = ["hsl(217,100%,65%)", "#CBD5E1", "#94A3B8", "#64748B", "#475569"];

const CompetitorDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { data: competitor } = useQuery({
    queryKey: ["competitor", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracked_competitors")
        .select("*")
        .eq("id", id!)
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!id,
  });

  const { data: analysis, isLoading } = useQuery({
    queryKey: ["competitor-analysis", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("competitor_analysis")
        .select("*")
        .eq("competitor_id", id!)
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!id,
  });

  const handleRefresh = async () => {
    if (!id || refreshing) return;
    setRefreshing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await supabase.functions.invoke("analyze-competitor", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { competitor_id: id },
      });
      queryClient.invalidateQueries({ queryKey: ["competitor-analysis", id] });
      toast({ title: "Analysis refreshed" });
    } catch {
      toast({ title: "Refresh failed", variant: "destructive" });
    } finally {
      setRefreshing(false);
    }
  };

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, [analysis]);

  const d = analysis?.analysis_data as Record<string, any> | undefined;
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "financials", label: "Financial Performance" },
    { id: "market", label: "Market Position" },
    { id: "customers", label: "Customer Intelligence" },
    { id: "digital", label: "Digital Presence" },
    { id: "advantages", label: "Competitive Advantages" },
  ];

  const scrollTo = (sectionId: string) => {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const lastAnalyzed = analysis?.last_analyzed_at
    ? new Date(analysis.last_analyzed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const initials = competitor?.competitor_name
    ?.split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "";

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/competitor-analysis")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Competitors
        </Button>
        <div className="flex items-center gap-2">
          {lastAnalyzed && (
            <span className="text-xs text-muted-foreground">Last analyzed: {lastAnalyzed}</span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />}
            Refresh
          </Button>
        </div>
      </div>

      {isLoading || !d ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Sidebar Nav (desktop only) */}
          <nav className="hidden lg:block w-48 shrink-0 sticky top-24 self-start space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === s.id
                    ? "bg-primary/10 text-primary border-l-2 border-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>

          {/* Main Content */}
          <div className="flex-1 space-y-8 min-w-0">
            {/* OVERVIEW */}
            <section id="overview" ref={(el) => { sectionRefs.current.overview = el; }}>
              <Card className="p-6 border-border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{competitor?.competitor_name}</h2>
                    {competitor?.website_url && (
                      <a
                        href={competitor.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                      >
                        {competitor.website_url} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {d.overview?.industry && (
                      <p className="text-sm text-muted-foreground mt-1">{d.overview.industry}</p>
                    )}
                  </div>
                </div>

                {d.overview?.description && (
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{d.overview.description}</p>
                )}

                {/* Quick facts */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    { label: "Employees", value: d.overview?.employees },
                    { label: "Countries", value: d.overview?.countries },
                    { label: "Founded", value: d.overview?.founded },
                  ].map((f) => (
                    <div key={f.label} className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">{f.label}</p>
                      <p className="text-lg font-bold text-foreground">{f.value ?? "—"}</p>
                    </div>
                  ))}
                </div>

                {/* USPs */}
                {d.overview?.usps && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {d.overview.usps.map((usp: string, i: number) => (
                      <Badge key={i} className="bg-primary/10 text-primary border-primary/20">{usp}</Badge>
                    ))}
                  </div>
                )}

                {/* Competitive Edge */}
                {d.overview?.competitive_edge && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Competitive Edge</h4>
                    <p className="text-sm text-muted-foreground mb-2">{d.overview.competitive_edge}</p>
                    {d.overview.competitive_edge_points && (
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {d.overview.competitive_edge_points.map((p: string, i: number) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </Card>
            </section>

            {/* FINANCIALS */}
            <section id="financials" ref={(el) => { sectionRefs.current.financials = el; }}>
              <h3 className="text-xl font-bold text-foreground mb-4">Financial Performance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <MetricCard
                  label="Annual Revenue"
                  value={d.financials?.revenue}
                  subtitle={d.financials?.revenue_year}
                  trend={d.financials?.revenue_growth_yoy}
                />
                <MetricCard label="Gross Margin" value={d.financials?.gross_margin} />
                <MetricCard label="Net Margin" value={d.financials?.net_margin} />
              </div>
              {d.financials?.financial_health_score != null && (
                <Card className="p-4 border-border">
                  <p className="text-sm text-muted-foreground mb-2">Financial Health Score</p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-foreground">{d.financials.financial_health_score}/100</span>
                    <Progress
                      value={d.financials.financial_health_score}
                      className="flex-1 h-3"
                    />
                  </div>
                </Card>
              )}
            </section>

            {/* MARKET */}
            <section id="market" ref={(el) => { sectionRefs.current.market = el; }}>
              <h3 className="text-xl font-bold text-foreground mb-4">Market Position</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Card className="p-4 border-border">
                  <p className="text-sm text-muted-foreground">Market Share</p>
                  <p className="text-2xl font-bold text-foreground">{d.market?.market_share ?? "—"}</p>
                  {d.market?.market_name && (
                    <p className="text-xs text-muted-foreground">{d.market.market_name}</p>
                  )}
                  {d.market?.market_rank && (
                    <Badge variant="secondary" className="mt-2">Rank #{d.market.market_rank}</Badge>
                  )}
                </Card>
                {d.market?.top_competitors && d.market.top_competitors.length > 0 && (
                  <Card className="p-4 border-border">
                    <p className="text-sm text-muted-foreground mb-2">Market Breakdown</p>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: competitor?.competitor_name, value: parseFloat(d.market.market_share) || 10 },
                              ...d.market.top_competitors.slice(0, 4).map((c: any) => ({
                                name: c.name,
                                value: parseFloat(c.market_share) || 5,
                              })),
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            dataKey="value"
                            label={({ name }) => name?.slice(0, 10)}
                          >
                            {[0, 1, 2, 3, 4].map((i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                )}
              </div>
            </section>

            {/* CUSTOMERS */}
            <section id="customers" ref={(el) => { sectionRefs.current.customers = el; }}>
              <h3 className="text-xl font-bold text-foreground mb-4">Customer Intelligence</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <MetricCard label="Total Customers" value={d.customers?.total_customers} />
                <MetricCard
                  label="Avg Rating"
                  value={d.customers?.avg_rating != null ? `${d.customers.avg_rating}/5.0` : null}
                  subtitle={d.customers?.total_reviews ? `from ${d.customers.total_reviews} reviews` : undefined}
                />
                <MetricCard
                  label="NPS Score"
                  value={d.customers?.nps_score != null ? String(d.customers.nps_score) : null}
                  subtitle={d.customers?.nps_score != null ? (d.customers.nps_score >= 50 ? "Excellent" : d.customers.nps_score >= 0 ? "Good" : "Needs Work") : undefined}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {d.customers?.positive_themes && (
                  <Card className="p-4 border-border">
                    <h4 className="font-semibold text-foreground mb-2 text-sm">Positive Themes</h4>
                    <div className="space-y-2">
                      {d.customers.positive_themes.map((t: any, i: number) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-sm text-foreground">{t.theme}</span>
                          <span className="text-sm font-medium text-[hsl(142,71%,45%)]">{t.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
                {d.customers?.negative_themes && (
                  <Card className="p-4 border-border">
                    <h4 className="font-semibold text-foreground mb-2 text-sm">Negative Themes</h4>
                    <div className="space-y-2">
                      {d.customers.negative_themes.map((t: any, i: number) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-sm text-foreground">{t.theme}</span>
                          <span className="text-sm font-medium text-destructive">{t.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </section>

            {/* DIGITAL */}
            <section id="digital" ref={(el) => { sectionRefs.current.digital = el; }}>
              <h3 className="text-xl font-bold text-foreground mb-4">Digital Presence</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <MetricCard label="Monthly Visitors" value={d.digital?.monthly_visitors} />
                <MetricCard label="Domain Authority" value={d.digital?.domain_authority != null ? `${d.digital.domain_authority}/100` : null} />
                <MetricCard label="Referring Domains" value={d.digital?.referring_domains} />
                <MetricCard label="Mobile Score" value={d.digital?.mobile_score != null ? `${d.digital.mobile_score}/100` : null} />
              </div>

              {d.digital?.social_media && (
                <Card className="p-4 border-border mb-4">
                  <h4 className="font-semibold text-foreground mb-3 text-sm">Social Media</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(d.digital.social_media).map(([platform, info]: [string, any]) => (
                      <div key={platform} className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground capitalize">{platform}</p>
                        <p className="text-lg font-bold text-foreground">{info?.followers ?? "—"}</p>
                        {info?.growth && (
                          <p className={`text-xs font-medium ${info.growth.startsWith("+") ? "text-[hsl(142,71%,45%)]" : "text-destructive"}`}>
                            {info.growth}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {d.digital?.marketing_channels && (
                <Card className="p-4 border-border">
                  <h4 className="font-semibold text-foreground mb-3 text-sm">Marketing Channels</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={d.digital.marketing_channels} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis dataKey="channel" type="category" width={100} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <Tooltip />
                        <Bar dataKey="percentage" fill="hsl(217,100%,65%)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}
            </section>

            {/* ADVANTAGES */}
            <section id="advantages" ref={(el) => { sectionRefs.current.advantages = el; }}>
              <h3 className="text-xl font-bold text-foreground mb-4">Competitive Advantages</h3>
              {d.advantages && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {d.advantages.map((adv: any, i: number) => (
                    <Card key={i} className="p-4 border-border">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{adv.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-foreground text-sm">{adv.title}</h4>
                            <Badge
                              className={
                                adv.impact === "High"
                                  ? "bg-[hsl(142,71%,45%,0.1)] text-[hsl(142,71%,45%)]"
                                  : adv.impact === "Medium"
                                  ? "bg-[hsl(38,92%,50%,0.1)] text-[hsl(38,92%,50%)]"
                                  : "bg-muted text-muted-foreground"
                              }
                            >
                              {adv.impact}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{adv.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {d.threat_level && (
                <Card className="p-4 border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-foreground">{d.threat_level.score}/10</span>
                    <Badge
                      className={
                        d.threat_level.score >= 7
                          ? "bg-destructive/10 text-destructive"
                          : d.threat_level.score >= 4
                          ? "bg-[hsl(38,92%,50%,0.1)] text-[hsl(38,92%,50%)]"
                          : "bg-[hsl(142,71%,45%,0.1)] text-[hsl(142,71%,45%)]"
                      }
                    >
                      {d.threat_level.label}
                    </Badge>
                  </div>
                  {d.threat_level.explanation && (
                    <p className="text-sm text-muted-foreground mb-2">{d.threat_level.explanation}</p>
                  )}
                  {d.threat_level.recommendation && (
                    <p className="text-sm text-foreground font-medium">{d.threat_level.recommendation}</p>
                  )}
                </Card>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <DashboardShell
      title={competitor?.competitor_name ?? "Competitor Analysis"}
      description={lastAnalyzed ? `Last analyzed: ${lastAnalyzed}` : "Loading analysis..."}
    >
      {content}
    </DashboardShell>
  );
};

function MetricCard({
  label,
  value,
  subtitle,
  trend,
}: {
  label: string;
  value?: string | null;
  subtitle?: string;
  trend?: string | null;
}) {
  return (
    <Card className="p-4 border-border">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-xl font-bold text-foreground">{value ?? "—"}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      {trend && (
        <p className={`text-xs font-medium mt-1 ${trend.startsWith("+") ? "text-[hsl(142,71%,45%)]" : "text-destructive"}`}>
          {trend}
        </p>
      )}
    </Card>
  );
}

export default CompetitorDetailPage;
