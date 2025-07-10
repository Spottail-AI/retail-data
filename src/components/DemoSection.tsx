
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, ArrowUp, Star, Clock } from "lucide-react";

export const DemoSection = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const topCountries = [
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "de", label: "Germany" },
    { value: "jp", label: "Japan" },
    { value: "au", label: "Australia" }
  ];

  const allCountries = [
    ...topCountries,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { firstName, lastName, email });
    setIsDialogOpen(false);
    // Reset form
    setFirstName("");
    setLastName("");
    setEmail("");
  };

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
                  {allCountries.map(country => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
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
                  {niches.map(niche => (
                    <SelectItem key={niche.value} value={niche.value}>
                      {niche.label}
                    </SelectItem>
                  ))}
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
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-center mb-8">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-full"
                >
                  <TrendingUp className="mr-2 w-5 h-5" />
                  Analyze Trends
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 border-0">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center text-slate-800 mb-2">
                    We'll be live soon. Receive the results directly in your email
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-slate-700 font-medium">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-white/80 border-slate-200"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-slate-700 font-medium">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-white/80 border-slate-200"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/80 border-slate-200"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white py-3 text-lg font-semibold rounded-full"
                  >
                    Send me Trends
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
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
