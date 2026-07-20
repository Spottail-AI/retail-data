import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
  const [selectedCountry, setSelectedCountry] = useState("");
  const [saving, setSaving] = useState(false);

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from("user_preferences").upsert({
        user_id: user.id,
        country: selectedCountry,
        onboarding_completed: true,
      }, { onConflict: "user_id" });
      toast({ title: "You're all set", description: "Your dashboard is now personalized." });
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
      <DialogContent className="dashboard-light bg-card border-border sm:max-w-lg [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-foreground">Where are you selling?</DialogTitle>
          <p className="text-sm text-muted-foreground">Pick your main market — we'll tailor your buyer matches to it.</p>
        </DialogHeader>

        <div className="space-y-2 max-h-72 overflow-y-auto py-2">
          {COUNTRIES.map((country) => (
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

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleComplete}
            disabled={saving || !selectedCountry}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Complete setup"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
