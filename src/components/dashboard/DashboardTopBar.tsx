import { useAuth } from "@/contexts/AuthContext";
import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface DashboardTopBarProps {
  sidebarCollapsed: boolean;
  onMobileMenuToggle: () => void;
}

export const DashboardTopBar = ({ sidebarCollapsed, onMobileMenuToggle }: DashboardTopBarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] || "there";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header
      className="h-16 bg-[hsl(var(--card))] border-b border-[#E6E8EB] flex items-center justify-between px-4 md:px-8 sticky top-0 z-20"
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={onMobileMenuToggle}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm md:text-base font-semibold text-[#111111]">
            Welcome back, {firstName}
          </h2>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Here's your live market overview.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 w-48 lg:w-64 h-9 bg-[hsl(var(--background))] border-[#E6E8EB] text-sm"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
        </button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold">
              {firstName.charAt(0).toUpperCase()}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem className="text-xs text-muted-foreground cursor-default">
              {user?.email}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
