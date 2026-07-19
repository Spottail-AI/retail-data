import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Search,
  Sparkles,
  Users,
  FileText,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Package,
  Store,
  Compass,
  ExternalLink,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

type NavItem = { label: string; icon: typeof LayoutDashboard; path: string; external?: boolean };

const topItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
];

const navGroups: { header: string; items: NavItem[] }[] = [
  {
    header: "Get into stores",
    items: [
      { label: "Find stores", icon: Search, path: "/find-stores" },
      { label: "My pipeline", icon: Store, path: "/stockists" },
    ],
  },
  {
    header: "Research",
    items: [
      { label: "Trends", icon: Sparkles, path: "/trend-discovery" },
      { label: "Competitors", icon: Users, path: "/competitor-analysis" },
    ],
  },
  {
    header: "Your Source page",
    items: [
      { label: "My listing", icon: Package, path: "/source/new" },
      { label: "Browse Source", icon: Compass, path: "/source", external: true },
    ],
  },
];

const bottomItems: NavItem[] = [
  { label: "Reports", icon: FileText, path: "/reports" },
  { label: "Settings", icon: Settings, path: "/settings" },
  { label: "Help", icon: HelpCircle, path: "/help" },
];

const ACCENT = "#2DD4BF";

export const DashboardSidebar = ({ collapsed, onToggle }: DashboardSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSubscribed } = useAuth();

  const go = (item: NavItem) => {
    if (item.external) {
      window.open(item.path, "_blank", "noopener,noreferrer");
    } else {
      navigate(item.path);
    }
  };

  const renderItem = (item: NavItem) => {
    const isActive = location.pathname === item.path;
    return (
      <button
        key={item.path}
        onClick={() => go(item)}
        title={collapsed ? item.label : undefined}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors tracking-[-0.01em]",
          collapsed && "justify-center px-0",
          isActive
            ? "text-white bg-white/[0.07]"
            : "text-white/60 hover:text-white hover:bg-white/[0.04]"
        )}
      >
        <item.icon
          className="w-[18px] h-[18px] shrink-0"
          style={isActive ? { color: ACCENT } : undefined}
        />
        {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
        {!collapsed && item.external && (
          <ExternalLink className="w-3.5 h-3.5 shrink-0 text-white/30" />
        )}
      </button>
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen z-30 p-2 transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
      style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
    >
      <div className="h-full w-full flex flex-col bg-[#13161C] border border-white/[0.09] rounded-2xl overflow-hidden">
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-white/[0.06] shrink-0">
          <img
            src="/lovable-uploads/6da76baf-f15f-427e-aaa0-1bd3c859bf32.webp"
            alt="Spottail"
            className={cn("object-contain transition-all", collapsed ? "h-6" : "h-7")}
          />
          <button
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="ml-auto text-white/40 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          <div className="space-y-0.5">{topItems.map(renderItem)}</div>

          {navGroups.map((group) => (
            <div key={group.header} className="mt-4">
              {!collapsed && (
                <div className="px-3 pb-1.5 text-[11px] font-medium text-white/35 tracking-[-0.01em]">
                  {group.header}
                </div>
              )}
              <div className="space-y-0.5">{group.items.map(renderItem)}</div>
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-2 border-t border-white/[0.06] shrink-0 space-y-0.5">
          {bottomItems.map(renderItem)}

          {!collapsed && (
            isSubscribed ? (
              <div className="flex items-center justify-between gap-2 mt-2 p-2.5 rounded-lg bg-white/[0.04]">
                <div className="flex items-center gap-2 min-w-0">
                  <BadgeCheck className="w-4 h-4 shrink-0" style={{ color: ACCENT }} />
                  <span className="text-[12px] text-white truncate">Pro plan</span>
                </div>
                <button
                  onClick={() => navigate("/pricing")}
                  className="text-[11px] text-white/50 hover:text-white transition-colors shrink-0"
                >
                  Manage
                </button>
              </div>
            ) : (
              <div
                className="flex items-center justify-between gap-2 mt-2 p-2.5 rounded-lg"
                style={{ background: "rgba(45,212,191,0.13)", border: "0.5px solid rgba(45,212,191,0.38)" }}
              >
                <span className="text-[12px] text-white">Free plan</span>
                <button
                  onClick={() => navigate("/pricing")}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-md shrink-0"
                  style={{ background: ACCENT, color: "#04342C" }}
                >
                  Upgrade
                </button>
              </div>
            )
          )}

          {collapsed && !isSubscribed && (
            <button
              onClick={() => navigate("/pricing")}
              aria-label="Upgrade plan"
              title="Upgrade plan"
              className="w-full flex justify-center py-2 mt-1 rounded-lg"
              style={{ background: "rgba(45,212,191,0.13)" }}
            >
              <TrendingUp className="w-[18px] h-[18px]" style={{ color: ACCENT }} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
