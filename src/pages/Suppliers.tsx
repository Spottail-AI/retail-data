import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronRight, Trash2, ListChecks, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/* eslint-disable @typescript-eslint/no-explicit-any */
const db = supabase as any; // new tables pending type regeneration

const ALL_COUNTRIES = [
  "Australia","Austria","Belgium","Brazil","Canada","China","Denmark","Finland","France","Germany",
  "Hong Kong","India","Ireland","Italy","Japan","Mexico","Netherlands","New Zealand","Norway","Poland",
  "Portugal","Singapore","South Africa","South Korea","Spain","Sweden","Switzerland","United Arab Emirates",
  "United Kingdom","United States",
];

type PipelineSummary = {
  id: string;
  name: string;
  created_at: string;
  row_count: number;
  in_motion: number;
};

const Suppliers = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState("");
  const [country, setCountry] = useState("United States");
  const [brandStage, setBrandStage] = useState("dtc_only");
  const [countrySearch, setCountrySearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pipelines, setPipelines] = useState<PipelineSummary[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return ALL_COUNTRIES;
    const q = countrySearch.toLowerCase();
    return ALL_COUNTRIES.filter((c) => c.toLowerCase().includes(q));
  }, [countrySearch]);

  const fetchPipelines = async () => {
    if (!session?.user?.id) return;
    const { data: prods } = await db
      .from("products")
      .select("id, name, created_at")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (!prods) { setLoadingSaved(false); return; }
    const { data: rows } = await db
      .from("pipeline_rows")
      .select("product_id, stage")
      .eq("user_id", session.user.id);
    const summary: PipelineSummary[] = prods.map((p: any) => {
      const mine = (rows || []).filter((r: any) => r.product_id === p.id);
      return {
        id: p.id, name: p.name, created_at: p.created_at,
        row_count: mine.length,
        in_motion: mine.filter((r: any) => !["to_contact", "passed"].includes(r.stage)).length,
      };
    });
    setPipelines(summary);
    setLoadingSaved(false);
  };

  useEffect(() => {
    fetchPipelines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const handleSearch = async () => {
    if (!product.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("pipeline-search", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: { product: product.trim(), country, brand_stage: brandStage },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message);
      if (data?.product_id) {
        toast.success(`${data.new_count} prospects added to your pipeline`);
        navigate(`/pipeline/${data.product_id}`);
        return;
      }
      toast.error("No results returned.");
    } catch (err: any) {
      console.error("Search error:", err);
      toast.error(err.message || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deletePipeline = async (id: string) => {
    await db.from("products").delete().eq("id", id);
    setPipelines((prev) => prev.filter((p) => p.id !== id));
    toast.success("Pipeline deleted");
  };

  return (
    <DashboardShell
      title="Retail Stores & Distributors"
      description="Each product gets one pipeline. Every search adds new matched stores and distributors to it — nothing gets lost between searches."
    >
      {/* New search */}
      <Card className="bg-card border-[#E6E8EB] p-6 shadow-sm">
        <label className="text-sm font-semibold text-foreground mb-1 block">
          What product are you trying to stock?
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          Paste a link to the exact product for better results
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <Input
              placeholder="e.g. Organic cold brew coffee, Bamboo toothbrush, LED grow lights..."
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-52">
            <label className="text-sm font-semibold text-foreground mb-1 block">Region</label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Country" />
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
          <Button
            onClick={handleSearch}
            disabled={loading || !product.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 w-full sm:w-auto"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
            {loading ? "Searching..." : "Find matches"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Matching takes ~30 seconds. Results are verified against live web sources and scored for fit against your product and brand stage.
        </p>
      </Card>

      {/* My pipelines */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <ListChecks className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">My pipelines</h2>
        </div>

        {loadingSaved ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : pipelines.length === 0 ? (
          <Card className="bg-card border-[#E6E8EB] p-8 text-center shadow-sm">
            <p className="text-sm text-muted-foreground">
              No pipelines yet. Run a search above — your matched stores and distributors will build up here, one pipeline per product.
            </p>
          </Card>
        ) : (
          <Card className="bg-card border-[#E6E8EB] shadow-sm overflow-hidden">
            <div className="divide-y divide-[#E6E8EB]">
              {pipelines.map((p) => (
                <div
                  key={p.id}
                  className="px-5 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors group"
                >
                  <button
                    onClick={() => navigate(`/pipeline/${p.id}`)}
                    className="flex items-center gap-3 text-left flex-1 min-w-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.row_count} prospects · {p.in_motion} in motion
                        {" · "}{new Date(p.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); deletePipeline(p.id); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <ChevronRight
                      className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors cursor-pointer"
                      onClick={() => navigate(`/pipeline/${p.id}`)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
};

export default Suppliers;
