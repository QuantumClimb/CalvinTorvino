import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product, StyleProfile } from "../types";
import { 
  Sparkles, 
  MapPin, 
  Thermometer, 
  Droplets, 
  RefreshCw, 
  ShieldAlert, 
  Compass, 
  ArrowRight, 
  Sliders, 
  Palette,
  CheckCircle2,
  Lock
} from "lucide-react";

interface AIStyleCurationProps {
  products: Product[];
  userProfile: StyleProfile;
  onUpdateProfile: (updatedProfile: StyleProfile) => void;
  onSelectProduct: (product: Product) => void;
  userName: string;
}

const DESTINATIONS = [
  { city: "Paris", label: "Avenue Montaigne, Paris", weather: "Clear", temp: 21, humidity: 45 },
  { city: "Milan", label: "Piazza del Duomo, Milan", weather: "Sunny", temp: 26, humidity: 38 },
  { city: "London", label: "Bond Street, London", weather: "Rainy", temp: 14, humidity: 88 },
  { city: "Tokyo", label: "Ginza Crossing, Tokyo", weather: "Overcast", temp: 19, humidity: 65 },
  { city: "Aspen", label: "Snowy Alpine, Aspen", weather: "Chilly", temp: 4, humidity: 75 },
  { city: "St. Tropez", label: "French Riviera, St. Tropez", weather: "Sunny", temp: 31, humidity: 40 }
];

const PREFERRED_STYLES = ["Minimalist", "Bold", "Vintage", "Architectural"];
const PREFERRED_COLORS = [
  { name: "Espresso", color: "bg-[#2E1A16]" },
  { name: "Burnished Gold", color: "bg-[#D4AF37]" },
  { name: "Charcoal", color: "bg-[#2F3E46]" },
  { name: "Cognac", color: "bg-[#9A5B3E]" },
  { name: "Ivory", color: "bg-[#F4F1EA]" },
  { name: "British Tan", color: "bg-[#A0522D]" }
];

