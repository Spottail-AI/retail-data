import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Truck, AlertCircle, Plus, ExternalLink } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const SupplierIntelligenceSection = () => {
  const { user } = useAuth();

  const { data: suppliers, isLoading, isError, refetch } = useQuery({
    queryKey: ["suppliers", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("user_id", user!.id)
        .order("reliability_score", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <Card className="bg-card border-border p-6">
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-card border-border p-6">
        <div className="flex items-center gap-2 text-destructive mb-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Failed to load suppliers</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
      </Card>
    );
  }

  if (!suppliers || suppliers.length === 0) {
    return (
      <Card className="bg-card border-border p-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
          <Truck className="w-6 h-6 text-success" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Find suppliers for your products</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
          Search and save suppliers to compare pricing, reliability, and minimum order quantities.
        </p>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Search Suppliers
        </Button>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Supplier Intelligence</h3>
        <span className="text-xs text-muted-foreground">{suppliers.length} supplier{suppliers.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">Supplier</TableHead>
              <TableHead className="text-muted-foreground">Location</TableHead>
              <TableHead className="text-muted-foreground">Avg. Price</TableHead>
              <TableHead className="text-muted-foreground">Reliability</TableHead>
              <TableHead className="text-muted-foreground">MOQ</TableHead>
              <TableHead className="text-muted-foreground"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((s) => (
              <TableRow key={s.id} className="border-border hover:bg-accent/50">
                <TableCell className="font-medium text-foreground">{s.supplier_name}</TableCell>
                <TableCell className="text-muted-foreground">{s.location || "—"}</TableCell>
                <TableCell className="text-foreground">{s.average_price ? `$${Number(s.average_price).toFixed(2)}` : "—"}</TableCell>
                <TableCell>
                  {s.reliability_score ? (
                    <span className={`text-sm font-medium ${Number(s.reliability_score) >= 80 ? "text-success" : Number(s.reliability_score) >= 50 ? "text-warning" : "text-destructive"}`}>
                      {Number(s.reliability_score).toFixed(0)}%
                    </span>
                  ) : "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">{s.moq ?? "—"}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
