import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type UserRole = "supplier" | "buyer";

export function useUserRole() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: role, isLoading, refetch } = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_user_role", {
        _user_id: user!.id,
      });
      if (error) throw error;
      return data as UserRole | null;
    },
    enabled: !!user,
  });

  const assignRole = useMutation({
    mutationFn: async (newRole: UserRole) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: user!.id, role: newRole });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-role", user?.id] });
    },
  });

  return {
    role,
    isLoading,
    hasRole: !!role,
    isSupplier: role === "supplier",
    isBuyer: role === "buyer",
    assignRole,
    refetch,
  };
}
