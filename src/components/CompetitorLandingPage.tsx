import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Check, X } from "lucide-react";

export interface ComparisonRow {
  feature: string;
  spottail: string;
  competitor: string;
}

export interface WhyBetterPoint {
  title: string;
  description?: string;
}

export interface UseCase {
  condition: string;
}

export interface CompetitorPageData {
  title: string;
  metaDescription: string;
  competitorName: string;
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  quickSummary: string;
  comparisonTable: ComparisonRow[];
  whyLookForAlternative: string[];
  whySpottailBetter: WhyBetterPoint[];
  useCompetitorIf: UseCase[];
  useSpottailIf: UseCase[];
  finalCta: {
    headline: string;
    buttonText: string;
  };
}

// ── V2 Logo / Nav / Footer (mirrors SpottailV2Homepage) ───────────────────
const V2Logo = ({ light = false }: { light?: boolean }) => (
  <span
    className="font-body font-semibold inline-flex items-center no-underline"
    style={{ fontSize: 15, letterSpacing: "-0.01em", gap: 7, color: light ? "#fff" : "var(--v2-ink)" }}
  >
    <span className="inline-flex items-center justify-center" style={{ width: 22, height: 22, background: "var(--v2-teal)", borderRadius: 6 }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 2L10 6L6 10L2 6L6 2Z" fill="white" />
      </svg>
    </span>
    Spottail
  </span>
);

const V2Nav = () => {
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
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 2, opacity: 0.5 }}>
                  <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-[10px]">
          {user ? (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="hidden md:inline-block font-body font-medium text-[13px] tracking-[-0.01em] no-underline cursor-pointer transition-all"
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
            { label: "Customers", id: "testimonials" },
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

const V2Footer = () => {
  const navigate = useNavigate();
  return (
    <footer style={{ background: "var(--v2-black)", padding: "0 24px 44px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="mx-auto grid" style={{ maxWidth: 1100, gridTemplateColumns: "1.8fr 1fr 1fr", gap: 48, padding: "52px 0 44px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 28 }}>
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
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>Contact</h4>
          <a href="mailto:hello@spottail.ai" style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>hello@spottail.ai</a>
        </div>
      </div>
      <div className="mx-auto flex justify-between items-center" style={{ maxWidth: 1100 }}>
        <span style={{ fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.2)" }}>© 2026 Spottail AI Ltd.</span>
      </div>
    </footer>
  );
};

// ── Design system primitives matching the v2 homepage ──────────────────────
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--v2-teal)", marginBottom: 12 }}>
    {children}
  </p>
);

const SectionH2 = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <h2 className="font-display" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, color: light ? "#fff" : "var(--v2-ink)" }}>
    {children}
  </h2>
);

const cardStyle: React.CSSProperties = {
  background: "var(--v2-white)",
  border: "1px solid var(--v2-border)",
  borderRadius: 12,
  padding: 28,
};

const primaryBtnStyle: React.CSSProperties = {
  fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em",
  color: "#fff", background: "var(--v2-ink)", border: "none",
  padding: "13px 26px", borderRadius: 9, display: "inline-flex", alignItems: "center", gap: 8,
  textDecoration: "none",
};

