
import { Button } from "@/components/ui/button";
import { TrendingUp, Mail, Phone, MapPin, Twitter, Linkedin, Facebook } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-black/50 backdrop-blur-sm border-t border-white/10 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* CTA Section */}
        <div className="text-center mb-16 py-16 bg-gradient-to-r from-emerald-500/10 to-blue-600/10 rounded-3xl border border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Stay Ahead of Every Trend?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of successful retailers who never miss an opportunity. 
            Start your free trial today.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-2xl transition-all duration-300 hover:shadow-emerald-500/25 hover:scale-105"
          >
            Start Free Trial
          </Button>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <TrendingUp className="w-8 h-8 text-emerald-400 mr-3" />
              <span className="text-xl font-bold text-white">TrendSpotter AI</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              The most advanced AI platform for predicting retail trends and identifying profitable opportunities before they peak.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Facebook className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Product</h4>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press Kit</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contact</h4>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-emerald-400" />
                <span>hello@trendspotter.ai</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-emerald-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-emerald-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 mb-4 md:mb-0">
            © 2024 TrendSpotter AI. All rights reserved.
          </div>
          <div className="flex space-x-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
