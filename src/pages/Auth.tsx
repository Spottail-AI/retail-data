import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { lovable } from "@/integrations/lovable/index";
import { RoleSelection } from "@/components/auth/RoleSelection";
import { supabase } from "@/integrations/supabase/client";
import type { UserRole } from "@/hooks/use-user-role";

const Auth = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get("mode");

  const [isLogin, setIsLogin] = useState(mode !== "signup");
  const [step, setStep] = useState<"role" | "credentials">(mode === "signup" ? "role" : "credentials");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (user && pendingRole) {
      const assign = async () => {
        try {
          await supabase
            .from("user_roles")
            .insert({ user_id: user.id, role: pendingRole });
        } catch (e) {
          console.error("Failed to assign role:", e);
        }
        setPendingRole(null);
        navigate(redirectTo);
      };
      assign();
    }
  }, [user, pendingRole, navigate, redirectTo]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep("credentials");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({ title: "Login failed", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Welcome back!", description: "You have been logged in successfully." });
          navigate(redirectTo);
        }
      } else {
        const { error } = await signUp(email, password, { first_name: firstName, last_name: lastName });
        if (error) {
          toast({ title: "Signup failed", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Account created!", description: "You have been signed up successfully." });
          setPendingRole(selectedRole);
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) {
        toast({ title: "Google sign-in failed", description: error.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong with Google sign-in.", variant: "destructive" });
    } finally {
      setGoogleLoading(false);
    }
  };

  const switchToSignup = () => {
    setIsLogin(false);
    setStep("role");
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setStep("credentials");
  };

  // v2 design tokens
  const ink = "#1A1A18";
  const white = "#FEFEFE";
  const surface = "#F7F7F4";
  const teal = "#0D9B8A";
  const border = "rgba(26,26,24,0.12)";
  const muted = "rgba(26,26,24,0.6)";

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 44,
    padding: "0 14px",
    background: white,
    border: `1px solid ${border}`,
    borderRadius: 10,
    fontFamily: "Manrope, system-ui, sans-serif",
    fontSize: 15,
    color: ink,
    outline: "none",
    transition: "border-color 0.15s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: ink,
    marginBottom: 6,
    fontFamily: "Manrope, system-ui, sans-serif",
  };

  return (
    <div
      className="spottail-v2"
      style={{
        minHeight: "100vh",
        background: surface,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        position: "relative",
      }}
    >
      <Link
        to="/"
        style={{
          position: "absolute",
          top: 28,
          left: 32,
          display: "flex",
          alignItems: "center",
          gap: 8,
          textDecoration: "none",
        }}
      >
        <img
          src="/lovable-uploads/6da76baf-f15f-427e-aaa0-1bd3c859bf32.png"
          alt="Spottail"
          style={{ height: 28 }}
        />
      </Link>

      <button
        onClick={() => {
          if (!isLogin && step === "credentials") {
            setStep("role");
          } else {
            navigate(-1);
          }
        }}
        style={{
          position: "absolute",
          top: 28,
          right: 32,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 14px",
          background: "transparent",
          border: "none",
          color: muted,
          fontFamily: "Manrope, system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          borderRadius: 8,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = ink)}
        onMouseLeave={(e) => (e.currentTarget.style.color = muted)}
      >
        <ArrowLeft style={{ width: 16, height: 16 }} />
        Back
      </button>

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: white,
          border: `1px solid ${border}`,
          borderRadius: 20,
          padding: "40px 36px",
          boxShadow: "0 1px 2px rgba(26,26,24,0.04), 0 8px 24px rgba(26,26,24,0.04)",
        }}
      >
        {!isLogin && step === "role" ? (
          <>
            <RoleSelection onSelect={handleRoleSelect} />
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <button
                type="button"
                onClick={switchToLogin}
                style={{
                  background: "none",
                  border: "none",
                  color: muted,
                  fontFamily: "Manrope, system-ui, sans-serif",
                  fontSize: 14,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = teal)}
                onMouseLeave={(e) => (e.currentTarget.style.color = muted)}
              >
                Already have an account? <span style={{ fontWeight: 600 }}>Sign in</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h1
                className="font-display"
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: 32,
                  fontWeight: 400,
                  color: ink,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                {isLogin ? "Welcome back" : "Create account"}
              </h1>
              <p
                style={{
                  fontFamily: "Manrope, system-ui, sans-serif",
                  fontSize: 14,
                  color: muted,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {isLogin
                  ? "Sign in to access your dashboard"
                  : selectedRole === "buyer"
                    ? "Sign up as a Retail Buyer / Distributor"
                    : "Sign up as a Supplier / Brand"}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {!isLogin && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label htmlFor="firstName" style={labelStyle}>First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = teal)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = border)}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" style={labelStyle}>Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = teal)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = border)}
                    />
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="email" style={labelStyle}>Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = teal)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = border)}
                />
              </div>
              <div>
                <label htmlFor="password" style={labelStyle}>Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = teal)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = border)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: 46,
                  marginTop: 4,
                  background: teal,
                  color: white,
                  border: "none",
                  borderRadius: 10,
                  fontFamily: "Manrope, system-ui, sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#0B8576")}
                onMouseLeave={(e) => (e.currentTarget.style.background = teal)}
              >
                {loading ? (
                  <>
                    <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  isLogin ? "Sign in" : "Create account"
                )}
              </button>

              <div style={{ position: "relative", margin: "8px 0", textAlign: "center" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    right: 0,
                    height: 1,
                    background: border,
                  }}
                />
                <span
                  style={{
                    position: "relative",
                    background: white,
                    padding: "0 12px",
                    fontFamily: "Manrope, system-ui, sans-serif",
                    fontSize: 11,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: muted,
                  }}
                >
                  Or continue with
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                style={{
                  width: "100%",
                  height: 46,
                  background: white,
                  color: ink,
                  border: `1px solid ${border}`,
                  borderRadius: 10,
                  fontFamily: "Manrope, system-ui, sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: googleLoading ? "not-allowed" : "pointer",
                  opacity: googleLoading ? 0.7 : 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  transition: "background 0.15s ease, border-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!googleLoading) {
                    e.currentTarget.style.background = surface;
                    e.currentTarget.style.borderColor = "rgba(26,26,24,0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = white;
                  e.currentTarget.style.borderColor = border;
                }}
              >
                {googleLoading ? (
                  <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" />
                ) : (
                  <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                Continue with Google
              </button>
            </form>

            <div style={{ marginTop: 24, textAlign: "center" }}>
              <button
                type="button"
                onClick={() => isLogin ? switchToSignup() : switchToLogin()}
                style={{
                  background: "none",
                  border: "none",
                  color: muted,
                  fontFamily: "Manrope, system-ui, sans-serif",
                  fontSize: 14,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = teal)}
                onMouseLeave={(e) => (e.currentTarget.style.color = muted)}
              >
                {isLogin
                  ? <>Don't have an account? <span style={{ fontWeight: 600 }}>Sign up</span></>
                  : <>Already have an account? <span style={{ fontWeight: 600 }}>Sign in</span></>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
