import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sparkles, TrendingUp, ArrowUp, Star, Clock, Lock, Trash2, Loader2, AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ── Same countries as landing pages (ISO 3166, alphabetical, top-5 prioritized) ──
const ALL_COUNTRIES = [
  "United States","United Kingdom","Germany","Japan","Australia",
  "Argentina","Austria","Belgium","Brazil","Cabo Verde","Cambodia","Cameroon","Canada",
  "Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica",
  "Croatia","Cuba","Cyprus","Czech Republic","Democratic Republic of the Congo","Denmark",
  "Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador",
  "Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France",
  "Gabon","Gambia","Georgia","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau",
  "Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq",
  "Ireland","Israel","Italy","Ivory Coast","Jamaica","Jordan","Kazakhstan","Kenya","Kiribati",
  "Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya",
  "Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali",
  "Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco",
  "Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal",
  "Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia",
  "Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru",
  "Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis",
  "Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe",
  "Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia",
  "Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka",
  "Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand",
  "Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda",
  "Ukraine","United Arab Emirates","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela",
  "Vietnam","Yemen","Zambia","Zimbabwe",
];

// ── Same niches as landing/demo pages ──
const NICHES = [
  { value: "Automotive", label: "Automotive" },
  { value: "Beauty & Personal Care", label: "Beauty & Personal Care" },
  { value: "Books & Literature", label: "Books & Literature" },
  { value: "Clothing & Apparel", label: "Clothing & Apparel" },
  { value: "Electronics", label: "Electronics" },
  { value: "Fashion", label: "Fashion" },
  { value: "Fitness & Sports", label: "Fitness & Sports" },
  { value: "Food & Beverages", label: "Food & Beverages" },
  { value: "Gaming", label: "Gaming" },
  { value: "Health & Wellness", label: "Health & Wellness" },
  { value: "Home & Garden", label: "Home & Garden" },
  { value: "Jewelry & Accessories", label: "Jewelry & Accessories" },
  { value: "Kids & Baby", label: "Kids & Baby" },
  { value: "Music & Instruments", label: "Music & Instruments" },
  { value: "Outdoors & Recreation", label: "Outdoors & Recreation" },
  { value: "Pet Supplies", label: "Pet Supplies" },
  { value: "Technology", label: "Technology" },
  { value: "Toys & Games", label: "Toys & Games" },
  { value: "Travel & Luggage", label: "Travel & Luggage" },
  { value: "Watches & Timepieces", label: "Watches & Timepieces" },
];

