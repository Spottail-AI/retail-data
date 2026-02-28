import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ExternalLink, Lock, Clock, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Result = { name: string; website: string; type: "supplier" | "distributor" };
type SavedSearch = {
  id: string;
  product_name: string;
  search_selection: string;
  results: Result[];
  results_found: number;
  created_at: string;
};

const Suppliers = () => {
  const { session, hasPaid } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState("");
  const [checkSuppliers, setCheckSuppliers] = useState(true);
  const [checkDistributors, setCheckDistributors] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  // Fetch saved searches on mount
  useEffect(() => {
    const fetchSaved = async () => {
      if (!session?.user?.id) return;
      const { data } = await supabase
        .from("saved_searches")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) setSavedSearches(data as unknown as SavedSearch[]);
      setLoadingSaved(false);
    };
    fetchSaved();
  }, [session?.user?.id]);

  const handleSearch = async () => {
    if (!product.trim()) return;
    const types: string[] = [];
    if (checkSuppliers) types.push("supplier");
    if (checkDistributors) types.push("distributor");
    if (types.length === 0) return;

    setLoading(true);
    setSearched(true);
    try {
      const { data, error } = await supabase.functions.invoke("search-suppliers", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: { product: product.trim(), searchType: types },
      });
      if (error) throw error;
      const allResults = data?.results || [];
      setResults(allResults);

      // Refresh saved searches
      const { data: saved } = await supabase
        .from("saved_searches")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (saved) setSavedSearches(saved as unknown as SavedSearch[]);
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Search failed. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedSearch = (search: SavedSearch) => {
    setProduct(search.product_name);
    setResults(search.results);
    setSearched(true);
    const sel = search.search_selection;
    setCheckSuppliers(sel === "supplier" || sel === "both");
    setCheckDistributors(sel === "distributor" || sel === "both");
  };

  const deleteSavedSearch = async (id: string) => {
    await supabase.from("saved_searches").delete().eq("id", id);
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
    toast.success("Search deleted");
  };

  const displayLimit = hasPaid ? 10 : 2;
  const displayedResults = results.slice(0, displayLimit);
  const suppliers = displayedResults.filter((r) => r.type === "supplier");
  const distributors = displayedResults.filter((r) => r.type === "distributor");
  const showBoth = checkSuppliers && checkDistributors;

  const ResultTable = ({ items, title }: { items: Result[]; title: string }) => (
    <Card className="bg-card border-[#E6E8EB] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E6E8EB]">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{items.length} result{items.length !== 1 ? "s" : ""} shown</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-[#E6E8EB] bg-muted/50">
            <TableHead className="text-muted-foreground font-medium pl-6">Company Name</TableHead>
            <TableHead className="text-muted-foreground font-medium pr-6">Website</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, i) => (
            <TableRow key={i} className="border-[#E6E8EB] hover:bg-muted/30 transition-colors h-12">
              <TableCell className="font-medium text-foreground pl-6">{item.name}</TableCell>
              <TableCell className="pr-6">
                <a
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 hover:underline"
                >
                  {item.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!hasPaid && results.length > 2 && (
        <div className="px-6 py-4 border-t border-[#E6E8EB] bg-muted/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>Upgrade to view {results.length - 2} more suppliers & distributors</span>
          </div>
          <Button size="sm" onClick={() => navigate("/pricing")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Upgrade Plan
          </Button>
        </div>
      )}
    </Card>
  );

  return (
    <DashboardShell
      title="Suppliers & Distributors"
      description="Search and discover verified suppliers and distributors for any product worldwide."
    >
      {/* Search Card */}
      <Card className="bg-card border-[#E6E8EB] p-6 shadow-sm">
        <label className="text-sm font-semibold text-foreground mb-2 block">
          Type in your product
        </label>
        <div className="flex gap-3">
          <Input
            placeholder="e.g. Organic Coffee Beans, LED Light Strips, Bamboo Toothbrush..."
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            disabled={loading || !product.trim() || (!checkSuppliers && !checkDistributors)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="suppliers"
              checked={checkSuppliers}
              onCheckedChange={(v) => setCheckSuppliers(!!v)}
            />
            <Label htmlFor="suppliers" className="text-sm text-foreground cursor-pointer">Suppliers</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="distributors"
              checked={checkDistributors}
              onCheckedChange={(v) => setCheckDistributors(!!v)}
            />
            <Label htmlFor="distributors" className="text-sm text-foreground cursor-pointer">Distributors</Label>
          </div>
        </div>
      </Card>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          {[1, 2].map((i) => (
            <Card key={i} className="bg-card border-[#E6E8EB] p-6 shadow-sm space-y-3">
              <Skeleton className="h-5 w-32" />
              {[1, 2, 3].map((j) => <Skeleton key={j} className="h-10 w-full" />)}
            </Card>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && searched && displayedResults.length > 0 && (
        <div className={`mt-6 ${showBoth ? "grid grid-cols-1 lg:grid-cols-2 gap-4" : ""}`}>
          {suppliers.length > 0 && <ResultTable items={suppliers} title="Suppliers" />}
          {distributors.length > 0 && <ResultTable items={distributors} title="Distributors" />}
        </div>
      )}

      {/* No results */}
      {!loading && searched && results.length === 0 && (
        <Card className="bg-card border-[#E6E8EB] p-8 text-center shadow-sm mt-6">
          <p className="text-muted-foreground text-sm">No verified suppliers or distributors found. Try refining the product name.</p>
        </Card>
      )}

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <Card className="bg-card border-[#E6E8EB] shadow-sm mt-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E6E8EB]">
            <h3 className="text-sm font-semibold text-foreground">Recent Searches</h3>
          </div>
          <div className="divide-y divide-[#E6E8EB]">
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
                    <p className="text-sm font-medium text-foreground truncate">{search.product_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {search.search_selection === "both" ? "Suppliers & Distributors" : search.search_selection === "supplier" ? "Suppliers" : "Distributors"}
                      {" · "}{search.results_found} results · {new Date(search.created_at).toLocaleDateString()}
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

export default Suppliers;
