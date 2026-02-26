import { Button } from "@/components/ui/button";
import { TrendingUp, Mail, Twitter, Linkedin, Facebook } from "lucide-react";

export const Footer = () => {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-border py-10 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
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
            <h4 className="text-foreground font-semibold mb-4 md:mb-6 text-sm">Product</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
              <li><button onClick={scrollToPricing} className="hover:text-foreground transition-colors">Pricing</button></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4 md:mb-6 text-sm">Company</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Press Kit</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Partners</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-foreground font-semibold mb-4 md:mb-6 text-sm">Contact</h4>
            <div className="space-y-4 text-muted-foreground text-sm">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-primary" />
                <span>hello@spottail.ai</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-muted-foreground text-sm">
            © 2025 Spottail. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-muted-foreground text-sm">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
