import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  ShoppingBag,
  TrendingUp,
  Heart,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

interface BuyerSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Browse Source", icon: ShoppingBag, path: "/source", badge: "New" },
  { label: "Trending Now", icon: TrendingUp, path: "/trending-now" },
  { label: "My Shortlist", icon: Heart, path: "/my-shortlist" },
  { label: "Enquiries", icon: MessageSquare, path: "/enquiries" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export const BuyerSidebar = ({ collapsed, onToggle }: BuyerSidebarProps) => {
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
        "bg-card border-r border-border",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border shrink-0">
        {collapsed ? (
          <Logo variant="icon" size={26} />
        ) : (
          <Logo variant="full" size={24} className="text-foreground" />
        )}
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
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
              <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary" : "")} />
              {!collapsed && (
                <span className="flex items-center gap-2">
                  {item.label}
                  {item.badge && (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground border border-transparent">
                      {item.badge}
                    </span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-border space-y-2 shrink-0">
        <button
          onClick={() => navigate("/help")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <HelpCircle className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Help & Docs</span>}
        </button>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-muted",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
};
