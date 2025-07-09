
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
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent"> Industry Leaders</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of retailers who are already using our AI to stay ahead of market trends 
            and maximize their profits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <Quote className="w-8 h-8 text-emerald-400 mb-4" />
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  <div className="text-gray-400 text-sm">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
