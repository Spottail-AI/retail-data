import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";
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
  checkPaymentStatus: (checkoutSessionId?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  
  // Prevent overlapping payment checks
  const isCheckingRef = useRef(false);
  const initialCheckDoneRef = useRef(false);

  const checkPaymentStatus = useCallback(async (checkoutSessionId?: string): Promise<boolean> => {
    // Get the current session directly to avoid stale closure
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (!currentSession) {
      setHasPaid(false);
      return false;
    }

    // Prevent overlapping checks (except for explicit checkout verification)
    if (isCheckingRef.current && !checkoutSessionId) {
      return hasPaid;
    }

    isCheckingRef.current = true;
    setCheckingPayment(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("check-payment", {
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
        },
        body: checkoutSessionId ? { checkout_session_id: checkoutSessionId } : {},
      });

      if (error) {
        console.error("Error checking payment:", error);
        setHasPaid(false);
        return false;
      } else {
        const paid = data?.hasPaid ?? false;
        setHasPaid(paid);
        return paid;
      }
    } catch (error) {
      console.error("Error checking payment:", error);
      setHasPaid(false);
      return false;
    } finally {
      isCheckingRef.current = false;
      setCheckingPayment(false);
    }
  }, [hasPaid]);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        // If user is logged in, check payment status BEFORE setting loading to false
        if (initialSession?.user) {
          setCheckingPayment(true);
          try {
            const { data, error } = await supabase.functions.invoke("check-payment", {
              headers: {
                Authorization: `Bearer ${initialSession.access_token}`,
              },
              body: {},
            });

            if (!isMounted) return;

            if (!error && data?.hasPaid) {
              setHasPaid(true);
            } else {
              setHasPaid(false);
            }
          } catch (error) {
            console.error("Error checking initial payment:", error);
            if (isMounted) setHasPaid(false);
          } finally {
            if (isMounted) setCheckingPayment(false);
          }
        }

        initialCheckDoneRef.current = true;
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;
        
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Only check payment on SIGNED_IN after initial load is complete
        if (event === "SIGNED_IN" && newSession && initialCheckDoneRef.current) {
          // Don't block the auth state change, but do check payment
          checkPaymentStatus();
        }
        
        if (event === "SIGNED_OUT") {
          setHasPaid(false);
          setCheckingPayment(false);
        }
      }
    );

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
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
