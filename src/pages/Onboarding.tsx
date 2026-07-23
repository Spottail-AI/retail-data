import { useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole, type UserRole } from "@/hooks/use-user-role";
import { RoleSelection } from "@/components/auth/RoleSelection";
import { Logo } from "@/components/Logo";
import { Loader2 } from "lucide-react";

/**
 * Post-login onboarding gate. Ensures every account picks a role before entering
 * the app — covers Google/OAuth signups (which skip the email flow's role step)
 * and any half-finished signups. Users who already have a role pass straight through.
 */
const Onboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Only allow in-app paths as the post-onboarding destination (no external URLs).
  const rawNext = searchParams.get("next");
  const next = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";
  const { user, loading: authLoading } = useAuth();
  const { isLoading: roleLoading, hasRole, assignRole } = useUserRole();

  // Not logged in → send to login.
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, user, navigate]);

  // Already onboarded → skip to the app.
  useEffect(() => {
    if (user && !roleLoading && hasRole) {
      navigate(next, { replace: true });
    }
  }, [user, roleLoading, hasRole, navigate, next]);

  const handleSelect = async (selected: UserRole) => {
    try {
      await assignRole.mutateAsync(selected);
      navigate(next, { replace: true });
    } catch (e) {
      console.error("Failed to assign role:", e);
    }
  };

  // Show a spinner while resolving auth/role or while redirecting.
  if (authLoading || !user || roleLoading || hasRole) {
    return (
      <div className="spottail-v2" style={{ minHeight: "100vh", background: "#F7F7F4", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#0D9B8A" }} />
      </div>
    );
  }

  return (
    <div
      className="spottail-v2"
      style={{
        minHeight: "100vh",
        background: "#F7F7F4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        position: "relative",
      }}
    >
      <Link to="/" style={{ position: "absolute", top: 28, left: 32, textDecoration: "none" }}>
        <Logo variant="full" size={28} />
      </Link>
      <div style={{ width: "100%", maxWidth: 560 }}>
        <RoleSelection onSelect={handleSelect} loading={assignRole.isPending} />
      </div>
    </div>
  );
};

export default Onboarding;