export default function AIStyleCuration({ 
  products, 
  userProfile, 
  onUpdateProfile, 
  onSelectProduct, 
  userName 
}: AIStyleCurationProps) {
  
  const [selectedDestination, setSelectedDestination] = useState(DESTINATIONS[0]);
  const [currentStyle, setCurrentStyle] = useState<string>(userProfile.preferredStyle || "Minimalist");
  const [currentColors, setCurrentColors] = useState<string[]>(userProfile.preferredColors || ["Espresso", "Burnished Gold"]);
  
  // Recommendations state
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<{
    recommendedProductIds: string[];
    stylingNarrative: string;
    careAdvice: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Show style editors panel
  const [showConfig, setShowConfig] = useState<boolean>(false);

  // Fetch from /api/recommendations
  const fetchRecommendations = async (
    profileStyle: string, 
    profileColors: string[], 
    dest: typeof DESTINATIONS[0]
  ) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        styleProfile: {
          preferredStyle: profileStyle,
          preferredColors: profileColors,
          seasonalInterests: userProfile.seasonalInterests || []
        },
        weather: {
          weather: dest.weather,
          temp: dest.temp,
          humidity: dest.humidity
        },
        city: dest.city,
        browsingHistory: "Prefers handcrafted leather goods with personalized monogram detailing"
      };

      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Unable to contact the design server");
      }

      const data = await res.json();
      setRecommendations(data);
    } catch (err: any) {
      console.error(err);
      setError("Unable to process high-luxury style calculations at this moment.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchRecommendations(currentStyle, currentColors, selectedDestination);
  }, [selectedDestination]);

  // Handle setting/changing preferences
  const handleStyleChange = (style: string) => {
    setCurrentStyle(style);
    // Update profile on parent and server
    const updated = {
      ...userProfile,
      preferredStyle: style
    };
    onUpdateProfile(updated);
    fetchRecommendations(style, currentColors, selectedDestination);
  };

  const handleColorToggle = (colorName: string) => {
    let nextColors = [...currentColors];
    if (nextColors.includes(colorName)) {
      if (nextColors.length > 1) {
        nextColors = nextColors.filter(c => c !== colorName);
      }
    } else {
      nextColors.push(colorName);
    }
    setCurrentColors(nextColors);
    
    const updated = {
      ...userProfile,
      preferredColors: nextColors
    };
    onUpdateProfile(updated);
    fetchRecommendations(currentStyle, nextColors, selectedDestination);
  };

  // Resolve product details
  const recommendedProducts = products.filter(p => 
    recommendations?.recommendedProductIds?.includes(p.id)
  );

  // Fallback to defaults if none found
  const finalRecommendedProducts = recommendedProducts.length > 0 
    ? recommendedProducts 
    : products.slice(0, 2);

  return (
    <div className="bg-white border border-espresso/5 rounded-sm overflow-hidden p-6 md:p-8 space-y-8 text-left shadow-xs">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-espresso/5 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-gold-burnished/10 border border-gold-burnished/20 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-gold-burnished animate-pulse" />
            <span className="text-[8px] tracking-[0.2em] uppercase font-bold text-gold-burnished">Gemini-Powered</span>
          </div>
          <h3 className="text-2xl font-serif text-espresso font-bold">
            Artisanal Style Curation
          </h3>
          <p className="text-xs text-espresso/60 font-light">
            An intelligent companion matching Florentine craftsmanship to your current location's microclimate and personal style.
          </p>
        </div>

        {/* Configuration Toggles */}
        <button
          onClick={() => setShowConfig(!showConfig)}
          className={`px-4 py-2 text-[10px] tracking-widest uppercase font-semibold rounded-sm transition-all border flex items-center gap-1.5 ${
            showConfig 
              ? "bg-espresso text-white border-espresso" 
              : "bg-alabaster text-espresso border-espresso/10 hover:border-espresso/30"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          {showConfig ? "Close Studio Knobs" : "Refine Profile Filter"}
        </button>
      </div>

      {/* QUICK PREFERENCES EDITOR PANEL */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-alabaster/60 border border-espresso/5 p-5 rounded-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Style Preference */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-gold-burnished font-bold block">
                  Aesthetic Philosophy
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {PREFERRED_STYLES.map((style) => {
                    const isSel = currentStyle === style;
                    return (
                      <button
                        key={style}
                        onClick={() => handleStyleChange(style)}
                        className={`py-2 px-3 text-xs text-center rounded-sm border transition-all flex items-center justify-between ${
                          isSel 
                            ? "bg-white border-gold-burnished text-espresso font-semibold shadow-xs" 
                            : "bg-white/40 border-espresso/5 text-espresso/60 hover:bg-white hover:text-espresso"
                        }`}
                      >
                        <span>{style}</span>
                        {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-gold-burnished" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors Palette */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-gold-burnished font-bold block">
                  Custom Leather Palette
                </span>
                <div className="flex flex-wrap gap-2">
                  {PREFERRED_COLORS.map((col) => {
                    const isSel = currentColors.includes(col.name);
                    return (
                      <button
                        key={col.name}
                        onClick={() => handleColorToggle(col.name)}
                        className={`py-1.5 px-3 rounded-full text-xs border transition-all flex items-center gap-1.5 ${
                          isSel 
                            ? "bg-espresso text-white border-espresso" 
                            : "bg-white border-espresso/10 text-espresso/60 hover:bg-alabaster"
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${col.color} border border-espresso/15`} />
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[9px] text-espresso/40">
                  Select multiple tones to blend seasonal wardrobes together.
                </p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CLIMATE SIMULATION & RECS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Climate Selector & Narrative Card */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Destination microclimate pills */}
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-wider text-espresso/55 block font-bold">
              Select World Destination
            </span>
            <div className="grid grid-cols-3 gap-1">
              {DESTINATIONS.map((dest) => {
                const isSel = selectedDestination.city === dest.city;
                return (
                  <button
                    key={dest.city}
                    onClick={() => setSelectedDestination(dest)}
                    className={`py-1.5 px-1 text-[10px] uppercase tracking-widest border rounded-xs transition-all text-center ${
                      isSel 
                        ? "bg-gold-burnished border-gold-burnished text-white font-bold" 
                        : "bg-alabaster/40 border-espresso/5 text-espresso/50 hover:bg-white hover:text-espresso"
                    }`}
                  >
                    {dest.city}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Connected Virtual Station Feed */}
          <div className="bg-espresso text-alabaster p-5 rounded-sm space-y-4 shadow-md relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] opacity-10">
              <Compass className="w-32 h-32 animate-spin" style={{ animationDuration: '30s' }} />
            </div>

            <div className="flex justify-between items-center border-b border-white/15 pb-3">
              <span className="text-[8px] font-mono tracking-widest text-gold-burnished font-bold uppercase flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gold-burnished" /> {selectedDestination.label}
              </span>
              <span className="text-[8px] font-mono text-white/35">ACTIVE WEATHER</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-serif text-white">{selectedDestination.temp}°C</span>
                <span className="block text-[8px] uppercase tracking-wider text-white/40 mt-1">Virtual Temperature</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-serif text-white">{selectedDestination.humidity}%</span>
                <span className="block text-[8px] uppercase tracking-wider text-white/40 mt-1">Micro Humidity</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-white/90 font-bold block">{selectedDestination.weather}</span>
                <span className="block text-[8px] uppercase tracking-wider text-white/40 mt-1">General Sky</span>
              </div>
            </div>
          </div>

          {/* Bespoke styling narrative card */}
          <div className="bg-alabaster border border-espresso/5 p-5 rounded-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[9px] tracking-widest text-espresso/45 uppercase font-bold">
                The Curated Counsel
              </span>
              {loading && <RefreshCw className="w-3.5 h-3.5 text-gold-burnished animate-spin" />}
            </div>

            {loading ? (
              <div className="py-8 space-y-2 text-center">
                <div className="w-6 h-6 border-2 border-gold-burnished border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[10px] text-espresso/40 tracking-wider uppercase">Running Style Formula...</p>
              </div>
            ) : error ? (
              <p className="text-xs text-rose-800 font-light">{error}</p>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDestination.city + currentStyle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <p className="text-xs text-espresso/80 leading-relaxed font-serif italic">
                    "{recommendations?.stylingNarrative || "Calvino Torvani's virtual atelier is preparing your digital look card."}"
                  </p>

                  <div className="pt-3 border-t border-espresso/5 space-y-1.5">
                    <span className="text-[8px] uppercase tracking-wider font-bold text-gold-burnished block">
                      ARTISANAL PRESERVATION ADVICE
                    </span>
                    <p className="text-[10.5px] text-espresso/60 leading-relaxed font-light">
                      {recommendations?.careAdvice}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

        </div>

        {/* Right column: Beautiful products recommended for you */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-[9px] uppercase tracking-widest text-gold-burnished font-bold">
              Recommended Pieces ({finalRecommendedProducts.length})
            </span>
            <span className="text-[10px] font-light text-espresso/45">Based on {currentStyle} Preferences</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-72 bg-alabaster animate-pulse rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {finalRecommendedProducts.map((prod, index) => (
                  <motion.div
                    key={prod.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-alabaster/40 border border-espresso/5 rounded-sm overflow-hidden flex flex-col justify-between group"
                  >
                    {/* Visual stage */}
                    <div className="h-44 bg-white relative overflow-hidden">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-102 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-espresso/90 text-white text-[8px] font-mono tracking-wider px-2 py-0.5 rounded-xs">
                        ${prod.price}
                      </span>
                      
                      {/* Interactive styling badge */}
                      <span className="absolute bottom-2.5 right-2.5 bg-gold-burnished/95 text-white text-[8px] uppercase tracking-widest font-semibold px-2 py-1 rounded-xs flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-2.5 h-2.5" /> AESTHETIC FIT
                      </span>
                    </div>

                    {/* Descriptive card body */}
                    <div className="p-4 space-y-2 text-left">
                      <div className="space-y-0.5">
                        <span className="text-[8px] text-gold-burnished uppercase tracking-wider block font-bold">
                          {prod.leatherType}
                        </span>
                        <h4 className="text-[12px] font-serif font-bold text-espresso truncate">
                          {prod.name}
                        </h4>
                      </div>
                      
                      <p className="text-[10px] text-espresso/60 leading-relaxed font-light line-clamp-2">
                        {prod.description}
                      </p>

                      <div className="pt-2 flex gap-1.5">
                        <button
                          onClick={() => onSelectProduct(prod)}
                          className="flex-1 py-1.5 bg-espresso hover:bg-gold-burnished text-white text-[8px] uppercase tracking-widest font-semibold rounded-xs transition-colors"
                        >
                          Monogram
                        </button>
                        <button
                          onClick={() => onSelectProduct(prod)}
                          className="px-2 py-1.5 bg-white border border-espresso/15 hover:border-espresso text-espresso text-[8px] font-bold rounded-xs transition-all"
                        >
                          Details
                        </button>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
