import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight, Check, Search, XCircle, ShieldAlert,
  Bot, ShieldCheck, Wrench, Factory, Globe, Zap,
  Quote
} from "lucide-react";

const FindSuppliers = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    document.title = "Find Suppliers for Your Product | One-Click Supplier Discovery — Spottail";
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (el) { el.setAttribute("content", content); }
      else { el = document.createElement("meta"); el.setAttribute(attr, name); el.setAttribute("content", content); document.head.appendChild(el); }
    };
    setMeta("description", "Already know what you need? Spottail finds verified suppliers for your product in one click. Save time, skip the directories, and source with confidence. Start free.");
    setMeta("og:title", "Find Suppliers for Your Product — Spottail", true);
    setMeta("og:description", "Tell Spottail what you need to source and we'll find the right suppliers instantly. Verified contacts, no cold lists. Start free.", true);
    setMeta("og:url", "https://spottail.ai/find-suppliers", true);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = "https://spottail.ai/find-suppliers";

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Spottail — Find Suppliers",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: [
        { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
        { "@type": "Offer", price: "29", priceCurrency: "USD", name: "Pro" },
      ],
      description: "Find verified suppliers for your product in one click with Spottail's AI-powered matching.",
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      const can = document.querySelector('link[rel="canonical"]');
      if (can) can.remove();
    };
  }, []);

  const handleCtaClick = () => navigate("/auth?mode=signup");

  return (
    <div className="min-h-screen bg-[#0A0E1A] font-inter text-white">
      {/* ─── HERO ─── */}
      <section className="relative flex items-center justify-center px-4 pt-32 md:pt-40 pb-16 md:pb-24">
        <Header />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#4A9EFF]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#4ADE80]/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Find Suppliers for Your Product
            <br />
            <span className="text-[#4A9EFF]">in One Click</span>
          </h1>
          <p className="text-[#9CA3AF] text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Already know what you need to source? Skip the directories and the guesswork. Spottail matches your product with verified suppliers — instantly.
          </p>
          <div className="flex flex-col items-center gap-3 mb-10 max-w-xl mx-auto">
            {[
              "Find suppliers for your specific product in seconds",
              "Filter by region, MOQ, lead time and category",
              "Verified contacts — ready to do business",
            ].map((line, i) => (
              <div key={i} className="flex items-start gap-2.5 text-left text-sm md:text-base">
                <Check className="w-5 h-5 text-[#4ADE80] flex-shrink-0 mt-0.5" />
                <span>{line}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-8">
            <Button
              size="lg"
              className="bg-[#AAFF00] hover:bg-[#AAFF00]/90 text-black font-semibold px-8 py-5 text-base rounded-lg shadow-lg shadow-[#AAFF00]/20 w-full sm:w-auto"
              onClick={handleCtaClick}
            >
              Find Suppliers Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-[#111827] text-white border-[#2a2a2a] hover:bg-[#1F2937] px-8 py-5 text-base rounded-lg font-semibold w-full sm:w-auto"
            >
              Request Demo
            </Button>
          </div>
          <p className="text-[#9CA3AF] text-sm">Trusted by 10,000+ retailers, buyers and e-commerce sellers</p>
        </div>
      </section>

      {/* ─── PAIN POINTS ─── */}
      <section className="px-4 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#4A9EFF] bg-[#4A9EFF]/10 px-3 py-1 rounded-full mb-4">The Problem</span>
          <h2 className="text-2xl sm:text-4xl font-bold mb-14">
            Why finding the right supplier <span className="text-[#4A9EFF]">wastes so much time</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Search, title: "Directories are slow and outdated", body: "Existing supplier databases are stale, generic, and require hours of manual filtering to find anyone relevant." },
              { icon: XCircle, title: "Unvetted contacts", body: "Cold supplier lists mean no visibility on reliability, MOQs, or whether they even supply your product category." },
              { icon: ShieldAlert, title: "Quality and trust risk", body: "Working with untested suppliers risks stockouts, quality failures, and damaged customer relationships." },
            ].map(({ icon: Icon, title, body }, i) => (
              <div key={i} className="bg-[#111827] border border-[#1F2937] rounded-lg p-6">
                <Icon className="w-8 h-8 text-[#4A9EFF] mb-4" />
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="px-4 py-20 md:py-28 bg-[#0D1117]">
        <div className="max-w-5xl mx-auto">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#4A9EFF] bg-[#4A9EFF]/10 px-3 py-1 rounded-full mb-4">How It Works</span>
          <h2 className="text-2xl sm:text-4xl font-bold mb-14">
            Tell us what you need. <span className="text-[#4A9EFF]">We'll find who supplies it.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Describe what you need to source", body: "Enter your product, category, and requirements. Spottail builds your supplier match profile instantly." },
              { step: "02", title: "Get a matched supplier shortlist", body: "Spottail surfaces verified suppliers who produce and supply your specific product — filtered to your region and requirements." },
              { step: "03", title: "Connect and negotiate", body: "Reach out directly to verified supplier contacts with everything you need to open a commercial conversation." },
            ].map(({ step, title, body }, i) => (
              <div key={i} className="relative">
                <span className="text-5xl font-extrabold text-[#4A9EFF]/15 absolute -top-2 -left-1">{step}</span>
                <div className="pt-10">
                  <h3 className="text-lg font-bold mb-2">{title}</h3>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="px-4 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold mb-14 text-center">
            Everything you need to <span className="text-[#4A9EFF]">source with confidence</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Bot, label: "AI-powered supplier matching for your product" },
              { icon: ShieldCheck, label: "Verified supplier profiles and contacts" },
              { icon: Wrench, label: "Filter by MOQ, lead time, region and category" },
              { icon: Factory, label: "Manufacturing and wholesale supplier options" },
              { icon: Globe, label: "Global supplier coverage" },
              { icon: Zap, label: "Results in one click — not weeks" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="bg-[#111827] border border-[#1F2937] rounded-lg p-5 flex items-start gap-4">
                <Icon className="w-6 h-6 text-[#4A9EFF] flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="px-4 py-20 md:py-28 bg-[#0D1117]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            { quote: "I used to spend days on Alibaba trying to find the right supplier. Spottail gave me a verified shortlist for my exact product in minutes.", name: "Marcus T.", role: "E-commerce Seller" },
            { quote: "We described what we needed and Spottail returned suppliers who actually match our category and MOQ requirements. It's replaced our entire sourcing research process.", name: "Priya R.", role: "Buying Manager, Online Retailer" },
          ].map((t, i) => (
            <div key={i} className="bg-[#111827] border border-[#1F2937] rounded-lg p-6">
              <Quote className="w-6 h-6 text-[#4A9EFF]/40 mb-4" />
              <p className="text-[#9CA3AF] text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-[#9CA3AF]">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SEO CONTENT ─── */}
      <section className="px-4 py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Find the Right Supplier for Your Product — Without the Legwork</h2>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">
            When you already know what you need to source, the last thing you want is to spend days filtering through generic directories or chasing unresponsive contacts. Spottail gives you a verified shortlist of suppliers matched to your specific product, category, region, and requirements — in one click.
          </p>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-10">
            Spottail is used by retailers, e-commerce sellers, buying teams, and procurement managers across SMEs and large enterprises alike. Whether you're sourcing a single SKU or building a supplier network across multiple categories and geographies, Spottail finds the right partners without the manual effort.
          </p>
          <h3 className="text-xl font-bold mb-4">Verified Suppliers, Not Just a Contact List</h3>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-10">
            The difference between a supplier directory and Spottail is verification and relevance. Every supplier result is matched to your product category and filtered to your specifications — so you're not starting from a cold list, you're starting from a qualified shortlist.
          </p>
          <h3 className="text-xl font-bold mb-4">Source Globally. Filter Locally.</h3>
          <p className="text-[#9CA3AF] text-sm leading-relaxed">
            Need a supplier in Europe, Southeast Asia, or North America? Spottail's global supplier coverage means you can source internationally or locally — filtered by the region, lead times, and minimum order quantities that work for your business.
          </p>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="px-4 py-20 md:py-28 bg-[#0D1117]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4">
            Ready to find the right <span className="text-[#4A9EFF]">supplier for your product?</span>
          </h2>
          <p className="text-[#9CA3AF] text-sm md:text-base mb-8 leading-relaxed">
            Join thousands of retailers and buyers using Spottail to source smarter — without the directories, the guesswork, or the wasted time.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); navigate("/auth?mode=signup"); }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#111827] border-[#1F2937] text-white placeholder:text-[#9CA3AF] h-12"
            />
            <Button
              type="submit"
              className="bg-[#AAFF00] hover:bg-[#AAFF00]/90 text-black font-semibold px-6 h-12 rounded-lg whitespace-nowrap"
            >
              Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
          <p className="text-[#9CA3AF] text-xs">No credit card required. Free plan available.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FindSuppliers;
