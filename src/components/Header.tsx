import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, LogIn, UserPlus, LogOut, Loader2 } from "lucide-react";

interface HeaderProps {
  inline?: boolean;
}

export const Header = ({ inline = false }: HeaderProps) => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const containerClass = inline
    ? "flex items-center gap-3"
    : "absolute top-8 right-8 z-20 flex items-center gap-3";

  if (loading) {
    return (
      <div className={containerClass}>
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {user ? (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/auth")}
            className="text-slate-700 hover:bg-slate-100"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/auth?mode=signup")}
            className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Sign Up
          </Button>
        </>
      )}
    </div>
  );
};
