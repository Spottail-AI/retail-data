import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { supplierGuides, guideBySlug } from "@/data/supplierGuides";
import {
  C,
  display,
  body,
  Rich,
  GuideNav,
  GuideFooter,
  SectionLabel,
  CheckIcon,
} from "@/components/supplierGuides/GuideChrome";

const JSONLD_ID = "supplier-guide-jsonld";

const SupplierGuide = () => {
  const { slug } = useParams();
  const guide = slug ? guideBySlug(slug) : undefined;

  useEffect(() => {
    if (!guide) return;
    document.title = guide.metaTitle;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", guide.metaDescription);

    // canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `https://spottail.ai/become-a-supplier/${guide.slug}`;

    // JSON-LD: FAQPage + BreadcrumbList
    document.getElementById(JSONLD_ID)?.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = JSONLD_ID;
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://spottail.ai/" },
          { "@type": "ListItem", position: 2, name: "Become a Supplier", item: "https://spottail.ai/become-a-supplier" },
          { "@type": "ListItem", position: 3, name: guide.name, item: `https://spottail.ai/become-a-supplier/${guide.slug}` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: guide.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ]);
    document.head.appendChild(script);
    window.scrollTo(0, 0);
    return () => {
      document.getElementById(JSONLD_ID)?.remove();
    };
  }, [guide]);

  if (!guide) return <NotFound />;

  const related = supplierGuides.filter((g) => g.slug !== guide.slug && g.country === guide.country).slice(0, 5);
  const updated = new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <div style={{ fontFamily: body, fontSize: 16, lineHeight: 1.6, color: C.ink, background: C.white }}>
      <GuideNav />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        {/* breadcrumbs */}
        <div style={{ fontSize: 12, color: C.muted, padding: "36px 0 0", letterSpacing: "-0.005em" }}>
          <Link to="/" style={{ color: C.muted, textDecoration: "none" }}>Home</Link>
          {"  ›  "}
          <Link to="/become-a-supplier" style={{ color: C.muted, textDecoration: "none" }}>Become a Supplier</Link>
          {"  ›  "}
          {guide.name}
        </div>

        {/* header */}
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.teal, margin: "34px 0 14px" }}>
          {guide.kicker}
        </p>
        <h1 style={{ fontFamily: display, fontSize: "clamp(34px, 5vw, 52px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.05, color: C.ink, marginBottom: 22 }}>
          {guide.h1Pre} <em style={{ fontStyle: "italic", color: C.muted }}>{guide.h1Em}</em> {guide.h1Post}
        </h1>
        <div style={{ fontSize: 13, fontWeight: 300, color: C.muted, paddingBottom: 28, borderBottom: `1px solid ${C.border}`, marginBottom: 32 }}>
          Requirements, process &amp; timeline · Updated {updated} · {guide.readTime}
        </div>

        {/* quick answer */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "26px 28px", marginBottom: 36 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.teal, marginBottom: 10 }}>
            Quick answer
          </p>
          <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.65, letterSpacing: "-0.005em", margin: 0 }}>
            <Rich text={guide.quickAnswer} />
          </p>
        </div>

        {/* facts */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: 1, background: C.border, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 48 }}
        >
          {guide.facts.map((f) => (
            <div key={f.l} style={{ background: C.white, padding: "20px 18px" }}>
              <div style={{ fontFamily: display, fontSize: 30, fontWeight: 300, letterSpacing: "-0.04em", color: C.ink, lineHeight: 1 }}>{f.n}</div>
              <div style={{ fontSize: 12, fontWeight: 300, color: C.muted, marginTop: 6 }}>{f.l}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 15, fontWeight: 300, color: C.muted, lineHeight: 1.7, letterSpacing: "-0.005em", marginBottom: 16 }}>
          <Rich text={guide.intro} />
        </p>

        {/* routes */}
        <h2 style={{ fontFamily: display, fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, color: C.ink, margin: "56px 0 18px" }}>
          {guide.routesHeading.pre} <em style={{ fontStyle: "italic", color: C.muted }}>{guide.routesHeading.em}</em>
        </h2>
        <div style={{ marginBottom: 8 }}>
          {guide.routes.map((r, i) => (
            <div
              key={r.title}
              style={{
                display: "flex",
                gap: 20,
                padding: "26px 0",
                borderTop: `1px solid ${C.border}`,
                borderBottom: i === guide.routes.length - 1 ? `1px solid ${C.border}` : undefined,
              }}
            >
              <span style={{ fontFamily: display, fontSize: 13, fontWeight: 300, color: C.muted, minWidth: 24, paddingTop: 2 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em", color: C.ink, margin: "0 0 6px" }}>{r.title}</h3>
                <p style={{ fontSize: 14, fontWeight: 300, color: C.muted, lineHeight: 1.65, margin: 0 }}>
                  <Rich text={r.body} />
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Source CTA — featured black card */}
        <div style={{ background: C.black, borderRadius: 12, padding: "34px 32px", margin: "44px 0" }}>
          <SectionLabel light>Spottail Source</SectionLabel>
          <h3 style={{ fontFamily: display, fontSize: 26, fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.15, color: "#fff", margin: "0 0 12px" }}>
            Put your product in front of <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.5)" }}>retail buyers</em>
          </h3>
          <p style={{ fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, marginBottom: 22, maxWidth: 480 }}>
            One product profile on Spottail Source, discoverable by the buyers and retailers looking for what you make — while you work the routes above.
          </p>
          <Link
            to="/source"
            style={{ display: "inline-block", fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em", color: C.black, background: "#fff", padding: "13px 26px", borderRadius: 9, textDecoration: "none" }}
          >
            Create your Source profile →
          </Link>
        </div>

        {/* requirements */}
        <h2 style={{ fontFamily: display, fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, color: C.ink, margin: "56px 0 18px" }}>
          What {guide.name} <em style={{ fontStyle: "italic", color: C.muted }}>requires</em>
        </h2>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", margin: "20px 0 8px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", background: C.surface, padding: "12px 16px" }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted }}>Requirement</span>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted }}>Detail</span>
          </div>
          {guide.requirements.map((r) => (
            <div key={r.k} style={{ display: "grid", gridTemplateColumns: "180px 1fr", padding: "13px 16px", borderTop: `1px solid ${C.border}`, fontSize: 14 }}>
              <span style={{ fontWeight: 600, letterSpacing: "-0.01em", paddingRight: 12 }}>{r.k}</span>
              <span style={{ fontWeight: 300, lineHeight: 1.6, letterSpacing: "-0.005em", color: C.ink }}>
                <Rich text={r.v} />
              </span>
            </div>
          ))}
        </div>

        {guide.note && (
          <div style={{ background: C.tealLight, border: "1px solid rgba(13,155,138,0.25)", borderRadius: 12, padding: "18px 22px", margin: "24px 0", fontSize: 14, fontWeight: 300, lineHeight: 1.65 }}>
            <Rich text={guide.note} />
          </div>
        )}

        {/* steps */}
        <h2 style={{ fontFamily: display, fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, color: C.ink, margin: "56px 0 18px" }}>
          The process, <em style={{ fontStyle: "italic", color: C.muted }}>step by step</em>
        </h2>
        <div style={{ marginBottom: 8 }}>
          {guide.steps.map((s, i) => (
            <div
              key={s.title}
              style={{
                display: "flex",
                gap: 20,
                padding: "22px 0",
                borderTop: `1px solid ${C.border}`,
                borderBottom: i === guide.steps.length - 1 ? `1px solid ${C.border}` : undefined,
              }}
            >
              <span style={{ fontFamily: display, fontSize: 13, fontWeight: 300, color: C.muted, minWidth: 24, paddingTop: 2 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", color: C.ink, marginBottom: 4 }}>{s.title}</h4>
                <p style={{ fontSize: 13, fontWeight: 300, color: C.muted, lineHeight: 1.6, margin: 0 }}>
                  <Rich text={s.body} />
                </p>
                <span style={{ display: "inline-block", fontSize: 11, fontWeight: 500, color: C.teal, background: C.tealLight, padding: "2px 9px", borderRadius: 100, marginTop: 8 }}>
                  {s.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* costs */}
        <h2 style={{ fontFamily: display, fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, color: C.ink, margin: "56px 0 18px" }}>
          What it <em style={{ fontStyle: "italic", color: C.muted }}>costs</em>
        </h2>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", margin: "20px 0 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", background: C.surface, padding: "12px 16px" }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted }}>Cost item</span>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted }}>Typical range</span>
          </div>
          {guide.costs.map((c) => (
            <div key={c.item} style={{ display: "grid", gridTemplateColumns: "1fr 200px", padding: "13px 16px", borderTop: `1px solid ${C.border}`, fontSize: 14 }}>
              <span style={{ fontWeight: 300, letterSpacing: "-0.005em", paddingRight: 12 }}>{c.item}</span>
              <span style={{ fontWeight: 300, letterSpacing: "-0.005em" }}>{c.range}</span>
            </div>
          ))}
        </div>
        {guide.costNote && (
          <p style={{ fontSize: 15, fontWeight: 300, color: C.muted, lineHeight: 1.7, letterSpacing: "-0.005em", marginBottom: 16 }}>
            <Rich text={guide.costNote} />
          </p>
        )}

        {/* tips */}
        <h2 style={{ fontFamily: display, fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, color: C.ink, margin: "56px 0 18px" }}>
          How to improve <em style={{ fontStyle: "italic", color: C.muted }}>your odds</em>
        </h2>
        <ul style={{ listStyle: "none", margin: "8px 0", padding: 0 }}>
          {guide.tips.map((t, i) => (
            <li
              key={t.title}
              style={{
                display: "flex",
                gap: 12,
                padding: "14px 0",
                borderTop: `1px solid ${C.border}`,
                borderBottom: i === guide.tips.length - 1 ? `1px solid ${C.border}` : undefined,
                fontSize: 14,
                fontWeight: 300,
                color: C.muted,
                lineHeight: 1.65,
              }}
            >
              <CheckIcon />
              <span>
                <strong style={{ fontWeight: 600, color: C.ink }}>{t.title}</strong> {t.body}
              </span>
            </li>
          ))}
        </ul>

        {/* FAQ */}
        <h2 style={{ fontFamily: display, fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, color: C.ink, margin: "56px 0 18px" }}>
          Frequently asked <em style={{ fontStyle: "italic", color: C.muted }}>questions</em>
        </h2>
        <div>
          {guide.faqs.map((f, i) => (
            <details
              key={f.q}
              style={{ borderTop: `1px solid ${C.border}`, borderBottom: i === guide.faqs.length - 1 ? `1px solid ${C.border}` : undefined }}
            >
              <summary style={{ cursor: "pointer", fontSize: 15, fontWeight: 500, letterSpacing: "-0.01em", padding: "18px 28px 18px 0" }}>
                {f.q}
              </summary>
              <p style={{ fontSize: 14, fontWeight: 300, color: C.muted, padding: "0 0 20px", margin: 0, maxWidth: 640 }}>
                <Rich text={f.a} />
              </p>
            </details>
          ))}
        </div>

        {/* sources */}
        <p style={{ fontSize: 12, fontWeight: 300, color: C.muted, margin: "40px 0 56px", letterSpacing: "-0.005em" }}>
          Sources:{" "}
          {guide.sources.map((s, i) => (
            <span key={s.href}>
              <a href={s.href} target="_blank" rel="nofollow noopener noreferrer" style={{ color: C.muted, textDecoration: "underline" }}>
                {s.label}
              </a>
              {i < guide.sources.length - 1 ? ", " : ". "}
            </span>
          ))}
          Processes change — always confirm details on {guide.name}'s official channels.
        </p>
      </div>

      {/* final CTA — full-bleed black */}
      <div style={{ background: C.black, padding: "96px 24px", marginTop: 72 }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.teal, marginBottom: 16 }}>
            Find your retailers
          </p>
          <h2 style={{ fontFamily: display, fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#fff", margin: "0 0 16px" }}>
            {guide.name} is one door.{" "}
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.45)" }}>Spottail opens the rest.</em>
          </h2>
          <p style={{ fontSize: 15, fontWeight: 300, color: "rgba(255,255,255,0.55)", maxWidth: 520, marginBottom: 30, lineHeight: 1.65 }}>
            Spottail matches your product to the retailers and distributors most likely to stock it right now — the stores that build the sales record big buyers want to see. Pitch with data, not hope.
          </p>
          <Link
            to="/signup"
            style={{ display: "inline-block", fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em", color: C.black, background: "#fff", padding: "14px 28px", borderRadius: 9, textDecoration: "none" }}
          >
            Find your retailers →
          </Link>
        </div>
      </div>

      {/* related */}
      <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: "64px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontFamily: display, fontSize: 26, fontWeight: 300, letterSpacing: "-0.03em", color: C.ink, margin: "0 0 28px" }}>
            Guides for <em style={{ fontStyle: "italic", color: C.muted }}>other retailers</em>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: 12 }}>
            {related.map((g) => (
              <Link
                key={g.slug}
                to={`/become-a-supplier/${g.slug}`}
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "16px 18px",
                  textDecoration: "none",
                  color: C.ink,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                {g.name}
                <span style={{ display: "block", fontWeight: 300, fontSize: 12, color: C.muted, marginTop: 4 }}>
                  {g.country} · {g.category}
                </span>
              </Link>
            ))}
            <Link
              to="/become-a-supplier"
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "16px 18px",
                textDecoration: "none",
                color: C.ink,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              All guides →
              <span style={{ display: "block", fontWeight: 300, fontSize: 12, color: C.muted, marginTop: 4 }}>Every retailer</span>
            </Link>
          </div>
        </div>
      </div>

      <GuideFooter />
    </div>
  );
};

export default SupplierGuide;
