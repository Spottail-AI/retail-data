import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasPaid: boolean;
  checkingPayment: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  checkPaymentStatus: (checkoutSessionId?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

  const checkPaymentStatus = useCallback(async (checkoutSessionId?: string) => {
    if (!session) {
      setHasPaid(false);
      return;
    }

    setCheckingPayment(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-payment", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: checkoutSessionId ? { checkout_session_id: checkoutSessionId } : {},
      });

      if (error) {
        console.error("Error checking payment:", error);
        setHasPaid(false);
      } else {
        setHasPaid(data?.hasPaid ?? false);
      }
    } catch (error) {
      console.error("Error checking payment:", error);
      setHasPaid(false);
    } finally {
      setCheckingPayment(false);
    }
  }, [session]);

  useEffect(() => {
    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);

        // Check payment status when user logs in
        if (event === "SIGNED_IN" && newSession) {
          // Use setTimeout to avoid blocking the auth state change
          setTimeout(() => {
            checkPaymentStatus();
          }, 0);
        }
        
        if (event === "SIGNED_OUT") {
          setHasPaid(false);
        }
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
      
      if (initialSession) {
        checkPaymentStatus();
      }
    });

    return () => subscription.unsubscribe();
  }, [checkPaymentStatus]);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        hasPaid,
        checkingPayment,
        signUp,
        signIn,
        signOut,
        checkPaymentStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
