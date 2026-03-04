import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  TrendingUp, TrendingDown, Minus, Plus, MoreVertical, ArrowUpRight,
  Link2, Search, RefreshCw, BarChart3, Loader2, AlertCircle, Pause, Play,
  Trash2, Edit, Download, Eye, ChevronLeft,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// ---- Types ----
interface TrackedPrice {
  id: string;
  user_id: string;
  url: string | null;
  product_name: string | null;
  product_label: string;
  tracking_type: string;
  update_frequency: string;
  status: string;
  currency: string | null;
  last_checked: string | null;
  last_error: string | null;
  error_count: number;
  created_at: string;
}

interface PriceHistoryPoint {
  id: string;
  price: number;
  currency: string;
  stock_status: string | null;
  is_on_sale: boolean | null;
  discount_percent: number | null;
  notes: string | null;
  scraped_at: string;
}

// ---- FAQ Data ----
const faqs = [
  { q: "What websites can I track?", a: "We support most e-commerce sites including Amazon, eBay, Walmart, Shopify stores, WooCommerce stores, Alibaba, AliExpress, and many more. If a site displays a price publicly, we can usually track it." },
  { q: "How often do prices update?", a: "By default, prices are checked daily. You can also choose every 3 days, weekly, or manual-only updates." },
  { q: "Can I track prices on Amazon, eBay, Walmart, etc.?", a: "Yes! These are our most commonly tracked platforms. Simply paste the product URL and we'll extract the price automatically." },
  { q: "What happens if a website blocks my tracking?", a: "If a website blocks automated access, we'll notify you and offer options like switching to manual updates or trying a different URL for the same product." },
  { q: "Can I export the price history?", a: "Yes, you can export the complete price history for any tracked item as a CSV file from the item's detail view." },
];

// ---- Helpers ----
const formatPrice = (price: number, currency: string) => {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
  } catch {
    return `${currency} ${price.toFixed(2)}`;
  }
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const freshnessColor = (dateStr: string | null) => {
  if (!dateStr) return "text-muted-foreground";
  const days = (Date.now() - new Date(dateStr).getTime()) / 86400000;
  if (days <= 1) return "text-[hsl(142,71%,45%)]";
  if (days <= 7) return "text-yellow-500";
  return "text-destructive";
};

