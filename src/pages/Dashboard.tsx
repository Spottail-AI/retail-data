import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/use-user-role";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Footer } from "@/components/Footer";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import BrandBriefing from "@/components/dashboard/BrandBriefing";
import { OnboardingModal } from "@/components/dashboard/OnboardingModal";
import BuyerDashboard from "@/pages/BuyerDashboard";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, isLoading: roleLoading, isBuyer } = useUserRole();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check onboarding status
  const { data: preferences, isLoading: prefsLoading, refetch: refetchPrefs } = useQuery({
    queryKey: ["user-preferences", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login?redirect=/dashboard");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // If user is a buyer, render buyer dashboard (wait for role to resolve before deciding)
  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isBuyer) {
    return <BuyerDashboard />;
  }

  // No role on record (e.g. signup flow interrupted before the role was saved):
  // send the user to onboarding to pick one instead of silently defaulting to
  // the supplier dashboard.
  if (!role) {
    return <Navigate to="/onboarding?next=/dashboard" replace />;
  }

  // Only show the onboarding modal once preferences have actually loaded — don't block the UI.
  const needsOnboarding = !prefsLoading && !preferences?.onboarding_completed;

  return (
    <div className="min-h-screen dashboard-light">
      {/* Onboarding Modal */}
      <OnboardingModal
        open={needsOnboarding}
        onComplete={() => refetchPrefs()}
      />

      {/* Sidebar - stays dark, outside dashboard-light scope */}
      <div className={cn("hidden md:block", mobileMenuOpen && "!block")}>
        <DashboardSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300 bg-[hsl(var(--background))]",
        sidebarCollapsed ? "md:ml-16" : "md:ml-60"
      )}>
        <DashboardTopBar
          sidebarCollapsed={sidebarCollapsed}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="p-4 md:p-8 max-w-[1100px] mx-auto">
          <BrandBriefing />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
