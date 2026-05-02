import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight, Check, Clock, Target, TrendingDown,
  Bot, ShieldCheck, MapPin, BarChart3, Tag, Zap,
  Quote
} from "lucide-react";

const FindDistributors = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    document.title = "Find Distributors for Your Product | One-Click Distributor Discovery — Spottail";
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (el) { el.setAttribute("content", content); }
      else { el = document.createElement("meta"); el.setAttribute(attr, name); el.setAttribute("content", content); document.head.appendChild(el); }
    };
    setMeta("description", "Already have a product? Spottail finds the right distributors for it in one click. Connect with verified distributors ready to carry your brand. Start free.");
    setMeta("og:title", "Find Distributors for Your Product — Spottail", true);
    setMeta("og:description", "Stop cold-emailing. Spottail matches your product with verified distributors actively seeking new lines. Start free.", true);
    setMeta("og:url", "https://spottail.ai/find-distributors", true);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = "https://spottail.ai/find-distributors";

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Spottail — Find Distributors",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: [
        { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
        { "@type": "Offer", price: "29", priceCurrency: "USD", name: "Pro" },
      ],
      description: "Find verified distributors for your product in one click with Spottail's AI-powered matching.",
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      const can = document.querySelector('link[rel="canonical"]');
      if (can) can.remove();
    };
  }, []);

  const handleCtaClick = () => navigate("/signup");

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
            Find Distributors for Your Product
            <br />
            <span className="text-[#4A9EFF]">in One Click</span>
          </h1>
          <p className="text-[#9CA3AF] text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop cold-emailing and trawling directories. Tell Spottail what your product is — and we'll find the distributors ready to carry it.
          </p>
          <div className="flex flex-col items-center gap-3 mb-10 max-w-xl mx-auto">
            {[
              "Find distributors for your existing product instantly",
              "Filter by region, category, and sales channel",
              "Connect with verified contacts — no cold lists",
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
              Find Distributors Free
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
          <p className="text-[#9CA3AF] text-sm">Trusted by 10,000+ brands, manufacturers and product creators</p>
        </div>
      </section>

      {/* ─── PAIN POINTS ─── */}
      <section className="px-4 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#4A9EFF] bg-[#4A9EFF]/10 px-3 py-1 rounded-full mb-4">The Problem</span>
          <h2 className="text-2xl sm:text-4xl font-bold mb-14">
            Why finding the right distributor <span className="text-[#4A9EFF]">takes so long</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "Weeks of manual research", body: "Trawling LinkedIn, trade directories and Google for distributor contacts eats time you don't have." },
              { icon: Target, title: "Wrong-fit partnerships", body: "Most distributors you find aren't actively seeking new lines — leading to dead-end conversations." },
              { icon: TrendingDown, title: "Slow route to market", body: "Every month without the right distributor is revenue you're leaving on the table." },
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
            From product to partnership <span className="text-[#4A9EFF]">in three steps</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Describe your product", body: "Enter your product details — category, target market, and geography. Spottail does the rest." },
              { step: "02", title: "Get matched with distributors", body: "Spottail searches its database to surface distributors that are the right fit for your product and market." },
              { step: "03", title: "Connect and close", body: "Reach out to verified distributor contacts with the information you need to start the conversation." },
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
            Everything you need to <span className="text-[#4A9EFF]">find your distribution partner</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Bot, label: "AI-powered distributor matching for your product" },
              { icon: ShieldCheck, label: "Verified distributor contacts and profiles" },
              { icon: MapPin, label: "Filter by region, category and sales channel" },
              { icon: BarChart3, label: "Market data to strengthen your pitch" },
              { icon: Tag, label: "White-label and direct distributor options" },
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
            { quote: "We found three serious distributor partners in our first week. It would have taken six months of trade shows to get the same results.", name: "Sarah K.", role: "Founder, Consumer Goods Brand" },
            { quote: "We described our product and Spottail came back with a shortlist of distributors who were actually a fit. Genuinely couldn't believe how fast it was.", name: "James L.", role: "Head of Sales, Health & Wellness Brand" },
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">The Smarter Way to Find Distributors for Your Product</h2>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">
            If you have a product and need distribution, the traditional path is painful: trade shows, cold outreach, outdated directories, and months of conversations that go nowhere. Spottail removes that friction entirely. Tell us about your product and we match you with distributors who are the right fit — by category, region, and channel — so you can focus on building relationships rather than finding them.
          </p>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-10">
            Spottail is built for brands and manufacturers at every stage — from SMEs launching their first product to enterprise teams scaling into new markets globally. Whether you sell FMCG, health and wellness, technology, or home goods, Spottail finds the distribution partners that make sense for your business.
          </p>
          <h3 className="text-xl font-bold mb-4">Stop Guessing. Start Matching.</h3>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-10">
            Most distributor searches fail not because the right partners don't exist, but because there's no efficient way to find them. Spottail solves that with AI-powered matching — giving you a shortlist of verified, relevant distributors instead of an endless list of cold contacts to work through manually.
          </p>
          <h3 className="text-xl font-bold mb-4">Find Distributors in Any Region or Sales Channel</h3>
          <p className="text-[#9CA3AF] text-sm leading-relaxed">
            Whether you need distributors for retail, foodservice, e-commerce, or wholesale — in your home market or internationally — Spottail filters results to match your specific route to market. One product. The right distributors. In one click.
          </p>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="px-4 py-20 md:py-28 bg-[#0D1117]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4">
            Ready to find your <span className="text-[#4A9EFF]">perfect distribution partner?</span>
          </h2>
          <p className="text-[#9CA3AF] text-sm md:text-base mb-8 leading-relaxed">
            Join thousands of brands and manufacturers using Spottail to get their products to market — faster.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); navigate("/signup"); }}
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
              Start for Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
          <p className="text-[#9CA3AF] text-xs">No credit card required. Free plan available.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FindDistributors;