// ==========================
// MAIN COMPONENT
// ==========================
const PriceTracking = () => {
  const { user, hasPaid, checkingPayment } = useAuth();
  const queryClient = useQueryClient();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addType, setAddType] = useState<"competitor" | "supplier">("competitor");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "competitor" | "supplier">("all");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formUrl, setFormUrl] = useState("");
  const [formProductName, setFormProductName] = useState("");
  const [formLabel, setFormLabel] = useState("");
  const [formFrequency, setFormFrequency] = useState("daily");
  const [formType, setFormType] = useState<"competitor" | "supplier">("competitor");
  const [inputMode, setInputMode] = useState<"url" | "name">("url");

  // Edit form state
  const [editLabel, setEditLabel] = useState("");
  const [editFrequency, setEditFrequency] = useState("daily");
  const [editType, setEditType] = useState<"competitor" | "supplier">("competitor");

  const maxItems = hasPaid ? 10 : 2;

  // ---- Queries ----
  const { data: trackedItems = [], isLoading: loadingItems } = useQuery({
    queryKey: ["tracked-prices", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracked_prices")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as TrackedPrice[];
    },
    enabled: !!user,
  });

  const selectedItem = trackedItems.find((i) => i.id === selectedItemId);

  const { data: priceHistory = [], isLoading: loadingHistory } = useQuery({
    queryKey: ["price-history", selectedItemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("price_history")
        .select("*")
        .eq("tracked_price_id", selectedItemId!)
        .order("scraped_at", { ascending: true });
      if (error) throw error;
      return data as PriceHistoryPoint[];
    },
    enabled: !!selectedItemId,
  });

  // ---- Mutations ----
  const addItemMutation = useMutation({
    mutationFn: async () => {
      const label = formLabel.trim() || formProductName.trim() || (formUrl ? new URL(formUrl).hostname : "Untitled");
      const { data, error } = await supabase.from("tracked_prices").insert({
        user_id: user!.id,
        url: formUrl.trim() || null,
        product_name: formProductName.trim() || null,
        product_label: label.slice(0, 100),
        tracking_type: formType,
        update_frequency: formFrequency,
      }).select().single();
      if (error) throw error;

      // If URL provided, trigger initial scrape
      if (formUrl.trim()) {
        const session = await supabase.auth.getSession();
        try {
          await supabase.functions.invoke("scrape-price", {
            headers: { Authorization: `Bearer ${session.data.session?.access_token}` },
            body: { url: formUrl.trim(), tracked_price_id: data.id },
          });
        } catch (e) {
          console.error("Initial scrape failed:", e);
        }
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracked-prices"] });
      setAddModalOpen(false);
      resetForm();
      toast({ title: "Tracking started", description: "We'll begin monitoring this price." });
    },
    onError: (e: Error) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tracked_prices").delete().eq("id", id).eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracked-prices"] });
      setDeleteConfirmId(null);
      if (selectedItemId === deleteConfirmId) setSelectedItemId(null);
      toast({ title: "Deleted", description: "Tracking item removed." });
    },
  });

  const togglePauseMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: string }) => {
      const { error } = await supabase.from("tracked_prices").update({ status: newStatus }).eq("id", id).eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tracked-prices"] }),
  });

  const updateItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tracked_prices").update({
        product_label: editLabel.slice(0, 100),
        update_frequency: editFrequency,
        tracking_type: editType,
      }).eq("id", id).eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracked-prices"] });
      setEditModalOpen(false);
      toast({ title: "Updated" });
    },
  });

  const refreshPriceMutation = useMutation({
    mutationFn: async (item: TrackedPrice) => {
      if (!item.url) throw new Error("No URL to scrape");
      const session = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke("scrape-price", {
        headers: { Authorization: `Bearer ${session.data.session?.access_token}` },
        body: { url: item.url, tracked_price_id: item.id },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracked-prices"] });
      queryClient.invalidateQueries({ queryKey: ["price-history"] });
      toast({ title: "Price refreshed" });
    },
    onError: (e: Error) => {
      toast({ title: "Scrape failed", description: e.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormUrl("");
    setFormProductName("");
    setFormLabel("");
    setFormFrequency("daily");
    setInputMode("url");
  };

  const openAddModal = (type: "competitor" | "supplier") => {
    if (trackedItems.length >= maxItems) {
      toast({
        title: "Limit reached",
        description: hasPaid
          ? "Paid plan limit reached (10 items). Delete an item to add a new one."
          : "Free plan: 2 items tracked. Upgrade to track up to 10 items.",
        variant: "destructive",
      });
      return;
    }
    setFormType(type);
    setAddType(type);
    resetForm();
    setAddModalOpen(true);
  };

  const openEditModal = (item: TrackedPrice) => {
    setEditLabel(item.product_label);
    setEditFrequency(item.update_frequency);
    setEditType(item.tracking_type as "competitor" | "supplier");
    setSelectedItemId(item.id);
    setEditModalOpen(true);
  };

  // Check for duplicate URL
  const isDuplicateUrl = useMemo(() => {
    if (!formUrl.trim()) return false;
    return trackedItems.some((i) => i.url?.toLowerCase() === formUrl.trim().toLowerCase());
  }, [formUrl, trackedItems]);

  const filteredItems = useMemo(() => {
    if (filter === "all") return trackedItems;
    return trackedItems.filter((i) => i.tracking_type === filter);
  }, [trackedItems, filter]);

  // Get latest price for an item from price_history (cached in item queries)
  const { data: latestPrices = {} } = useQuery({
    queryKey: ["latest-prices", user?.id],
    queryFn: async () => {
      if (trackedItems.length === 0) return {};
      const ids = trackedItems.map((i) => i.id);
      // Get latest price for each tracked item
      const results: Record<string, { price: number; currency: string; prevPrice: number | null; stock_status: string | null; scraped_at: string }> = {};
      for (const id of ids) {
        const { data } = await supabase
          .from("price_history")
          .select("price, currency, stock_status, scraped_at")
          .eq("tracked_price_id", id)
          .order("scraped_at", { ascending: false })
          .limit(2);
        if (data && data.length > 0) {
          results[id] = {
            price: Number(data[0].price),
            currency: data[0].currency,
            prevPrice: data.length > 1 ? Number(data[1].price) : null,
            stock_status: data[0].stock_status,
            scraped_at: data[0].scraped_at,
          };
        }
      }
      return results;
    },
    enabled: !!user && trackedItems.length > 0,
  });

  // CSV Export
  const exportCSV = (item: TrackedPrice, history: PriceHistoryPoint[]) => {
    const rows = [["Date", "Price", "Currency", "Status", "On Sale", "Discount %", "Notes"]];
    history.forEach((h) => {
      rows.push([
        new Date(h.scraped_at).toISOString(),
        String(h.price),
        h.currency,
        h.stock_status || "",
        h.is_on_sale ? "Yes" : "No",
        h.discount_percent ? String(h.discount_percent) : "",
        h.notes || "",
      ]);
    });
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.product_label.replace(/[^a-zA-Z0-9]/g, "_")}_price_history.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---- Chart View ----
  if (selectedItemId && selectedItem && !editModalOpen) {
    // Deduplicate by date: keep latest price per day
    const pricesByDate: Record<string, { price: number; scraped_at: string; count: number }> = {};
    priceHistory.forEach((p) => {
      const dateKey = new Date(p.scraped_at).toISOString().split("T")[0];
      if (!pricesByDate[dateKey] || new Date(p.scraped_at) > new Date(pricesByDate[dateKey].scraped_at)) {
        pricesByDate[dateKey] = { price: Number(p.price), scraped_at: p.scraped_at, count: (pricesByDate[dateKey]?.count || 0) + 1 };
      } else {
        pricesByDate[dateKey].count += 1;
      }
    });
    const chartData = Object.entries(pricesByDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateKey, v]) => ({
        date: new Date(dateKey + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        price: v.price,
        fullDate: new Date(dateKey + "T00:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        checksOnDay: v.count,
      }));

    const prices = chartData.map((p) => p.price);
    const currentPrice = prices.length > 0 ? prices[prices.length - 1] : null;
    const firstPrice = prices.length > 0 ? prices[0] : null;
    const minPrice = prices.length > 0 ? Math.min(...prices) : null;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : null;
    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : null;
    const priceChange = currentPrice !== null && firstPrice !== null ? currentPrice - firstPrice : null;
    const pctChange = priceChange !== null && firstPrice ? (priceChange / firstPrice) * 100 : null;
    const currency = selectedItem.currency || "USD";

    return (
      <DashboardShell title="Price Tracking" description="Monitor competitor and supplier prices over time">
        <Button variant="ghost" className="mb-4 gap-2" onClick={() => setSelectedItemId(null)}>
          <ChevronLeft className="w-4 h-4" /> Back to all items
        </Button>

        <Card className="p-6 border-border">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">{selectedItem.product_label}</h2>
              {selectedItem.url && (
                <a href={selectedItem.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                  <Link2 className="w-3 h-3" /> {new URL(selectedItem.url).hostname}
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => refreshPriceMutation.mutate(selectedItem)} disabled={refreshPriceMutation.isPending || !selectedItem.url}>
                <RefreshCw className={`w-4 h-4 mr-1 ${refreshPriceMutation.isPending ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button size="sm" variant="outline" onClick={() => exportCSV(selectedItem, priceHistory)} disabled={priceHistory.length === 0}>
                <Download className="w-4 h-4 mr-1" /> Export CSV
              </Button>
            </div>
          </div>

          {loadingHistory ? (
            <Skeleton className="h-64 w-full" />
          ) : priceHistory.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <BarChart3 className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Price tracking started {new Date(selectedItem.created_at).toLocaleDateString()}.</p>
              <p className="text-xs text-muted-foreground mt-1">More data will appear as prices are updated. Check back tomorrow!</p>
            </div>
          ) : (
            <>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} domain={["auto", "auto"]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                      formatter={(value: number) => [formatPrice(value, currency), "Price"]}
                      labelFormatter={(_, payload) => {
                        const p = payload?.[0]?.payload;
                        const label = p?.fullDate || "";
                        return p?.checksOnDay > 1 ? `${label} (${p.checksOnDay} checks)` : label;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={selectedItem.tracking_type === "competitor" ? "hsl(var(--primary))" : "hsl(142,71%,45%)"}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: selectedItem.tracking_type === "competitor" ? "hsl(var(--primary))" : "hsl(142,71%,45%)" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Current Price</p>
                  <p className="text-lg font-bold text-foreground">{currentPrice !== null ? formatPrice(currentPrice, currency) : "—"}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Change</p>
                  <div className="flex items-center gap-1">
                    {priceChange !== null && (
                      <>
                        {priceChange > 0 ? <TrendingUp className="w-4 h-4 text-[hsl(142,71%,45%)]" /> : priceChange < 0 ? <TrendingDown className="w-4 h-4 text-destructive" /> : <Minus className="w-4 h-4 text-muted-foreground" />}
                        <span className={`text-lg font-bold ${priceChange > 0 ? "text-[hsl(142,71%,45%)]" : priceChange < 0 ? "text-destructive" : "text-foreground"}`}>
                          {priceChange > 0 ? "+" : ""}{formatPrice(priceChange, currency)} ({pctChange?.toFixed(1)}%)
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Range</p>
                  <p className="text-sm font-medium text-foreground">
                    {minPrice !== null ? `${formatPrice(minPrice, currency)} – ${formatPrice(maxPrice!, currency)}` : "—"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Average</p>
                  <p className="text-lg font-bold text-foreground">{avgPrice !== null ? formatPrice(avgPrice, currency) : "—"}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <p className={`text-xs ${freshnessColor(selectedItem.last_checked)}`}>
                  Last updated: {selectedItem.last_checked ? timeAgo(selectedItem.last_checked) : "Never"}
                </p>
                <span className="text-xs text-muted-foreground">•</span>
                <p className="text-xs text-muted-foreground">
                  Tracking since {new Date(selectedItem.created_at).toLocaleDateString()} ({Math.ceil((Date.now() - new Date(selectedItem.created_at).getTime()) / 86400000)} days)
                </p>
              </div>
            </>
          )}
        </Card>
      </DashboardShell>
    );
  }

  // ---- Main Dashboard ----
  const isEmpty = trackedItems.length === 0 && !loadingItems;

  return (
    <DashboardShell title="Price Tracking" description="Monitor competitor and supplier prices over time">
      {checkingPayment || loadingItems ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      ) : isEmpty ? (
        /* ---- Empty State ---- */
        <div className="space-y-8">
          <Card className="p-8 md:p-12 text-center border-border">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Track Competitor & Supplier Prices</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Monitor pricing trends over time to stay competitive and manage costs</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button size="lg" className="gap-2" onClick={() => openAddModal("competitor")}>
                <Eye className="w-5 h-5" /> Track Competitor Prices
              </Button>
              <Button size="lg" variant="outline" className="gap-2" onClick={() => openAddModal("supplier")}>
                <TrendingUp className="w-5 h-5" /> Track Supplier / Commodity Prices
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Link2 className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">Add a product link or name</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">We scrape the price daily</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">Watch trends in your dashboard</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {hasPaid ? "Paid plan: Track up to 10 items" : "Free plan: Track up to 2 items"}
            </p>
          </Card>

          {/* FAQ */}
          <Card className="p-6 border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-sm text-foreground">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      ) : (
        /* ---- Populated State ---- */
        <div className="space-y-6">
          {/* Header controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                Tracking {trackedItems.length} of {maxItems} items
              </p>
              {!hasPaid && (
                <Button size="sm" variant="outline" className="text-xs" onClick={() => window.location.href = "/pricing"}>
                  <ArrowUpRight className="w-3 h-3 mr-1" /> Upgrade
                </Button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
                <TabsList>
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="competitor" className="text-xs">Competitor</TabsTrigger>
                  <TabsTrigger value="supplier" className="text-xs">Supplier</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button size="sm" className="gap-1" onClick={() => openAddModal("competitor")} disabled={trackedItems.length >= maxItems}>
                <Plus className="w-4 h-4" /> Add Item
              </Button>
            </div>
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const latest = latestPrices[item.id];
              const priceChangeVal = latest?.prevPrice ? latest.price - latest.prevPrice : null;
              const pctChangeVal = priceChangeVal !== null && latest?.prevPrice ? (priceChangeVal / latest.prevPrice) * 100 : null;

              return (
                <Card
                  key={item.id}
                  className="p-5 border-border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedItemId(item.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground truncate">{item.product_label}</h3>
                        <Badge variant={item.status === "active" ? "default" : item.status === "paused" ? "secondary" : "destructive"} className="text-[10px] shrink-0">
                          {item.status === "active" ? "Active" : item.status === "paused" ? "Paused" : "Error"}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="text-[10px] mb-2">
                        {item.tracking_type === "competitor" ? "Competitor" : "Supplier"}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedItemId(item.id); }}>
                          <BarChart3 className="w-4 h-4 mr-2" /> View Chart
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEditModal(item); }}>
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          togglePauseMutation.mutate({ id: item.id, newStatus: item.status === "paused" ? "active" : "paused" });
                        }}>
                          {item.status === "paused" ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                          {item.status === "paused" ? "Resume" : "Pause"}
                        </DropdownMenuItem>
                        {item.url && (
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); refreshPriceMutation.mutate(item); }}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Refresh Price
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(item.id); }}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Price display */}
                  <div className="mt-3">
                    {latest ? (
                      <div className="flex items-end gap-3">
                        <span className="text-2xl font-bold text-foreground">{formatPrice(latest.price, latest.currency)}</span>
                        {pctChangeVal !== null && (
                          <span className={`text-sm font-medium flex items-center gap-0.5 ${pctChangeVal > 0 ? "text-[hsl(142,71%,45%)]" : pctChangeVal < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                            {pctChangeVal > 0 ? <TrendingUp className="w-3 h-3" /> : pctChangeVal < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                            {pctChangeVal > 0 ? "+" : ""}{pctChangeVal.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Awaiting first price check...</span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    {latest?.stock_status && latest.stock_status !== "unknown" && (
                      <Badge variant={latest.stock_status === "in_stock" ? "default" : latest.stock_status === "limited" ? "secondary" : "destructive"} className="text-[10px]">
                        {latest.stock_status === "in_stock" ? "In Stock" : latest.stock_status === "limited" ? "Limited" : "Out of Stock"}
                      </Badge>
                    )}
                    <span className={`text-[10px] ${freshnessColor(item.last_checked)}`}>
                      {item.last_checked ? `Updated ${timeAgo(item.last_checked)}` : "Not yet checked"}
                    </span>
                  </div>

                  {item.status === "error" && item.last_error && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="w-3 h-3" />
                      <span className="truncate">{item.last_error}</span>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {!hasPaid && trackedItems.length >= 2 && (
            <Card className="p-4 border-primary/20 bg-primary/5 text-center">
              <p className="text-sm text-foreground font-medium mb-2">Free plan: {trackedItems.length} of 2 items used</p>
              <Button size="sm" onClick={() => window.location.href = "/pricing"}>Upgrade to track up to 10 items</Button>
            </Card>
          )}
        </div>
      )}

      {/* ---- Add Modal ---- */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Price Tracking</DialogTitle>
            <DialogDescription>Start monitoring a product's price over time.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Tracking type */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Tracking Type</Label>
              <RadioGroup value={formType} onValueChange={(v) => setFormType(v as "competitor" | "supplier")} className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="competitor" id="type-comp" />
                  <Label htmlFor="type-comp" className="text-sm">Competitor Price</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="supplier" id="type-supp" />
                  <Label htmlFor="type-supp" className="text-sm">Supplier / Commodity</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Input mode tabs */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Product Identifier</Label>
              <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "url" | "name")}>
                <TabsList className="mb-2">
                  <TabsTrigger value="url" className="text-xs">By URL</TabsTrigger>
                  <TabsTrigger value="name" className="text-xs">By Product Name</TabsTrigger>
                </TabsList>
              </Tabs>

              {inputMode === "url" ? (
                <div className="space-y-2">
                  <Input
                    placeholder="https://www.amazon.com/product/dp/B0123456789"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                  />
                  {isDuplicateUrl && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> You're already tracking this URL.
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">Paste the full product URL from the website you want to track</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input placeholder="e.g., iPhone 15 Pro Max 256GB" value={formProductName} onChange={(e) => setFormProductName(e.target.value)} />
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Product name matching is less reliable. For best results, use a direct URL.
                  </p>
                </div>
              )}
            </div>

            {/* Label */}
            <div>
              <Label className="text-sm font-medium mb-1 block">Label (optional)</Label>
              <Input placeholder="e.g., iPhone 15 Pro vs. Competitor A" value={formLabel} onChange={(e) => setFormLabel(e.target.value)} maxLength={100} />
            </div>

            {/* Frequency */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Update Frequency</Label>
              <RadioGroup value={formFrequency} onValueChange={setFormFrequency} className="grid grid-cols-2 gap-2">
                {[
                  { value: "daily", label: "Daily", desc: "Recommended" },
                  { value: "3days", label: "Every 3 days", desc: "" },
                  { value: "weekly", label: "Weekly", desc: "" },
                  { value: "manual", label: "Manual only", desc: "" },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <RadioGroupItem value={opt.value} id={`freq-${opt.value}`} />
                    <Label htmlFor={`freq-${opt.value}`} className="text-sm">
                      {opt.label} {opt.desc && <span className="text-xs text-muted-foreground">({opt.desc})</span>}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => addItemMutation.mutate()}
              disabled={addItemMutation.isPending || isDuplicateUrl || (inputMode === "url" ? !formUrl.trim() : !formProductName.trim())}
            >
              {addItemMutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
              Start Tracking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---- Edit Modal ---- */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tracking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-1 block">Label</Label>
              <Input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} maxLength={100} />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Type</Label>
              <RadioGroup value={editType} onValueChange={(v) => setEditType(v as "competitor" | "supplier")} className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="competitor" id="edit-comp" />
                  <Label htmlFor="edit-comp" className="text-sm">Competitor</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="supplier" id="edit-supp" />
                  <Label htmlFor="edit-supp" className="text-sm">Supplier</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Frequency</Label>
              <RadioGroup value={editFrequency} onValueChange={setEditFrequency} className="grid grid-cols-2 gap-2">
                {["daily", "3days", "weekly", "manual"].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <RadioGroupItem value={f} id={`edit-freq-${f}`} />
                    <Label htmlFor={`edit-freq-${f}`} className="text-sm capitalize">{f === "3days" ? "Every 3 days" : f}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => selectedItemId && updateItemMutation.mutate(selectedItemId)} disabled={updateItemMutation.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---- Delete Confirm ---- */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Tracking?</DialogTitle>
            <DialogDescription>All price history for this item will be deleted and cannot be recovered.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={() => deleteConfirmId && deleteItemMutation.mutate(deleteConfirmId)} disabled={deleteItemMutation.isPending}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
};

export default PriceTracking;
