import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CompetitorCard } from "./CompetitorCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FREE_LIMIT = 2;
const PRO_LIMIT = 10;

export const CompetitorCardGrid = () => {
  const { user, isSubscribed } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formWebsite, setFormWebsite] = useState("");
  const [formCategory, setFormCategory] = useState("");

  const limit = isSubscribed ? PRO_LIMIT : FREE_LIMIT;

  // Fetch competitors
  const { data: competitors, isLoading: compsLoading } = useQuery({
    queryKey: ["competitors", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracked_competitors")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch analyses
  const { data: analyses, isLoading: analysesLoading } = useQuery({
    queryKey: ["competitor-analyses", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("competitor_analysis")
        .select("*")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Auto-trigger analysis for competitors without analysis
  useEffect(() => {
    if (!competitors || !analyses || !user) return;

    const analysisMap = new Map(analyses.map((a: any) => [a.competitor_id, a]));
    const needsAnalysis = competitors.filter(
      (c: any) => !analysisMap.has(c.id) || analysisMap.get(c.id)?.status === "pending"
    );

    needsAnalysis.forEach((comp: any) => {
      triggerAnalysis(comp.id);
    });
  }, [competitors, analyses, user]);

  const triggerAnalysis = async (competitorId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.functions.invoke("analyze-competitor", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { competitor_id: competitorId },
      });

      // Refetch analyses after completion
      queryClient.invalidateQueries({ queryKey: ["competitor-analyses", user?.id] });
    } catch (error) {
      console.error("Analysis trigger failed:", error);
    }
  };

  // Add competitor mutation
  const addMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("tracked_competitors")
        .insert({
          user_id: user!.id,
          competitor_name: formName.trim(),
          website_url: formWebsite.trim() || null,
          category: formCategory.trim() || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["competitors", user?.id] });
      triggerAnalysis(data.id);
      setAddOpen(false);
      resetForm();
      toast({ title: "Competitor added", description: "Analysis will be ready shortly." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Edit competitor mutation
  const editMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("tracked_competitors")
        .update({
          competitor_name: formName.trim(),
          website_url: formWebsite.trim() || null,
          category: formCategory.trim() || null,
        })
        .eq("id", selectedId!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["competitors", user?.id] });
      setEditOpen(false);
      resetForm();
      toast({ title: "Competitor updated" });
    },
  });

  // Remove competitor mutation
  const removeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("tracked_competitors")
        .delete()
        .eq("id", selectedId!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["competitors", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["competitor-analyses", user?.id] });
      setRemoveOpen(false);
      setSelectedId(null);
      toast({ title: "Competitor removed" });
    },
  });

  const resetForm = () => {
    setFormName("");
    setFormWebsite("");
    setFormCategory("");
    setSelectedId(null);
  };

  const handleEdit = (id: string) => {
    const comp = competitors?.find((c: any) => c.id === id);
    if (!comp) return;
    setSelectedId(id);
    setFormName(comp.competitor_name);
    setFormWebsite(comp.website_url || "");
    setFormCategory(comp.category || "");
    setEditOpen(true);
  };

  const handleRemove = (id: string) => {
    setSelectedId(id);
    setRemoveOpen(true);
  };

  const analysisMap = new Map(
    (analyses || []).map((a: any) => [a.competitor_id, a])
  );

  const competitorCount = competitors?.length || 0;
  const canAdd = competitorCount < limit;

  if (compsLoading || analysesLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-muted rounded animate-pulse" />
          <div className="h-9 w-36 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[320px] bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-xs">
            {isSubscribed ? "Pro Plan" : "Free Plan"} – {competitorCount} of {limit} tracked
          </Badge>
        </div>
        <Button
          onClick={() => { resetForm(); setAddOpen(true); }}
          disabled={!canAdd}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Competitor
        </Button>
        {!canAdd && !isSubscribed && (
          <p className="text-xs text-muted-foreground w-full text-right">
            Upgrade to Pro to track more competitors.
          </p>
        )}
      </div>

      {/* Grid */}
      {competitorCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No competitors yet</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            Add your first competitor to start getting AI-powered analysis.
          </p>
          <Button onClick={() => { resetForm(); setAddOpen(true); }} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" /> Add Your First Competitor
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {competitors!.map((comp: any, idx: number) => (
            <CompetitorCard
              key={comp.id}
              competitor={comp}
              analysis={analysisMap.get(comp.id) || null}
              isBlurred={!isSubscribed && idx >= FREE_LIMIT}
              onEdit={handleEdit}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={addOpen || editOpen} onOpenChange={(open) => { if (!open) { setAddOpen(false); setEditOpen(false); resetForm(); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editOpen ? "Edit Competitor" : "Add Competitor"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="comp-name">Competitor Name *</Label>
              <Input
                id="comp-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Nike"
              />
            </div>
            <div>
              <Label htmlFor="comp-website">Website (optional)</Label>
              <Input
                id="comp-website"
                value={formWebsite}
                onChange={(e) => setFormWebsite(e.target.value)}
                placeholder="https://nike.com"
              />
            </div>
            <div>
              <Label htmlFor="comp-category">Industry (optional)</Label>
              <Input
                id="comp-category"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="e.g. Sportswear"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAddOpen(false); setEditOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button
              onClick={() => editOpen ? editMutation.mutate() : addMutation.mutate()}
              disabled={!formName.trim() || addMutation.isPending || editMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {(addMutation.isPending || editMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editOpen ? "Save" : "Add & Analyze"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation */}
      <AlertDialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove competitor?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this competitor and all its analysis data. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => removeMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
