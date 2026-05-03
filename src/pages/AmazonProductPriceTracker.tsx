import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowRight, Check, X, Play, Clock, Bell, BarChart3, Zap, Globe,
  TrendingUp, Shield, Users, Star, Layers, FileText,
  Eye, Target, Rocket, Package, MonitorSmartphone, LineChart
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--v2-teal)", marginBottom: 12 }}>
    {children}
  </p>
);

const SectionH2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--v2-ink)" }}>
    {children}
  </h2>
);

const cardStyle: React.CSSProperties = {
  background: "var(--v2-white)",
  border: "1px solid var(--v2-border)",
  borderRadius: 12,
  padding: 28,
};

const surfaceCardStyle: React.CSSProperties = {
  background: "var(--v2-surface)",
  border: "1px solid var(--v2-border)",
  borderRadius: 12,
  padding: 28,
};

const primaryBtnStyle: React.CSSProperties = {
  fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em",
  color: "#fff", background: "var(--v2-ink)", border: "none",
  padding: "13px 26px", borderRadius: 9, display: "inline-flex", alignItems: "center", gap: 8,
};

const ghostBtnStyle: React.CSSProperties = {
  fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em",
  color: "var(--v2-ink)", background: "transparent", border: "1px solid var(--v2-border)",
  padding: "13px 26px", borderRadius: 9, display: "inline-flex", alignItems: "center", gap: 8,
};

const tealChipStyle: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 9,
  background: "var(--v2-teal-light)", border: "1px solid var(--v2-border)",
  display: "flex", alignItems: "center", justifyContent: "center",
};

