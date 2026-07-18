import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2, Check, Circle, Store } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
const db = supabase as any;

const ALL_COUNTRIES = [
  "Australia","Austria","Belgium","Brazil","Canada","China","Denmark","Finland","France","Germany",
  "Hong Kong","India","Ireland","Italy","Japan","Mexico","Netherlands","New Zealand","Norway","Poland",
  "Portugal","Singapore","South Africa","South Korea","Spain","Sweden","Switzerland","United Arab Emirates",
  "United Kingdom","United States",
];

const STEPS = [
  "Reading your product page",
  "Scouting national & regional distributors",
  "Scouting retail chains & marketplaces",
  "Verifying every website is real and live",
  "Scoring fit against your brand's stage",
];

const SOURCE_DISMISS_KEY = "spottail_source_promo_dismissed";

export const SearchLauncher = ({ onDone, heroTitle }: { onDone?: () => void; heroTitle?: string }) => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState("");
  const [country, setCountry] = useState("United States");
  const [countrySearch, setCountrySearch] = useState("");
  const [brandStage, setBrandStage] = useState("dtc_only");
  const [running, setRunning] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [profileLine, setProfileLine] = useState<string | null>(null);
  const [showSource, setShowSource] = useState(false);
  const timers = useRef<number[]>([]);

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return ALL_COUNTRIES;
    const q = countrySearch.toLowerCase();
    return ALL_COUNTRIES.filter((c) => c.toLowerCase().includes(q));
  }, [countrySearch]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  useEffect(() => {
    (async () => {
      if (!session?.user?.id || localStorage.getItem(SOURCE_DISMISS_KEY)) return;
      const { data } = await db.from("source_products").select("id").eq("user_id", session.user.id).limit(1);
      if (!data || data.length === 0) setShowSource(true);
    })();
  }, [session?.user?.id]);

  const run = async () => {
    if (!product.trim() || running) return;
    setRunning(true); setStepIdx(0); setProfileLine(null);
    try {
      // Stage A: profile only — real progress, shown mid-wait.
      const { data: p1, error: e1 } = await supabase.functions.invoke("pipeline-search", {
        body: { product: product.trim(), country, brand_stage: brandStage, profile_only: true },
      });
      if (e1 || p1?.error) throw new Error(p1?.error || e1?.message || "failed");
      const prof = p1.profile;
      if (prof?.category) {
        setProfileLine(
          `${prof.price_point ? `${prof.price_point} ` : ""}${prof.category}` +
          (prof.comparable_brands?.length ? ` — comparable to ${prof.comparable_brands.slice(0, 2).join(", ")}` : "")
        );
      }
      setStepIdx(1);
      // Matcher phases are one request — advance the remaining steps on honest-ish timers.
      timers.current.push(window.setTimeout(() => setStepIdx(2), 14000));
      timers.current.push(window.setTimeout(() => setStepIdx(3), 32000));
      timers.current.push(window.setTimeout(() => setStepIdx(4), 48000));

      const { data: p2, error: e2 } = await supabase.functions.invoke("pipeline-search", {
        body: { product_id: p1.product_id, country, brand_stage: brandStage },
      });
      if (e2 || p2?.error) throw new Error(p2?.error || e2?.message || "failed");
      toast.success(
        `${p2.new_count} new prospects added` +
        (p2.existing_count ? ` · ${p2.existing_count} already in your pipeline` : "")
      );
      onDone?.();
      navigate(`/pipeline/${p1.product_id}`);
    } catch (err: any) {
      toast.error(err.message || "Search failed. Please try again.");
      setRunning(false);
    } finally {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    }
  };

  const dismissSource = () => {
    localStorage.setItem(SOURCE_DISMISS_KEY, "1");
    setShowSource(false);
  };

  if (running) {
    const monogram = (profileLine || product).trim().charAt(0).toUpperCase() || "?";
    return (
      <div>
        <Card className="bg-card border-[#E6E8EB] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-base"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}>{monogram}</div>
            <div>
              <p className="text-sm font-semibold text-foreground">Scouting buyers for your product</p>
              <p className="text-xs text-muted-foreground">{country} · usually under a minute</p>
            </div>
          </div>
          <div className="h-1 rounded-full bg-muted mt-4 mb-5 overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${((stepIdx + 0.5) / STEPS.length) * 100}%` }} />
          </div>
          <div className="space-y-2.5">
            {STEPS.map((label, i) => (
              <div key={label} className={cn(
                "flex items-center gap-2.5 text-[13px]",
                i < stepIdx ? "text-muted-foreground" : i === stepIdx ? "text-foreground font-medium" : "text-muted-foreground/50"
              )}>
                {i < stepIdx ? <Check className="w-4 h-4 text-primary shrink-0" />
                  : i === stepIdx ? <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                  : <Circle className="w-3 h-3 shrink-0" />}
                <span>
                  {label}
                  {i === 0 && profileLine && <span className="text-muted-foreground"> — {profileLine}</span>}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {showSource && (
          <Card className="bg-muted/40 border-[#E6E8EB] p-4 mt-3 flex items-start gap-3 shadow-none">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-foreground">While we scout buyers for you — let buyers scout you</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Retail buyers browse Spottail Source for new brands. A free profile makes your product discoverable while you do outreach.
              </p>
              <div className="flex gap-2 mt-2.5">
                <Button variant="outline" size="sm" className="h-7 text-xs"
                  onClick={() => window.open("/source/new", "_blank", "noopener")}>
                  Create Source profile
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={dismissSource}>
                  Not now
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <Card className="bg-card border-[#E6E8EB] p-6 shadow-sm">
      <label className="text-sm font-semibold text-foreground mb-1 block">
        {heroTitle || "What product are you trying to stock?"}
      </label>
      <p className="text-xs text-muted-foreground mb-2">Paste a link to the exact product for better results</p>
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1 w-full">
          <Input
            placeholder="e.g. https://yourbrand.com/products/your-product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-52">
          <label className="text-sm font-semibold text-foreground mb-1 block">Region</label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select Country" /></SelectTrigger>
            <SelectContent>
              <div className="px-2 pb-2">
                <Input placeholder="Search countries..." value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)} className="h-8 text-sm"
                  onKeyDown={(e) => e.stopPropagation()} />
              </div>
              {filteredCountries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-56">
          <label className="text-sm font-semibold text-foreground mb-1 block">Where is the brand today?</label>
          <Select value={brandStage} onValueChange={setBrandStage}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="dtc_only">Online / DTC only</SelectItem>
              <SelectItem value="some_retail">In some stores</SelectItem>
              <SelectItem value="established_retail">Established in retail</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={run} disabled={!product.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 w-full sm:w-auto">
          <Search className="w-4 h-4 mr-2" /> Find matches
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Takes about a minute · every match verified against live web sources · scored for fit against your brand's stage
      </p>
    </Card>
  );
};

export default SearchLauncher;
