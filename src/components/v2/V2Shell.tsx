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

export const V2Nav = ({ ctaLabel = "Start free" }: { ctaLabel?: string } = {}) => {
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
                {ctaLabel}
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
            {ctaLabel}
          </button>
        </div>
      )}
    </>
  );
};

export const V2Footer = () => {
  const navigate = useNavigate();
  const goToSection = (id: string) => {
    navigate("/");
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 300);
  };
  const columns = [
    { title: "Product", links: [
      { label: "Features", action: () => goToSection("features") },
      { label: "Integrations" },
      { label: "Pricing", action: () => navigate("/pricing") },
      { label: "Source", action: () => navigate("/source") },
      { label: "Roadmap" },
    ]},
    { title: "Company", links: [
      { label: "About" }, { label: "Blog" }, { label: "Careers" }, { label: "Press" }, { label: "Contact" },
    ]},
    { title: "Resources", links: [
      { label: "Documentation" }, { label: "API reference" }, { label: "Case studies" }, { label: "Help centre" }, { label: "Status" },
    ]},
  ];
  return (
    <footer style={{ background: "var(--v2-black)", padding: "0 48px 44px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="footer-grid-v2 mx-auto grid" style={{ maxWidth: 1100, gridTemplateColumns: "1.8fr 1fr 1fr 1fr", gap: 48, padding: "52px 0 44px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 28 }}>
        <div>
          <div style={{ marginBottom: 12, display: "inline-flex" }}><V2Logo light /></div>
          <p style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.25)", lineHeight: 1.6, maxWidth: 230, letterSpacing: "-0.005em" }}>
            AI growth partner for retail and e-commerce teams who move fast.
          </p>
          <div className="flex items-center" style={{ gap: 14, marginTop: 16 }}>
            <a href="#" aria-label="Twitter" style={{ color: "rgba(255,255,255,0.35)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.857L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="#" aria-label="Instagram" style={{ color: "rgba(255,255,255,0.35)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
            </a>
            <a href="#" aria-label="Facebook" style={{ color: "rgba(255,255,255,0.35)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
            <a href="mailto:hello@spottail.ai" style={{ fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.35)", textDecoration: "none", letterSpacing: "-0.005em" }}>hello@spottail.ai</a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>{col.title}</h4>
            <ul className="list-none">
              {col.links.map((l) => (
                <li key={l.label} style={{ marginBottom: 9 }}>
                  <button
                    onClick={(l as any).action}
                    className="bg-transparent border-0 cursor-pointer p-0 text-left"
                    style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.4)", letterSpacing: "-0.005em" }}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom-v2 mx-auto flex justify-between items-center" style={{ maxWidth: 1100 }}>
        <span style={{ fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.2)", letterSpacing: "-0.005em" }}>© 2026 Spottail AI Ltd.</span>
        <div className="flex" style={{ gap: 20 }}>
          {["Privacy", "Terms", "Cookies"].map((l) => (
            <a key={l} href="#" style={{ fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.2)", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export const V2Page = ({ children }: { children: React.ReactNode }) => (
  <div className="spottail-v2 min-h-screen" style={{ background: "var(--v2-white)", color: "var(--v2-ink)" }}>
    {children}
  </div>
);
