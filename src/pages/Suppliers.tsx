import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Clock, Trash2, ChevronRight, ListChecks } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ALL_COUNTRIES = [
  "Australia","Austria","Belgium","Brazil","Canada","China","Denmark","Finland","France","Germany",
  "Hong Kong","India","Ireland","Italy","Japan","Mexico","Netherlands","New Zealand","Norway","Poland",
  "Portugal","Singapore","South Africa","South Korea","Spain","Sweden","Switzerland","United Arab Emirates",
  "United Kingdom","United States",
];

type SavedSearch = {
  id: string;
  product_name: string;
  list_title: string | null;
  country: string | null;
  results_found: number;
  created_at: string;
};

const Suppliers = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState("");
  const [country, setCountry] = useState("United States");
  const [countrySearch, setCountrySearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return ALL_COUNTRIES;
    const q = countrySearch.toLowerCase();
    return ALL_COUNTRIES.filter((c) => c.toLowerCase().includes(q));
  }, [countrySearch]);

  const fetchLists = async () => {
    if (!session?.user?.id) return;
    const { data } = await supabase
      .from("saved_searches")
      .select("id, product_name, list_title, country, results_found, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setSavedSearches(data as SavedSearch[]);
    setLoadingSaved(false);
  };

  useEffect(() => {
    fetchLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const handleSearch = async () => {
    if (!product.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("search-suppliers", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: { product: product.trim(), country },
      });
      if (error) throw error;
      if (data?.list_id) {
        toast.success("List created");
        navigate(`/stockists/${data.list_id}`);
        return;
      }
      toast.error("No results returned.");
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteList = async (id: string) => {
    await supabase.from("saved_searches").delete().eq("id", id);
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
    toast.success("List deleted");
  };

  return (
    <DashboardShell
      title="Retail Stores & Distributors"
      description="Each search generates an auto-saved list of matched stores and distributors you can work as a pipeline."
    >
      {/* New search */}
      <Card className="bg-card border-[#E6E8EB] p-6 shadow-sm">
        <label className="text-sm font-semibold text-foreground mb-1 block">
          What product are you placing?
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          Paste a link to the exact product for better results
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="e.g. Organic cold brew coffee, Bamboo toothbrush, LED grow lights..."
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-full sm:w-64">
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
          <Button
            onClick={handleSearch}
            disabled={loading || !product.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? "Building list..." : "Find matches"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Each search is auto-saved as its own list. No manual save needed.
        </p>
      </Card>

      {/* My Lists */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <ListChecks className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">My lists</h2>
        </div>

        {loadingSaved ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : savedSearches.length === 0 ? (
          <Card className="bg-card border-[#E6E8EB] p-8 text-center shadow-sm">
            <p className="text-sm text-muted-foreground">
              You haven't run a search yet. Try one above — it'll appear here as a list you can come back to.
            </p>
          </Card>
        ) : (
          <Card className="bg-card border-[#E6E8EB] shadow-sm overflow-hidden">
            <div className="divide-y divide-[#E6E8EB]">
              {savedSearches.map((s) => (
                <div
                  key={s.id}
                  className="px-5 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors group"
                >
                  <button
                    onClick={() => navigate(`/stockists/${s.id}`)}
                    className="flex items-center gap-3 text-left flex-1 min-w-0"
                  >
                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {s.list_title || s.product_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {s.results_found} matches
                        {s.country ? ` · ${s.country}` : ""}
                        {" · "}{new Date(s.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); deleteList(s.id); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <ChevronRight
                      className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors cursor-pointer"
                      onClick={() => navigate(`/stockists/${s.id}`)}
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
