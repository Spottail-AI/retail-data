import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface DashboardShellProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const DashboardShell = ({ title, description, children }: DashboardShellProps) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=" + window.location.pathname);
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen dashboard-light">
      <div className={cn("hidden md:block", mobileMenuOpen && "!block")}>
        <DashboardSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={cn(
        "transition-all duration-300 bg-[hsl(var(--background))]",
        sidebarCollapsed ? "md:ml-16" : "md:ml-60"
      )}>
        <DashboardTopBar
          sidebarCollapsed={sidebarCollapsed}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="p-4 md:p-8 max-w-[1200px] mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
