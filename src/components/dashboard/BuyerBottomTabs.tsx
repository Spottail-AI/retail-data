import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  TrendingUp,
  Heart,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Source", icon: ShoppingBag, path: "/source" },
  { label: "Trending", icon: TrendingUp, path: "/trending-now" },
  { label: "Shortlist", icon: Heart, path: "/my-shortlist" },
  { label: "Enquiries", icon: MessageSquare, path: "/enquiries" },
];

export const BuyerBottomTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0e1a] border-t border-[#1e2d4a] md:hidden">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors",
                isActive ? "text-[#4f8ef7]" : "text-[#64748b]"
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
