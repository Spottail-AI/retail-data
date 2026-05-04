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
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return (data?.role as UserRole | undefined) ?? null;
    },
    enabled: !!user,
    retry: false,
    staleTime: 5 * 60 * 1000,
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
