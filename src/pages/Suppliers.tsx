import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Trash2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SearchLauncher from "@/components/dashboard/SearchLauncher";

/* eslint-disable @typescript-eslint/no-explicit-any */
const db = supabase as any; // new tables pending type regeneration

const STAGE_ORDER = ["to_contact", "contacted", "in_conversation", "sampling", "stocked", "passed"] as const;
const STAGE_COLORS: Record<string, string> = {
  to_contact: "#94A3B8", contacted: "#3B82F6", in_conversation: "#8B5CF6",
  sampling: "#F59E0B", stocked: "#10B981", passed: "#FB7185",
};

type PipelineSummary = {
  id: string;
  name: string;
  created_at: string;
  row_count: number;
  in_motion: number;
  due_soon: number;
  new_count: number;
  counts: Record<string, number>;
};

const Suppliers = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [pipelines, setPipelines] = useState<PipelineSummary[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

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
      .select("product_id, stage, next_due, is_new")
      .eq("user_id", session.user.id);
    const weekOut = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    const today = new Date().toISOString().slice(0, 10);
    const summary: PipelineSummary[] = prods.map((p: any) => {
      const mine = (rows || []).filter((r: any) => r.product_id === p.id);
      const counts: Record<string, number> = {};
      STAGE_ORDER.forEach((s) => { counts[s] = mine.filter((r: any) => r.stage === s).length; });
      return {
        id: p.id, name: p.name, created_at: p.created_at,
        row_count: mine.length,
        in_motion: mine.filter((r: any) => !["to_contact", "passed"].includes(r.stage)).length,
        due_soon: mine.filter((r: any) => r.next_due && r.next_due <= weekOut && r.next_due >= today).length,
        new_count: mine.filter((r: any) => r.is_new).length,
        counts,
      };
    });
    setPipelines(summary);
    setLoadingSaved(false);
  };

  useEffect(() => {
    fetchPipelines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const deletePipeline = async (id: string) => {
    await db.from("products").delete().eq("id", id);
    setPipelines((prev) => prev.filter((p) => p.id !== id));
    toast.success("Pipeline deleted");
  };

  const [renaming, setRenaming] = useState<PipelineSummary | null>(null);
  const [renameVal, setRenameVal] = useState("");
  const renameProduct = async () => {
    if (!renaming || !renameVal.trim()) return;
    const { error } = await db.from("products").update({ name: renameVal.trim() }).eq("id", renaming.id);
    if (error) { toast.error("A product with that name already exists"); return; }
    setPipelines((prev) => prev.map((p) => (p.id === renaming.id ? { ...p, name: renameVal.trim() } : p)));
    setRenaming(null);
    toast.success("Renamed");
  };

  return (
    <DashboardShell
      title="Retail Stores & Distributors"
      description="Each product gets one pipeline. Every search adds new matched stores and distributors to it — nothing gets lost between searches."
    >
      {/* New search */}
      <SearchLauncher onDone={fetchPipelines} />

      {/* Your products */}
      <div className="mt-10">
        <h2 className="text-lg font-medium text-foreground mb-4" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
          Your products
        </h2>

        {loadingSaved ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-36 w-full rounded-xl" />)}
          </div>
        ) : pipelines.length === 0 ? (
          <Card className="bg-card border-[#E6E8EB] p-8 text-center shadow-sm">
            <p className="text-sm text-muted-foreground">
              No pipelines yet. Run a search above — your matched stores and distributors will build up here, one pipeline per product.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pipelines.map((p) => (
              <Card
                key={p.id}
                onClick={() => navigate(`/pipeline/${p.id}`)}
                className="bg-card border-[#E6E8EB] p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0"
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate capitalize">{p.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {p.row_count === 0
                        ? "No prospects yet"
                        : <>{p.row_count} prospects · {p.in_motion} in motion</>}
                    </p>
                  </div>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost" size="icon"
                      className="h-7 w-7 text-muted-foreground"
                      title="Rename"
                      onClick={(e) => { e.stopPropagation(); setRenaming(p); setRenameVal(p.name); }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      title="Delete"
                      onClick={(e) => { e.stopPropagation(); deletePipeline(p.id); }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {p.row_count > 0 ? (
                  <>
                    {/* funnel bar */}
                    <div className="flex h-1.5 rounded-full overflow-hidden mt-4 bg-muted">
                      {STAGE_ORDER.map((s) =>
                        p.counts[s] > 0 ? (
                          <div key={s} style={{ width: `${(p.counts[s] / p.row_count) * 100}%`, background: STAGE_COLORS[s] }} />
                        ) : null
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground">
                      {p.new_count > 0 && (
                        <span className="text-primary font-semibold">✨ {p.new_count} new</span>
                      )}
                      {p.due_soon > 0 && (
                        <span className="text-amber-600 font-semibold">{p.due_soon} due this week</span>
                      )}
                      {p.new_count === 0 && p.due_soon === 0 && (
                        <span>Updated {new Date(p.created_at).toLocaleDateString()}</span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </>
                ) : (
                  <p className="text-[11px] text-primary font-semibold mt-4">Run your first search →</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Rename dialog */}
      <Dialog open={!!renaming} onOpenChange={(o) => !o && setRenaming(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Rename product</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus value={renameVal}
            onChange={(e) => setRenameVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && renameProduct()}
          />
          <Button className="w-full" disabled={!renameVal.trim()} onClick={renameProduct}>Save</Button>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
};

export default Suppliers;