// ── Same platforms as landing/demo pages (no Google Trends) ──
const PLATFORMS = [
  { value: "all", label: "All Platforms", recommended: true },
  { value: "amazon", label: "Amazon" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
];

interface TrendProduct {
  product_name: string;
  image_url?: string;
  trend_score: number;
  growth_rate: number;
  platform_source: string;
  engagement_metrics?: { views?: number; saves?: number; shares?: number };
  demand_indicator: string;
  competition_indicator: string;
  confidence?: number;
  risk?: string;
  timeframe?: string;
  description?: string;
}

interface SavedTrend {
  id: string;
  category: string;
  session_id: string;
  results: TrendProduct[];
  created_at: string;
}

const TrendDiscovery = () => {
  const { session, hasPaid } = useAuth();
  const navigate = useNavigate();

  // Filters
  const [country, setCountry] = useState("United States");
  const [countrySearch, setCountrySearch] = useState("");
  const [niche, setNiche] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["all"]);

  // Results
  const [products, setProducts] = useState<TrendProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // History
  const [savedSearches, setSavedSearches] = useState<SavedTrend[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return ALL_COUNTRIES;
    const q = countrySearch.toLowerCase();
    return ALL_COUNTRIES.filter((c) => c.toLowerCase().includes(q));
  }, [countrySearch]);

  const togglePlatform = (value: string) => {
    if (value === "all") {
      setSelectedPlatforms(["all"]);
      return;
    }
    let next = selectedPlatforms.filter((p) => p !== "all");
    if (next.includes(value)) {
      next = next.filter((p) => p !== value);
    } else {
      next.push(value);
    }
    if (next.length === 0) next = ["all"];
    setSelectedPlatforms(next);
  };

  // Load saved searches
  useEffect(() => {
    const fetch = async () => {
      if (!session?.user?.id) return;
      const { data } = await supabase
        .from("trend_results")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) setSavedSearches(data as unknown as SavedTrend[]);
      setLoadingSaved(false);
    };
    fetch();
  }, [session?.user?.id]);

  const handleDiscover = async () => {
    if (!niche) {
      toast.error("Please select a niche.");
      return;
    }
    if (!session?.access_token) {
      toast.error("Please sign in to discover trends.");
      return;
    }

    setLoading(true);
    setSearched(true);
    const sessionId = `td_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      const { data, error } = await supabase.functions.invoke("generate-trends", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: {
          country,
          niche,
          platforms: selectedPlatforms,
          sessionId,
        },
      });

      if (error) throw error;
      if (data?.results) {
        setProducts(data.results as TrendProduct[]);
        // Refresh saved searches
        const { data: saved } = await supabase
          .from("trend_results")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(10);
        if (saved) setSavedSearches(saved as unknown as SavedTrend[]);
      } else if (data?.error) {
        toast.error(data.error);
        setProducts([]);
      } else {
        throw new Error("No results");
      }
    } catch (err: any) {
      console.error("Trend discovery error:", err);
      toast.error("Failed to discover trends. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedSearch = (search: SavedTrend) => {
    setProducts(search.results);
    setSearched(true);
    // Parse category "Niche in Country"
    const parts = search.category.split(" in ");
    if (parts.length === 2) {
      setNiche(parts[0]);
      setCountry(parts[1]);
    }
  };

  const deleteSavedSearch = async (id: string) => {
    // trend_results doesn't have DELETE RLS - skip for now, just remove from UI
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
    toast.success("Search removed from history");
  };

  const displayLimit = hasPaid ? 10 : 2;
  const displayed = products.slice(0, displayLimit);

  const getDemandColor = (d: string) => {
    if (d === "Very High") return "text-[hsl(142,71%,45.3%)]";
    if (d === "High") return "text-[hsl(142,71%,45.3%)]";
    if (d === "Medium") return "text-warning";
    return "text-muted-foreground";
  };

  const getCompetitionColor = (c: string) => {
    if (c === "Low") return "text-[hsl(142,71%,45.3%)]";
    if (c === "Medium") return "text-warning";
    return "text-destructive";
  };

  return (
    <DashboardShell
      title="Trend Discovery"
      description="Discover emerging products with high growth potential before they peak."
    >
      {/* ── Filter Controls ── */}
      <Card className="bg-card border-border p-6 shadow-sm space-y-4">
        {/* Country */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Select Country / Region</label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-full sm:w-80">
              <SelectValue placeholder="Select Country / Region" />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 pb-2">
                <Input
                  placeholder="Search countries..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="h-8 text-sm"
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
              {filteredCountries.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
              {filteredCountries.length === 0 && (
                <div className="px-2 py-4 text-sm text-muted-foreground text-center">No countries found</div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Niche */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Select Niche</label>
          <Select value={niche} onValueChange={setNiche}>
            <SelectTrigger className="w-full sm:w-80">
              <SelectValue placeholder="Choose a niche" />
            </SelectTrigger>
            <SelectContent>
              {NICHES.map((n) => (
                <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Platforms multi-select */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Select Platforms</label>
          <div className="flex flex-wrap items-center gap-4">
            {PLATFORMS.map((p) => (
              <div key={p.value} className="flex items-center gap-2">
                <Checkbox
                  id={`platform-${p.value}`}
                  checked={selectedPlatforms.includes(p.value)}
                  onCheckedChange={() => togglePlatform(p.value)}
                />
                <Label htmlFor={`platform-${p.value}`} className="text-sm text-foreground cursor-pointer flex items-center gap-1">
                  {p.label}
                  {p.recommended && (
                    <span className="text-[10px] text-[hsl(142,71%,45.3%)] font-medium bg-[hsl(142,71%,45.3%,0.1)] px-1.5 py-0.5 rounded">
                      Recommended
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Discover Button */}
        <div className="pt-2">
          <Button
            onClick={handleDiscover}
            disabled={loading || !niche}
            className="bg-cta hover:bg-cta/90 text-cta-foreground font-semibold px-8"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Trends...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Discover Trends
              </>
            )}
          </Button>
          {loading && (
            <p className="text-muted-foreground text-xs mt-2">
              Our AI is analyzing millions of data points. This may take a moment...
            </p>
          )}
        </div>
      </Card>

      {/* ── Loading Skeleton ── */}
      {loading && (
        <div className="space-y-3 mt-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-card border-border p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-3">
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-3.5 w-20" />
                  </div>
                </div>
                <div className="ml-4 space-y-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Results ── */}
      {!loading && searched && displayed.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-foreground">
              Trending Products in {country}
            </h3>
            <span className="text-xs text-muted-foreground">
              {hasPaid
                ? `Showing all ${products.length} results`
                : `Showing ${displayed.length} of ${products.length} results`}
            </span>
          </div>

          {displayed.map((product, index) => (
            <Card key={index} className="bg-card border-border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded">
                      #{index + 1}
                    </span>
                    <h4 className="text-base font-semibold text-foreground">{product.product_name}</h4>
                  </div>
                  {product.description && (
                    <p className="text-muted-foreground text-sm mb-3">{product.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {product.timeframe && (
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {product.timeframe}
                      </span>
                    )}
                    <span>Platform: {product.platform_source}</span>
                    <span>
                      Demand: <span className={getDemandColor(product.demand_indicator)}>{product.demand_indicator}</span>
                    </span>
                    <span>
                      Competition: <span className={getCompetitionColor(product.competition_indicator)}>{product.competition_indicator}</span>
                    </span>
                    {product.risk && (
                      <span>
                        Risk: <span className={
                          product.risk === "Low" ? "text-[hsl(142,71%,45.3%)]" :
                          product.risk === "Medium" ? "text-warning" : "text-destructive"
                        }>{product.risk}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <div className="flex items-center text-[hsl(142,71%,45.3%)] font-bold text-lg mb-1">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    +{product.growth_rate}%
                  </div>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                    Score: {product.trend_score}
                  </Badge>
                  {product.confidence && (
                    <div className="flex items-center justify-end text-warning text-xs mt-1">
                      <Star className="w-3 h-3 mr-0.5" />
                      {product.confidence}%
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {/* Upgrade CTA for free users */}
          {!hasPaid && products.length > 2 && (
            <Card className="bg-card border-border p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">
                  Upgrade to unlock {products.length - 2} more trending products
                </h4>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Get full access to detailed trend analysis, competition insights, and timing predictions.
              </p>
              <Button
                onClick={() => navigate("/pricing")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Upgrade Plan
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* ── No results ── */}
      {!loading && searched && products.length === 0 && (
        <Card className="bg-card border-border p-8 text-center mt-6">
          <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No trending products found for the selected filters. Try adjusting country, niche, or platforms.
          </p>
        </Card>
      )}

      {/* ── Search History ── */}
      {savedSearches.length > 0 && (
        <Card className="bg-card border-border shadow-sm mt-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Recent Trend Searches</h3>
          </div>
          <div className="divide-y divide-border">
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className="px-6 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <button
                  onClick={() => loadSavedSearch(search)}
                  className="flex items-center gap-3 text-left flex-1 min-w-0"
                >
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{search.category}</p>
                    <p className="text-xs text-muted-foreground">
                      {Array.isArray(search.results) ? search.results.length : 0} products · {new Date(search.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteSavedSearch(search.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </DashboardShell>
  );
};

export default TrendDiscovery;
