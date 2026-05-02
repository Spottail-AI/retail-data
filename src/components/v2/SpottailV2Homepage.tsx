import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Logo = ({ light = false }: { light?: boolean }) => (
  <span
    className="logo font-body font-semibold text-[15px] tracking-[-0.01em] inline-flex items-center gap-[7px] no-underline"
    style={{ color: light ? "#fff" : "var(--v2-ink)" }}
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

const Nav = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
          <Logo />
        </button>

        <ul className="hidden md:flex list-none gap-7">
          {[
            { label: "Ideation", id: "features" },
            { label: "Growth", id: "how" },
            { label: "Scale", id: "pricing" },
          ].map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
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
              onClick={() => scrollTo(item.id)}
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

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section
      className="flex items-center"
      style={{ background: "var(--v2-black)", padding: "148px 48px 55px", minHeight: "92vh" }}
    >
      <div className="mx-auto w-full text-center" style={{ maxWidth: 900 }}>
        <p className="font-body" style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.01em", color: "var(--v2-teal)", marginBottom: 28 }}>
          Launch smarter. Price better. Win faster.
        </p>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(52px, 7vw, 86px)",
            fontWeight: 300,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            color: "#fff",
            marginBottom: 32,
          }}
        >
          Your AI Growth Partner for<br />
          <em style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.45)" }}>
            Retail &amp; E-Commerce
          </em>
        </h1>
        <p className="hero-subhead-v2" style={{ fontSize: 22, fontWeight: 300, color: "rgba(255,255,255,0.6)", margin: "0 auto 28px", lineHeight: 1.4, letterSpacing: "-0.02em" }}>
          Make smarter product, pricing, and sourcing decisions—faster.
        </p>
        <ul className="hero-sub-v2 list-none mx-auto" style={{ fontSize: 17, fontWeight: 300, color: "rgba(255,255,255,0.55)", maxWidth: 480, margin: "0 auto 44px", letterSpacing: "-0.01em" }}>
          {[
            "Track product prices across online and offline markets",
            "Find verified buyers, distributors, and suppliers instantly",
            "Launch your products to a network of retailers and buyers",
            "Discover rising products before they break out",
          ].map((line) => (
            <li key={line} className="flex items-center justify-center gap-2" style={{ padding: "5px 0" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
                <path d="M2.5 7l3 3 6-6" stroke="#0D9B8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <div className="hero-actions-v2 flex items-center justify-center" style={{ gap: 12 }}>
          <button
            onClick={() => navigate("/signup")}
            className="font-body cursor-pointer transition-all"
            style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em", color: "var(--v2-black)", background: "var(--v2-white)", border: "none", padding: "13px 26px", borderRadius: 9 }}
          >
            Start for free
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="font-body cursor-pointer transition-colors flex items-center"
            style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.01em", color: "rgba(255,255,255,0.45)", background: "transparent", border: "none", padding: "13px 8px", gap: 6 }}
          >
            Watch demo
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="hero-bottom-v2 flex items-center justify-center flex-wrap" style={{ gap: 12, marginTop: 88, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.25)", letterSpacing: "0.01em", marginRight: 8 }}>
            Trusted by teams at
          </span>
          {["Lumi", "Newbase", "SoundHub"].map((b) => (
            <span key={b} style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.1)", padding: "5px 13px", borderRadius: 100, letterSpacing: "-0.01em" }}>
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--v2-teal)", marginBottom: 12 }}>
    {children}
  </p>
);

const SectionH2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display" style={{ fontSize: "clamp(30px, 3.5vw, 42px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--v2-ink)" }}>
    {children}
  </h2>
);

const Features = () => {
  const items = [
    { icon: "📉", title: "Retail & Competitor Product Price Tracking", desc: "Track prices across online and offline markets so you never miss margin or pricing opportunities. Get real-time price change alerts." },
    { icon: "🔍", title: "Supplier & Distributor Discovery", desc: "Find verified distributors and suppliers for your products in one click. Reduce sourcing friction." },
    { icon: "📈", title: "Product Trends Discovery", desc: "Identify products customers are talking about and those about to trend. Spot revenue opportunities before competitors." },
    { icon: "🚀", title: "Launch Your Product to Retail Buyers", desc: "Buyers and customers can explore and upvote products to signal real demand." },
    { icon: "🎯", title: "Competitive Analysis", desc: "Understand what competitors are launching, how they position themselves, and where they're vulnerable." },
  ];
  return (
    <section id="features" style={{ background: "var(--v2-white)", padding: "48px 48px 96px", borderTop: "1px solid var(--v2-border)" }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="features-header-v2 flex justify-between items-end" style={{ marginBottom: 52 }}>
          <div>
            <SectionLabel>Features</SectionLabel>
            <SectionH2>
              Built for retailers that<br />
              <em style={{ fontStyle: "italic", color: "var(--v2-muted)" }}>make markets move</em>
            </SectionH2>
          </div>
          <p className="section-desc-v2" style={{ fontSize: 15, fontWeight: 300, color: "var(--v2-muted)", maxWidth: 300, lineHeight: 1.6, textAlign: "right", letterSpacing: "-0.01em" }}>
            For teams competing in fast-moving retail markets—pricing, sourcing, launching, and growing products.
          </p>
        </div>
        <div className="features-grid-v2 grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {items.map((f, i) => (
            <div
              key={f.title}
              className="feature-card-v2 transition-colors"
              style={{
                background: "var(--v2-white)",
                border: "1px solid var(--v2-border)",
                borderRadius: 12,
                padding: "32px 30px",
                gridColumn: i === items.length - 1 ? "1 / -1" : undefined,
                maxWidth: i === items.length - 1 ? "50%" : undefined,
                margin: i === items.length - 1 ? "0 auto" : undefined,
                width: i === items.length - 1 ? "100%" : undefined,
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--v2-surface)", border: "1px solid var(--v2-border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 16 }}>
                {f.icon}
              </div>
              <h3 className="font-body" style={{ fontSize: 15, fontWeight: 600, color: "var(--v2-ink)", letterSpacing: "-0.02em", marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.6, letterSpacing: "-0.005em" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const navigate = useNavigate();
  const steps = [
    { n: "01", title: "See what's happening", desc: "Track prices, competitor moves, emerging products, and supply signals across online and offline retail." },
    { n: "02", title: "Understand what matters", desc: "Spot opportunities, risks, and gaps in pricing, sourcing, demand, and positioning using real-time market context." },
    { n: "03", title: "Act with confidence", desc: "Launch products, adjust pricing, source suppliers, and respond to competitors—all from one place." },
  ];
  return (
    <section id="how" style={{ background: "var(--v2-surface)", padding: "96px 48px", borderTop: "1px solid var(--v2-border)", borderBottom: "1px solid var(--v2-border)" }}>
      <div className="how-inner-v2 mx-auto grid items-start" style={{ maxWidth: 1100, gridTemplateColumns: "1fr 1fr", gap: 80 }}>
        <div>
          <SectionLabel>How it works</SectionLabel>
          <h2 className="font-display" style={{ fontSize: "clamp(30px, 3.5vw, 42px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--v2-ink)", marginBottom: 20 }}>
            Three steps to<br />
            <em style={{ fontStyle: "italic", color: "var(--v2-muted)" }}>your growth</em>
          </h2>
          <p style={{ fontSize: 15, fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.65, letterSpacing: "-0.01em", marginBottom: 36, maxWidth: 380 }}>
            From raw retail data to actions your team can move on — in minutes, not months.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="font-body cursor-pointer transition-all hidden md:inline-block"
            style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em", color: "#fff", background: "var(--v2-ink)", border: "none", padding: "13px 26px", borderRadius: 9 }}
          >
            See it in action
          </button>
        </div>
        <div className="flex flex-col" style={{ gap: 1 }}>
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="flex items-start"
              style={{
                gap: 20,
                padding: "24px 0",
                borderTop: "1px solid var(--v2-border)",
                borderBottom: i === steps.length - 1 ? "1px solid var(--v2-border)" : undefined,
              }}
            >
              <span className="font-display" style={{ fontSize: 13, fontWeight: 300, color: "var(--v2-muted)", letterSpacing: "-0.01em", minWidth: 22, paddingTop: 1 }}>
                {s.n}
              </span>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--v2-ink)", letterSpacing: "-0.02em", marginBottom: 4 }}>{s.title}</h4>
                <p style={{ fontSize: 13, fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.55, letterSpacing: "-0.005em" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const items = [
    { featured: true, quote: '"Spottail replaced three different tools we were paying for. The AI surfaced a product gap that became our best-performing category last quarter."', initials: "MO", name: "Marcus Osei", role: "Head of Buying" },
    { featured: false, quote: '"The competitor pricing alerts alone are worth it. We stopped losing price-sensitive customers and our margin held through peak season."', initials: "LB", name: "Leila Burrows", role: "E-Commerce Director" },
    { featured: false, quote: '"We used to spend weeks sourcing distributors manually. Now we find them in minutes and just a click. We can now move faster."', initials: "TN", name: "Tom Nwachukwu", role: "Category Manager" },
  ];
  return (
    <section id="testimonials" style={{ background: "var(--v2-white)", padding: "96px 48px" }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <SectionLabel>Customers</SectionLabel>
        <SectionH2>What retail teams say</SectionH2>
        <div className="testi-grid-v2 grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 52 }}>
          {items.map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between"
              style={{
                border: t.featured ? "1px solid transparent" : "1px solid var(--v2-border)",
                borderRadius: 12,
                padding: 28,
                background: t.featured ? "var(--v2-black)" : "var(--v2-white)",
              }}
            >
              <p
                className="font-display italic"
                style={{
                  fontSize: 16,
                  fontWeight: 300,
                  lineHeight: 1.6,
                  color: t.featured ? "rgba(255,255,255,0.75)" : "var(--v2-ink)",
                  letterSpacing: "-0.01em",
                  marginBottom: 24,
                }}
              >
                {t.quote}
              </p>
              <div
                className="flex items-center"
                style={{
                  paddingTop: 20,
                  gap: 11,
                  borderTop: t.featured ? "1px solid rgba(255,255,255,0.08)" : "1px solid var(--v2-border)",
                }}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    fontSize: 11, fontWeight: 600,
                    background: t.featured ? "rgba(255,255,255,0.08)" : "var(--v2-surface)",
                    color: t.featured ? "rgba(255,255,255,0.5)" : "var(--v2-muted)",
                    border: t.featured ? "1px solid rgba(255,255,255,0.1)" : "1px solid var(--v2-border)",
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: t.featured ? "#fff" : "var(--v2-ink)", letterSpacing: "-0.01em" }}>{t.name}</p>
                  <p style={{ fontSize: 12, fontWeight: 300, color: t.featured ? "rgba(255,255,255,0.35)" : "var(--v2-muted)", marginTop: 1 }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: "var(--v2-teal)" }}>
    <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Pricing = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    setFirstName(""); setLastName(""); setEmail(""); setMessage("");
  };

  return (
    <section id="pricing" style={{ background: "var(--v2-surface)", padding: "96px 48px", borderTop: "1px solid var(--v2-border)" }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div>
          <SectionLabel>Pricing</SectionLabel>
          <SectionH2>
            Simple, <em style={{ fontStyle: "italic", color: "var(--v2-muted)" }}>transparent</em> pricing
          </SectionH2>
        </div>
        <div className="pricing-grid-v2 grid items-start" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 52 }}>
          {/* Starter */}
          <div style={{ background: "var(--v2-white)", border: "1px solid var(--v2-border)", borderRadius: 12, padding: 30 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--v2-muted)", marginBottom: 20 }}>Starter</p>
            <p className="font-display" style={{ fontSize: 48, fontWeight: 300, letterSpacing: "-0.04em", color: "var(--v2-ink)", lineHeight: 1, marginBottom: 4 }}>$0</p>
            <p style={{ fontSize: 12, fontWeight: 300, color: "var(--v2-muted)", marginBottom: 20, letterSpacing: "-0.01em" }}>Start exploring the market</p>
            <p style={{ fontSize: 13, fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.55, paddingBottom: 20, marginBottom: 20, borderBottom: "1px solid var(--v2-border)", letterSpacing: "-0.005em" }}>
              Perfect for individuals and small teams getting started with smarter retail decisions.
            </p>
            <ul className="list-none" style={{ marginBottom: 28 }}>
              {["Access to product trend detection", "Launch products to retail buyers", "Track up to 2 product prices", "Find up to 2 suppliers & distributors"].map((f, i, arr) => (
                <li key={f} className="flex items-center" style={{ fontSize: 13, fontWeight: 300, color: "var(--v2-ink)", padding: "6px 0", gap: 9, borderBottom: i === arr.length - 1 ? "none" : "1px solid var(--v2-border)", letterSpacing: "-0.005em" }}>
                  <CheckIcon />{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/signup")}
              className="w-full font-body cursor-pointer transition-all"
              style={{ fontSize: 13, fontWeight: 500, padding: 12, borderRadius: 8, letterSpacing: "-0.01em", background: "transparent", border: "1px solid var(--v2-border)", color: "var(--v2-ink)" }}
            >
              Get started free
            </button>
          </div>

          {/* Growth */}
          <div style={{ background: "var(--v2-black)", border: "1px solid transparent", borderRadius: 12, padding: 30 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Growth</p>
            <p className="font-display" style={{ fontSize: 48, fontWeight: 300, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1, marginBottom: 4 }}>
              <sup style={{ fontSize: 20, fontWeight: 300, verticalAlign: "super", letterSpacing: 0 }}>$</sup>20
            </p>
            <p style={{ fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.3)", marginBottom: 20, letterSpacing: "-0.01em" }}>per month</p>
            <p style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.35)", lineHeight: 1.55, paddingBottom: 20, marginBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.08)", letterSpacing: "-0.005em" }}>
              For growing retail and e-commerce teams ready to scale decisions and execution.
            </p>
            <ul className="list-none" style={{ marginBottom: 28 }}>
              {["Everything in Free", "Track up to 10 product prices", "Find up to 10 suppliers & distributors", "Access to competitive analysis tools"].map((f, i, arr) => (
                <li key={f} className="flex items-center" style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.6)", padding: "6px 0", gap: 9, borderBottom: i === arr.length - 1 ? "none" : "1px solid rgba(255,255,255,0.06)", letterSpacing: "-0.005em" }}>
                  <CheckIcon />{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/signup&redirect=/pricing")}
              className="w-full font-body cursor-pointer transition-all"
              style={{ fontSize: 13, fontWeight: 500, padding: 12, borderRadius: 8, letterSpacing: "-0.01em", background: "#fff", border: "1px solid transparent", color: "var(--v2-black)" }}
            >
              Get started
            </button>
          </div>

          {/* Enterprise */}
          <div style={{ background: "var(--v2-white)", border: "1px solid var(--v2-border)", borderRadius: 12, padding: 30 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--v2-muted)", marginBottom: 20 }}>Enterprise</p>
            <p className="font-display" style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.04em", color: "var(--v2-ink)", lineHeight: 1, marginBottom: 4, paddingTop: 5 }}>Custom</p>
            <p style={{ fontSize: 12, fontWeight: 300, color: "var(--v2-muted)", marginBottom: 20, letterSpacing: "-0.01em" }}>Full visibility. Full control.</p>
            <p style={{ fontSize: 13, fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.55, paddingBottom: 20, marginBottom: 20, borderBottom: "1px solid var(--v2-border)", letterSpacing: "-0.005em" }}>
              For teams operating at scale across multiple products, markets, and suppliers.
            </p>
            <ul className="list-none" style={{ marginBottom: 28 }}>
              {["Unlimited product price tracking", "Unlimited supplier & distributor discovery", "Full competitive analysis suite", "Priority support & onboarding"].map((f, i, arr) => (
                <li key={f} className="flex items-center" style={{ fontSize: 13, fontWeight: 300, color: "var(--v2-ink)", padding: "6px 0", gap: 9, borderBottom: i === arr.length - 1 ? "none" : "1px solid var(--v2-border)", letterSpacing: "-0.005em" }}>
                  <CheckIcon />{f}
                </li>
              ))}
            </ul>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  className="w-full font-body cursor-pointer transition-all"
                  style={{ fontSize: 13, fontWeight: 500, padding: 12, borderRadius: 8, letterSpacing: "-0.01em", background: "transparent", border: "1px solid var(--v2-border)", color: "var(--v2-ink)" }}
                >
                  Contact sales
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-center mb-2">Contact Sales</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactFirstName" className="font-medium text-sm">First Name</Label>
                      <Input id="contactFirstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="contactLastName" className="font-medium text-sm">Last Name</Label>
                      <Input id="contactLastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="contactEmail" className="font-medium text-sm">Email</Label>
                    <Input id="contactEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="message" className="font-medium text-sm">Tell Us More...</Label>
                    <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-[120px]" required />
                  </div>
                  <button
                    type="submit"
                    className="w-full font-body cursor-pointer transition-all"
                    style={{ fontSize: 13, fontWeight: 500, padding: 12, borderRadius: 8, background: "var(--v2-ink)", color: "#fff", border: "1px solid transparent" }}
                  >
                    Contact Sales
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
};

const CtaBlock = () => {
  const navigate = useNavigate();
  return (
    <section style={{ background: "var(--v2-black)", padding: "110px 48px" }}>
      <div className="cta-inner-v2 mx-auto flex justify-between items-end" style={{ maxWidth: 1100 }}>
        <div>
          <h2 className="font-display" style={{ fontSize: "clamp(38px, 5vw, 62px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.05, color: "#fff", marginBottom: 16 }}>
            Ready to grow<br />
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>smarter?</em>
          </h2>
          <p style={{ fontSize: 15, fontWeight: 300, color: "rgba(255,255,255,0.35)", letterSpacing: "-0.01em" }}>
            No credit card needed. Setup in under 5 minutes.
          </p>
        </div>
        <div className="cta-right-v2 flex flex-col items-end flex-shrink-0" style={{ gap: 12, marginLeft: 60 }}>
          <button
            onClick={() => navigate("/signup")}
            className="font-body cursor-pointer transition-all"
            style={{ fontSize: 15, fontWeight: 500, letterSpacing: "-0.01em", color: "var(--v2-black)", background: "var(--v2-white)", border: "none", padding: "14px 32px", borderRadius: 9 }}
          >
            Start for free
          </button>
          <span style={{ fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.2)", letterSpacing: "0.02em", textAlign: "right" }}>
            Free plan available · No lock-in
          </span>
        </div>
      </div>
    </section>
  );
};

const FooterV2 = () => {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer style={{ background: "var(--v2-black)", padding: "0 48px 44px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="footer-grid-v2 mx-auto grid" style={{ maxWidth: 1100, gridTemplateColumns: "1.8fr 1fr 1fr 1fr", gap: 48, padding: "52px 0 44px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 28 }}>
        <div>
          <div style={{ marginBottom: 12, display: "inline-flex" }}>
            <Logo light />
          </div>
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

        {[
          { title: "Product", links: [{ label: "Features", action: () => scrollTo("features") }, { label: "Integrations" }, { label: "Pricing", action: () => scrollTo("pricing") }, { label: "Changelog" }, { label: "Roadmap" }] },
          { title: "Company", links: [{ label: "About" }, { label: "Blog" }, { label: "Careers" }, { label: "Press" }, { label: "Contact" }] },
          { title: "Resources", links: [{ label: "Documentation" }, { label: "API reference" }, { label: "Case studies" }, { label: "Help centre" }, { label: "Status" }] },
        ].map((col) => (
          <div key={col.title}>
            <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>{col.title}</h4>
            <ul className="list-none">
              {col.links.map((l) => (
                <li key={l.label} style={{ marginBottom: 9 }}>
                  <button
                    onClick={l.action}
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

export const SpottailV2Homepage = () => {
  return (
    <div className="spottail-v2 min-h-screen">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CtaBlock />
      <FooterV2 />
    </div>
  );
};
