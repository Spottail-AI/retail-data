
import { Star, Quote } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "E-commerce Director",
      company: "RetailPro Inc.",
      content: "This AI tool helped us identify the smart home trend 3 weeks before our competitors. We increased our Q4 revenue by 340% thanks to early inventory decisions.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Marcus Chen",
      role: "Founder",
      company: "TrendSpot Retail",
      content: "The accuracy is incredible. We've successfully launched 12 product lines based on their predictions, with 11 becoming bestsellers. Game-changing technology.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Elena Rodriguez",
      role: "Buyer",
      company: "Fashion Forward",
      content: "The platform's niche-specific insights for fashion accessories saved us from costly mistakes and helped us capitalize on emerging trends worth millions.",
      rating: 5,
      avatar: "ER"
    }
  ];

  return (
    <section id="testimonials-section" className="py-36 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 tracking-wide">
            Trusted by
            <span className="text-primary"> Industry Leaders</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join thousands of retailers who are already using our AI to stay ahead of market trends 
            and maximize their profits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card border border-[hsl(var(--card-border))] rounded-xl p-8 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center mb-5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-warning fill-current" />
                ))}
              </div>
              
              <Quote className="w-7 h-7 text-primary/40 mb-4" />
              
              <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center pt-4 border-t border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm mr-3">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-foreground font-medium text-sm">{testimonial.name}</div>
                  <div className="text-muted-foreground text-xs">{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
