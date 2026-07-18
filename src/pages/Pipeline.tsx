import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ChevronDown, ChevronRight, Download, Plus, Search, Loader2, ExternalLink,
  Copy, Mail, Sparkles, LayoutGrid, Table2, Rss, RefreshCw, X, AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
const db = supabase as any; // new tables pending type regeneration

/* ───────────────────────── types ───────────────────────── */

type Stage = "to_contact" | "contacted" | "in_conversation" | "sampling" | "stocked" | "passed";

type Row = {
  id: string;
  product_id: string;
  retailer_id: string;
  stage: Stage;
  fit: number | null;
  why: string | null;
  pitch_angle: string | null;
  how_to_get_in: { steps?: string[]; requirements?: string[]; submission_url?: string | null } | null;
  contact_channel: string | null;
  email: string | null;
  phone: string | null;
  contact_form_url: string | null;
  location: string | null;
  next_action: string | null;
  next_due: string | null;
  notes: string | null;
  last_touch: string | null;
  sources: string[];
  is_new: boolean;
  user_edited: boolean;
  retailers: { name: string; domain: string; website: string | null; segment: string | null; location: string | null };
};

type ProductMeta = {
  id: string; name: string; url: string | null;
  profile?: {
    vertical?: string; category?: string; subcategory?: string;
    price_point?: string; msrp_estimate?: string;
    attributes?: string[]; comparable_brands?: string[];
  } | null;
};
type Feed = { id: string; params: any; new_count: number; existing_count: number; ran_at: string };
type EventRow = { label: string; at: string };
type CrossRef = { productName: string; stage: Stage };

