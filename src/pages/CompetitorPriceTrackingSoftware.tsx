import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Check, X, Play, Clock, Bell, BarChart3, Zap, Globe,
  TrendingUp, Shield, Users, Star, ChevronDown, Layers, FileText,
  Eye, Target, DollarSign, Gauge, Rocket, Package, MonitorSmartphone,
  CircleDot, AlertTriangle, LineChart
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CompetitorPriceTrackingSoftware = () => {
  useEffect(() => {
    document.title = "Competitor Price Tracking Software | Monitor Competitor Prices";
    const metaDesc = document.querySelector('meta[name="description"]');
    const content = "Competitor price tracking software for retail teams. Track competitor prices across e-commerce stores, monitor price changes, and optimize pricing strategy with Spottail.";
    if (metaDesc) {
      metaDesc.setAttribute("content", content);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = content;
      document.head.appendChild(meta);
    }
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const keywords = "competitor price tracking software, competitor price monitoring, price tracking tool, e-commerce price tracker, retail price monitoring";
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    } else {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      meta.content = keywords;
      document.head.appendChild(meta);
    }

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://spottail.ai/competitor-price-tracking-software";

    // JSON-LD
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Spottail.ai Competitor Price Tracking Software",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: [
        { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
        { "@type": "Offer", price: "29", priceCurrency: "USD", name: "Pro" },
      ],
      description: "Track competitor prices in real-time across all channels with automated alerts and pricing intelligence.",
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      const can = document.querySelector('link[rel="canonical"]');
      if (can) can.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* ─── 1. HERO ─── */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 pt-32 md:pt-36 pb-16 md:pb-20">
        <Header />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-success/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 md:mb-8 leading-tight tracking-wide">
            Competitor Price Tracking Software That Actually Keeps You Competitive
          </h1>
          <p className="text-base md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed">
            Monitor competitor prices in real-time across all channels. Get instant alerts. Make pricing decisions in hours, not days. Track Amazon, eBay, Shopify, and 50+ retail platforms.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-5 text-base sm:text-lg font-semibold rounded-lg shadow-lg shadow-primary/20 w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-accent px-8 py-5 text-base sm:text-lg font-semibold rounded-lg w-full sm:w-auto">
              <Play className="mr-2 w-5 h-5" />
              Watch 2-min Demo
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Used by 500+ retailers</span>
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Real-time monitoring</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> 90-second setup</span>
          </div>
        </div>
      </section>

      {/* ─── 2. PROBLEM ─── */}
      <section className="py-16 md:py-24 px-4 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6 md:mb-8 tracking-wide text-center">
            Why Manual Competitor Price Tracking is Costing You Sales
          </h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-12 leading-relaxed">
            In today's e-commerce landscape, competitor price tracking software isn't optional — it's survival. Amazon alone changes 2.5 million prices every single day. If you're still checking competitor prices manually once a week, you're already behind. The result? Lost sales, eroded margins, and wasted hours on spreadsheets that are outdated the moment you finish them. Real-time price monitoring software gives you the edge.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { stat: "2.5M", label: "Daily price changes on Amazon" },
              { stat: "67%", label: "Shoppers compare prices before buying" },
              { stat: "30%", label: "Revenue lost to mispricing" },
              { stat: "8hrs", label: "Avg. weekly manual tracking time" },
              { stat: "< 24hrs", label: "Shelf life of a competitive price" },
            ].map((s, i) => (
              <div key={i} className="text-center p-4 md:p-6 rounded-xl bg-card border border-[hsl(var(--card-border))]">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{s.stat}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. SOLUTION (3-Column) ─── */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-12 tracking-wide text-center">
            Real-Time Competitor Price Tracking. Automated.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Eye, title: "Monitor", desc: "Track prices across 50+ retailers in real-time. Every change captured automatically so you never miss a competitor move." },
              { icon: BarChart3, title: "Analyze", desc: "Get pricing recommendations and margin analysis. Understand where you stand in the market at a glance with intelligent dashboards." },
              { icon: Zap, title: "Act", desc: "Auto-sync prices, set pricing rules, and respond to competitors quickly. Turn insights into revenue in minutes, not days." },
            ].map((col, i) => (
              <div key={i} className="p-6 md:p-8 rounded-xl bg-card border border-[hsl(var(--card-border))] text-center">
                <div className="w-12 h-12 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-5">
                  <col.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{col.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{col.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. KEY FEATURES (6-Grid) ─── */}
      <section className="py-16 md:py-24 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-12 tracking-wide text-center">
            Everything You Need in Competitor Price Tracking Software
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MonitorSmartphone, title: "Real-Time Price Monitoring", points: ["Track competitor prices as they change", "Instant alerts when prices move", "Historical price data & trends"] },
              { icon: Globe, title: "Multi-Channel Integration", points: ["Amazon, eBay, Shopify, WooCommerce, Alibaba", "Direct website scraping", "CSV imports for any source"] },
              { icon: Bell, title: "Automated Alerts", points: ["Instant notification system", "Custom price-change thresholds", "Slack, Email & SMS integration"] },
              { icon: LineChart, title: "Pricing Intelligence Dashboard", points: ["Beautiful price comparison charts", "Historical trends & analytics", "Built-in margin calculator"] },
              { icon: Target, title: "Pricing Recommendations", points: ["AI-powered pricing suggestions", "Margin protection rules", "Seasonal pricing strategies"] },
              { icon: FileText, title: "Data Export & Reporting", points: ["Export price history as CSV", "Generate shareable reports", "Team sharing & collaboration"] },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-[hsl(var(--card-border))]">
                <div className="w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{f.title}</h3>
                <ul className="space-y-2">
                  {f.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. HOW IT WORKS ─── */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-12 tracking-wide text-center">
            Get Started in 90 Seconds
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Add Products to Track", desc: "Paste URLs or search by name. We'll start monitoring immediately." },
              { step: "2", title: "Choose Monitoring Frequency", desc: "Real-time, hourly, or daily — you decide how often to check." },
              { step: "3", title: "Receive Alerts & Recommendations", desc: "Get notified the moment a competitor changes their price." },
              { step: "4", title: "Make Data-Driven Decisions", desc: "Use pricing intelligence to stay competitive and protect margins." },
            ].map((s, i) => (
              <div key={i} className="text-center p-5 rounded-xl bg-card border border-[hsl(var(--card-border))]">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {s.step}
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. USE CASES ─── */}
      <section className="py-16 md:py-24 px-4 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-12 tracking-wide text-center">
            Built for Your Business Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Package, title: "E-Commerce Sellers", metric: "18% avg revenue increase", desc: "Stay competitive on Amazon, eBay, and your own store with real-time competitive pricing data." },
              { icon: Rocket, title: "Dropshippers & Resellers", metric: "22% margin improvement", desc: "Find the best margins by tracking supplier and competitor prices simultaneously." },
              { icon: Users, title: "Retail Chains", metric: "12% traffic increase", desc: "Ensure consistent, competitive pricing across all locations and online channels." },
              { icon: Shield, title: "Private Label Brands", metric: "15% market share growth", desc: "Protect your brand positioning and respond to competitors encroaching on your market." },
            ].map((uc, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-[hsl(var(--card-border))]">
                <div className="w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center mb-4">
                  <uc.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{uc.title}</h3>
                <div className="text-sm font-medium text-success mb-3">{uc.metric}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. BENEFITS ─── */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-12 tracking-wide text-center">
            What Spottail.ai Competitor Price Tracking Gives You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "Save Time", desc: "Automate price tracking and save 150+ hours per year. No more manual spreadsheets." },
              { icon: TrendingUp, title: "Increase Revenue", desc: "Retailers using Spottail see a 10-25% revenue increase within 3 months." },
              { icon: Shield, title: "Protect Margins", desc: "Set margin-protection rules so you never accidentally underprice or overprice." },
              { icon: Zap, title: "Stay Agile", desc: "Respond to market changes in minutes instead of days with instant alerts." },
              { icon: BarChart3, title: "Get Insights", desc: "Understand pricing trends, seasonal patterns, and competitor strategies at a glance." },
              { icon: Layers, title: "Scale Easily", desc: "Track 2 products or 2,000 — Spottail grows with your business without added complexity." },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-card border border-[hsl(var(--card-border))]">
                <div className="w-10 h-10 bg-success/15 rounded-full flex items-center justify-center shrink-0">
                  <b.icon className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. PRICING ─── */}
      <section className="py-16 md:py-24 px-4 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 tracking-wide text-center">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-center mb-12">No hidden fees. Cancel anytime.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "FREE", price: "$0", period: "/month", items: "2 products", freq: "Daily updates", features: ["Price change alerts", "7-day history", "Email notifications"], cta: "Start Free", popular: false },
              { name: "PRO", price: "$29", period: "/month", items: "10 products", freq: "Real-time updates", features: ["Everything in Free", "AI pricing recommendations", "Slack & SMS alerts", "Unlimited history", "CSV export"], cta: "Start Pro Trial", popular: true },
              { name: "ENTERPRISE", price: "Custom", period: "", items: "Unlimited products", freq: "Real-time + API", features: ["Everything in Pro", "Dedicated account manager", "Custom integrations", "SSO & team management", "Priority support"], cta: "Contact Sales", popular: false },
            ].map((plan, i) => (
              <div key={i} className={`p-6 md:p-8 rounded-xl border ${plan.popular ? "border-primary bg-card shadow-lg shadow-primary/10 relative" : "border-[hsl(var(--card-border))] bg-card"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-sm font-medium text-muted-foreground mb-2">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl md:text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">{plan.items}</div>
                <div className="text-sm text-primary font-medium mb-6">{plan.freq}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. INTEGRATIONS ─── */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6 tracking-wide">
            Connects to Your Favorite Tools
          </h2>
          <p className="text-muted-foreground mb-10">Integrates with 50+ platforms. More coming soon.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {["Shopify", "WooCommerce", "Amazon", "eBay", "Slack", "Google Sheets", "Zapier", "Excel"].map((name) => (
              <div key={name} className="px-5 py-3 rounded-lg bg-card border border-[hsl(var(--card-border))] text-sm font-medium text-foreground">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. COMPARISON TABLE ─── */}
      <section className="py-16 md:py-24 px-4 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-12 tracking-wide text-center">
            How Spottail Stacks Up
          </h2>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Feature</th>
                  <th className="text-center py-3 px-4 text-primary font-semibold text-xs uppercase tracking-wider">Spottail</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Prisync</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Competera</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Price2Spy</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Real-Time Monitoring", spottail: true, prisync: true, competera: true, price2spy: false },
                  { feature: "Free Plan Available", spottail: true, prisync: false, competera: false, price2spy: false },
                  { feature: "AI Pricing Recommendations", spottail: true, prisync: false, competera: true, price2spy: false },
                  { feature: "Commodity & Raw Material Pricing", spottail: true, prisync: false, competera: false, price2spy: false },
                  { feature: "90-Second Setup", spottail: true, prisync: false, competera: false, price2spy: false },
                  { feature: "50+ Platform Integrations", spottail: true, prisync: true, competera: false, price2spy: true },
                  { feature: "Slack / SMS Alerts", spottail: true, prisync: false, competera: false, price2spy: true },
                  { feature: "Trend Discovery", spottail: true, prisync: false, competera: false, price2spy: false },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3 px-4 text-foreground font-medium text-sm">{row.feature}</td>
                    {[row.spottail, row.prisync, row.competera, row.price2spy].map((val, j) => (
                      <td key={j} className="py-3 px-4 text-center">
                        {val ? <Check className="w-4 h-4 text-success mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
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
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-12 tracking-wide text-center">
            What Retailers Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { quote: "Spottail's price tracking saved us 15 hours a week. We increased our revenue by 22% in just two months by responding to competitor pricing changes in real-time.", name: "Sarah K.", title: "E-Commerce Director", company: "TrendRetail", impact: "+22% revenue" },
              { quote: "We used to lose sales because we were always a day behind on pricing. With Spottail's competitor price tracking software, we're now the first to adjust. Game changer.", name: "David M.", title: "Head of Pricing", company: "GreenMart", impact: "+18% conversion" },
              { quote: "The AI recommendations alone paid for the subscription 10x over. We protect our margins without constantly checking competitor sites manually.", name: "Priya L.", title: "Operations Lead", company: "LuxHome Goods", impact: "30% time saved" },
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-[hsl(var(--card-border))] flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">"{t.quote}"</p>
                <div>
                  <div className="text-foreground font-medium text-sm">{t.name}</div>
                  <div className="text-muted-foreground text-xs">{t.title}, {t.company}</div>
                  <div className="text-success text-xs font-medium mt-1">{t.impact}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center p-8 rounded-xl bg-card border border-[hsl(var(--card-border))]">
            <Play className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">See how retailers use Spottail</h3>
            <p className="text-sm text-muted-foreground">Watch a 2-minute walkthrough of how real businesses track competitor prices and boost revenue.</p>
          </div>
        </div>
      </section>

      {/* ─── 12. FAQ ─── */}
      <section className="py-16 md:py-24 px-4 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-12 tracking-wide text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {[
              { q: "How often does Spottail update competitor prices?", a: "Depending on your plan, prices are updated daily (Free), or in real-time (Pro and Enterprise). Real-time tracking captures changes within minutes of them happening." },
              { q: "Which retailers can I track with this competitor price tracking software?", a: "Spottail supports 50+ retail platforms including Amazon, eBay, Shopify stores, WooCommerce sites, Walmart, Alibaba, and any public-facing website via our scraping engine." },
              { q: "How accurate is the price tracking?", a: "Our scraping engine achieves 99.5%+ accuracy. We validate prices using multiple data points and flag discrepancies for review." },
              { q: "Can I track my own prices alongside competitors?", a: "Absolutely. Spottail lets you monitor your own product prices so you can see exactly how you compare in real-time." },
              { q: "What if a website blocks tracking?", a: "We use advanced techniques to ensure reliable data collection. If a site is temporarily unavailable, we'll retry automatically and notify you of any gaps." },
              { q: "Can I automate my pricing based on competitor data?", a: "Yes. Pro and Enterprise plans include pricing rules that can automatically adjust your prices based on competitor changes, margin floors, and custom logic." },
              { q: "How long does setup take?", a: "Most users are up and running in under 90 seconds. Just paste a product URL or search by name and we start tracking immediately." },
              { q: "Is my data private and secure?", a: "Yes. All data is encrypted in transit and at rest. We never share your tracking data with third parties." },
              { q: "Do you offer a free trial?", a: "Yes — our Free plan is free forever with 2 tracked products and daily updates. No credit card required. Upgrade anytime." },
              { q: "Can I cancel anytime?", a: "Yes. There are no long-term contracts. You can cancel your subscription at any time from your account settings." },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-[hsl(var(--card-border))] rounded-xl px-5">
                <AccordionTrigger className="text-foreground text-sm font-medium text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── 13. CASE STUDIES ─── */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-12 tracking-wide text-center">
            Case Study: How 3 Retailers Used Price Tracking to Increase Revenue
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                type: "Mid-Size E-Commerce Store",
                size: "~5,000 SKUs, $2M annual revenue",
                challenge: "Spending 10+ hours per week manually monitoring competitor prices on Amazon and eBay. Frequently undercut without realizing it.",
                solution: "Implemented Spottail Pro to track top 50 competitors in real-time with automated Slack alerts.",
                results: "+18% revenue in 90 days, 12 hours/week saved, 95% fewer missed price changes.",
                learning: "Automation pays for itself within the first week.",
              },
              {
                type: "Dropshipping Business",
                size: "300 products, solo founder",
                challenge: "Margins were razor-thin. Competitors frequently undercut by $1-2, stealing Buy Box and organic traffic.",
                solution: "Used Spottail's AI recommendations to set dynamic pricing rules and margin floors.",
                results: "+22% average margin, 40% fewer lost-Buy-Box incidents, $8K additional monthly profit.",
                learning: "Even small price adjustments compound into significant margin gains.",
              },
              {
                type: "Regional Retail Chain",
                size: "12 stores, $15M annual revenue",
                challenge: "No visibility into online competitor pricing. Losing foot traffic to e-commerce rivals.",
                solution: "Deployed Spottail Enterprise across all categories with weekly team reports.",
                results: "+12% in-store traffic, 15% improvement in price competitiveness score, reduced markdown waste by 20%.",
                learning: "Brick-and-mortar retailers need online price intelligence just as much as e-commerce sellers.",
              },
            ].map((cs, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-[hsl(var(--card-border))]">
                <div className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">{cs.type}</div>
                <div className="text-xs text-muted-foreground mb-4">{cs.size}</div>
                <div className="space-y-3 text-sm">
                  <div><span className="font-medium text-foreground">Challenge:</span> <span className="text-muted-foreground">{cs.challenge}</span></div>
                  <div><span className="font-medium text-foreground">Solution:</span> <span className="text-muted-foreground">{cs.solution}</span></div>
                  <div><span className="font-medium text-success">Results:</span> <span className="text-muted-foreground">{cs.results}</span></div>
                  <div className="pt-2 border-t border-border/50"><span className="font-medium text-foreground">Key Learning:</span> <span className="text-muted-foreground italic">{cs.learning}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 14. FINAL CTA ─── */}
      <section className="py-16 md:py-24 px-4 bg-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 tracking-wide">
            Start Tracking Competitor Prices Today
          </h2>
          <p className="text-lg text-muted-foreground mb-2">See what your competitors are doing in real-time.</p>
          <p className="text-sm text-muted-foreground mb-8">Free forever plan. No credit card required. 90-second setup.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-5 text-lg font-semibold rounded-lg shadow-lg shadow-primary/20 w-full sm:w-auto">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-accent px-8 py-5 text-lg font-semibold rounded-lg w-full sm:w-auto">
              Schedule a Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Join 500+ retailers tracking prices smarter
          </p>
        </div>
      </section>

      {/* ─── 15. FOOTER ─── */}
      <Footer />
    </div>
  );
};

export default CompetitorPriceTrackingSoftware;
