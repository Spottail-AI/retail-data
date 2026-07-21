import { useEffect } from "react";
import { Link } from "react-router-dom";
import { supplierGuides } from "@/data/supplierGuides";
import { C, display, body, GuideNav, GuideFooter } from "@/components/supplierGuides/GuideChrome";

const JSONLD_ID = "supplier-hub-jsonld";

const CountrySection = ({
  id,
  label,
  headingPre,
  headingEm,
  desc,
  country,
  alt,
}: {
  id: string;
  label: string;
  headingPre: string;
  headingEm: string;
  desc: string;
  country: "UK" | "US";
  alt?: boolean;
}) => {
  const guides = supplierGuides.filter((g) => g.country === country);
  return (
    <div
      id={id}
      style={{
        padding: "72px 24px",
        background: alt ? C.surface : C.white,
        borderTop: alt ? `1px solid ${C.border}` : undefined,
        borderBottom: alt ? `1px solid ${C.border}` : undefined,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, marginBottom: 40, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.teal, marginBottom: 12 }}>{label}</p>
            <h2 style={{ fontFamily: display, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, color: C.ink, margin: 0 }}>
              {headingPre} <em style={{ fontStyle: "italic", color: C.muted }}>{headingEm}</em>
            </h2>
          </div>
          <p style={{ fontSize: 14, fontWeight: 300, color: C.muted, maxWidth: 320, lineHeight: 1.6, letterSpacing: "-0.01em", margin: 0 }}>{desc}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 14 }}>
          {guides.map((g) => (
            <Link
              key={g.slug}
              to={`/become-a-supplier/${g.slug}`}
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                color: C.ink,
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: g.topGun ? C.teal : C.muted }}>
                {g.category}
              </span>
              <span style={{ fontFamily: display, fontSize: 22, fontWeight: 400, letterSpacing: "-0.02em", margin: "4px 0 2px" }}>{g.name}</span>
              <span style={{ fontSize: 13, fontWeight: 300, color: C.muted, lineHeight: 1.55, letterSpacing: "-0.005em" }}>{g.cardBlurb}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: C.teal, marginTop: 12 }}>Read the guide →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const SupplierHub = () => {
  useEffect(() => {
    document.title = "Become a Supplier: How to Get Stocked at Major Retailers | Spottail";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      "content",
      "Step-by-step supplier guides for major retailers — Tesco, Walmart, Boots, Target, Costco and more. Requirements, timelines, buyer contacts, and how to get your product on shelves."
    );
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://spottail.ai/become-a-supplier";

    document.getElementById(JSONLD_ID)?.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = JSONLD_ID;
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Become a Supplier — Retailer Guides",
      url: "https://spottail.ai/become-a-supplier",
      description: "Step-by-step supplier guides for major retailers.",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://spottail.ai/" },
          { "@type": "ListItem", position: 2, name: "Become a Supplier", item: "https://spottail.ai/become-a-supplier" },
        ],
      },
    });
    document.head.appendChild(script);
    window.scrollTo(0, 0);
    return () => {
      document.getElementById(JSONLD_ID)?.remove();
    };
  }, []);

  return (
    <div style={{ fontFamily: body, fontSize: 16, lineHeight: 1.6, color: C.ink, background: C.white }}>
      <GuideNav />

      {/* hero */}
      <div style={{ background: C.black, padding: "88px 24px 72px", textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.teal, marginBottom: 18 }}>Supplier Guides</p>
        <h1 style={{ fontFamily: display, fontSize: "clamp(38px, 6vw, 68px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.02, color: "#fff", maxWidth: 760, margin: "0 auto 24px" }}>
          Become a supplier to the <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.45)" }}>retailers that matter</em>
        </h1>
        <p style={{ fontSize: 16, fontWeight: 300, color: "rgba(255,255,255,0.55)", maxWidth: 540, margin: "0 auto 36px", letterSpacing: "-0.01em", lineHeight: 1.6 }}>
          Step-by-step guides to getting your product stocked — requirements, real timelines, buyer routes and costs, for every major retailer.
        </p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
          {[
            { href: "#uk", label: "United Kingdom ↓" },
            { href: "#us", label: "United States ↓" },
          ].map((p) => (
            <a
              key={p.href}
              href={p.href}
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: "6px 16px",
                borderRadius: 100,
                letterSpacing: "-0.01em",
                textDecoration: "none",
              }}
            >
              {p.label}
            </a>
          ))}
        </div>
      </div>

      <CountrySection
        id="uk"
        label="United Kingdom"
        headingPre="UK retailers"
        headingEm="& wholesalers"
        desc="From the Big Four to the specialist chains and wholesale routes most brands should start with."
        country="UK"
      />

      <CountrySection
        id="us"
        label="United States"
        headingPre="US retailers"
        headingEm="& distributors"
        desc="The mass giants, the specialty chains where emerging brands break out, and the distributor route in."
        country="US"
        alt
      />

      {/* why these guides exist */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "64px 24px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ maxWidth: 1100, margin: "0 auto", gap: 64, alignItems: "start" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.teal, marginBottom: 12 }}>Why these guides exist</p>
            <h2 style={{ fontFamily: display, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, color: C.ink, margin: 0 }}>
              The listing is the <em style={{ fontStyle: "italic", color: C.muted }}>last step,</em> not the first
            </h2>
            <p style={{ fontSize: 15, fontWeight: 300, color: C.muted, lineHeight: 1.7, letterSpacing: "-0.005em", marginTop: 16 }}>
              Every guide here tells you the same honest thing: big retailers say yes to brands with proof. Proof comes from getting stocked somewhere smaller first — independents, wholesalers, specialty chains — and showing up to the buyer meeting with sell-through data. Spottail exists to shortcut that grind.
            </p>
          </div>
          <div>
            {[
              { n: "01", t: "Pick your targets", d: "Use these guides to understand each retailer's requirements, timeline and route in." },
              { n: "02", t: "Get discovered on Source", d: "One product profile on Spottail Source, in front of the buyers and retailers looking for what you make." },
              { n: "03", t: "Build proof, then go big", d: "Spottail matches you to the stores most likely to stock you now — the track record big buyers ask for." },
            ].map((s, i, arr) => (
              <div
                key={s.n}
                style={{
                  display: "flex",
                  gap: 20,
                  padding: "20px 0",
                  borderTop: `1px solid ${C.border}`,
                  borderBottom: i === arr.length - 1 ? `1px solid ${C.border}` : undefined,
                }}
              >
                <span style={{ fontFamily: display, fontSize: 13, fontWeight: 300, color: C.muted, minWidth: 24, paddingTop: 1 }}>{s.n}</span>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", color: C.ink, marginBottom: 3 }}>{s.t}</h4>
                  <p style={{ fontSize: 13, fontWeight: 300, color: C.muted, lineHeight: 1.55, margin: 0 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* final CTA */}
      <div style={{ background: C.black, padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 36, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontFamily: display, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#fff", maxWidth: 560, margin: 0 }}>
              Every retailer. One place to <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.45)" }}>get discovered.</em>
            </h2>
            <p style={{ fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.5)", maxWidth: 400, marginTop: 14, lineHeight: 1.65 }}>
              Create your product profile on Spottail Source and get matched to the retailers and distributors most likely to stock you — contacts included.
            </p>
          </div>
          <Link
            to="/signup"
            style={{ display: "inline-block", fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em", color: C.black, background: "#fff", padding: "14px 28px", borderRadius: 9, textDecoration: "none", whiteSpace: "nowrap" }}
          >
            Start free →
          </Link>
        </div>
      </div>

      <GuideFooter />
    </div>
  );
};

export default SupplierHub;
