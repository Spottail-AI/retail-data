import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasPaid: boolean;
  checkingPayment: boolean;
  isSubscribed: boolean;
  checkingSubscription: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  checkPaymentStatus: (checkoutSessionId?: string) => Promise<boolean>;
  checkSubscriptionStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  
  const isCheckingRef = useRef(false);
  const hasCheckedPaymentRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);
  const hasCheckedSubRef = useRef(false);
  const isCheckingSubRef = useRef(false);

  const checkSubscriptionStatus = useCallback(async (): Promise<boolean> => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (!currentSession) {
      setIsSubscribed(false);
      return false;
    }

    if (hasCheckedSubRef.current && lastUserIdRef.current === currentSession.user.id) {
      return isSubscribed;
    }
    if (isCheckingSubRef.current) return isSubscribed;

    isCheckingSubRef.current = true;
    setCheckingSubscription(true);

    try {
      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: { Authorization: `Bearer ${currentSession.access_token}` },
      });

      if (error) {
        console.error("Error checking subscription:", error);
        setIsSubscribed(false);
        return false;
      }

      const subscribed = data?.subscribed ?? false;
      setIsSubscribed(subscribed);
      hasCheckedSubRef.current = true;
      return subscribed;
    } catch (error) {
      console.error("Error checking subscription:", error);
      setIsSubscribed(false);
      return false;
    } finally {
      isCheckingSubRef.current = false;
      setCheckingSubscription(false);
    }
  }, [isSubscribed]);

  const checkPaymentStatus = useCallback(async (checkoutSessionId?: string): Promise<boolean> => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (!currentSession) {
      setHasPaid(false);
      return false;
    }

    if (!checkoutSessionId) {
      if (hasCheckedPaymentRef.current && lastUserIdRef.current === currentSession.user.id) {
        return hasPaid;
      }
      if (isCheckingRef.current) return hasPaid;
    }

    isCheckingRef.current = true;
    setCheckingPayment(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("check-payment", {
        headers: { Authorization: `Bearer ${currentSession.access_token}` },
        body: checkoutSessionId ? { checkout_session_id: checkoutSessionId } : {},
      });

      if (error) {
        console.error("Error checking payment:", error);
        setHasPaid(false);
        return false;
      } else {
        const paid = data?.hasPaid ?? false;
        setHasPaid(paid);
        hasCheckedPaymentRef.current = true;
        lastUserIdRef.current = currentSession.user.id;
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
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!isMounted) return;

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          lastUserIdRef.current = initialSession.user.id;
          
          // Check payment and subscription in parallel
          setCheckingPayment(true);
          setCheckingSubscription(true);
          
          try {
            const [paymentResult, subResult] = await Promise.allSettled([
              supabase.functions.invoke("check-payment", {
                headers: { Authorization: `Bearer ${initialSession.access_token}` },
                body: {},
              }),
              supabase.functions.invoke("check-subscription", {
                headers: { Authorization: `Bearer ${initialSession.access_token}` },
              }),
            ]);

            if (!isMounted) return;

            if (paymentResult.status === "fulfilled" && !paymentResult.value.error && paymentResult.value.data?.hasPaid) {
              setHasPaid(true);
            } else {
              setHasPaid(false);
            }
            hasCheckedPaymentRef.current = true;

            if (subResult.status === "fulfilled" && !subResult.value.error && subResult.value.data?.subscribed) {
              setIsSubscribed(true);
            } else {
              setIsSubscribed(false);
            }
            hasCheckedSubRef.current = true;
          } catch (error) {
            console.error("Error checking initial status:", error);
            if (isMounted) {
              setHasPaid(false);
              setIsSubscribed(false);
            }
          } finally {
            if (isMounted) {
              setCheckingPayment(false);
              setCheckingSubscription(false);
            }
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;
        
        if (event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          return;
        }
        
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === "SIGNED_IN" && newSession) {
          const isNewUser = lastUserIdRef.current !== newSession.user.id;
          if (isNewUser) {
            hasCheckedPaymentRef.current = false;
            hasCheckedSubRef.current = false;
            lastUserIdRef.current = newSession.user.id;
            checkPaymentStatus();
            checkSubscriptionStatus();
          }
        }
        
        if (event === "SIGNED_OUT") {
          setHasPaid(false);
          setIsSubscribed(false);
          setCheckingPayment(false);
          setCheckingSubscription(false);
          hasCheckedPaymentRef.current = false;
          hasCheckedSubRef.current = false;
          lastUserIdRef.current = null;
        }
      }
    );

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [checkPaymentStatus, checkSubscriptionStatus]);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
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
        isSubscribed,
        checkingSubscription,
        signUp,
        signIn,
        signOut,
        checkPaymentStatus,
        checkSubscriptionStatus,
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