const STAGES: { id: Stage; label: string; dot: string; pill: string }[] = [
  { id: "to_contact", label: "To contact", dot: "bg-slate-400", pill: "bg-slate-100 text-slate-600" },
  { id: "contacted", label: "Contacted", dot: "bg-blue-500", pill: "bg-blue-50 text-blue-700" },
  { id: "in_conversation", label: "In conversation", dot: "bg-violet-500", pill: "bg-violet-50 text-violet-700" },
  { id: "sampling", label: "Sampling", dot: "bg-amber-500", pill: "bg-amber-50 text-amber-700" },
  { id: "stocked", label: "Stocked", dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700" },
  { id: "passed", label: "Passed", dot: "bg-rose-400", pill: "bg-rose-50 text-rose-600" },
];
const stageMeta = (s: Stage) => STAGES.find((x) => x.id === s)!;

const SEGMENTS: { id: string; label: string }[] = [
  { id: "national_distributor", label: "National distributors" },
  { id: "regional_distributor", label: "Regional & specialty distributors" },
  { id: "retail_chain", label: "Retail chains" },
  { id: "independent_marketplace", label: "Independent & marketplace" },
];

const today = () => new Date().toISOString().slice(0, 10);
const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—";

/* ───────────────────────── page ───────────────────────── */

const Pipeline = () => {
  const { productId } = useParams<{ productId: string }>();
  const { session } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductMeta | null>(null);
  const [products, setProducts] = useState<ProductMeta[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [crossRefs, setCrossRefs] = useState<Map<string, CrossRef>>(new Map());
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<"sheet" | "board" | "feeds">("sheet");
  const [stageFilter, setStageFilter] = useState<Stage | null>(null);
  const [newFilter, setNewFilter] = useState(false);
  const [feedFilter, setFeedFilter] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [showQ, setShowQ] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [panelRow, setPanelRow] = useState<Row | null>(null);
  const [panelEnriching, setPanelEnriching] = useState(false);
  const enriching = useRef<Set<string>>(new Set());
  const [events, setEvents] = useState<EventRow[]>([]);
  const [diffBanner, setDiffBanner] = useState<{ new: number; existing: number; inMotion: number } | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [showSourceStrip, setShowSourceStrip] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [pitchRow, setPitchRow] = useState<Row | null>(null);
  const [searching, setSearching] = useState(false);
  const [deepSearching, setDeepSearching] = useState(false);

  /* ── data loading ── */
  const loadAll = useCallback(async () => {
    if (!session?.user?.id || !productId) return;
    const [{ data: prod }, { data: prods }, { data: rowData }, { data: feedData }] = await Promise.all([
      db.from("products").select("id,name,url,profile").eq("id", productId).single(),
      db.from("products").select("id,name,url").eq("user_id", session.user.id).order("created_at"),
      db.from("pipeline_rows")
        .select("*, retailers(name,domain,website,segment,location)")
        .eq("product_id", productId)
        .order("fit", { ascending: false }),
      db.from("pipeline_searches").select("id,params,new_count,existing_count,ran_at")
        .eq("product_id", productId).order("ran_at", { ascending: false }),
    ]);
    if (!prod) { navigate("/stockists"); return; }
    setProduct(prod);
    setProducts(prods || []);
    setRows((rowData || []) as Row[]);
    setFeeds((feedData || []) as Feed[]);
    setLoading(false);

    // cross-pipeline awareness
    const retailerIds = (rowData || []).map((r: Row) => r.retailer_id);
    if (retailerIds.length) {
      const { data: sib } = await db.from("pipeline_rows")
        .select("retailer_id, stage, products(name)")
        .eq("user_id", session.user.id)
        .neq("product_id", productId)
        .in("retailer_id", retailerIds);
      const map = new Map<string, CrossRef>();
      for (const s of sib || []) {
        map.set(s.retailer_id, { productName: s.products?.name || "another product", stage: s.stage });
      }
      setCrossRefs(map);
    }
  }, [session?.user?.id, productId, navigate]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Source cross-sell: user has searched (they're here) but has no Source profile.
  useEffect(() => {
    (async () => {
      if (!session?.user?.id || localStorage.getItem("spottail_source_promo_dismissed")) return;
      const { data } = await db.from("source_products").select("id").eq("user_id", session.user.id).limit(1);
      if (!data || data.length === 0) setShowSourceStrip(true);
    })();
  }, [session?.user?.id]);

  /* ── row updates ── */
  const patchRow = useCallback(async (id: string, patch: Partial<Row>, log?: string) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    const { error } = await db.from("pipeline_rows").update(patch).eq("id", id);
    if (error) { toast.error("Couldn't save — retry"); return; }
    if (log && session?.user?.id) {
      await db.from("pipeline_events").insert({ row_id: id, user_id: session.user.id, label: log });
    }
  }, [session?.user?.id]);

  const setStage = (row: Row, stage: Stage) => {
    if (stage === row.stage) return;
    patchRow(row.id, { stage, last_touch: today(), user_edited: true }, `Stage → ${stageMeta(stage).label}`);
    if (panelRow?.id === row.id) setPanelRow({ ...row, stage, last_touch: today() });
  };

  /* ── derived ── */
  const counts = useMemo(() => {
    const c: Record<Stage, number> = { to_contact: 0, contacted: 0, in_conversation: 0, sampling: 0, stocked: 0, passed: 0 };
    rows.forEach((r) => { c[r.stage]++; });
    return c;
  }, [rows]);
  const newCount = useMemo(() => rows.filter((r) => r.is_new).length, [rows]);
  const overdue = useMemo(
    () => rows.filter((r) => r.next_due && r.next_due < today() && !["stocked", "passed"].includes(r.stage)).length,
    [rows]
  );
  const inMotion = useMemo(() => rows.filter((r) => !["to_contact", "passed"].includes(r.stage)).length, [rows]);

  const visible = useMemo(() => {
    let v = rows;
    if (stageFilter) v = v.filter((r) => r.stage === stageFilter);
    if (newFilter) v = v.filter((r) => r.is_new);
    if (feedFilter) v = v.filter((r) => r.sources?.some((s) => s === feedFilter || s.endsWith(feedFilter)));
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      v = v.filter((r) => r.retailers.name.toLowerCase().includes(needle) || r.retailers.domain.includes(needle));
    }
    return v;
  }, [rows, stageFilter, newFilter, feedFilter, q]);

  const grouped = useMemo(
    () => SEGMENTS.map((seg) => ({
      ...seg,
      rows: visible.filter((r) => (r.retailers.segment || "retail_chain") === seg.id),
    })).filter((g) => g.rows.length > 0),
    [visible]
  );

  /* ── actions ── */
  const openPanel = async (row: Row) => {
    setPanelRow(row);
    const { data } = await db.from("pipeline_events").select("label,at").eq("row_id", row.id).order("at", { ascending: false }).limit(12);
    setEvents((data || []) as EventRow[]);
    // Lazy enrichment: search returns light rows; fetch how-to-get-in + contact on first open (cached per retailer).
    if (!row.how_to_get_in && !enriching.current.has(row.id)) {
      enriching.current.add(row.id);
      setPanelEnriching(true);
      try {
        const { data: intel } = await supabase.functions.invoke("retailer-intel", {
          body: { mode: "find_contact", retailer_id: row.retailer_id, row_id: row.id },
        });
        if (intel && !intel.error) {
          const updated: Row = {
            ...row,
            how_to_get_in: intel.how_to_get_in || row.how_to_get_in,
            contact_channel: intel.contact?.channel || row.contact_channel,
            contact_form_url: intel.contact?.url || row.contact_form_url,
            email: intel.contact?.email || row.email,
          };
          setRows((rs) => rs.map((r) => (r.id === row.id ? updated : r)));
          setPanelRow((p) => (p?.id === row.id ? updated : p));
        }
      } catch { /* row stays light; Find contact button remains */ }
      setPanelEnriching(false);
    }
  };

  const runSearch = async (params: { country: string; region?: string; brand_stage: string; mode?: "normal" | "deep" }) => {
    const setBusy = params.mode === "deep" ? setDeepSearching : setSearching;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("pipeline-search", {
        body: { product_id: productId, ...params },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message);
      setDiffBanner({ new: data.new_count, existing: data.existing_count, inMotion: data.in_motion_count });
      if (data.widen_suggestion) toast.info(data.widen_suggestion);
      if (data.upgradeRequired) toast.info("Upgrade to see all matches — free plan shows 5 prospects per pipeline.");
      setSearchOpen(false);
      await loadAll();
    } catch (e: any) {
      toast.error(e.message || "Search failed — try again");
    } finally {
      setBusy(false);
    }
  };

  const exportCsv = () => {
    const header = ["Name", "Website", "Segment", "Fit", "Stage", "Next action", "Due", "Contact", "Email", "Phone", "Last touch", "Notes"];
    const lines = visible.map((r) => [
      r.retailers.name, r.retailers.website || "", r.retailers.segment || "", r.fit ?? "",
      stageMeta(r.stage).label, r.next_action || "", r.next_due || "", r.contact_channel || "",
      r.email || "", r.phone || "", r.last_touch || "", (r.notes || "").replace(/\n/g, " "),
    ].map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","));
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${product?.name || "pipeline"}-pipeline.csv`;
    a.click();
  };

  const findContact = async (row: Row) => {
    toast.promise(
      (async () => {
        const { data, error } = await supabase.functions.invoke("retailer-intel", {
          body: { mode: "find_contact", retailer_id: row.retailer_id, row_id: row.id },
        });
        if (error || data?.error) throw new Error(data?.error || "failed");
        await loadAll();
        return data.contact;
      })(),
      {
        loading: `Finding the way into ${row.retailers.name}…`,
        success: (c: any) => c?.channel ? `${c.channel}${c.guidance ? ` — ${c.guidance}` : ""}` : "Channel found",
        error: "Couldn't resolve a contact channel",
      }
    );
  };

  /* ── render helpers ── */
  const StagePill = ({ row }: { row: Row }) => {
    const m = stageMeta(row.stage);
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className={cn("inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap", m.pill)}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", m.dot)} />
            {m.label}
            <ChevronDown className="w-3 h-3 opacity-50" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
          {STAGES.map((s) => (
            <DropdownMenuItem key={s.id} onClick={() => setStage(row, s.id)} className="gap-2 text-sm">
              <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} /> {s.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const InlineCell = ({ row, field, placeholder }: { row: Row; field: "next_action" | "notes"; placeholder: string }) => {
    const [editing, setEditing] = useState(false);
    const [val, setVal] = useState(row[field] || "");
    useEffect(() => setVal(row[field] || ""), [row, field]);
    if (editing) {
      return (
        <Input
          autoFocus value={val}
          onChange={(e) => setVal(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onBlur={() => { setEditing(false); if (val !== (row[field] || "")) patchRow(row.id, { [field]: val || null, user_edited: true } as any); }}
          onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
          className="h-7 text-xs"
        />
      );
    }
    return (
      <button
        onClick={(e) => { e.stopPropagation(); setEditing(true); }}
        className={cn("text-left text-xs rounded px-1 -mx-1 py-0.5 hover:bg-muted w-full truncate", !row[field] && "text-muted-foreground/60")}
      >
        {row[field] || placeholder}
      </button>
    );
  };

  const RowLine = ({ row }: { row: Row }) => {
    const xref = crossRefs.get(row.retailer_id);
    const isOverdue = row.next_due && row.next_due < today() && !["stocked", "passed"].includes(row.stage);
    return (
      <tr onClick={() => openPanel(row)} className="cursor-pointer hover:bg-muted/40 border-b border-border/60 group">
        <td className="pl-4 pr-1 py-2 w-8" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={selected.has(row.id)}
            onChange={(e) => {
              const s = new Set(selected);
              e.target.checked ? s.add(row.id) : s.delete(row.id);
              setSelected(s);
            }}
            className="accent-primary"
          />
        </td>
        <td className="px-2 py-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{row.retailers.name}</span>
            {row.is_new && <span className="w-1.5 h-1.5 rounded-full bg-primary" title="New from last search" />}
            {xref && (
              <span className="text-[10px] font-medium bg-violet-50 text-violet-700 rounded px-1.5 py-0.5">
                ⧉ {xref.productName}
              </span>
            )}
            <span className="text-xs text-muted-foreground">{row.retailers.domain}</span>
          </div>
        </td>
        <td className="px-2 py-2 w-14">
          <span className={cn("text-sm font-bold", (row.fit ?? 0) >= 85 ? "text-primary" : "text-foreground")}>{row.fit ?? "—"}</span>
        </td>
        <td className="px-2 py-2 w-40"><StagePill row={row} /></td>
        <td className="px-2 py-2 max-w-[220px]">
          <InlineCell row={row} field="next_action" placeholder="+ next action" />
          {row.next_due && (
            <div className={cn("text-[10px] mt-0.5", isOverdue ? "text-rose-600 font-semibold" : "text-muted-foreground")}>
              {isOverdue && "⚠ overdue · "}{fmtDate(row.next_due)}
            </div>
          )}
        </td>
        <td className="px-2 py-2 w-40">
          {row.contact_channel && !/unknown|not found|n\/a/i.test(row.contact_channel) ? (
            <span className="text-xs">{row.contact_channel}</span>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); findContact(row); }}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Find contact →
            </button>
          )}
        </td>
        <td className="px-2 py-2 w-20 text-xs text-muted-foreground whitespace-nowrap">{fmtDate(row.last_touch)}</td>
        <td className="px-2 py-2 max-w-[180px]"><InlineCell row={row} field="notes" placeholder="+ note" /></td>
      </tr>
    );
  };

  /* ── page ── */
  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto px-2">
        {/* breadcrumb + title */}
        <div className="text-xs text-muted-foreground mb-4">
          <button onClick={() => navigate("/stockists")} className="hover:text-foreground">My pipelines</button>
          <span className="mx-1.5">/</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:text-foreground font-medium">
              {product?.name} ▾
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {products.map((p) => (
                <DropdownMenuItem key={p.id} onClick={() => navigate(`/pipeline/${p.id}`)}>{p.name}</DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => navigate("/stockists")} className="text-primary font-medium">
                <Plus className="w-3.5 h-3.5 mr-1" /> New product pipeline
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h1 className="text-3xl font-medium mb-2" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
          {product?.name} — Retail Pipeline
        </h1>

        {/* Stage A product profile strip */}
        {product?.profile && (
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] mb-2">
            <span className="text-muted-foreground/70 font-semibold uppercase tracking-wide mr-1">We read your product as</span>
            {product.profile.category && (
              <span className="bg-muted rounded px-2 py-0.5 text-muted-foreground">
                <b className="text-foreground font-semibold">{product.profile.category}</b>
                {product.profile.subcategory ? ` › ${product.profile.subcategory}` : ""}
              </span>
            )}
            {product.profile.price_point && (
              <span className="bg-muted rounded px-2 py-0.5 text-muted-foreground capitalize">
                {product.profile.price_point}{product.profile.msrp_estimate ? ` · ${product.profile.msrp_estimate}` : ""}
              </span>
            )}
            {(product.profile.attributes || []).slice(0, 4).map((a) => (
              <span key={a} className="bg-muted rounded px-2 py-0.5 text-muted-foreground">{a}</span>
            ))}
            {(product.profile.comparable_brands || []).length > 0 && (
              <span className="bg-accent rounded px-2 py-0.5 text-accent-foreground">
                Comparable: {(product.profile.comparable_brands || []).slice(0, 3).join(", ")}
              </span>
            )}
          </div>
        )}

        {/* meta line: stage counts as filters */}
        <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground mb-1">
          {STAGES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStageFilter(stageFilter === s.id ? null : s.id)}
              className={cn("inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 hover:bg-muted", stageFilter === s.id && "bg-card ring-1 ring-primary text-foreground")}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
              <b className="text-foreground font-semibold">{counts[s.id]}</b> {s.label.toLowerCase()}
            </button>
          ))}
          {newCount > 0 && (
            <button
              onClick={() => setNewFilter(!newFilter)}
              className={cn("inline-flex items-center gap-1 font-semibold text-primary rounded-md px-1.5 py-1 hover:bg-accent", newFilter && "bg-accent")}
            >
              <Sparkles className="w-3 h-3" /> {newCount} new from last search
            </button>
          )}
        </div>

        {/* diff banner */}
        {diffBanner && (
          <div className="flex items-center gap-2 text-xs bg-accent text-accent-foreground rounded-lg px-3 py-2 mt-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              Search found <b>{diffBanner.new + diffBanner.existing}</b> matches — <b>{diffBanner.new} new</b> added,{" "}
              {diffBanner.existing} already here{diffBanner.inMotion > 0 && ` (${diffBanner.inMotion} in motion)`}
            </span>
            <button className="ml-auto" onClick={() => setDiffBanner(null)}><X className="w-3.5 h-3.5" /></button>
          </div>
        )}

        {/* tabs + actions */}
        <div className="flex items-center border-b border-border mt-5 mb-0">
          {([["sheet", "Sheet", Table2], ["board", "Board", LayoutGrid], ["feeds", "Feeds", Rss]] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm border-b-2 -mb-px",
                view === id ? "border-foreground font-semibold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1 pb-1.5">
            {showQ ? (
              <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => !q && setShowQ(false)}
                placeholder="Filter…" className="h-8 w-44 text-xs" />
            ) : (
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setShowQ(true)}><Search className="w-4 h-4" /></Button>
            )}
            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={exportCsv} title="Export CSV"><Download className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setAddOpen(true)} title="Add store"><Plus className="w-4 h-4" /></Button>
            <Button size="sm" className="h-8 ml-1" onClick={() => setSearchOpen(true)}>New search</Button>
          </div>
        </div>

        {/* bulk bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 text-xs py-2 border-b border-border">
            <span className="text-muted-foreground">{selected.size} selected</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="h-7 text-xs">Set stage ▾</Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                {STAGES.map((s) => (
                  <DropdownMenuItem key={s.id} onClick={() => {
                    rows.filter((r) => selected.has(r.id)).forEach((r) => setStage(r, s.id));
                    setSelected(new Set());
                  }} className="gap-2 text-sm">
                    <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} /> {s.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setSelected(new Set())}>Clear</Button>
          </div>
        )}

        {/* ═════════ SHEET ═════════ */}
        {view === "sheet" && (
          <>
            <table className="w-full border-collapse mt-1">
              <thead>
                <tr className="text-[11px] text-muted-foreground/80 border-b border-border">
                  <th className="w-8" />
                  <th className="text-left font-medium px-2 py-2">Name</th>
                  <th className="text-left font-medium px-2 py-2">Fit</th>
                  <th className="text-left font-medium px-2 py-2">Stage</th>
                  <th className="text-left font-medium px-2 py-2">Next action</th>
                  <th className="text-left font-medium px-2 py-2">Contact</th>
                  <th className="text-left font-medium px-2 py-2">Last touch</th>
                  <th className="text-left font-medium px-2 py-2">Notes</th>
                </tr>
              </thead>
              {grouped.map((g) => (
                <tbody key={g.id}>
                  <tr onClick={() => {
                    const c = new Set(collapsed);
                    c.has(g.id) ? c.delete(g.id) : c.add(g.id);
                    setCollapsed(c);
                  }} className="cursor-pointer">
                    <td colSpan={8} className="pt-5 pb-1.5 px-2">
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-foreground">
                        {collapsed.has(g.id) ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {g.label} <span className="font-normal text-muted-foreground/70">{g.rows.length}</span>
                      </span>
                    </td>
                  </tr>
                  {!collapsed.has(g.id) && g.rows.map((r) => <RowLine key={r.id} row={r} />)}
                </tbody>
              ))}
            </table>
            {visible.length === 0 && (
              <div className="text-center py-16 text-sm text-muted-foreground">
                {rows.length === 0 ? "Run a search to build this pipeline." : "Nothing matches the current filters."}
              </div>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-6 pb-4">
              <span><b className="text-foreground">{rows.length}</b> matched</span>
              <span><b className="text-foreground">{inMotion}</b> in motion</span>
              <span><b className="text-foreground">{overdue}</b> need follow-up</span>
              <button
                onClick={() => runSearch({ country: (feeds[0]?.params?.country as string) || "United States", brand_stage: (feeds[0]?.params?.brand_stage as string) || "dtc_only", mode: "deep" })}
                disabled={deepSearching}
                className="ml-auto inline-flex items-center gap-1 font-semibold text-primary hover:underline disabled:opacity-50"
              >
                {deepSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                Find more — deep search
              </button>
            </div>
            {showSourceStrip && (
              <div className="flex items-center gap-3 bg-muted/40 border border-border rounded-lg px-4 py-2.5 mb-6 text-xs">
                <span className="text-muted-foreground">
                  <b className="text-foreground">While you pitch buyers, let buyers find you</b> — retail buyers browse Spottail Source for new brands.
                </span>
                <button
                  className="ml-auto font-semibold text-primary hover:underline whitespace-nowrap"
                  onClick={() => window.open("/source/new", "_blank", "noopener")}
                >
                  Create Source profile →
                </button>
                <button
                  className="text-muted-foreground hover:text-foreground"
                  title="Dismiss permanently"
                  onClick={() => { localStorage.setItem("spottail_source_promo_dismissed", "1"); setShowSourceStrip(false); }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* ═════════ BOARD ═════════ */}
        {view === "board" && (
          <div className="flex gap-4 overflow-x-auto mt-5 pb-4 items-start">
            {STAGES.map((s) => {
              const colRows = visible.filter((r) => r.stage === s.id);
              return (
                <div
                  key={s.id}
                  className="flex-shrink-0 w-56"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const id = e.dataTransfer.getData("rowId");
                    const row = rows.find((r) => r.id === id);
                    if (row) setStage(row, s.id);
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium", s.pill)}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} /> {s.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{colRows.length}</span>
                  </div>
                  {colRows.map((r) => (
                    <div
                      key={r.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("rowId", r.id)}
                      onClick={() => openPanel(r)}
                      className="bg-card border border-border rounded-lg p-3 mb-2 cursor-pointer shadow-sm hover:shadow transition-shadow"
                    >
                      <div className="text-sm font-semibold">{r.retailers.name}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Fit {r.fit ?? "—"} · {SEGMENTS.find((x) => x.id === r.retailers.segment)?.label.split(" ")[0] || "Retail"}
                      </div>
                      {r.next_action && <div className="text-xs text-muted-foreground mt-1.5">→ {r.next_action}</div>}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ═════════ FEEDS ═════════ */}
        {view === "feeds" && (
          <div className="mt-5 space-y-2 pb-6 max-w-2xl">
            {feeds.map((f) => (
              <div key={f.id} className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3">
                <Rss className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-sm font-medium">
                    {product?.name} × {f.params?.region ? `${f.params.region}, ` : ""}{f.params?.country || "—"}
                    {f.params?.mode === "deep" && <span className="text-xs text-muted-foreground"> · deep</span>}
                    {f.params?.legacy && <span className="text-xs text-muted-foreground"> · imported</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(f.ran_at).toLocaleDateString()} · {f.new_count} new{f.existing_count > 0 && ` · ${f.existing_count} existing`}
                  </div>
                </div>
                <button
                  className="ml-auto text-xs font-semibold text-primary hover:underline"
                  onClick={() => { setFeedFilter(f.params?.legacy ? `legacy:${f.id}` : `search:${f.id}`); setView("sheet"); }}
                >
                  View rows →
                </button>
              </div>
            ))}
            <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3">
              <Plus className="w-4 h-4 text-amber-600" />
              <div className="text-sm font-medium">Added by you</div>
              <button
                className="ml-auto text-xs font-semibold text-primary hover:underline"
                onClick={() => { setFeedFilter("manual"); setView("sheet"); }}
              >
                View rows →
              </button>
            </div>
            {feedFilter && (
              <Button variant="outline" size="sm" onClick={() => setFeedFilter(null)}>Clear feed filter</Button>
            )}
          </div>
        )}
      </div>

      {/* ═════════ SIDE PANEL ═════════ */}
      <Sheet open={!!panelRow} onOpenChange={(o) => !o && setPanelRow(null)}>
        <SheetContent className="w-[420px] sm:max-w-[420px] overflow-y-auto">
          {panelRow && (
            <>
              <SheetHeader className="mb-1">
                <SheetTitle className="text-xl" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                  {panelRow.retailers.name}
                </SheetTitle>
                <div className="text-xs text-muted-foreground -mt-1">
                  {SEGMENTS.find((s) => s.id === panelRow.retailers.segment)?.label || "Retail"} · {panelRow.retailers.domain}
                  {panelRow.retailers.website && (
                    <a href={panelRow.retailers.website} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="ml-1 inline-flex"><ExternalLink className="w-3 h-3" /></a>
                  )}
                </div>
                {crossRefs.get(panelRow.retailer_id) && (
                  <div className="text-xs bg-violet-50 text-violet-700 rounded-md px-2.5 py-1.5 mt-1">
                    ⧉ Also in {crossRefs.get(panelRow.retailer_id)!.productName} — {stageMeta(crossRefs.get(panelRow.retailer_id)!.stage).label.toLowerCase()}
                  </div>
                )}
              </SheetHeader>

              <div className="space-y-5 mt-4">
                <div>
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Why this match · <span className="text-primary">{panelRow.fit ?? "—"} fit</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{panelRow.why || "—"}</p>
                </div>

                {panelEnriching && !panelRow.how_to_get_in && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Researching how to get in…
                  </div>
                )}
                {panelRow.how_to_get_in?.steps?.length ? (
                  <div>
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">How to get in</div>
                    <ol className="list-decimal ml-4 space-y-1 text-sm text-muted-foreground">
                      {panelRow.how_to_get_in.steps.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                    {panelRow.how_to_get_in.requirements?.length ? (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {panelRow.how_to_get_in.requirements.map((r, i) => (
                          <span key={i} className="text-[11px] bg-muted rounded px-2 py-0.5 text-muted-foreground">{r}</span>
                        ))}
                      </div>
                    ) : null}
                    {panelRow.how_to_get_in.submission_url && (
                      <a href={panelRow.how_to_get_in.submission_url} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-2 hover:underline">
                        Submission page <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ) : null}

                <div>
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Contact</div>
                  <p className="text-sm text-muted-foreground">
                    {panelRow.contact_channel || "No channel yet."}
                    {panelRow.email && <> · <a className="text-primary" href={`mailto:${panelRow.email}`}>{panelRow.email}</a></>}
                    {panelRow.contact_form_url && (
                      <> · <a className="text-primary hover:underline" href={panelRow.contact_form_url} target="_blank" rel="noreferrer">form</a></>
                    )}
                  </p>
                  {!panelRow.contact_channel && (
                    <Button variant="outline" size="sm" className="mt-2 text-xs" onClick={() => findContact(panelRow)}>
                      Find contact
                    </Button>
                  )}
                  <Button className="w-full mt-3" onClick={() => setPitchRow(panelRow)}>
                    <Mail className="w-4 h-4 mr-1.5" /> Draft pitch with AI
                  </Button>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Activity</div>
                  <ul className="space-y-1.5">
                    {events.map((e, i) => (
                      <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                        <span className="w-12 flex-shrink-0 text-muted-foreground/60">{fmtDate(e.at)}</span>
                        {e.label}
                      </li>
                    ))}
                    {events.length === 0 && <li className="text-xs text-muted-foreground/60">No activity yet</li>}
                  </ul>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <NewSearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} onRun={runSearch} busy={searching} defaults={feeds[0]?.params} />
      <AddStoreDialog open={addOpen} onClose={() => setAddOpen(false)} productId={productId!} onDone={loadAll} rows={rows} />
      <PitchDialog row={pitchRow} onClose={() => setPitchRow(null)} onStageChange={(r, s) => setStage(r, s)} />
    </DashboardShell>
  );
};

/* ───────────────────── New search dialog ───────────────────── */

const COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Netherlands", "Ireland", "New Zealand", "United Arab Emirates"];

const NewSearchDialog = ({ open, onClose, onRun, busy, defaults }: {
  open: boolean; onClose: () => void; busy: boolean; defaults?: any;
  onRun: (p: { country: string; region?: string; brand_stage: string }) => void;
}) => {
  const [country, setCountry] = useState(defaults?.country || "United States");
  const [region, setRegion] = useState("");
  const [brandStage, setBrandStage] = useState(defaults?.brand_stage || "dtc_only");
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle style={{ fontFamily: "'Fraunces', Georgia, serif" }}>New search</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Country</label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Region / city (optional — narrows the search)</label>
            <Input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. California, London" className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Where is this brand today?</label>
            <Select value={brandStage} onValueChange={setBrandStage}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dtc_only">Online / DTC only — no stores yet</SelectItem>
                <SelectItem value="some_retail">In some stores</SelectItem>
                <SelectItem value="established_retail">Established in retail</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground mt-1">This changes who we recommend — big distributors need retail proof; marketplaces don't.</p>
          </div>
          <Button className="w-full" disabled={busy} onClick={() => onRun({ country, region: region.trim() || undefined, brand_stage: brandStage })}>
            {busy ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Searching — this takes ~30s</> : "Search"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ───────────────────── Add store dialog ───────────────────── */

const AddStoreDialog = ({ open, onClose, productId, onDone, rows }: {
  open: boolean; onClose: () => void; productId: string; onDone: () => void; rows: Row[];
}) => {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [suggestions, setSuggestions] = useState<{ id: string; name: string; domain: string }[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!input.trim() || input.length < 2) { setSuggestions([]); return; }
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const { data } = await db.from("retailers").select("id,name,domain")
        .or(`name.ilike.%${input}%,domain.ilike.%${input}%`).limit(5);
      setSuggestions(data || []);
    }, 250);
  }, [input]);

  const add = async (value: string) => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("retailer-intel", {
        body: { mode: "add_store", product_id: productId, input: value },
      });
      if (error || data?.error) throw new Error(data?.error || "failed");
      if (data.duplicate) {
        toast.info("Already in this pipeline — jumping to it.");
      } else {
        toast.success(data.website_alive === false
          ? "Added — couldn't verify their website, double-check the domain."
          : "Added and enriched.");
      }
      setInput("");
      onClose();
      onDone();
    } catch (e: any) {
      toast.error(e.message || "Couldn't add that store");
    } finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Add a store or distributor</DialogTitle></DialogHeader>
        <Input
          autoFocus value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Store name or website"
          onKeyDown={(e) => e.key === "Enter" && input.trim() && add(input.trim())}
        />
        {suggestions.length > 0 && (
          <div className="border border-border rounded-lg divide-y divide-border">
            {suggestions.map((s) => {
              const inPipeline = rows.some((r) => r.retailers.domain === s.domain);
              return (
                <button key={s.id} disabled={busy}
                  onClick={() => add(s.domain)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xs text-muted-foreground">{s.domain}</span>
                  {inPipeline && <span className="ml-auto text-[10px] text-muted-foreground">already in pipeline</span>}
                </button>
              );
            })}
          </div>
        )}
        <Button className="w-full" disabled={busy || !input.trim()} onClick={() => add(input.trim())}>
          {busy ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enriching…</> : "Add"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

/* ───────────────────── Pitch dialog ───────────────────── */

const PitchDialog = ({ row, onClose, onStageChange }: {
  row: Row | null; onClose: () => void; onStageChange: (r: Row, s: Stage) => void;
}) => {
  const [busy, setBusy] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [warning, setWarning] = useState<string | null>(null);

  const generate = useCallback(async (r: Row) => {
    setBusy(true); setSubject(""); setBody(""); setWarning(null);
    try {
      const { data, error } = await supabase.functions.invoke("draft-pitch", { body: { row_id: r.id } });
      if (error || data?.error) throw new Error(data?.error || "failed");
      setSubject(data.subject || ""); setBody(data.body || ""); setWarning(data.cross_warning || null);
    } catch {
      toast.error("Couldn't draft the pitch — try again");
    } finally { setBusy(false); }
  }, []);

  useEffect(() => { if (row) generate(row); }, [row, generate]);

  const afterSend = () => {
    if (row && row.stage === "to_contact") {
      toast("Mark as contacted?", {
        action: { label: "Yes", onClick: () => onStageChange(row, "contacted") },
      });
    }
  };

  return (
    <Dialog open={!!row} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            Pitch — {row?.retailers.name}
          </DialogTitle>
        </DialogHeader>
        {warning && (
          <div className="flex items-start gap-2 text-xs bg-amber-50 text-amber-800 rounded-md px-3 py-2">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {warning}
          </div>
        )}
        {busy ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Writing your pitch…
          </div>
        ) : (
          <div className="space-y-3">
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="font-medium" />
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={9} className="text-sm" />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => {
                navigator.clipboard.writeText(`${subject}\n\n${body}`);
                toast.success("Copied"); afterSend();
              }}>
                <Copy className="w-4 h-4 mr-1.5" /> Copy
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => {
                const to = row?.email || "";
                window.open(`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                afterSend();
              }}>
                <Mail className="w-4 h-4 mr-1.5" /> Open in email
              </Button>
              <Button variant="ghost" onClick={() => row && generate(row)}><RefreshCw className="w-4 h-4" /></Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Pipeline;
