import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, LogIn, UserPlus, LogOut, Loader2 } from "lucide-react";

interface HeaderProps {
  inline?: boolean;
}

export const Header = ({ inline = false }: HeaderProps) => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isHomePage = location.pathname === "/";

  const scrollToSection = (id: string) => {
    if (!isHomePage) {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (inline) {
    return (
      <div className="flex items-center gap-3">
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        ) : user ? (
          <>
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")} className="border-border text-foreground hover:bg-accent">
              <LayoutDashboard className="w-4 h-4 mr-2" />Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground hover:bg-accent">
              <LogOut className="w-4 h-4 mr-2" />Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground hover:bg-accent">
              <LogIn className="w-4 h-4 mr-2" />Sign In
            </Button>
            <Button size="sm" onClick={() => navigate("/auth?mode=signup")} className="bg-cta hover:bg-cta/90 text-cta-foreground">
              <UserPlus className="w-4 h-4 mr-2" />Sign Up
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-5 border-b border-[hsl(var(--card-border))]">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/lovable-uploads/6da76baf-f15f-427e-aaa0-1bd3c859bf32.png"
          alt="Spottail"
          className="h-8 object-contain"
          style={{ background: "transparent" }}
        />
      </div>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-8">
        <button
          onClick={() => scrollToSection("features-section")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          Features
        </button>
        <button
          onClick={() => scrollToSection("pricing-section")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          Pricing
        </button>
        <button
          onClick={() => scrollToSection("testimonials-section")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          Testimonials
        </button>
      </nav>

      {/* Auth buttons */}
      <div className="flex items-center gap-3">
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        ) : user ? (
          <>
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")} className="border-border text-foreground hover:bg-accent">
              <LayoutDashboard className="w-4 h-4 mr-2" />Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground hover:bg-accent">
              <LogOut className="w-4 h-4 mr-2" />Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground hover:bg-accent">
              <LogIn className="w-4 h-4 mr-2" />Sign In
            </Button>
            <Button size="sm" onClick={() => navigate("/auth?mode=signup")} className="bg-cta hover:bg-cta/90 text-cta-foreground font-semibold">
              <UserPlus className="w-4 h-4 mr-2" />Sign Up
            </Button>
          </>
        )}
      </div>
    </header>
  );
};
