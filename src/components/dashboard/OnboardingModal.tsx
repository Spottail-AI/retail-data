import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Globe, Package, Users, Check, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Germany", "France",
  "Australia", "India", "Brazil", "Japan", "Nigeria", "South Africa",
  "UAE", "Mexico", "Netherlands", "Singapore",
];

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

export const OnboardingModal = ({ open, onComplete }: OnboardingModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [competitorName, setCompetitorName] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const addCompetitor = () => {
    if (competitorName.trim() && !competitors.includes(competitorName.trim())) {
      setCompetitors(prev => [...prev, competitorName.trim()]);
      setCompetitorName("");
    }
  };

  const removeCompetitor = (name: string) => {
    setCompetitors(prev => prev.filter(c => c !== name));
  };

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);

    try {
      // Save preferences
      await supabase.from("user_preferences").upsert({
        user_id: user.id,
        country: selectedCountry,
        onboarding_completed: true,
      }, { onConflict: "user_id" });

      // Save competitors
      if (competitors.length > 0) {
        const competitorRows = competitors.map(c => ({
          user_id: user.id,
          competitor_name: c,
        }));
        await supabase.from("tracked_competitors").insert(competitorRows);
      }

      toast({ title: "Setup complete!", description: "Your dashboard is now personalized." });
      onComplete();
    } catch (error) {
      console.error("Onboarding error:", error);
      toast({ title: "Error", description: "Failed to save preferences. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-card border-border sm:max-w-lg [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {[1, 2].map(s => (
              <div
                key={s}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
                  s === step ? "bg-primary text-primary-foreground" : s < step ? "bg-success text-success-foreground" : "bg-accent text-muted-foreground"
                }`}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>
          <DialogTitle className="text-foreground">
            {step === 1 && "Select your country"}
            {step === 2 && "Add competitors (optional)"}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Country */}
        {step === 1 && (
          <div className="space-y-3 max-h-64 overflow-y-auto py-2">
            {COUNTRIES.map(country => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  selectedCountry === country
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-accent/50 text-foreground hover:bg-accent border border-transparent"
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Competitors */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Amazon, Walmart"
                value={competitorName}
                onChange={(e) => setCompetitorName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCompetitor())}
                className="bg-background border-border"
              />
              <Button onClick={addCompetitor} variant="secondary" size="sm">Add</Button>
            </div>
            {competitors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {competitors.map(c => (
                  <Badge key={c} variant="secondary" className="pr-1">
                    {c}
                    <button onClick={() => removeCompetitor(c)} className="ml-1 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">You can skip this step and add competitors later.</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-2">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(s => s - 1)}>Back</Button>
          ) : <div />}
          {step < 2 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !selectedCountry}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={saving}
              className="bg-cta hover:bg-cta/90 text-cta-foreground font-semibold"
            >
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Complete Setup"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
