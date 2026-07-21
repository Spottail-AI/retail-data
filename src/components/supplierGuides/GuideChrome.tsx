import { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";

// Shared chrome + helpers for the Become a Supplier guide pages.
// Visual language mirrors the v2 homepage (Fraunces 300 display, Manrope body,
// hairline borders, ink buttons, black CTA sections).

export const C = {
  black: "#0C0C0B",
  ink: "#1A1A18",
  muted: "#6B6B66",
  border: "#E4E4E0",
  surface: "#F7F7F4",
  white: "#FEFEFE",
  teal: "#0D9B8A",
  tealLight: "#E6F5F3",
};

export const display = "'Fraunces', Georgia, serif";
export const body = "'Manrope', system-ui, sans-serif";

// Minimal inline rich text: **bold** and [text](href).
// Internal hrefs (starting with "/") render as router Links.
export const Rich = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} style={{ fontWeight: 600 }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, href] = link;
          if (href.startsWith("/")) {
            return (
              <Link key={i} to={href} style={{ color: C.teal, fontWeight: 500, textDecoration: "none" }}>
                {label}
              </Link>
            );
          }
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="nofollow noopener noreferrer"
              style={{ color: C.teal, fontWeight: 500, textDecoration: "none" }}
            >
              {label}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
};

export const GuideNav = () => {
  const navigate = useNavigate();
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 99,
        height: 58,
        background: C.white,
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        fontFamily: body,
      }}
    >
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          fontWeight: 600,
          fontSize: 15,
          letterSpacing: "-0.01em",
          color: C.ink,
          textDecoration: "none",
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            background: C.teal,
            borderRadius: 6,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2L10 6L6 10L2 6L6 2Z" fill="white" />
          </svg>
        </span>
        Spottail
      </Link>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => navigate("/login")}
          className="hidden md:inline-block"
          style={{
            fontFamily: body,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: C.muted,
            padding: "7px 16px",
            borderRadius: 7,
            border: `1px solid ${C.border}`,
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Sign in
        </button>
        <button
          onClick={() => navigate("/signup")}
          style={{
            fontFamily: body,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: "#fff",
            background: C.ink,
            padding: "7px 16px",
            borderRadius: 7,
            border: "1px solid transparent",
            cursor: "pointer",
          }}
        >
          Start free
        </button>
      </div>
    </nav>
  );
};

export const GuideFooter = () => (
  <footer style={{ background: C.black, padding: "32px 24px", fontFamily: body }}>
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 14,
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.35)" }}>
        © {new Date().getFullYear()} Spottail
      </span>
      <span style={{ fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.35)", display: "flex", gap: 14 }}>
        <Link to="/become-a-supplier" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
          Supplier guides
        </Link>
        <Link to="/source" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
          Source
        </Link>
        <Link to="/" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
          spottail.ai
        </Link>
      </span>
    </div>
  </footer>
);

export const SectionLabel = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <p
    style={{
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: light ? "rgba(255,255,255,0.35)" : C.teal,
      marginBottom: 12,
      fontFamily: body,
    }}
  >
    {children}
  </p>
);

export const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 5 }}>
    <path d="M2.5 7l3 3 6-6" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
