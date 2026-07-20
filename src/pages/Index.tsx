import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SpottailV2Homepage } from "@/components/v2/SpottailV2Homepage";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/use-user-role";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isLoading: roleLoading, hasRole } = useUserRole();

  // Safety net: a logged-in account with no role yet (e.g. a brand-new Google
  // signup that landed here) gets routed into onboarding to pick a role.
  useEffect(() => {
    if (!authLoading && user && !roleLoading && !hasRole) {
      navigate("/onboarding", { replace: true });
    }
  }, [authLoading, user, roleLoading, hasRole, navigate]);

  return <SpottailV2Homepage />;
};

export default Index;
