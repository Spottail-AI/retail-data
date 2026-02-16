import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-background font-inter">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4 py-28">
        <Header />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-success/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-8 leading-tight tracking-wide">
            {data.hero.headline}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            {data.hero.subheadline}
          </p>
          <Link to="/auth">
            <Button
              size="lg"
              className="bg-cta hover:bg-cta/90 text-cta-foreground px-10 py-5 text-lg font-semibold rounded-lg shadow-lg shadow-cta/20 transition-all duration-300 hover:shadow-xl hover:shadow-cta/30"
            >
              {data.hero.cta}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Comparison Summary */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 tracking-wide text-center">
            Quick Comparison
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
            {data.quickSummary}
          </p>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/auth">
            <Button
              size="lg"
              className="bg-cta hover:bg-cta/90 text-cta-foreground px-10 py-5 text-lg font-semibold rounded-lg shadow-lg shadow-cta/20 transition-all duration-300"
            >
              Try Spottail Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 tracking-wide text-center">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-muted-foreground font-medium text-sm uppercase tracking-wider">Feature</th>
                  <th className="text-center py-4 px-4 text-primary font-semibold text-sm uppercase tracking-wider">Spottail</th>
                  <th className="text-center py-4 px-4 text-muted-foreground font-medium text-sm uppercase tracking-wider">{data.competitorName}</th>
                </tr>
              </thead>
              <tbody>
                {data.comparisonTable.map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-4 px-4 text-foreground font-medium">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 text-success font-medium">
                        <Check className="w-4 h-4" />
                        {row.spottail}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-muted-foreground">{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why People Look for an Alternative */}
      <section className="py-24 px-4 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 tracking-wide text-center">
            Why People Look for a {data.competitorName} Alternative
          </h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {data.whyLookForAlternative.map((reason, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-[hsl(var(--card-border))]">
                <X className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Spottail is a Stronger Choice */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 tracking-wide text-center">
            Why Spottail Is a Stronger Choice
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {data.whySpottailBetter.map((point, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-[hsl(var(--card-border))]">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-success shrink-0" />
                  <h3 className="text-foreground font-semibold">{point.title}</h3>
                </div>
                {point.description && (
                  <p className="text-muted-foreground text-sm pl-7">{point.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Should Use Each Tool */}
      <section className="py-24 px-4 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 tracking-wide text-center">
            Who Should Use Each Tool
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="text-foreground font-semibold mb-4">Use {data.competitorName} if:</h3>
              <ul className="space-y-3">
                {data.useCompetitorIf.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-muted-foreground mt-1">•</span>
                    {item.condition}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-card border border-primary/30">
              <h3 className="text-primary font-semibold mb-4">Use Spottail if:</h3>
              <ul className="space-y-3">
                {data.useSpottailIf.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-foreground">
                    <Check className="w-4 h-4 text-success mt-1 shrink-0" />
                    {item.condition}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 tracking-wide">
            {data.finalCta.headline}
          </h2>
          <Link to="/auth">
            <Button
              size="lg"
              className="bg-cta hover:bg-cta/90 text-cta-foreground px-10 py-5 text-lg font-semibold rounded-lg shadow-lg shadow-cta/20 transition-all duration-300 hover:shadow-xl hover:shadow-cta/30"
            >
              {data.finalCta.buttonText}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};
