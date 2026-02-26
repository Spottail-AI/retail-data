import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  TrendingUp,
  Truck,
  Users,
  Sparkles,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Price Tracking", icon: TrendingUp, path: "/dashboard/prices" },
  { label: "Suppliers", icon: Truck, path: "/dashboard/suppliers" },
  { label: "Competitor Analysis", icon: Users, path: "/dashboard/competitors" },
  { label: "Trend Discovery", icon: Sparkles, path: "/dashboard/trends" },
  { label: "Reports", icon: FileText, path: "/dashboard/reports" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export const DashboardSidebar = ({ collapsed, onToggle }: DashboardSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col z-30 transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border shrink-0">
        <img
          src="/lovable-uploads/6da76baf-f15f-427e-aaa0-1bd3c859bf32.png"
          alt="Spottail"
          className={cn("object-contain transition-all", collapsed ? "h-6" : "h-7")}
        />
        <button
          onClick={onToggle}
          className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === "/dashboard" && location.pathname === "/dashboard");
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
              )}
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-border space-y-2 shrink-0">
        <button
          onClick={() => {}}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          )}
        >
          <HelpCircle className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Help & Docs</span>}
        </button>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
        {!collapsed && (
          <Button
            onClick={() => navigate("/dashboard/settings")}
            className="w-full bg-cta hover:bg-cta/90 text-cta-foreground font-semibold"
          >
            Upgrade Plan
          </Button>
        )}
      </div>
    </aside>
  );
};
