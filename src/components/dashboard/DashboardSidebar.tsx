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
  Package,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Price Tracking", icon: TrendingUp, path: "/price-tracking" },
  { label: "Suppliers & Distributors", icon: Truck, path: "/suppliers" },
  { label: "Competitor Analysis", icon: Users, path: "/competitor-analysis" },
  { label: "Trend Discovery", icon: Sparkles, path: "/trend-discovery" },
  { label: "List a Product", icon: Package, path: "/source/new" },
  { label: "Browse Source", icon: Store, path: "/source" },
  { label: "Reports", icon: FileText, path: "/reports" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export const DashboardSidebar = ({ collapsed, onToggle }: DashboardSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen flex flex-col z-30 transition-all duration-300",
        "bg-[#0C0C0B] border-r border-white/[0.06]",
        collapsed ? "w-16" : "w-60"
      )}
      style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-white/[0.06] shrink-0">
        <img
          src="/lovable-uploads/6da76baf-f15f-427e-aaa0-1bd3c859bf32.png"
          alt="Spottail"
          className={cn("object-contain transition-all", collapsed ? "h-6" : "h-7")}
        />
        <button
          onClick={onToggle}
          className="ml-auto text-white/40 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-200 relative tracking-[-0.01em]",
                isActive
                  ? "text-white bg-white/[0.06]"
                  : "text-white/55 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-[#0D9B8A] rounded-r-full" />
              )}
              <item.icon className={cn("w-[18px] h-[18px] shrink-0", isActive ? "text-[#0D9B8A]" : "")} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-white/[0.06] space-y-1.5 shrink-0">
        <button
          onClick={() => navigate("/help")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-white/55 hover:text-white hover:bg-white/[0.04] transition-colors tracking-[-0.01em]"
          )}
        >
          <HelpCircle className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Help & Docs</span>}
        </button>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-[13px] text-white/55 hover:text-white hover:bg-white/[0.04] tracking-[-0.01em] font-medium px-3 h-auto py-2",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
        {!collapsed && (
          <Button
            onClick={() => navigate("/pricing")}
            className="w-full bg-[#0D9B8A] hover:bg-[#0b8576] text-white font-medium text-[13px] tracking-[-0.01em] rounded-md h-9 mt-2"
          >
            Upgrade Plan
          </Button>
        )}
      </div>
    </aside>
  );
};
