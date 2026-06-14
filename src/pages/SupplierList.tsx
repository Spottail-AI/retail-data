import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, Download, Plus, Mail, Phone, MessageCircle, Search,
  X, Filter as FilterIcon, ArrowUpDown, ExternalLink, Loader2,
  Copy, MapPin, Globe, FileText, MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Fit = "High" | "Medium" | "Low";
type Status = "To contact" | "Contacted" | "In talks" | "Won" | "Passed";
type Priority = "High" | "Medium" | "Low";
type Channel = "Physical" | "Online" | "Both";

type ListItem = {
  id: string;
  list_id: string;
  user_id: string;
  name: string;
  website: string | null;
  channel: Channel;
  location: string | null;
  fit_score: Fit;
  why_it_matches: string | null;
  pitch_angle: string | null;
  store_type: string | null;
  audience_category: string | null;
  price_tier: string | null;
  stocks_similar: string | null;
  decision_maker_name: string | null;
  decision_maker_role: string | null;
  buy_direct_or_distributor: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  contact_form_url: string | null;
  address: string | null;
  sources: string[] | null;
  status: Status;
  priority: Priority;
  notes: string | null;
  sort_order: number;
};

type ListMeta = {
  id: string;
  product_name: string;
  list_title: string | null;
  country: string | null;
  created_at: string;
};

const FIT_RANK: Record<Fit, number> = { High: 0, Medium: 1, Low: 2 };
const PRIO_RANK: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };

const fitPill = (f: Fit) =>
  f === "High"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : f === "Medium"
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-slate-100 text-slate-600 border-slate-200";

