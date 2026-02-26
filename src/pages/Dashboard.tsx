import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Footer } from "@/components/Footer";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { PriceTrendsSection } from "@/components/dashboard/PriceTrendsSection";
import { SupplierIntelligenceSection } from "@/components/dashboard/SupplierIntelligenceSection";
import { CompetitorAnalysisSection } from "@/components/dashboard/CompetitorAnalysisSection";
import { TrendDiscoverySection } from "@/components/dashboard/TrendDiscoverySection";
import { OnboardingModal } from "@/components/dashboard/OnboardingModal";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
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
      navigate("/auth?redirect=/dashboard");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || prefsLoading) {
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

  const needsOnboarding = !preferences?.onboarding_completed;

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

        <main className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-8">
          {/* KPI Cards */}
          <KpiCards />

          {/* Price Trends - Primary */}
          <PriceTrendsSection />

          {/* Two-column layout for Suppliers + Competitors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SupplierIntelligenceSection />
            <CompetitorAnalysisSection />
          </div>

          {/* Trend Discovery */}
          <TrendDiscoverySection />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
