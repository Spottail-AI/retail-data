import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { BuyerSidebar } from "./BuyerSidebar";
import { BuyerBottomTabs } from "./BuyerBottomTabs";

interface BuyerShellProps {
  children: React.ReactNode;
}

export const BuyerShell = ({ children }: BuyerShellProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      {/* Desktop sidebar */}
      {!isMobile && (
        <BuyerSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      )}

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-300 pb-16 md:pb-0",
          !isMobile && (sidebarCollapsed ? "md:ml-16" : "md:ml-60")
        )}
      >
        {children}
      </div>

      {/* Mobile bottom tabs */}
      {isMobile && <BuyerBottomTabs />}
    </div>
  );
};