const statusPill = (s: Status) => {
  switch (s) {
    case "Won": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "In talks": return "bg-blue-50 text-blue-700 border-blue-200";
    case "Contacted": return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "Passed": return "bg-rose-50 text-rose-700 border-rose-200";
    default: return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const prioPill = (p: Priority) =>
  p === "High"
    ? "bg-rose-50 text-rose-700 border-rose-200"
    : p === "Medium"
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-slate-100 text-slate-600 border-slate-200";

/* ───────────── Contact helpers ───────────── */

// Normalize phone to E.164. Defaults to UK (+44) when input is a local number.
function normalizePhoneE164(raw?: string | null, defaultCc = "44"): string | null {
  if (!raw) return null;
  let s = raw.replace(/[^\d+]/g, "");
  if (!s) return null;
  if (s.startsWith("+")) {
    return /^\+\d{8,15}$/.test(s) ? s : null;
  }
  if (s.startsWith("00")) s = s.slice(2);
  if (s.startsWith("0")) s = defaultCc + s.slice(1);
  if (/^\d{8,15}$/.test(s)) return "+" + s;
  return null;
}

// Best-effort cleaned phone for tel:/sms: when E.164 normalization fails.
function cleanedPhone(raw?: string | null): string | null {
  if (!raw) return null;
  const s = raw.replace(/[^\d+]/g, "");
  return s.length >= 6 ? s : null;
}

// Mobile detection — keep WhatsApp limited to numbers we can be confident are mobiles.
// UK: +447… is mobile. For other country codes we conservatively allow WhatsApp
// since most international numbers users save here are reachable on WhatsApp.
function looksLikeMobile(e164: string): boolean {
  if (e164.startsWith("+44")) return e164.startsWith("+447");
  return true;
}

function firstName(full?: string | null): string {
  if (!full) return "";
  const t = full.trim().split(/\s+/)[0];
  return t || "";
}

function buildMessage(item: ListItem): string {
  const fn = firstName(item.decision_maker_name);
  return fn
    ? `Hi ${fn}, I'm reaching out about stocking my product with ${item.name}.`
    : `Hi, I'm reaching out about stocking my product with ${item.name}.`;
}

async function copyToClipboard(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  } catch {
    toast.error("Copy failed");
  }
}

const SupplierListPage = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [meta, setMeta] = useState<ListMeta | null>(null);
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [titleDraft, setTitleDraft] = useState("");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [sortMode, setSortMode] =
    useState<"fit-priority" | "name" | "status" | "priority">("fit-priority");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");

  useEffect(() => {
    if (!listId || !session?.user?.id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [{ data: list }, { data: rows }] = await Promise.all([
        supabase.from("saved_searches").select("id, product_name, list_title, country, created_at, results").eq("id", listId).maybeSingle(),
        supabase.from("list_items").select("*").eq("list_id", listId).order("sort_order", { ascending: true }),
      ]);
      if (cancelled) return;
      if (list) {
        setMeta(list as ListMeta);
        setTitleDraft((list as ListMeta).list_title || (list as ListMeta).product_name);
      }
      let finalRows = (rows ?? []) as ListItem[];

      // Backfill: legacy saved_searches stored results as JSON only.
      // If no list_items exist yet but saved_searches.results has entries, hydrate them.
      const legacyResults = Array.isArray((list as any)?.results) ? ((list as any).results as any[]) : [];
      if (finalRows.length === 0 && legacyResults.length > 0) {
        const norm = (v: any, allowed: string[], fb: string) => (v && allowed.includes(v) ? v : fb);
        const toInsert = legacyResults.map((r: any, idx: number) => ({
          list_id: listId,
          user_id: session.user.id,
          name: String(r?.name || "Unknown").slice(0, 200),
          website: r?.website ?? null,
          channel: norm(r?.channel, ["Physical", "Online", "Both"], "Both"),
          location: r?.location ?? null,
          fit_score: norm(r?.fit_score, ["High", "Medium", "Low"], "Medium"),
          why_it_matches: r?.why_it_matches ?? r?.why ?? null,
          pitch_angle: r?.pitch_angle ?? null,
          store_type: r?.store_type ?? null,
          audience_category: r?.audience_category ?? null,
          price_tier: r?.price_tier ?? null,
          stocks_similar: norm(r?.stocks_similar, ["Competitors", "Complements", "Neither"], "Neither"),
          decision_maker_name: r?.decision_maker_name ?? null,
          decision_maker_role: r?.decision_maker_role ?? null,
          buy_direct_or_distributor: norm(r?.buy_direct_or_distributor, ["Direct", "Distributor", "Both"], "Both"),
          email: r?.email ?? null,
          phone: r?.phone ?? null,
          whatsapp: r?.whatsapp ?? null,
          contact_form_url: r?.contact_form_url ?? null,
          address: r?.address ?? null,
          sources: Array.isArray(r?.sources) ? r.sources : [],
          status: "To contact",
          priority: "Medium",
          sort_order: idx,
        }));
        const { data: inserted, error: insErr } = await supabase
          .from("list_items")
          .insert(toInsert)
          .select("*");
        if (insErr) {
          console.error("Backfill failed", insErr);
        } else if (inserted) {
          finalRows = inserted as ListItem[];
        }
      }

      setItems(finalRows);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [listId, session?.user?.id]);

  const saveTitle = async () => {
    if (!meta || !titleDraft.trim()) return;
    if (titleDraft === meta.list_title) return;
    const { error } = await supabase
      .from("saved_searches")
      .update({ list_title: titleDraft.trim() })
      .eq("id", meta.id);
    if (error) toast.error("Failed to rename");
    else setMeta({ ...meta, list_title: titleDraft.trim() });
  };

  const patchItem = useCallback(
    async (id: string, patch: Partial<ListItem>) => {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
      const { error } = await supabase.from("list_items").update(patch).eq("id", id);
      if (error) toast.error("Save failed");
    },
    []
  );

  const addStore = async () => {
    if (!listId || !session?.user?.id) return;
    const { data, error } = await supabase
      .from("list_items")
      .insert({
        list_id: listId,
        user_id: session.user.id,
        name: "New store",
        channel: "Both",
        fit_score: "Medium",
        status: "To contact",
        priority: "Medium",
        sort_order: items.length,
      })
      .select("*")
      .single();
    if (error || !data) { toast.error("Could not add row"); return; }
    setItems((prev) => [...prev, data as ListItem]);
    setActiveId(data.id);
    setOpenId(data.id);
  };

  const deleteItem = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await supabase.from("list_items").delete().eq("id", id);
  };

  const filteredSorted = useMemo(() => {
    let rows = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(q));
    }
    if (statusFilter !== "All") {
      rows = rows.filter((r) => r.status === statusFilter);
    }
    const sorted = [...rows];
    if (sortMode === "fit-priority") {
      sorted.sort((a, b) => FIT_RANK[a.fit_score] - FIT_RANK[b.fit_score] || PRIO_RANK[a.priority] - PRIO_RANK[b.priority]);
    } else if (sortMode === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === "status") {
      sorted.sort((a, b) => a.status.localeCompare(b.status));
    } else if (sortMode === "priority") {
      sorted.sort((a, b) => PRIO_RANK[a.priority] - PRIO_RANK[b.priority]);
    }
    return sorted;
  }, [items, search, sortMode, statusFilter]);

  const exportCSV = () => {
    const headers = [
      "Name","Channel","Location","Fit Score","Status","Priority",
      "Email","Phone","WhatsApp","Website","Why it matches","Pitch angle",
      "Store Type","Audience","Price Tier","Stocks Similar",
      "Decision-Maker","Decision-Maker Role","Buy Direct or Distributor","Notes",
    ];
    const rows = filteredSorted.map((r) => [
      r.name, r.channel, r.location ?? "", r.fit_score, r.status, r.priority,
      r.email ?? "", r.phone ?? "", r.whatsapp ?? "", r.website ?? "",
      r.why_it_matches ?? "", r.pitch_angle ?? "",
      r.store_type ?? "", r.audience_category ?? "", r.price_tier ?? "",
      r.stocks_similar ?? "",
      r.decision_maker_name ?? "", r.decision_maker_role ?? "",
      r.buy_direct_or_distributor ?? "", r.notes ?? "",
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(meta?.list_title || meta?.product_name || "list").replace(/\s+/g, "-")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  const totalMatched = items.length;
  const totalContacted = items.filter((i) => i.status !== "To contact").length;
  const totalToContact = items.filter((i) => i.status === "To contact").length;

  const activeItem = items.find((i) => i.id === openId) || null;

  return (
    <DashboardShell>
      {/* Header */}
      <div className="-mt-4">
        <button
          onClick={() => navigate("/stockists")}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> My lists
        </button>

        <div className="flex items-center gap-3 mb-1">
          <input
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
            className="text-xl md:text-2xl font-bold text-foreground bg-transparent outline-none focus:bg-muted/40 rounded px-2 -mx-2 py-1 flex-1 min-w-0"
            placeholder="Untitled list"
          />
        </div>

        {/* Summary bar */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{totalMatched}</span> stores and distributors matched
          </span>
          {meta?.product_name && (
            <span className="inline-flex items-center gap-1 text-xs bg-muted text-foreground/80 border border-[#E6E8EB] rounded-full px-2.5 py-1">
              Product: {meta.product_name}
            </span>
          )}
          {meta?.country && (
            <span className="inline-flex items-center gap-1 text-xs bg-muted text-foreground/80 border border-[#E6E8EB] rounded-full px-2.5 py-1">
              Country: {meta.country}
            </span>
          )}
          <Button
            size="sm" variant="outline"
            onClick={() => navigate("/stockists")}
            className="ml-auto"
          >
            Refine
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mt-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by store name…"
            className="pl-9 h-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as Status | "All")}>
          <SelectTrigger className="h-9 w-auto gap-2">
            <FilterIcon className="w-3.5 h-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(["All","To contact","Contacted","In talks","Won","Passed"] as const).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortMode} onValueChange={(v) => setSortMode(v as typeof sortMode)}>
          <SelectTrigger className="h-9 w-auto gap-2">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fit-priority">Fit Score, then Priority</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="name">Name (A–Z)</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-1.5" /> Export CSV
          </Button>
          <Button size="sm" onClick={addStore} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-1.5" /> Add store
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-4 border border-[#E6E8EB] rounded-lg overflow-hidden bg-card shadow-sm">
        {loading ? (
          <div className="p-10 flex items-center justify-center text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading list…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <TooltipProvider delayDuration={150}>
              <table className="w-full text-sm border-separate border-spacing-0">
                <thead className="bg-muted/60 sticky top-0 z-10">
                  <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="sticky left-0 z-20 bg-muted/80 backdrop-blur px-3 py-2 border-b border-r border-[#E6E8EB] min-w-[220px]">
                      Retail Store / Distributor
                    </th>
                    <th className="px-3 py-2 border-b border-[#E6E8EB] min-w-[120px]">Channel</th>
                    <th className="px-3 py-2 border-b border-[#E6E8EB] min-w-[150px]">Location</th>
                    <th className="px-3 py-2 border-b border-[#E6E8EB] min-w-[110px]">Fit Score</th>
                    <th className="px-3 py-2 border-b border-[#E6E8EB] min-w-[140px]">Status</th>
                    <th className="px-3 py-2 border-b border-[#E6E8EB] min-w-[110px]">Priority</th>
                    <th className="px-3 py-2 border-b border-[#E6E8EB] min-w-[120px]">Contact</th>
                    <th className="px-3 py-2 border-b border-[#E6E8EB] w-[40px]" />
                  </tr>
                </thead>
                <tbody>
                  {filteredSorted.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                        No stores match your filters.
                      </td>
                    </tr>
                  )}
                  {filteredSorted.map((it) => {
                    const isActive = activeId === it.id;
                    return (
                      <tr
                        key={it.id}
                        className={cn(
                          "group bg-card hover:bg-muted/30 transition-colors cursor-pointer",
                          isActive && "ring-2 ring-inset ring-primary/60"
                        )}
                        onClick={() => { setActiveId(it.id); setOpenId(it.id); }}
                      >
                        <td className="sticky left-0 z-10 bg-card group-hover:bg-muted/30 px-3 py-2.5 border-b border-r border-[#E6E8EB] font-medium text-foreground min-w-[220px]">
                          <div className="truncate">{it.name}</div>
                          {it.website && (
                            <a
                              href={it.website}
                              target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-0.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {it.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "").slice(0, 40)}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </td>

                        <td
                          className="px-2 py-1 border-b border-[#E6E8EB]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Select
                            value={it.channel}
                            onValueChange={(v) => patchItem(it.id, { channel: v as Channel })}
                          >
                            <SelectTrigger className="h-8 border-transparent bg-transparent hover:bg-muted/60 focus:bg-card focus:border-input text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(["Physical","Online","Both"] as Channel[]).map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>

                        <td className="px-3 py-2.5 border-b border-[#E6E8EB] text-foreground/90">
                          {it.location || <span className="text-muted-foreground">—</span>}
                        </td>

                        <td className="px-3 py-2.5 border-b border-[#E6E8EB]">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                                fitPill(it.fit_score)
                              )}>{it.fit_score}</span>
                            </TooltipTrigger>
                            {it.why_it_matches && (
                              <TooltipContent side="top" className="max-w-xs">
                                <p className="text-xs leading-relaxed">{it.why_it_matches}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </td>

                        <td className="px-2 py-1 border-b border-[#E6E8EB]" onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={it.status}
                            onValueChange={(v) => patchItem(it.id, { status: v as Status })}
                          >
                            <SelectTrigger className={cn(
                              "h-7 border w-auto px-2 py-0 text-xs font-medium rounded-full hover:opacity-90",
                              statusPill(it.status)
                            )}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(["To contact","Contacted","In talks","Won","Passed"] as Status[]).map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>

                        <td className="px-2 py-1 border-b border-[#E6E8EB]" onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={it.priority}
                            onValueChange={(v) => patchItem(it.id, { priority: v as Priority })}
                          >
                            <SelectTrigger className={cn(
                              "h-7 border w-auto px-2 py-0 text-xs font-medium rounded-full",
                              prioPill(it.priority)
                            )}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(["High","Medium","Low"] as Priority[]).map((p) => (
                                <SelectItem key={p} value={p}>{p}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>

                        <td className="px-3 py-2.5 border-b border-[#E6E8EB]" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            {it.email ? (
                              <a href={`mailto:${it.email}`} title={it.email} className="text-muted-foreground hover:text-primary">
                                <Mail className="w-4 h-4" />
                              </a>
                            ) : <Mail className="w-4 h-4 text-muted-foreground/30" />}
                            {it.phone ? (
                              <a href={`tel:${it.phone}`} title={it.phone} className="text-muted-foreground hover:text-primary">
                                <Phone className="w-4 h-4" />
                              </a>
                            ) : <Phone className="w-4 h-4 text-muted-foreground/30" />}
                            {it.whatsapp ? (
                              <a
                                href={`https://wa.me/${it.whatsapp.replace(/[^\d]/g, "")}`}
                                target="_blank" rel="noopener noreferrer"
                                title={it.whatsapp}
                                className="text-muted-foreground hover:text-emerald-600"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>
                            ) : <MessageCircle className="w-4 h-4 text-muted-foreground/30" />}
                          </div>
                        </td>

                        <td className="px-2 py-1 border-b border-[#E6E8EB] text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => deleteItem(it.id)}
                            className="text-muted-foreground/40 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            aria-label="Remove row"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TooltipProvider>
          </div>
        )}

        {/* Bottom status bar */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-4 py-2 border-t border-[#E6E8EB] bg-muted/40 text-xs text-muted-foreground">
          <span><span className="font-semibold text-foreground">{totalMatched}</span> total matched</span>
          <span><span className="font-semibold text-foreground">{totalContacted}</span> in pipeline</span>
          <span><span className="font-semibold text-foreground">{totalToContact}</span> still to contact</span>
        </div>
      </div>

      {/* Detail panel */}
      <Sheet open={!!openId} onOpenChange={(v) => !v && setOpenId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          {activeItem && (
            <DetailPanel item={activeItem} onChange={(patch) => patchItem(activeItem.id, patch)} />
          )}
        </SheetContent>
      </Sheet>
    </DashboardShell>
  );
};

/* ───────────── Detail Panel ───────────── */

const DetailPanel = ({
  item, onChange,
}: { item: ListItem; onChange: (p: Partial<ListItem>) => void }) => {
  const [notesDraft, setNotesDraft] = useState(item.notes || "");
  useEffect(() => setNotesDraft(item.notes || ""), [item.id]); // eslint-disable-line

  const editableText = (
    label: string,
    field: keyof ListItem,
    placeholder = "—"
  ) => (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">{label}</p>
      <input
        defaultValue={(item[field] as string) || ""}
        onBlur={(e) => {
          const v = e.target.value.trim();
          if (v !== ((item[field] as string) || "")) onChange({ [field]: v || null } as Partial<ListItem>);
        }}
        placeholder={placeholder}
        className="w-full text-sm bg-transparent border-b border-transparent hover:border-[#E6E8EB] focus:border-primary outline-none py-1"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle className="text-left">
          <input
            defaultValue={item.name}
            onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== item.name) onChange({ name: v }); }}
            className="text-lg font-bold bg-transparent w-full outline-none focus:bg-muted/40 rounded px-1 -mx-1"
          />
        </SheetTitle>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs bg-muted border border-[#E6E8EB] rounded-full px-2 py-0.5">{item.channel}</span>
          {item.location && (
            <span className="text-xs bg-muted border border-[#E6E8EB] rounded-full px-2 py-0.5">{item.location}</span>
          )}
          <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
            fitPill(item.fit_score)
          )}>Fit: {item.fit_score}</span>
        </div>
      </SheetHeader>

      {/* Featured */}
      <div className="space-y-3 rounded-lg bg-muted/40 border border-[#E6E8EB] p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Why it matches</p>
          <Textarea
            defaultValue={item.why_it_matches || ""}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (item.why_it_matches || "")) onChange({ why_it_matches: v || null });
            }}
            placeholder="What makes this a strong fit…"
            className="min-h-[64px] bg-card"
          />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Pitch angle</p>
          <Textarea
            defaultValue={item.pitch_angle || ""}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (item.pitch_angle || "")) onChange({ pitch_angle: v || null });
            }}
            placeholder="A tailored angle for this specific store…"
            className="min-h-[64px] bg-card"
          />
        </div>
      </div>

      {/* Status + Priority */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Status</p>
          <Select value={item.status} onValueChange={(v) => onChange({ status: v as Status })}>
            <SelectTrigger className={cn("h-9 border", statusPill(item.status))}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["To contact","Contacted","In talks","Won","Passed"] as Status[]).map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Priority</p>
          <Select value={item.priority} onValueChange={(v) => onChange({ priority: v as Priority })}>
            <SelectTrigger className={cn("h-9 border", prioPill(item.priority))}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["High","Medium","Low"] as Priority[]).map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Details */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Details</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 border border-[#E6E8EB] rounded-lg p-3">
          {editableText("Store Type", "store_type", "e.g. Independent boutique")}
          {editableText("Audience Category", "audience_category", "e.g. Premium 25-45 urban")}
          {editableText("Price Tier", "price_tier", "Budget / Mid / Premium / Luxury")}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Stocks Similar</p>
            <Select
              value={item.stocks_similar || "Neither"}
              onValueChange={(v) => onChange({ stocks_similar: v })}
            >
              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Competitors","Complements","Neither"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {editableText("Decision-Maker Name", "decision_maker_name", "or leave blank")}
          {editableText("Decision-Maker Role", "decision_maker_role", "e.g. Owner / Buyer")}
          <div className="col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Buy Direct or Distributor</p>
            <Select
              value={item.buy_direct_or_distributor || "Both"}
              onValueChange={(v) => onChange({ buy_direct_or_distributor: v })}
            >
              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Direct","Distributor","Both"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Contact action bar */}
      <ContactActionBar item={item} />

      {/* Contact */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Contact</h3>
        <div className="grid grid-cols-1 gap-3 border border-[#E6E8EB] rounded-lg p-3">
          {editableText("Email", "email", "name@store.com")}
          {editableText("Contact Form URL", "contact_form_url", "https://…/wholesale")}
          {editableText("Phone", "phone", "+44 7700 900123")}
          {editableText("WhatsApp", "whatsapp", "+44 7700 900123")}
          {editableText("Website", "website", "https://store.com")}
          {editableText("Address", "address", "Street, City, Postcode")}
      </div>

      {/* Sources */}
      {Array.isArray(item.sources) && item.sources.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Sources
          </h3>
          <ul className="border border-[#E6E8EB] rounded-lg p-3 space-y-1.5">
            {item.sources.map((url, i) => {
              let host = url;
              try { host = new URL(url).hostname.replace(/^www\./, ""); } catch { /* noop */ }
              return (
                <li key={`${url}-${i}`} className="flex items-start gap-2 text-sm">
                  <ExternalLink className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                    title={url}
                  >
                    {host}
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="text-[11px] text-muted-foreground mt-1.5">
            Facts above were grounded in these web sources.
          </p>
        </div>
      )}
      </div>

      {/* Notes */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Notes</h3>
        <Textarea
          value={notesDraft}
          onChange={(e) => setNotesDraft(e.target.value)}
          onBlur={() => {
            if (notesDraft !== (item.notes || "")) onChange({ notes: notesDraft || null });
          }}
          placeholder="Conversation notes, follow-ups, anything useful…"
          className="min-h-[120px]"
        />
      </div>
    </div>
  );
};

/* ───────────── Contact Action Bar ───────────── */

const ContactActionBar = ({ item }: { item: ListItem }) => {
  const message = buildMessage(item);
  const subject = "Stocking enquiry";
  const encMsg = encodeURIComponent(message);
  const encSubject = encodeURIComponent(subject);

  const e164 = normalizePhoneE164(item.phone);
  const e164Whatsapp = normalizePhoneE164(item.whatsapp || item.phone);
  const phoneForLinks = e164 || cleanedPhone(item.phone);
  const whatsappOk = !!(e164Whatsapp && looksLikeMobile(e164Whatsapp));

  const emailHref = item.email
    ? `mailto:${item.email}?subject=${encSubject}&body=${encMsg}`
    : null;
  const formHref = !item.email && item.contact_form_url ? item.contact_form_url : null;

  const telHref = phoneForLinks ? `tel:${phoneForLinks}` : null;
  const smsHref = phoneForLinks ? `sms:${phoneForLinks}?body=${encMsg}` : null;
  const waHref = whatsappOk
    ? `https://wa.me/${e164Whatsapp!.replace(/^\+/, "")}?text=${encMsg}`
    : null;

  const websiteHref = item.website || null;
  const mapsHref = item.address
    ? `https://maps.google.com/?q=${encodeURIComponent(item.address)}`
    : null;

  const nothing =
    !emailHref && !formHref && !telHref && !smsHref && !waHref && !websiteHref && !mapsHref;

  if (nothing) {
    return (
      <div className="rounded-lg border border-dashed border-[#E6E8EB] p-3 text-xs text-muted-foreground">
        Add an email, phone, website, or address below to enable one-click outreach.
      </div>
    );
  }

  const btn =
    "inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-[#E6E8EB] bg-card text-sm font-medium text-foreground hover:bg-muted/60 transition-colors";

  return (
    <div className="rounded-lg border border-[#E6E8EB] bg-muted/30 p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Reach out
        </h3>
        <button
          onClick={() => copyToClipboard(message, "Message")}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          title="Copy pre-filled message"
        >
          <Copy className="w-3.5 h-3.5" /> Copy message
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {waHref && (
          <a href={waHref} target="_blank" rel="noopener noreferrer"
            className={cn(btn, "text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100")}>
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        )}
        {smsHref && (
          <a href={smsHref} className={btn}>
            <MessageSquare className="w-4 h-4" /> SMS
          </a>
        )}
        {emailHref && (
          <a href={emailHref} className={btn}>
            <Mail className="w-4 h-4" /> Email
          </a>
        )}
        {formHref && (
          <a href={formHref} target="_blank" rel="noopener noreferrer" className={btn}>
            <FileText className="w-4 h-4" /> Open contact form
          </a>
        )}
        {telHref && (
          <a href={telHref} className={btn}>
            <Phone className="w-4 h-4" /> Call
          </a>
        )}
        {websiteHref && (
          <a href={websiteHref} target="_blank" rel="noopener noreferrer" className={btn}>
            <Globe className="w-4 h-4" /> Open website
          </a>
        )}
        {mapsHref && (
          <a href={mapsHref} target="_blank" rel="noopener noreferrer" className={btn}>
            <MapPin className="w-4 h-4" /> Open in Maps
          </a>
        )}
      </div>

      {/* Desktop fallbacks: tel/sms/wa.me are unreliable on desktop */}
      {(phoneForLinks || item.phone) && (
        <div className="hidden md:flex flex-wrap gap-2 mt-2 pt-2 border-t border-[#E6E8EB]/60">
          {(phoneForLinks || item.phone) && (
            <button
              onClick={() => copyToClipboard(phoneForLinks || item.phone || "", "Number")}
              className={cn(btn, "text-xs h-8 px-2.5")}
            >
              <Copy className="w-3.5 h-3.5" /> Copy number
            </button>
          )}
          <button
            onClick={() => copyToClipboard(message, "Message")}
            className={cn(btn, "text-xs h-8 px-2.5")}
          >
            <Copy className="w-3.5 h-3.5" /> Copy message
          </button>
        </div>
      )}
    </div>
  );
};

export default SupplierListPage;
