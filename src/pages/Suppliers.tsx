import { useState } from "react";
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
import { Search, ExternalLink, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Result = { name: string; website: string; type: "supplier" | "distributor" };

const Suppliers = () => {
  const { session, hasPaid } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState("");
  const [checkSuppliers, setCheckSuppliers] = useState(true);
  const [checkDistributors, setCheckDistributors] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

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
      setResults(data?.results || []);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const suppliers = results.filter((r) => r.type === "supplier");
  const distributors = results.filter((r) => r.type === "distributor");
  const showBoth = checkSuppliers && checkDistributors;

  const ResultTable = ({ items, title }: { items: Result[]; title: string }) => (
    <Card className="bg-card border-[#E6E8EB] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E6E8EB]">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{items.length} result{items.length !== 1 ? "s" : ""} found</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-[#E6E8EB] bg-[#F9FAFB]">
            <TableHead className="text-muted-foreground font-medium pl-6">Company Name</TableHead>
            <TableHead className="text-muted-foreground font-medium pr-6">Website</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, i) => (
            <TableRow key={i} className="border-[#E6E8EB] hover:bg-[#F9FAFB] transition-colors h-12">
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
      {!hasPaid && (
        <div className="px-6 py-4 border-t border-[#E6E8EB] bg-[#F9FAFB] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>Upgrade to see up to 10 results</span>
          </div>
          <Button size="sm" onClick={() => navigate("/pricing")} className="bg-primary hover:bg-primary/90 text-white">
            Upgrade Plan
          </Button>
        </div>
      )}
    </Card>
  );

  return (
    <DashboardShell
      title="Suppliers & Distributors"
      description="Search and manage your supplier and distributor network with pricing and reliability data."
    >
      <Card className="bg-card border-[#E6E8EB] p-6 shadow-sm">
        <label className="text-sm font-semibold text-foreground mb-2 block">
          Type in your product
        </label>
        <div className="flex gap-3">
          <Input
            placeholder="e.g. Organic Coffee Beans, LED Light Strips..."
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            disabled={loading || !product.trim() || (!checkSuppliers && !checkDistributors)}
            className="bg-primary hover:bg-primary/90 text-white px-6"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
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

      {!loading && searched && results.length > 0 && (
        <div className={`mt-6 ${showBoth ? "grid grid-cols-1 lg:grid-cols-2 gap-4" : ""}`}>
          {suppliers.length > 0 && <ResultTable items={suppliers} title="Suppliers" />}
          {distributors.length > 0 && <ResultTable items={distributors} title="Distributors" />}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <Card className="bg-card border-[#E6E8EB] p-8 text-center shadow-sm mt-6">
          <p className="text-muted-foreground text-sm">No results found. Try a different product name.</p>
        </Card>
      )}
    </DashboardShell>
  );
};

export default Suppliers;
