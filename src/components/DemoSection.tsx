import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { TrendingUp, ArrowUp, Star, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const DemoSection = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const allCountries = [
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "de", label: "Germany" },
    { value: "jp", label: "Japan" },
    { value: "au", label: "Australia" },
    { value: "ar", label: "Argentina" },
    { value: "at", label: "Austria" },
    { value: "be", label: "Belgium" },
    { value: "br", label: "Brazil" },
    { value: "ca", label: "Canada" },
    { value: "cl", label: "Chile" },
    { value: "cn", label: "China" },
    { value: "co", label: "Colombia" },
    { value: "cz", label: "Czech Republic" },
    { value: "dk", label: "Denmark" },
    { value: "eg", label: "Egypt" },
    { value: "fi", label: "Finland" },
    { value: "fr", label: "France" },
    { value: "gr", label: "Greece" },
    { value: "hk", label: "Hong Kong" },
    { value: "hu", label: "Hungary" },
    { value: "in", label: "India" },
    { value: "id", label: "Indonesia" },
    { value: "ie", label: "Ireland" },
    { value: "il", label: "Israel" },
    { value: "it", label: "Italy" },
    { value: "kr", label: "South Korea" },
    { value: "mx", label: "Mexico" },
    { value: "my", label: "Malaysia" },
    { value: "nl", label: "Netherlands" },
    { value: "no", label: "Norway" },
    { value: "nz", label: "New Zealand" },
    { value: "pe", label: "Peru" },
    { value: "ph", label: "Philippines" },
    { value: "pl", label: "Poland" },
    { value: "pt", label: "Portugal" },
    { value: "ro", label: "Romania" },
    { value: "ru", label: "Russia" },
    { value: "sa", label: "Saudi Arabia" },
    { value: "sg", label: "Singapore" },
    { value: "za", label: "South Africa" },
    { value: "es", label: "Spain" },
    { value: "se", label: "Sweden" },
    { value: "ch", label: "Switzerland" },
    { value: "th", label: "Thailand" },
    { value: "tr", label: "Turkey" },
    { value: "ae", label: "United Arab Emirates" },
    { value: "vn", label: "Vietnam" }
  ];

  const niches = [
    { value: "automotive", label: "Automotive" },
    { value: "beauty", label: "Beauty & Personal Care" },
    { value: "books", label: "Books & Literature" },
    { value: "clothing", label: "Clothing & Apparel" },
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
    { value: "fitness", label: "Fitness & Sports" },
    { value: "food", label: "Food & Beverages" },
    { value: "gaming", label: "Gaming" },
    { value: "health", label: "Health & Wellness" },
    { value: "home", label: "Home & Garden" },
    { value: "jewelry", label: "Jewelry & Accessories" },
    { value: "kids", label: "Kids & Baby" },
    { value: "music", label: "Music & Instruments" },
    { value: "outdoors", label: "Outdoors & Recreation" },
    { value: "pets", label: "Pet Supplies" },
    { value: "tech", label: "Technology" },
    { value: "toys", label: "Toys & Games" },
    { value: "travel", label: "Travel & Luggage" },
    { value: "watches", label: "Watches & Timepieces" }
  ];

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
      platform: "TikTok",
      timeframe: "1-2 weeks",
      confidence: 97,
      risk: "Low"
    }
  ];

  const handleAnalyzeTrends = async () => {
    if (!selectedCountry || !selectedNiche || !selectedPlatform) {
      toast({
        title: "Missing selections",
        description: "Please select a country, niche, and platform to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    // Generate a unique session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      const countryLabel = allCountries.find(c => c.value === selectedCountry)?.label || selectedCountry;
      const nicheLabel = niches.find(n => n.value === selectedNiche)?.label || selectedNiche;

      const { data, error } = await supabase.functions.invoke("generate-trends", {
        body: {
          country: countryLabel,
          niche: nicheLabel,
          platform: selectedPlatform,
          sessionId,
          userId: user?.id,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.results) {
        // Store results in localStorage for quick access
        localStorage.setItem(`trends_${sessionId}`, JSON.stringify(data.results));
        
        // Navigate to results page
        navigate(`/results?session_id=${sessionId}`);
      } else {
        throw new Error("No results received");
      }
    } catch (error) {
      console.error("Error generating trends:", error);
      toast({
        title: "Analysis failed",
        description: "Could not generate trend analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="demo-section" className="py-10 md:py-16 px-4 relative">
      <div className="absolute inset-0 bg-navy-surface/50"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 tracking-wide">
            See It In
            <span className="text-primary"> Action</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-14">
            Try our AI trend detector for retail right now. Select your target market, Niche, Platform, and see which products 
            are about to explode in popularity.
          </p>
        </div>

        <div className="bg-card border border-[hsl(var(--card-border))] rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-foreground font-medium mb-3 text-sm">Select Country/Region</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Choose location" />
                </SelectTrigger>
                <SelectContent>
                  {allCountries.map(country => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-foreground font-medium mb-3 text-sm">Select Niche</label>
              <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  {niches.map(niche => (
                    <SelectItem key={niche.value} value={niche.value}>
                      {niche.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-foreground font-medium mb-3 text-sm">Select Platform</label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Choose platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center justify-between w-full">
                      <span>All Platforms</span>
                      <span className="text-xs text-success font-medium bg-success/10 px-2 py-0.5 rounded ml-2">Recommended</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="amazon">Amazon</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-center mb-8">
            <Button 
              id="analyze_trends_button_click"
              size="lg" 
              className="bg-cta hover:bg-cta/90 text-cta-foreground px-12 py-4 text-lg font-semibold rounded-lg shadow-lg shadow-cta/20"
              onClick={handleAnalyzeTrends}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Analyzing Trends...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 w-5 h-5" />
                  Analyze Trends
                </>
              )}
            </Button>
            {isAnalyzing && (
              <p className="text-muted-foreground text-sm mt-3">
                Our AI is analyzing millions of data points. This may take a moment...
              </p>
            )}
          </div>

          {/* Demo Results */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground mb-4">Trending Products (Sample)</h3>
            {demoResults.map((result, index) => (
              <div key={index} className="bg-background border border-border rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-foreground mb-2">{result.product}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {result.timeframe}
                      </span>
                      <span>Platform: {result.platform}</span>
                      <span>Risk: <span className={result.risk === "Low" ? "text-success" : "text-warning"}>{result.risk}</span></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-success font-semibold text-lg mb-1">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      {result.trend}
                    </div>
                    <div className="flex items-center text-warning text-sm">
                      <Star className="w-3.5 h-3.5 mr-1" />
                      {result.confidence}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
