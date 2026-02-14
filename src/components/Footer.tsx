
import { Button } from "@/components/ui/button";
import { TrendingUp, Mail, Twitter, Linkedin, Facebook } from "lucide-react";

export const Footer = () => {
  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-border py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* CTA Section */}
        <div className="text-center mb-16 py-16 bg-card rounded-2xl border border-border">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Ready to Stay Ahead of Every Trend?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of successful retailers who never miss an opportunity. 
            Start your free trial today.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg font-semibold rounded-lg shadow-lg shadow-primary/20 transition-all duration-300"
            onClick={scrollToDemo}
          >
            Start Free Trial
          </Button>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <TrendingUp className="w-7 h-7 text-primary mr-3" />
              <span className="text-lg font-bold text-foreground">Spottail</span>
            </div>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              The most advanced AI platform for predicting retail trends and identifying profitable opportunities before they peak.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent w-9 h-9 p-0">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent w-9 h-9 p-0">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent w-9 h-9 p-0">
                <Facebook className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-6 text-sm">Product</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
              <li><button onClick={scrollToPricing} className="hover:text-foreground transition-colors">Pricing</button></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-6 text-sm">Company</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Press Kit</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Partners</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-6 text-sm">Contact</h4>
            <div className="space-y-4 text-muted-foreground text-sm">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-primary" />
                <span>hello@spottail.ai</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-muted-foreground text-sm mb-4 md:mb-0">
            © 2025 Spottail. All rights reserved.
          </div>
          <div className="flex space-x-6 text-muted-foreground text-sm">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
