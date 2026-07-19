import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Sparkles, Search, ChevronRight, Layout, Mail } from "lucide-react";
import SearchLauncher from "./SearchLauncher";

/* eslint-disable @typescript-eslint/no-explicit-any */
const db = supabase as any;

const STAGE_ORDER = ["to_contact", "contacted", "in_conversation", "sampling", "stocked", "passed"] as const;
const STAGE_COLORS: Record<string, string> = {
  to_contact: "#94A3B8", contacted: "#3B82F6", in_conversation: "#8B5CF6",
  sampling: "#F59E0B", stocked: "#10B981", passed: "#FB7185",
};

type RowLite = {
  product_id: string; stage: string; next_due: string | null; is_new: boolean;
  retailers: { name: string } | null;
};
type ProductLite = { id: string; name: string };

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

const fmtDue = (d: string) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });

export const BrandBriefing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductLite[]>([]);
  const [rows, setRows] = useState<RowLite[]>([]);

  const load = async () => {
    if (!user?.id) return;
    const [{ data: prods }, { data: rowData }] = await Promise.all([
      db.from("products").select("id,name").eq("user_id", user.id).order("created_at", { ascending: false }).limit(24),
      db.from("pipeline_rows").select("product_id,stage,next_due,is_new,retailers(name)").eq("user_id", user.id),
    ]);
    setProducts(prods || []);
    setRows((rowData || []) as RowLite[]);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [user?.id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const firstName = (user?.user_metadata?.full_name || user?.email || "there").split(/[@ ]/)[0];
  const today = new Date().toISOString().slice(0, 10);
  const weekOut = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const active = (r: RowLite) => !["stocked", "passed"].includes(r.stage);
  const dueRows = rows
    .filter((r) => r.next_due && r.next_due <= weekOut && active(r))
    .sort((a, b) => (a.next_due! < b.next_due! ? -1 : 1));
  const overdueCount = dueRows.filter((r) => r.next_due! < today).length;
  const newRows = rows.filter((r) => r.is_new);
  const hasActivity = rows.length > 0;

  /* ── Welcome state: no pipeline activity yet ── */
  if (!hasActivity) {
    return (
      <div>
        <h1 className="text-3xl font-medium" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
          Welcome, {firstName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1 mb-6">
          Let's get your product on shelves. One search builds your first buyer pipeline.
        </p>

        <SearchLauncher heroTitle="Find your first buyers" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { icon: Search, title: "1 · Search", body: "We scout distributors, chains, and marketplaces that fit your product." },
            { icon: Layout, title: "2 · Work your pipeline", body: "Every match lands in one pipeline with stages, notes, and next actions." },
            { icon: Mail, title: "3 · Pitch", body: "We show how to get in — submission portals, requirements, and an AI-drafted pitch." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-start gap-3 px-1">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-dashed border-border rounded-xl p-4 mt-6 opacity-70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-muted text-muted-foreground flex items-center justify-center font-bold"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}>?</div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Your first pipeline appears here</p>
              <p className="text-xs text-muted-foreground/70">e.g. 34 prospects · 4 segments · ranked by fit</p>
            </div>
          </div>
          <div className="flex h-1.5 rounded-full overflow-hidden mt-3 bg-muted">
            <div style={{ width: "60%" }} className="bg-border" />
            <div style={{ width: "22%" }} className="bg-muted-foreground/25" />
            <div style={{ width: "12%" }} className="bg-border" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Briefing state ── */
  const statusBits: string[] = [];
  if (dueRows.length) statusBits.push(`${dueRows.length} follow-up${dueRows.length > 1 ? "s" : ""} due`);
  if (newRows.length) statusBits.push(`${newRows.length} new prospects to review`);

  return (
    <div>
      <h1 className="text-3xl font-medium" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
        {greeting()}, {firstName}
      </h1>
      <p className="text-sm text-muted-foreground mt-1 mb-6">
        {statusBits.length ? (
          <>
            You have{" "}
            {statusBits.map((b, i) => (
              <span key={b}>
                <span className="text-primary font-semibold">{b}</span>
                {i < statusBits.length - 1 ? " and " : ""}
              </span>
            ))}{" "}
            this week.
          </>
        ) : (
          "All caught up — run a search to keep the pipeline warm."
        )}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-[#E6E8EB] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" /> Follow-ups due
          </div>
          <p className="text-2xl font-semibold mt-1">{dueRows.length}</p>
          <div className="border-t border-border mt-2 pt-2 space-y-1">
            {dueRows.slice(0, 3).map((r, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="truncate">{r.retailers?.name || "—"}</span>
                <span className={r.next_due! < today ? "text-rose-600 font-semibold" : "text-muted-foreground"}>
                  {r.next_due! < today ? "overdue" : fmtDue(r.next_due!)}
                </span>
              </div>
            ))}
            {dueRows.length === 0 && <p className="text-xs text-muted-foreground">Nothing due — nice.</p>}
          </div>
        </Card>

        <Card className="bg-card border-[#E6E8EB] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5" /> New matches to review
          </div>
          <p className="text-2xl font-semibold mt-1">{newRows.length}</p>
          <p className="text-xs text-muted-foreground border-t border-border mt-2 pt-2">
            {newRows.length
              ? "From your latest search — review and set next actions."
              : "Run a search to find new buyers."}
          </p>
        </Card>

        <Card className="bg-card border-[#E6E8EB] p-4 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Search className="w-3.5 h-3.5" /> Find new buyers
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex-1">Search stores and distributors for any product.</p>
          <Button size="sm" className="w-full mt-3" onClick={() => navigate("/find-stores")}>New search</Button>
        </Card>
      </div>

      <h2 className="text-lg font-medium mt-8 mb-3" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
        Your products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((p) => {
          const mine = rows.filter((r) => r.product_id === p.id);
          if (mine.length === 0) return null;
          const inMotion = mine.filter((r) => !["to_contact", "passed"].includes(r.stage)).length;
          const newCount = mine.filter((r) => r.is_new).length;
          const due = mine.filter((r) => r.next_due && r.next_due <= weekOut && r.next_due >= today && active(r)).length;
          return (
            <Card key={p.id} onClick={() => navigate(`/pipeline/${p.id}`)}
              className="bg-card border-[#E6E8EB] p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}>{p.name.charAt(0).toUpperCase()}</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate capitalize">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{mine.length} prospects · {inMotion} in motion</p>
                </div>
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex h-1.5 rounded-full overflow-hidden mt-3 bg-muted">
                {STAGE_ORDER.map((s) => {
                  const n = mine.filter((r) => r.stage === s).length;
                  return n > 0 ? <div key={s} style={{ width: `${(n / mine.length) * 100}%`, background: STAGE_COLORS[s] }} /> : null;
                })}
              </div>
              <div className="flex gap-3 mt-2 text-[11px]">
                {newCount > 0 && <span className="text-primary font-semibold">✨ {newCount} new</span>}
                {due > 0 && <span className="text-amber-600 font-semibold">{due} due this week</span>}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BrandBriefing;
