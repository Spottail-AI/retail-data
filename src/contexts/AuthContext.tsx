import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getTierFromProductId, type SubscriptionTier } from "@/lib/stripe-config";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasPaid: boolean;
  checkingPayment: boolean;
  isSubscribed: boolean;
  checkingSubscription: boolean;
  subscriptionTier: SubscriptionTier;
  subscriptionEnd: string | null;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<{ error: Error | null }>;
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
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>("free");
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  
  const isCheckingRef = useRef(false);
  const hasCheckedPaymentRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);
  const hasCheckedSubRef = useRef(false);
  const isCheckingSubRef = useRef(false);
  const hasPaidRef = useRef(false);
  const isSubscribedRef = useRef(false);
  const authStateRef = useRef<{ userId: string | null; accessToken: string | null }>({
    userId: null,
    accessToken: null,
  });

  useEffect(() => {
    hasPaidRef.current = hasPaid;
  }, [hasPaid]);

  useEffect(() => {
    isSubscribedRef.current = isSubscribed;
  }, [isSubscribed]);

  const setAuthSession = useCallback((nextSession: Session | null) => {
    const nextUserId = nextSession?.user?.id ?? null;
    const nextAccessToken = nextSession?.access_token ?? null;

    if (
      authStateRef.current.userId === nextUserId &&
      authStateRef.current.accessToken === nextAccessToken
    ) {
      return;
    }

    authStateRef.current = { userId: nextUserId, accessToken: nextAccessToken };
    setSession(nextSession);
    setUser(nextSession?.user ?? null);
  }, []);

  const checkSubscriptionStatus = useCallback(async (): Promise<boolean> => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (!currentSession) {
      setIsSubscribed(false);
      setSubscriptionTier("free");
      setSubscriptionEnd(null);
      return false;
    }

    if (hasCheckedSubRef.current && lastUserIdRef.current === currentSession.user.id) {
      return isSubscribedRef.current;
    }
    if (isCheckingSubRef.current) return isSubscribedRef.current;

    isCheckingSubRef.current = true;
    setCheckingSubscription(true);

    try {
      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: { Authorization: `Bearer ${currentSession.access_token}` },
      });

      if (error) {
        console.error("Error checking subscription:", error);
        setIsSubscribed(false);
        setSubscriptionTier("free");
        setSubscriptionEnd(null);
        return false;
      }

      const subscribed = data?.subscribed ?? false;
      const tier = getTierFromProductId(data?.product_id ?? null);
      setIsSubscribed(subscribed);
      setSubscriptionTier(subscribed ? tier : "free");
      setSubscriptionEnd(data?.subscription_end ?? null);
      hasCheckedSubRef.current = true;
      return subscribed;
    } catch (error) {
      console.error("Error checking subscription:", error);
      setIsSubscribed(false);
      setSubscriptionTier("free");
      setSubscriptionEnd(null);
      return false;
    } finally {
      isCheckingSubRef.current = false;
      setCheckingSubscription(false);
    }
  }, []);

  const checkPaymentStatus = useCallback(async (checkoutSessionId?: string): Promise<boolean> => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (!currentSession) {
      setHasPaid(false);
      return false;
    }

    if (!checkoutSessionId) {
      if (hasCheckedPaymentRef.current && lastUserIdRef.current === currentSession.user.id) {
        return hasPaidRef.current;
      }
      if (isCheckingRef.current) return hasPaidRef.current;
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
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!isMounted) return;

        setAuthSession(initialSession);

        // Unblock the app immediately once we know the session.
        if (isMounted) setLoading(false);

        if (initialSession?.user) {
          lastUserIdRef.current = initialSession.user.id;
          if (hasCheckedPaymentRef.current && hasCheckedSubRef.current) return;
          isCheckingRef.current = true;
          isCheckingSubRef.current = true;
          setCheckingPayment(true);
          setCheckingSubscription(true);

          // Fire payment + subscription checks in the background — do NOT block UI.
          Promise.allSettled([
            supabase.functions.invoke("check-payment", {
              headers: { Authorization: `Bearer ${initialSession.access_token}` },
              body: {},
            }),
            supabase.functions.invoke("check-subscription", {
              headers: { Authorization: `Bearer ${initialSession.access_token}` },
            }),
          ])
            .then(([paymentResult, subResult]) => {
              if (!isMounted) return;

              if (paymentResult.status === "fulfilled" && !paymentResult.value.error && paymentResult.value.data?.hasPaid) {
                setHasPaid(true);
              } else {
                setHasPaid(false);
              }
              hasCheckedPaymentRef.current = true;

              if (subResult.status === "fulfilled" && !subResult.value.error && subResult.value.data?.subscribed) {
                setIsSubscribed(true);
                const tier = getTierFromProductId(subResult.value.data?.product_id ?? null);
                setSubscriptionTier(tier);
                setSubscriptionEnd(subResult.value.data?.subscription_end ?? null);
              } else {
                setIsSubscribed(false);
                setSubscriptionTier("free");
                setSubscriptionEnd(null);
              }
              hasCheckedSubRef.current = true;
            })
            .catch((error) => {
              console.error("Error checking initial status:", error);
              if (!isMounted) return;
              setHasPaid(false);
              setIsSubscribed(false);
              setSubscriptionTier("free");
              setSubscriptionEnd(null);
            })
            .finally(() => {
              if (!isMounted) return;
              isCheckingRef.current = false;
              isCheckingSubRef.current = false;
              setCheckingPayment(false);
              setCheckingSubscription(false);
            });
        }
      } catch (e) {
        if (isMounted) setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;
        
        if (event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
          setAuthSession(newSession);
          return;
        }
        
        setAuthSession(newSession);

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
          setSubscriptionTier("free");
          setSubscriptionEnd(null);
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
  }, [checkPaymentStatus, checkSubscriptionStatus, setAuthSession]);

  const signUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: metadata ? { first_name: metadata.first_name, last_name: metadata.last_name } : undefined,
      },
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
        subscriptionTier,
        subscriptionEnd,
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
