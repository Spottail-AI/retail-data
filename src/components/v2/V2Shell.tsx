import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const V2Logo = ({ light = false }: { light?: boolean }) => (
  <span
    className="font-body font-semibold inline-flex items-center no-underline"
    style={{ fontSize: 15, letterSpacing: "-0.01em", gap: 7, color: light ? "#fff" : "var(--v2-ink)" }}
  >
    <span
      className="inline-flex items-center justify-center"
      style={{ width: 22, height: 22, background: "var(--v2-teal)", borderRadius: 6 }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 2L10 6L6 10L2 6L6 2Z" fill="white" />
      </svg>
    </span>
    Spottail
  </span>
);

export const V2Nav = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const goToSection = (id: string) => {
    setOpen(false);
    navigate("/");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[99] flex items-center justify-between"
        style={{
          height: 58,
          padding: "0 48px",
          background: "var(--v2-white)",
          borderBottom: "1px solid var(--v2-border)",
        }}
      >
        <button onClick={() => navigate("/")} className="bg-transparent border-0 cursor-pointer p-0">
          <V2Logo />
        </button>

        <ul className="hidden md:flex list-none gap-7">
          {[
            { label: "Ideation", id: "features" },
            { label: "Growth", id: "how" },
            { label: "Scale", id: "pricing" },
          ].map((item) => (
            <li key={item.id}>
              <button
                onClick={() => goToSection(item.id)}
                className="text-[13px] font-normal bg-transparent border-0 cursor-pointer transition-colors p-0"
                style={{ color: "var(--v2-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--v2-ink)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--v2-muted)")}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-[10px]">
          {user ? (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="hidden md:inline-block font-body font-medium text-[13px] tracking-[-0.01em] cursor-pointer transition-all"
                style={{ padding: "7px 16px", borderRadius: 7, color: "var(--v2-muted)", background: "transparent", border: "1px solid var(--v2-border)" }}
              >
                Dashboard
              </button>
              <button
                onClick={async () => { await signOut(); navigate("/"); }}
                className="font-body font-medium text-[13px] tracking-[-0.01em] cursor-pointer transition-all"
                style={{ padding: "7px 16px", borderRadius: 7, color: "#fff", background: "var(--v2-ink)", border: "1px solid transparent" }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="hidden md:inline-block font-body font-medium text-[13px] tracking-[-0.01em] cursor-pointer transition-all"
                style={{ padding: "7px 16px", borderRadius: 7, color: "var(--v2-muted)", background: "transparent", border: "1px solid var(--v2-border)" }}
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="font-body font-medium text-[13px] tracking-[-0.01em] cursor-pointer transition-all"
                style={{ padding: "7px 16px", borderRadius: 7, color: "#fff", background: "var(--v2-ink)", border: "1px solid transparent" }}
              >
                Start free
              </button>
            </>
          )}

          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="md:hidden flex flex-col justify-center bg-transparent border-0 cursor-pointer ml-2"
            style={{ gap: 5, padding: 4 }}
          >
            <span className="block transition-all" style={{ width: 20, height: 1.5, background: "var(--v2-ink)", transform: open ? "translateY(6.5px) rotate(45deg)" : "none" }} />
            <span className="block transition-all" style={{ width: 20, height: 1.5, background: "var(--v2-ink)", opacity: open ? 0 : 1 }} />
            <span className="block transition-all" style={{ width: 20, height: 1.5, background: "var(--v2-ink)", transform: open ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="md:hidden fixed left-0 right-0 z-[98] flex flex-col"
          style={{ top: 58, background: "var(--v2-white)", borderBottom: "1px solid var(--v2-border)", padding: 20, gap: 4 }}
        >
          {[
            { label: "Ideation", id: "features" },
            { label: "Growth", id: "how" },
            { label: "Scale", id: "pricing" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => goToSection(item.id)}
              className="text-[15px] font-normal text-left bg-transparent border-0 cursor-pointer"
              style={{ color: "var(--v2-ink)", padding: "12px 0", borderBottom: "1px solid var(--v2-border)", letterSpacing: "-0.01em" }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { setOpen(false); navigate("/signup"); }}
            className="text-[15px] font-semibold text-left bg-transparent border-0 cursor-pointer"
            style={{ color: "var(--v2-teal)", padding: "12px 0", marginTop: 8 }}
          >
            Start free
          </button>
        </div>
      )}
    </>
  );
};

export const V2Footer = () => {
  const navigate = useNavigate();
  return (
    <footer style={{ background: "var(--v2-black)", padding: "0 24px 44px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="mx-auto grid footer-grid-v2" style={{ maxWidth: 1100, gridTemplateColumns: "1.8fr 1fr 1fr", gap: 48, padding: "52px 0 44px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 28 }}>
        <div>
          <div style={{ marginBottom: 12, display: "inline-flex" }}><V2Logo light /></div>
          <p style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.25)", lineHeight: 1.6, maxWidth: 230, letterSpacing: "-0.005em" }}>
            AI growth partner for retail and e-commerce teams who move fast.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>Product</h4>
          <ul className="list-none">
            <li style={{ marginBottom: 9 }}><button onClick={() => navigate("/")} className="bg-transparent border-0 cursor-pointer p-0 text-left" style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.4)" }}>Home</button></li>
            <li style={{ marginBottom: 9 }}><button onClick={() => navigate("/pricing")} className="bg-transparent border-0 cursor-pointer p-0 text-left" style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.4)" }}>Pricing</button></li>
            <li style={{ marginBottom: 9 }}><button onClick={() => navigate("/source")} className="bg-transparent border-0 cursor-pointer p-0 text-left" style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.4)" }}>Source</button></li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>Contact</h4>
          <a href="mailto:hello@spottail.ai" style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>hello@spottail.ai</a>
        </div>
      </div>
      <div className="mx-auto flex justify-between items-center footer-bottom-v2" style={{ maxWidth: 1100 }}>
        <span style={{ fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.2)" }}>© 2026 Spottail AI Ltd.</span>
      </div>
    </footer>
  );
};

export const V2Page = ({ children }: { children: React.ReactNode }) => (
  <div className="spottail-v2 min-h-screen" style={{ background: "var(--v2-white)", color: "var(--v2-ink)" }}>
    {children}
  </div>
);
