
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { TrendingUp, ArrowUp, Star, Clock } from "lucide-react";

export const DemoSection = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const demoResults = [
    {
      product: "Smart Home Security Cameras",
      trend: "+347%",
      platform: "Amazon",
      timeframe: "2-3 weeks",
      confidence: 94,
      risk: "Low"
    },
    {
      product: "Sustainable Phone Cases",
      trend: "+289%",
      platform: "Instagram",
      timeframe: "3-4 weeks",
      confidence: 91,
      risk: "Medium"
    },
    {
      product: "AI Writing Tools",
      trend: "+456%",
      platform: "Google Trends",
      timeframe: "1-2 weeks",
      confidence: 97,
      risk: "Low"
    }
  ];

  return (
    <section id="demo-section" className="py-24 px-4 relative bg-gradient-to-br from-slate-100 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            See It In
            <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent"> Action</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12">
            Try our AI trend detector for retail right now. Select your target market, Niche, Platform, and see which products 
            are about to explode in popularity.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8 mb-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-slate-700 font-medium mb-3">Select Country/Region</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="bg-slate-50 border-slate-300 text-slate-700">
                  <SelectValue placeholder="Choose location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="jp">Japan</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-3">Select Niche</label>
              <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                <SelectTrigger className="bg-slate-50 border-slate-300 text-slate-700">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                  <SelectItem value="health">Health & Wellness</SelectItem>
                  <SelectItem value="sports">Sports & Outdoors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-3">Select Platform</label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="bg-slate-50 border-slate-300 text-slate-700">
                  <SelectValue placeholder="Choose platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center justify-between w-full">
                      <span>All Platforms</span>
                      <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded ml-2">Recommended</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="amazon">Amazon</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="google">Google Trends</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-center mb-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-full"
            >
              <TrendingUp className="mr-2 w-5 h-5" />
              Analyze Trends
            </Button>
          </div>

          {/* Demo Results */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Trending Products (Sample)</h3>
            {demoResults.map((result, index) => (
              <Card key={index} className="bg-slate-50/50 border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">{result.product}</h4>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {result.timeframe}
                      </span>
                      <span>Platform: {result.platform}</span>
                      <span>Risk: {result.risk}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-emerald-600 font-semibold text-lg mb-1">
                      <ArrowUp className="w-5 h-5 mr-1" />
                      {result.trend}
                    </div>
                    <div className="flex items-center text-yellow-600 text-sm">
                      <Star className="w-4 h-4 mr-1" />
                      {result.confidence}% confidence
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
