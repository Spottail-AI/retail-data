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
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center px-4 pt-24 md:pt-32 pb-16 md:pb-20">
        <Header />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-success/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6 md:mb-8 leading-tight tracking-wide">
            {data.hero.headline}
          </h1>
          <p className="text-base md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed">
            {data.hero.subheadline}
          </p>
          <Link to="/auth">
            <Button
              size="lg"
              className="bg-cta hover:bg-cta/90 text-cta-foreground px-8 sm:px-10 py-5 text-base sm:text-lg font-semibold rounded-lg shadow-lg shadow-cta/20 transition-all duration-300 hover:shadow-xl hover:shadow-cta/30 w-full sm:w-auto"
            >
              {data.hero.cta}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-8 md:mb-12 tracking-wide text-center">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 md:py-4 px-3 md:px-4 text-muted-foreground font-medium text-xs md:text-sm uppercase tracking-wider">Feature</th>
                  <th className="text-center py-3 md:py-4 px-3 md:px-4 text-primary font-semibold text-xs md:text-sm uppercase tracking-wider">Spottail</th>
                  <th className="text-center py-3 md:py-4 px-3 md:px-4 text-muted-foreground font-medium text-xs md:text-sm uppercase tracking-wider">{data.competitorName}</th>
                </tr>
              </thead>
              <tbody>
                {data.comparisonTable.map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3 md:py-4 px-3 md:px-4 text-foreground font-medium text-sm">{row.feature}</td>
                    <td className="py-3 md:py-4 px-3 md:px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 text-success font-medium text-sm">
                        <Check className="w-4 h-4" />
                        {row.spottail}
                      </span>
                    </td>
                    <td className="py-3 md:py-4 px-3 md:px-4 text-center text-muted-foreground text-sm">{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why Switch — merged table */}
      <section className="py-16 md:py-24 px-4 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-8 md:mb-12 tracking-wide text-center">
            Why Teams Switch from {data.competitorName} to Spottail
          </h2>

          {/* Mobile: stacked cards / Desktop: table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-muted-foreground font-medium text-sm uppercase tracking-wider">
                    {data.competitorName} Limitation
                  </th>
                  <th className="text-left py-4 px-4 text-primary font-semibold text-sm uppercase tracking-wider">
                    How Spottail Solves It
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.whyLookForAlternative.map((reason, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-4 px-4">
                      <span className="inline-flex items-start gap-2 text-muted-foreground">
                        <X className="w-4 h-4 text-destructive mt-1 shrink-0" />
                        {reason}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {data.whySpottailBetter[i] ? (
                        <span className="inline-flex items-start gap-2 text-foreground">
                          <Check className="w-4 h-4 text-success mt-1 shrink-0" />
                          <span>
                            <span className="font-medium">{data.whySpottailBetter[i].title}</span>
                            {data.whySpottailBetter[i].description && (
                              <span className="text-muted-foreground"> — {data.whySpottailBetter[i].description}</span>
                            )}
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked view */}
          <div className="md:hidden space-y-4">
            {data.whyLookForAlternative.map((reason, i) => (
              <div key={i} className="bg-card border border-[hsl(var(--card-border))] rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-2 text-muted-foreground text-sm">
                  <X className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  <span>{reason}</span>
                </div>
                {data.whySpottailBetter[i] && (
                  <div className="flex items-start gap-2 text-foreground text-sm border-t border-border/50 pt-3">
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span>
                      <span className="font-medium">{data.whySpottailBetter[i].title}</span>
                      {data.whySpottailBetter[i].description && (
                        <span className="text-muted-foreground"> — {data.whySpottailBetter[i].description}</span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Should Use Each Tool */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-8 md:mb-12 tracking-wide text-center">
            Who Should Use Each Tool
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-3xl mx-auto">
            <div className="p-5 md:p-6 rounded-xl bg-card border border-border">
              <h3 className="text-foreground font-semibold mb-4 text-sm md:text-base">Use {data.competitorName} if:</h3>
              <ul className="space-y-3">
                {data.useCompetitorIf.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                    <span className="text-muted-foreground mt-1">•</span>
                    {item.condition}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 md:p-6 rounded-xl bg-card border border-primary/30">
              <h3 className="text-primary font-semibold mb-4 text-sm md:text-base">Use Spottail if:</h3>
              <ul className="space-y-3">
                {data.useSpottailIf.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-foreground text-sm">
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
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6 md:mb-8 tracking-wide">
            {data.finalCta.headline}
          </h2>
          <Link to="/auth">
            <Button
              size="lg"
              className="bg-cta hover:bg-cta/90 text-cta-foreground px-8 sm:px-10 py-5 text-base sm:text-lg font-semibold rounded-lg shadow-lg shadow-cta/20 transition-all duration-300 hover:shadow-xl hover:shadow-cta/30 w-full sm:w-auto"
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