export const CompetitorLandingPage = ({ data }: { data: CompetitorPageData }) => {
  useEffect(() => {
    document.title = data.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", data.metaDescription);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = data.metaDescription;
      document.head.appendChild(meta);
    }
  }, [data.title, data.metaDescription]);

  return (
    <div className="spottail-v2" style={{ background: "var(--v2-white)", color: "var(--v2-ink)", minHeight: "100vh" }}>
      <V2Nav />

      {/* Hero */}
      <section style={{ padding: "140px 24px 80px", background: "var(--v2-white)" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 880 }}>
          <SectionLabel>Spottail vs {data.competitorName}</SectionLabel>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(36px, 5.5vw, 64px)",
              fontWeight: 300,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              color: "var(--v2-ink)",
              marginBottom: 24,
            }}
          >
            {data.hero.headline}
          </h1>
          <p
            className="font-body"
            style={{
              fontSize: "clamp(15px, 1.4vw, 18px)",
              fontWeight: 300,
              lineHeight: 1.55,
              color: "var(--v2-muted)",
              maxWidth: 620,
              margin: "0 auto 36px",
              letterSpacing: "-0.01em",
            }}
          >
            {data.hero.subheadline}
          </p>
          <Link to="/signup" style={primaryBtnStyle}>
            {data.hero.cta}
            <ArrowRight size={16} />
          </Link>
          <p className="font-body" style={{ fontSize: 12, color: "var(--v2-muted)", marginTop: 18, letterSpacing: "-0.005em" }}>
            {data.quickSummary}
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section style={{ padding: "80px 24px", background: "var(--v2-surface)" }}>
        <div className="mx-auto" style={{ maxWidth: 980 }}>
          <div className="text-center" style={{ marginBottom: 48 }}>
            <SectionLabel>Feature comparison</SectionLabel>
            <SectionH2>How Spottail compares to {data.competitorName}</SectionH2>
          </div>

          <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
            <div className="overflow-x-auto">
              <table className="w-full font-body" style={{ borderCollapse: "collapse", minWidth: 520 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--v2-border)" }}>
                    <th className="text-left" style={{ padding: "18px 24px", fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--v2-muted)" }}>Feature</th>
                    <th className="text-center" style={{ padding: "18px 24px", fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--v2-teal)" }}>Spottail</th>
                    <th className="text-center" style={{ padding: "18px 24px", fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--v2-muted)" }}>{data.competitorName}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.comparisonTable.map((row, i) => (
                    <tr key={i} style={{ borderBottom: i === data.comparisonTable.length - 1 ? "none" : "1px solid var(--v2-border)" }}>
                      <td style={{ padding: "18px 24px", fontSize: 14, fontWeight: 500, color: "var(--v2-ink)", letterSpacing: "-0.01em" }}>{row.feature}</td>
                      <td className="text-center" style={{ padding: "18px 24px" }}>
                        <span className="inline-flex items-center" style={{ gap: 6, fontSize: 14, fontWeight: 500, color: "var(--v2-teal)", letterSpacing: "-0.01em" }}>
                          <Check size={15} />
                          {row.spottail}
                        </span>
                      </td>
                      <td className="text-center" style={{ padding: "18px 24px", fontSize: 14, fontWeight: 300, color: "var(--v2-muted)", letterSpacing: "-0.01em" }}>{row.competitor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Why Switch */}
      <section style={{ padding: "80px 24px", background: "var(--v2-white)" }}>
        <div className="mx-auto" style={{ maxWidth: 980 }}>
          <div className="text-center" style={{ marginBottom: 48 }}>
            <SectionLabel>Why teams switch</SectionLabel>
            <SectionH2>Why teams move from {data.competitorName} to Spottail</SectionH2>
          </div>

          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {data.whyLookForAlternative.map((reason, i) => (
              <div key={i} style={cardStyle}>
                <div className="flex items-start" style={{ gap: 10, marginBottom: 16 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 6, background: "var(--v2-surface)", border: "1px solid var(--v2-border)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <X size={13} style={{ color: "var(--v2-muted)" }} />
                  </span>
                  <p className="font-body" style={{ fontSize: 14, fontWeight: 400, color: "var(--v2-muted)", letterSpacing: "-0.01em", lineHeight: 1.5 }}>
                    {reason}
                  </p>
                </div>
                {data.whySpottailBetter[i] && (
                  <div className="flex items-start" style={{ gap: 10, paddingTop: 16, borderTop: "1px solid var(--v2-border)" }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: "var(--v2-teal-light, rgba(13,155,138,0.1))", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <Check size={13} style={{ color: "var(--v2-teal)" }} />
                    </span>
                    <div>
                      <p className="font-body" style={{ fontSize: 14, fontWeight: 500, color: "var(--v2-ink)", letterSpacing: "-0.01em", lineHeight: 1.5 }}>
                        {data.whySpottailBetter[i].title}
                      </p>
                      {data.whySpottailBetter[i].description && (
                        <p className="font-body" style={{ fontSize: 13, fontWeight: 300, color: "var(--v2-muted)", marginTop: 4, letterSpacing: "-0.005em", lineHeight: 1.5 }}>
                          {data.whySpottailBetter[i].description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who should use each */}
      <section style={{ padding: "80px 24px", background: "var(--v2-surface)" }}>
        <div className="mx-auto" style={{ maxWidth: 880 }}>
          <div className="text-center" style={{ marginBottom: 48 }}>
            <SectionLabel>Use cases</SectionLabel>
            <SectionH2>Who should use each tool</SectionH2>
          </div>

          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            <div style={cardStyle}>
              <p className="font-body" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--v2-muted)", marginBottom: 16 }}>
                Use {data.competitorName} if
              </p>
              <ul className="list-none" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {data.useCompetitorIf.map((item, i) => (
                  <li key={i} className="flex items-start" style={{ gap: 10 }}>
                    <span style={{ width: 4, height: 4, borderRadius: 2, background: "var(--v2-muted)", marginTop: 9, flexShrink: 0 }} />
                    <span className="font-body" style={{ fontSize: 14, fontWeight: 300, color: "var(--v2-muted)", letterSpacing: "-0.01em", lineHeight: 1.5 }}>
                      {item.condition}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ ...cardStyle, borderColor: "var(--v2-teal)", borderWidth: 1.5 }}>
              <p className="font-body" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--v2-teal)", marginBottom: 16 }}>
                Use Spottail if
              </p>
              <ul className="list-none" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {data.useSpottailIf.map((item, i) => (
                  <li key={i} className="flex items-start" style={{ gap: 10 }}>
                    <Check size={15} style={{ color: "var(--v2-teal)", marginTop: 4, flexShrink: 0 }} />
                    <span className="font-body" style={{ fontSize: 14, fontWeight: 400, color: "var(--v2-ink)", letterSpacing: "-0.01em", lineHeight: 1.5 }}>
                      {item.condition}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "100px 24px", background: "var(--v2-white)" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 720 }}>
          <SectionH2>{data.finalCta.headline}</SectionH2>
          <div style={{ marginTop: 36 }}>
            <Link to="/signup" style={primaryBtnStyle}>
              {data.finalCta.buttonText}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <V2Footer />
    </div>
  );
};