const AmazonProductPriceTracker = () => {
  useEffect(() => {
    document.title = "Amazon Product Price Tracker | Track Competitor Prices in Real Time";
    const metaDesc = document.querySelector('meta[name="description"]');
    const content = "Track Amazon product prices in real time, monitor competitors, and get alerts when prices change. Make smarter pricing decisions and win the Buy Box.";
    if (metaDesc) {
      metaDesc.setAttribute("content", content);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = content;
      document.head.appendChild(meta);
    }
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const keywords = "amazon product price tracker, amazon price tracking, buy box monitoring, amazon competitor pricing, amazon price alerts";
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    } else {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      meta.content = keywords;
      document.head.appendChild(meta);
    }

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://spottail.ai/amazon-product-price-tracker";

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Spottail.ai Amazon Product Price Tracker",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: [
        { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
        { "@type": "Offer", price: "29", priceCurrency: "USD", name: "Pro" },
      ],
      description: "Track Amazon product prices in real time, monitor competitors, and win the Buy Box with automated alerts and AI pricing recommendations.",
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      const can = document.querySelector('link[rel="canonical"]');
      if (can) can.remove();
    };
  }, []);

  return (
    <div className="spottail-v2 min-h-screen" style={{ background: "var(--v2-white)", color: "var(--v2-ink)" }}>
      <V2Nav />

      {/* ─── 1. HERO ─── */}
      <section style={{ background: "var(--v2-white)", padding: "140px 24px 80px" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 900 }}>
          <SectionLabel>Amazon Product Price Tracker</SectionLabel>
          <h1 className="font-display" style={{ fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1.05, color: "var(--v2-ink)", marginBottom: 24 }}>
            Amazon product price tracker that{" "}
            <em style={{ fontStyle: "italic", color: "var(--v2-muted)" }}>tells you when to act</em>
          </h1>
          <p style={{ fontSize: 17, fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.6, letterSpacing: "-0.01em", maxWidth: 680, margin: "0 auto 40px" }}>
            Track competitor prices across Amazon in real time — and know exactly when to adjust, protect margins, or win the Buy Box.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center" style={{ gap: 12, marginBottom: 40 }}>
            <Link to="/signup">
              <button style={primaryBtnStyle}>
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <button style={ghostBtnStyle}>
              <Play className="w-4 h-4" /> Watch 2-min Demo
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center" style={{ gap: 24, fontSize: 12, fontWeight: 400, color: "var(--v2-muted)", letterSpacing: "-0.005em" }}>
            <span className="flex items-center" style={{ gap: 6 }}><Users className="w-4 h-4" style={{ color: "var(--v2-teal)" }} /> Used by 500+ Amazon sellers</span>
            <span className="flex items-center" style={{ gap: 6 }}><Zap className="w-4 h-4" style={{ color: "var(--v2-teal)" }} /> Real-time Amazon tracking</span>
            <span className="flex items-center" style={{ gap: 6 }}><Clock className="w-4 h-4" style={{ color: "var(--v2-teal)" }} /> Setup in under 2 minutes</span>
          </div>
        </div>
      </section>

      {/* ─── 2. PROBLEM ─── */}
      <section style={{ background: "var(--v2-surface)", padding: "96px 24px", borderTop: "1px solid var(--v2-border)" }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="text-center" style={{ marginBottom: 48 }}>
            <SectionLabel>The problem</SectionLabel>
            <SectionH2>Most Amazon sellers don't lose on price — <em style={{ fontStyle: "italic", color: "var(--v2-muted)" }}>they lose on timing</em></SectionH2>
            <p style={{ fontSize: 15, fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.65, letterSpacing: "-0.01em", maxWidth: 720, margin: "20px auto 0" }}>
              Amazon prices don't just change — they shift constantly. Competitors drop prices without warning. Buy Box winners rotate throughout the day. One delayed reaction can cost hours of sales. Manual tracking doesn't just slow you down — it guarantees you're reacting too late.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 12 }}>
            {[
              { stat: "2.5M+", label: "Price changes daily on Amazon" },
              { stat: "< 24h", label: "Lifespan of a competitive price" },
              { stat: "30%", label: "Revenue lost to poor pricing decisions" },
            ].map((s, i) => (
              <div key={i} style={{ ...cardStyle, padding: "24px 18px", textAlign: "center" }}>
                <div className="font-display" style={{ fontSize: 32, fontWeight: 300, letterSpacing: "-0.03em", color: "var(--v2-ink)", marginBottom: 6 }}>{s.stat}</div>
                <div style={{ fontSize: 12, fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.5, letterSpacing: "-0.005em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. HOW IT WORKS ─── */}
      <section style={{ background: "var(--v2-white)", padding: "96px 24px", borderTop: "1px solid var(--v2-border)" }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="text-center" style={{ marginBottom: 48 }}>
            <SectionLabel>How it works</SectionLabel>
            <SectionH2>From Amazon price changes <em style={{ fontStyle: "italic", color: "var(--v2-muted)" }}>→ to pricing decisions</em></SectionH2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 16 }}>
            {[
              { icon: Eye, title: "Monitor", desc: "Track Amazon product prices in real time — every competitor change captured automatically." },
              { icon: BarChart3, title: "Understand", desc: "See which price movements actually impact your Buy Box position and margins." },
              { icon: Zap, title: "Act", desc: "Adjust pricing faster, protect profit, and respond with confidence — not guesswork." },
            ].map((col, i) => (
              <div key={i} style={cardStyle}>
                <div style={tealChipStyle}>
                  <col.icon className="w-4 h-4" style={{ color: "var(--v2-teal)" }} />
                </div>
                <h3 className="font-body" style={{ fontSize: 16, fontWeight: 600, color: "var(--v2-ink)", letterSpacing: "-0.02em", margin: "20px 0 8px" }}>{col.title}</h3>
                <p style={{ fontSize: 13, fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.6, letterSpacing: "-0.005em" }}>{col.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. KEY FEATURES ─── */}
      <section style={{ background: "var(--v2-surface)", padding: "96px 24px", borderTop: "1px solid var(--v2-border)" }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="text-center" style={{ marginBottom: 48 }}>
            <SectionLabel>Features</SectionLabel>
            <SectionH2>Everything you need to track Amazon product prices — <em style={{ fontStyle: "italic", color: "var(--v2-muted)" }}>and stay competitive</em></SectionH2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 16 }}>
            {[
              { icon: MonitorSmartphone, title: "Real-Time Amazon Price Tracking", points: ["Monitor competitor prices across Amazon listings", "Track Buy Box price changes automatically", "Access historical price trends"] },
              { icon: Bell, title: "Smart Alerts (Not Noise)", points: ["Get notified only when meaningful price changes happen", "Set thresholds based on your margins", "Receive alerts via Slack, email, or SMS"] },
              { icon: Target, title: "Buy Box & Competitive Insights", points: ["See where you stand against competitors instantly", "Understand what it takes to win the Buy Box", "Track pricing gaps and opportunities"] },
              { icon: LineChart, title: "Pricing Intelligence Dashboard", points: ["Visualize Amazon price trends and competitor movements", "Monitor margin impact in real time", "Make faster, data-backed pricing decisions"] },
              { icon: Zap, title: "Pricing Recommendations", points: ["Get AI-powered suggestions based on competitor behavior", "Avoid unnecessary price drops", "Stay competitive without sacrificing margin"] },
              { icon: FileText, title: "Data Export & Reporting", points: ["Export Amazon price history as CSV", "Generate shareable reports", "Team sharing & collaboration"] },
            ].map((f, i) => (
              <div key={i} style={cardStyle}>
                <div style={tealChipStyle}>
                  <f.icon className="w-4 h-4" style={{ color: "var(--v2-teal)" }} />
                </div>
                <h3 className="font-body" style={{ fontSize: 15, fontWeight: 600, color: "var(--v2-ink)", letterSpacing: "-0.02em", margin: "20px 0 12px" }}>{f.title}</h3>
                <ul className="list-none">
                  {f.points.map((p, j) => (
                    <li key={j} className="flex items-start" style={{ gap: 8, fontSize: 13, fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.55, letterSpacing: "-0.005em", marginBottom: 6 }}>
                      <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--v2-teal)", marginTop: 4 }} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. SETUP STEPS ─── */}
      <section style={{ background: "var(--v2-white)", padding: "96px 24px", borderTop: "1px solid var(--v2-border)" }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="text-center" style={{ marginBottom: 48 }}>
            <SectionLabel>Setup</SectionLabel>
            <SectionH2>Get started in <em style={{ fontStyle: "italic", color: "var(--v2-muted)" }}>under 2 minutes</em></SectionH2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4" style={{ gap: 16 }}>
            {[
              { step: "01", title: "Add Amazon Products", desc: "Paste ASINs or product URLs. We'll start monitoring immediately." },
              { step: "02", title: "Choose Monitoring Frequency", desc: "Real-time, hourly, or daily — you decide how often to check." },
              { step: "03", title: "Receive Alerts & Recommendations", desc: "Get notified the moment a competitor changes their price." },
              { step: "04", title: "Make Data-Driven Decisions", desc: "Use Amazon pricing intelligence to win the Buy Box and protect margins." },
            ].map((s, i) => (
              <div key={i} style={{ ...cardStyle, padding: 24 }}>
                <span className="font-display" style={{ fontSize: 13, fontWeight: 300, color: "var(--v2-teal)", letterSpacing: "-0.01em" }}>{s.step}</span>
                <h3 className="font-body" style={{ fontSize: 15, fontWeight: 600, color: "var(--v2-ink)", letterSpacing: "-0.02em", margin: "12px 0 8px" }}>{s.title}</h3>
                <p style={{ fontSize: 13, fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.55, letterSpacing: "-0.005em" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. USE CASES ─── */}
      <section style={{ background: "var(--v2-surface)", padding: "96px 24px", borderTop: "1px solid var(--v2-border)" }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="text-center" style={{ marginBottom: 48 }}>
            <SectionLabel>Use cases</SectionLabel>
            <SectionH2>Built for <em style={{ fontStyle: "italic", color: "var(--v2-muted)" }}>Amazon sellers</em></SectionH2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 16 }}>
            {[
              { icon: Package, title: "Amazon FBA Sellers", metric: "18% avg revenue increase", desc: "Win the Buy Box more often with real-time competitor pricing data." },
              { icon: Rocket, title: "Resellers & Arbitrage", metric: "22% margin improvement", desc: "Find the best margins by tracking supplier and Amazon competitor prices simultaneously." },
              { icon: Users, title: "Multi-Channel Brands", metric: "12% sales increase", desc: "Keep Amazon pricing aligned with your other channels without manual checks." },
              { icon: Shield, title: "Private Label Brands", metric: "15% Buy Box growth", desc: "Protect your listings and respond instantly to hijackers and undercutters." },
            ].map((uc, i) => (
              <div key={i} style={cardStyle}>
                <div style={tealChipStyle}>
                  <uc.icon className="w-4 h-4" style={{ color: "var(--v2-teal)" }} />
                </div>
                <h3 className="font-body" style={{ fontSize: 15, fontWeight: 600, color: "var(--v2-ink)", letterSpacing: "-0.02em", margin: "20px 0 4px" }}>{uc.title}</h3>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--v2-teal)", marginBottom: 10, letterSpacing: "-0.005em" }}>{uc.metric}</div>
                <p style={{ fontSize: 13, fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.55, letterSpacing: "-0.005em" }}>{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. BENEFITS ─── */}
      <section style={{ background: "var(--v2-white)", padding: "96px 24px", borderTop: "1px solid var(--v2-border)" }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="text-center" style={{ marginBottom: 48 }}>
            <SectionLabel>Benefits</SectionLabel>
            <SectionH2>What Spottail <em style={{ fontStyle: "italic", color: "var(--v2-muted)" }}>gives you</em></SectionH2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 16 }}>
            {[
              { icon: Clock, title: "Save Time", desc: "Automate Amazon price tracking and save 150+ hours per year. No more manual checks." },
              { icon: TrendingUp, title: "Increase Revenue", desc: "Sellers using Spottail see a 10-25% revenue increase within 3 months." },
              { icon: Shield, title: "Protect Margins", desc: "Set margin-protection rules so you never accidentally underprice or overprice." },
              { icon: Zap, title: "Win the Buy Box", desc: "Respond to competitor changes in minutes and capture more of the Buy Box rotation." },
              { icon: BarChart3, title: "Get Insights", desc: "Understand pricing trends, seasonal patterns, and competitor strategies at a glance." },
              { icon: Layers, title: "Scale Easily", desc: "Track 2 ASINs or 2,000 — Spottail grows with your Amazon business." },
            ].map((b, i) => (
              <div key={i} className="flex items-start" style={{ ...cardStyle, gap: 16 }}>
                <div style={{ ...tealChipStyle, flexShrink: 0 }}>
                  <b.icon className="w-4 h-4" style={{ color: "var(--v2-teal)" }} />
                </div>
                <div>
                  <h3 className="font-body" style={{ fontSize: 15, fontWeight: 600, color: "var(--v2-ink)", letterSpacing: "-0.02em", marginBottom: 6 }}>{b.title}</h3>
                  <p style={{ fontSize: 13, fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.55, letterSpacing: "-0.005em" }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. PRICING ─── */}
      <section style={{ background: "var(--v2-surface)", padding: "96px 24px", borderTop: "1px solid var(--v2-border)" }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="text-center" style={{ marginBottom: 48 }}>
            <SectionLabel>Pricing</SectionLabel>
            <SectionH2>Simple, <em style={{ fontStyle: "italic", color: "var(--v2-muted)" }}>transparent</em> pricing</SectionH2>
            <p style={{ fontSize: 14, fontWeight: 300, color: "var(--v2-muted)", marginTop: 12, letterSpacing: "-0.005em" }}>No hidden fees. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 mx-auto" style={{ gap: 16, maxWidth: 960 }}>
            {[
              { name: "STARTER", price: "$0", period: "Start exploring the market", items: "Up to 2 product prices", freq: "Forever free", features: ["Access to product trend detection", "Launch products to retail buyers", "Track up to 2 product prices", "Find up to 2 suppliers & distributors"], cta: "Get started free", featured: false },
              { name: "GROWTH", price: "$20", period: "per month", items: "Up to 10 product prices", freq: "For growing teams", features: ["Everything in Free", "Track up to 10 product prices", "Find up to 10 suppliers & distributors", "Access to competitive analysis tools"], cta: "Get started", featured: true },
              { name: "ENTERPRISE", price: "Custom", period: "Full visibility. Full control.", items: "Unlimited tracking", freq: "For teams at scale", features: ["Unlimited product price tracking", "Unlimited supplier & distributor discovery", "Full competitive analysis suite", "Priority support & onboarding"], cta: "Contact Sales", featured: false },
            ].map((plan, i) => {
              const dark = plan.featured;
              return (
                <div key={i} style={{
                  background: dark ? "var(--v2-black)" : "var(--v2-white)",
                  border: "1px solid " + (dark ? "transparent" : "var(--v2-border)"),
                  borderRadius: 12,
                  padding: 30,
                }}>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.35)" : "var(--v2-muted)", marginBottom: 18 }}>{plan.name}</p>
                  <p className="font-display" style={{ fontSize: plan.price === "Custom" ? 36 : 48, fontWeight: 300, letterSpacing: "-0.04em", color: dark ? "#fff" : "var(--v2-ink)", lineHeight: 1, marginBottom: 4 }}>{plan.price}</p>
                  <p style={{ fontSize: 12, fontWeight: 300, color: dark ? "rgba(255,255,255,0.3)" : "var(--v2-muted)", marginBottom: 18, letterSpacing: "-0.01em" }}>{plan.period || plan.items}</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: dark ? "rgba(255,255,255,0.65)" : "var(--v2-teal)", paddingBottom: 18, marginBottom: 18, borderBottom: "1px solid " + (dark ? "rgba(255,255,255,0.08)" : "var(--v2-border)"), letterSpacing: "-0.005em" }}>
                    {plan.freq} · {plan.items}
                  </p>
                  <ul className="list-none" style={{ marginBottom: 24 }}>
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start" style={{ fontSize: 13, fontWeight: 300, color: dark ? "rgba(255,255,255,0.65)" : "var(--v2-ink)", padding: "5px 0", gap: 9, letterSpacing: "-0.005em" }}>
                        <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--v2-teal)", marginTop: 3 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup">
                    <button className="w-full font-body cursor-pointer" style={{
                      fontSize: 13, fontWeight: 500, padding: 12, borderRadius: 8, letterSpacing: "-0.01em",
                      background: dark ? "#fff" : "transparent",
                      border: "1px solid " + (dark ? "transparent" : "var(--v2-border)"),
                      color: dark ? "var(--v2-black)" : "var(--v2-ink)",
                    }}>
                      {plan.cta}
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 9. INTEGRATIONS ─── */}
      <section style={{ background: "var(--v2-white)", padding: "96px 24px", borderTop: "1px solid var(--v2-border)" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 900 }}>
          <SectionLabel>Integrations</SectionLabel>
          <SectionH2>Connects to your <em style={{ fontStyle: "italic", color: "var(--v2-muted)" }}>favourite tools</em></SectionH2>
          <p style={{ fontSize: 14, fontWeight: 300, color: "var(--v2-muted)", margin: "16px 0 36px", letterSpacing: "-0.005em" }}>
            Works with Amazon Seller Central and 50+ other platforms.
          </p>
          <div className="flex flex-wrap items-center justify-center" style={{ gap: 10 }}>
            {["Amazon", "Seller Central", "Shopify", "WooCommerce", "eBay", "Slack", "Google Sheets", "Zapier"].map((name) => (
              <div key={name} style={{
                padding: "10px 18px",
                borderRadius: 100,
                background: "var(--v2-white)",
                border: "1px solid var(--v2-border)",
                fontSize: 13, fontWeight: 500, color: "var(--v2-ink)", letterSpacing: "-0.01em",
              }}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. COMPARISON TABLE ─── */}
      <section style={{ background: "var(--v2-surface)", padding: "96px 24px", borderTop: "1px solid var(--v2-border)" }}>
        <div className="mx-auto" style={{ maxWidth: 1000 }}>
          <div className="text-center" style={{ marginBottom: 48 }}>
            <SectionLabel>Comparison</SectionLabel>
            <SectionH2>How Spottail <em style={{ fontStyle: "italic", color: "var(--v2-muted)" }}>stacks up</em></SectionH2>
          </div>
          <div className="overflow-x-auto" style={{ ...cardStyle, padding: 0 }}>
            <table className="w-full border-collapse" style={{ minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--v2-border)" }}>
                  <th style={{ textAlign: "left", padding: "16px 20px", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--v2-muted)" }}>Feature</th>
                  <th style={{ textAlign: "center", padding: "16px 20px", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--v2-teal)" }}>Spottail</th>
                  <th style={{ textAlign: "center", padding: "16px 20px", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--v2-muted)" }}>Keepa</th>
                  <th style={{ textAlign: "center", padding: "16px 20px", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--v2-muted)" }}>CamelCamelCamel</th>
                  <th style={{ textAlign: "center", padding: "16px 20px", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--v2-muted)" }}>Prisync</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Real-Time Amazon Tracking", spottail: true, a: true, b: false, c: true },
                  { feature: "Buy Box Monitoring", spottail: true, a: true, b: false, c: false },
                  { feature: "AI Pricing Recommendations", spottail: true, a: false, b: false, c: false },
                  { feature: "Free Plan Available", spottail: true, a: true, b: true, c: false },
                  { feature: "Slack / SMS Alerts", spottail: true, a: false, b: false, c: false },
                  { feature: "Margin-Based Thresholds", spottail: true, a: false, b: false, c: true },
                  { feature: "Setup Under 2 Minutes", spottail: true, a: false, b: true, c: false },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--v2-border)" }}>
                    <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 500, color: "var(--v2-ink)", letterSpacing: "-0.005em" }}>{row.feature}</td>
                    {[row.spottail, row.a, row.b, row.c].map((val, j) => (
                      <td key={j} style={{ padding: "14px 20px", textAlign: "center" }}>
                        {val
                          ? <Check className="w-4 h-4 mx-auto" style={{ color: "var(--v2-teal)" }} />
                          : <X className="w-4 h-4 mx-auto" style={{ color: "var(--v2-border)" }} />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── 11. TESTIMONIALS ─── */}
      <section style={{ background: "var(--v2-white)", padding: "96px 24px", borderTop: "1px solid var(--v2-border)" }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="text-center" style={{ marginBottom: 48 }}>
            <SectionLabel>Customers</SectionLabel>
            <SectionH2>What Amazon sellers <em style={{ fontStyle: "italic", color: "var(--v2-muted)" }}>are saying</em></SectionH2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 16, marginBottom: 24 }}>
            {[
              { quote: "Spottail tells us the moment a competitor undercuts on Amazon. We've cut our Buy Box losses in half and added 22% to revenue in two months.", name: "Sarah K.", title: "E-Commerce Director", company: "TrendRetail", impact: "+22% revenue" },
              { quote: "We used to react to Amazon price changes a day late. Now we react in minutes. Spottail's alerts are signal — not noise.", name: "David M.", title: "Head of Pricing", company: "GreenMart", impact: "+18% conversion" },
              { quote: "The AI recommendations stop us from racing competitors to the bottom. Margins are protected and we still win the Buy Box.", name: "Priya L.", title: "Operations Lead", company: "LuxHome Goods", impact: "30% time saved" },
            ].map((t, i) => (
              <div key={i} className="flex flex-col" style={cardStyle}>
                <div className="flex" style={{ gap: 3, marginBottom: 16 }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5" style={{ color: "var(--v2-teal)", fill: "var(--v2-teal)" }} />
                  ))}
                </div>
                <p className="font-display italic" style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.6, color: "var(--v2-ink)", letterSpacing: "-0.01em", marginBottom: 24, flex: 1 }}>
                  "{t.quote}"
                </p>
                <div style={{ paddingTop: 16, borderTop: "1px solid var(--v2-border)" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--v2-ink)", letterSpacing: "-0.01em" }}>{t.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 300, color: "var(--v2-muted)", marginTop: 2 }}>{t.title}, {t.company}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--v2-teal)", marginTop: 6 }}>{t.impact}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ ...surfaceCardStyle, padding: 40 }}>
            <Play className="w-10 h-10 mx-auto" style={{ color: "var(--v2-teal)", marginBottom: 16 }} />
            <h3 className="font-body" style={{ fontSize: 16, fontWeight: 600, color: "var(--v2-ink)", letterSpacing: "-0.02em", marginBottom: 8 }}>See how Amazon sellers use Spottail</h3>
            <p style={{ fontSize: 13, fontWeight: 300, color: "var(--v2-muted)", letterSpacing: "-0.005em" }}>Watch a 2-minute walkthrough of how real Amazon businesses track competitor prices and win the Buy Box.</p>
          </div>
        </div>
      </section>

      {/* ─── 12. FAQ ─── */}
      <section style={{ background: "var(--v2-surface)", padding: "96px 24px", borderTop: "1px solid var(--v2-border)" }}>
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          <div className="text-center" style={{ marginBottom: 48 }}>
            <SectionLabel>FAQ</SectionLabel>
            <SectionH2>Frequently asked <em style={{ fontStyle: "italic", color: "var(--v2-muted)" }}>questions</em></SectionH2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {[
              { q: "How often does Spottail update Amazon prices?", a: "Depending on your plan, prices are updated daily (Free), or in real time (Pro and Enterprise). Real-time tracking captures Amazon price changes within minutes." },
              { q: "Does Spottail track the Amazon Buy Box?", a: "Yes. We monitor Buy Box price and rotation across the day so you know exactly what it takes to win and hold it." },
              { q: "What Amazon marketplaces are supported?", a: "Spottail supports Amazon US, UK, EU and most major marketplaces. Track listings by ASIN or product URL." },
              { q: "How accurate is the price tracking?", a: "Our scraping engine achieves 99.5%+ accuracy. We validate Amazon prices using multiple data points and flag discrepancies for review." },
              { q: "Can I track my own Amazon listings alongside competitors?", a: "Absolutely. Add your own ASINs and see exactly how you compare on price and Buy Box share in real time." },
              { q: "Can I automate my Amazon pricing based on competitor data?", a: "Yes. Pro and Enterprise plans include rules that suggest price adjustments based on competitor changes, margin floors, and custom logic." },
              { q: "How long does setup take?", a: "Most users are up and running in under 2 minutes. Just paste an ASIN or Amazon URL and tracking starts immediately." },
              { q: "Is my data private and secure?", a: "Yes. All data is encrypted in transit and at rest. We never share your tracking data with third parties." },
              { q: "Do you offer a free trial?", a: "Yes — our Free plan is free forever with 2 tracked Amazon products and daily updates. No credit card required." },
              { q: "Can I cancel anytime?", a: "Yes. There are no long-term contracts. You can cancel your subscription at any time from your account settings." },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} style={{ background: "var(--v2-white)", border: "1px solid var(--v2-border)", borderRadius: 12, padding: "0 20px" }}>
                <AccordionTrigger className="font-body text-left" style={{ fontSize: 14, fontWeight: 500, color: "var(--v2-ink)", letterSpacing: "-0.01em" }}>{faq.q}</AccordionTrigger>
                <AccordionContent style={{ fontSize: 13, fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.65, letterSpacing: "-0.005em" }}>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── 13. CASE STUDIES ─── */}
      <section style={{ background: "var(--v2-white)", padding: "96px 24px", borderTop: "1px solid var(--v2-border)" }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="text-center" style={{ marginBottom: 48 }}>
            <SectionLabel>Case studies</SectionLabel>
            <SectionH2>How 3 Amazon sellers <em style={{ fontStyle: "italic", color: "var(--v2-muted)" }}>increased revenue</em></SectionH2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 16 }}>
            {[
              {
                type: "Mid-Size Amazon FBA Seller",
                size: "~5,000 ASINs, $2M annual revenue",
                challenge: "Spending 10+ hours per week manually monitoring Amazon competitors. Frequently undercut without realizing it.",
                solution: "Implemented Spottail Pro to track top 50 competitors in real time with automated Slack alerts.",
                results: "+18% revenue in 90 days, 12 hours/week saved, 95% fewer missed Buy Box rotations.",
                learning: "Automation pays for itself within the first week.",
              },
              {
                type: "Amazon Reseller",
                size: "300 ASINs, solo founder",
                challenge: "Razor-thin margins. Competitors undercut by $1-2, stealing the Buy Box and traffic.",
                solution: "Used Spottail's AI recommendations to set dynamic pricing rules and margin floors.",
                results: "+22% average margin, 40% fewer lost-Buy-Box incidents, $8K additional monthly profit.",
                learning: "Even small price adjustments compound into significant margin gains.",
              },
              {
                type: "Private Label Brand",
                size: "60 SKUs across 4 categories",
                challenge: "Hijackers and copycats kept undercutting listings, eroding price floor and brand positioning.",
                solution: "Deployed Spottail Enterprise with real-time alerts and weekly competitor reports.",
                results: "+15% Buy Box share, 20% fewer unauthorized undercut events, faster reaction times.",
                learning: "Speed of response matters more than the size of the price change.",
              },
            ].map((cs, i) => (
              <div key={i} style={cardStyle}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--v2-teal)", marginBottom: 6 }}>{cs.type}</div>
                <div style={{ fontSize: 12, fontWeight: 300, color: "var(--v2-muted)", marginBottom: 16, letterSpacing: "-0.005em" }}>{cs.size}</div>
                <div className="space-y-3" style={{ fontSize: 13 }}>
                  <div><span style={{ fontWeight: 600, color: "var(--v2-ink)" }}>Challenge:</span> <span style={{ fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.6 }}>{cs.challenge}</span></div>
                  <div><span style={{ fontWeight: 600, color: "var(--v2-ink)" }}>Solution:</span> <span style={{ fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.6 }}>{cs.solution}</span></div>
                  <div><span style={{ fontWeight: 600, color: "var(--v2-teal)" }}>Results:</span> <span style={{ fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.6 }}>{cs.results}</span></div>
                  <div style={{ paddingTop: 12, borderTop: "1px solid var(--v2-border)" }}>
                    <span style={{ fontWeight: 600, color: "var(--v2-ink)" }}>Key Learning:</span>{" "}
                    <span className="font-display italic" style={{ fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.6 }}>{cs.learning}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 14. FINAL CTA ─── */}
      <section style={{ background: "var(--v2-black)", padding: "110px 24px" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 760 }}>
          <h2 className="font-display" style={{ fontSize: "clamp(34px, 4.5vw, 56px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.05, color: "#fff", marginBottom: 16 }}>
            Start tracking Amazon<br />
            prices <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>today</em>
          </h2>
          <p style={{ fontSize: 15, fontWeight: 300, color: "rgba(255,255,255,0.4)", letterSpacing: "-0.01em", marginBottom: 6 }}>
            See what your Amazon competitors are doing in real time.
          </p>
          <p style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.3)", letterSpacing: "-0.005em", marginBottom: 36 }}>
            Free forever plan. No credit card required. Setup in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center" style={{ gap: 12, marginBottom: 24 }}>
            <Link to="/signup">
              <button className="font-body cursor-pointer" style={{
                fontSize: 15, fontWeight: 500, letterSpacing: "-0.01em",
                color: "var(--v2-black)", background: "var(--v2-white)", border: "none",
                padding: "14px 32px", borderRadius: 9, display: "inline-flex", alignItems: "center", gap: 8,
              }}>
                Start Your Free Trial <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <button className="font-body cursor-pointer" style={{
              fontSize: 15, fontWeight: 500, letterSpacing: "-0.01em",
              color: "rgba(255,255,255,0.7)", background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              padding: "14px 32px", borderRadius: 9,
            }}>
              Watch 2-min Demo
            </button>
          </div>
          <p className="flex items-center justify-center" style={{ fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.35)", letterSpacing: "0.01em", gap: 6 }}>
            <Users className="w-3.5 h-3.5" /> Join 500+ Amazon sellers tracking prices smarter
          </p>
        </div>
      </section>

      <V2Footer />
    </div>
  );
};

export default AmazonProductPriceTracker;
