import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PatinaRecord, Product } from "../types";
import { Droplets, Thermometer, Wind, CloudRain, UploadCloud, Calendar, Check, Compass, Shield } from "lucide-react";

interface CareConciergeProps {
  email: string;
  userName: string;
  products: Product[];
}

export default function CareConcierge({ email, userName, products }: CareConciergeProps) {
  const [activeTab, setActiveTab] = useState<"weather-care" | "patina-journey">("weather-care");
  const [selectedCity, setSelectedCity] = useState<string>("Paris");
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(false);

  // Gemini recommended care guidelines state (custom fetched!)
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiAdvice, setAiAdvice] = useState<any | null>(null);

  // Patina gallery upload form
  const [patinaRecords, setPatinaRecords] = useState<PatinaRecord[]>([]);
  const [loadingPatina, setLoadingPatina] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<string>(products[0]?.id || "");
  const [yearsOld, setYearsOld] = useState<number>(1);
  const [patinaStory, setPatinaStory] = useState<string>("");
  const [submittingPatina, setSubmittingPatina] = useState<boolean>(false);
  const [uploadedSuccess, setUploadedSuccess] = useState<boolean>(false);

  const globalCities = ["Paris", "London", "Milan", "Tokyo", "Aspen", "St. Tropez"];

  // Fetch weather data and AI style advice dynamically
  const fetchWeatherAndRecommendations = async (city: string) => {
    setLoadingWeather(true);
    setAiLoading(true);
    try {
      // 1. Fetch live or simulated atmospheric stats
      const weatherRes = await fetch(`/api/weather?city=${city}`);
      const weather = await weatherRes.json();
      setWeatherData(weather);

      // 2. Fetch bespoke Gemini style and care recommendation from backend proxy
      const recRes = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          weather,
          styleProfile: { preferredStyle: "Minimalist", preferredColors: ["Espresso", "Cognac"] }
        })
      });
      const advice = await recRes.json();
      setAiAdvice(advice);
    } catch (err) {
      console.error("Error fetching atmosphere stats", err);
    } finally {
      setLoadingWeather(false);
      setAiLoading(false);
    }
  };

  // Fetch patina gallery records from backend
  const fetchPatinaGallery = async () => {
    setLoadingPatina(true);
    try {
      const res = await fetch("/api/patina");
      const data = await res.json();
      setPatinaRecords(data.patinaRecords || []);
    } catch (err) {
      console.error("Failed to load patina journey", err);
    } finally {
      setLoadingPatina(false);
    }
  };

  useEffect(() => {
    fetchWeatherAndRecommendations(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    fetchPatinaGallery();
  }, []);

  const handlePatinaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patinaStory) return;
    setSubmittingPatina(true);

    const product = products.find(p => p.id === selectedProduct) || products[0];
    
    // Aesthetic simulated patina images matching user choice
    const mockPatinaImages: Record<string, string> = {
      "prod-briefcase-01": "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80",
      "prod-tote-01": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
      "prod-messenger-01": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      "prod-wallet-01": "https://images.unsplash.com/photo-1627124718515-e23e7102dbdb?auto=format&fit=crop&w=800&q=80"
    };

    const imageUrl = mockPatinaImages[selectedProduct] || "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80";

    try {
      const response = await fetch("/api/patina", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          userName: userName || "Honorary Patron",
          productName: product?.name,
          productId: selectedProduct,
          yearsOld,
          notes: patinaStory,
          imageUrl
        })
      });

      if (response.ok) {
        setUploadedSuccess(true);
        setPatinaStory("");
        fetchPatinaGallery();
        setTimeout(() => setUploadedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Story submission failed", err);
    } finally {
      setSubmittingPatina(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Tab navigation headers */}
      <div className="flex border-b border-espresso/5">
        <button
          onClick={() => setActiveTab("weather-care")}
          className={`flex-1 py-4 text-xs uppercase tracking-widest transition-all text-center border-b-2 ${
            activeTab === "weather-care"
              ? "border-gold-burnished text-espresso font-semibold"
              : "border-transparent text-espresso/40 hover:text-espresso/70"
          }`}
        >
          Atmospheric Care Alerts
        </button>
        <button
          onClick={() => setActiveTab("patina-journey")}
          className={`flex-1 py-4 text-xs uppercase tracking-widest transition-all text-center border-b-2 ${
            activeTab === "patina-journey"
              ? "border-gold-burnished text-espresso font-semibold"
              : "border-transparent text-espresso/40 hover:text-espresso/70"
          }`}
        >
          The Patina Journey Gallery
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "weather-care" && (
          <motion.div
            key="weather"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
          >
            {/* Left Column: Atmospheric Dial */}
            <div className="md:col-span-5 bg-white border border-espresso/5 p-6 rounded-sm space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] tracking-widest text-gold-burnished uppercase font-semibold">Location Microclimate</span>
                <h4 className="text-xl font-serif text-espresso">Global Atelier Weather</h4>
              </div>

              {/* City Selection Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {globalCities.map(city => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`py-2 text-[10px] tracking-widest uppercase transition-all rounded-sm border ${
                      selectedCity === city
                        ? "bg-espresso border-espresso text-white"
                        : "bg-transparent border-espresso/10 hover:border-espresso text-espresso"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>

              {/* Simulated Weather Gauges */}
              <div className="p-5 bg-alabaster rounded-sm border border-espresso/5 space-y-4">
                {loadingWeather ? (
                  <div className="py-8 text-center text-xs text-espresso/40 animate-pulse">Retrieving local microclimate...</div>
                ) : (
                  weatherData && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-serif text-espresso">{weatherData.city} Atmosphere</span>
                        <div className="flex items-center gap-1.5 text-xs text-gold-burnished">
                          <CloudRain className="w-4 h-4" />
                          <span>{weatherData.weather}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-white p-3 rounded-xs border border-espresso/5">
                          <Thermometer className="w-4 h-4 text-espresso/40 mx-auto mb-1" />
                          <span className="block text-[8px] uppercase tracking-wider text-espresso/40">Temp</span>
                          <span className="text-sm font-semibold">{weatherData.temp}°C</span>
                        </div>
                        <div className="bg-white p-3 rounded-xs border border-espresso/5">
                          <Droplets className="w-4 h-4 text-blue-500/60 mx-auto mb-1" />
                          <span className="block text-[8px] uppercase tracking-wider text-espresso/40">Humidity</span>
                          <span className="text-sm font-semibold">{weatherData.humidity}%</span>
                        </div>
                        <div className="bg-white p-3 rounded-xs border border-espresso/5">
                          <Wind className="w-4 h-4 text-teal-600/60 mx-auto mb-1" />
                          <span className="block text-[8px] uppercase tracking-wider text-espresso/40">Climate</span>
                          <span className="text-[9px] font-semibold leading-none text-espresso/80 truncate block pt-1">{weatherData.weather}</span>
                        </div>
                      </div>

                      <p className="text-xs text-espresso/60 leading-relaxed font-light italic bg-white p-3 border border-espresso/5 rounded-xs">
                        {weatherData.desc}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Right Column: AI Care Concierge bespoke recommendations */}
            <div className="md:col-span-7 bg-white border border-espresso/5 p-6 rounded-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] tracking-widest text-gold-burnished uppercase font-semibold">Gemini Workshop Guard</span>
                <h4 className="text-2xl font-serif text-espresso">Care Advice & Bespoke Recommendations</h4>
                <p className="text-xs text-espresso/60 font-light leading-relaxed">
                  Our algorithm processes real-time humidity levels to safeguard the protein structure of your fine leathers.
                </p>
              </div>

              {aiLoading ? (
                <div className="py-12 flex-1 flex flex-col justify-center items-center space-y-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gold-burnished border-t-transparent animate-spin" />
                  <span className="text-[10px] tracking-widest uppercase text-gold-burnished">Gemini consulting leather master...</span>
                </div>
              ) : (
                aiAdvice && (
                  <div className="space-y-5 flex-1 pt-4">
                    {/* Conditioning alert */}
                    <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-sm space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider">
                        <Shield className="w-4 h-4 text-gold-burnished" /> Dynamic Preservation Alert
                      </div>
                      <p className="text-xs text-espresso/70 leading-relaxed font-light">
                        {aiAdvice.careAdvice}
                      </p>
                    </div>

                    {/* Styling Narrative */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] uppercase tracking-widest text-espresso/50 font-semibold flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-gold-burnished" /> Atelier Seasonal Styling Guide
                      </h5>
                      <p className="text-xs text-espresso/70 leading-relaxed font-serif italic pl-4 border-l border-gold-burnished/30 py-1">
                        "{aiAdvice.stylingNarrative}"
                      </p>
                    </div>

                    {/* Quick recommended action */}
                    <div className="bg-alabaster border border-espresso/5 p-3 rounded-xs flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-wider text-espresso/50">Optimal leather for {selectedCity} today:</span>
                      <span className="text-xs font-semibold text-gold-burnished uppercase tracking-wider">
                        {weatherData?.weather === "Rainy" ? "Saffiano Scratchguard" : "French Vachetta Patina"}
                      </span>
                    </div>
                  </div>
                )
              )}

              <div className="border-t border-espresso/5 pt-4 flex justify-between items-center text-[10px] text-espresso/40">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Next Condition Due: 6 Months</span>
                <span>Calvino Torvani Care Registry</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "patina-journey" && (
          <motion.div
            key="patina"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Gallery Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Side: Aging Records Feed */}
              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
                <h4 className="text-lg font-serif text-espresso">Atelier Patron Aging Journals</h4>
                
                {loadingPatina ? (
                  <div className="py-12 text-center text-xs text-espresso/40">Loading aging records...</div>
                ) : patinaRecords.length === 0 ? (
                  <div className="py-12 text-center text-xs text-espresso/40">No entries yet. Be the first to catalog your patina.</div>
                ) : (
                  patinaRecords.map(rec => (
                    <div key={rec.id} className="bg-white border border-espresso/5 p-4 rounded-sm flex gap-4 hover:shadow-xs transition-shadow">
                      <img
                        src={rec.imageUrl}
                        alt="Leather Patina"
                        className="w-20 h-20 object-cover rounded-sm border border-espresso/10 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-semibold text-espresso">{rec.userName}</span>
                          <span className="text-[9px] font-mono text-gold-burnished bg-gold-burnished/5 px-1.5 py-0.5 rounded-xs">
                            {rec.yearsOld} Year{rec.yearsOld > 1 ? "s" : ""} Old
                          </span>
                        </div>
                        <span className="block text-[9px] uppercase text-espresso/40 tracking-wider">{rec.productName}</span>
                        <p className="text-[11px] text-espresso/70 leading-relaxed font-light">{rec.notes}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Right Side: Upload Story Form */}
              <div className="bg-white border border-espresso/5 p-6 rounded-sm shadow-xs h-fit">
                <div className="space-y-1 mb-4">
                  <h4 className="text-lg font-serif text-espresso">Catalog Your Patina Story</h4>
                  <p className="text-[11px] text-espresso/50 leading-relaxed">
                    True luxury leather isn't static. It records your travels, your touches, and the atmospheres you traverse. Publish your aging journal.
                  </p>
                </div>

                <form onSubmit={handlePatinaSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-espresso/50 mb-1">Your Leather Artifact</label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full bg-transparent border-b border-espresso/20 py-2 text-xs focus:outline-none focus:border-gold-burnished"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-espresso/50 mb-1">Artifact Age (Years)</label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={yearsOld}
                        onChange={(e) => setYearsOld(Number(e.target.value))}
                        className="w-full bg-transparent border-b border-espresso/20 py-2 text-xs focus:outline-none focus:border-gold-burnished"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-espresso/50 mb-1">Upload Photo</label>
                      <div className="py-2 flex items-center gap-1.5 text-xs text-gold-burnished border-b border-espresso/10 cursor-pointer hover:border-gold-burnished transition-colors">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span className="text-[10px] tracking-wider uppercase font-medium">Auto-Generates Fit Image</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-espresso/50 mb-1">The Aging Narrative</label>
                    <textarea
                      rows={3}
                      value={patinaStory}
                      onChange={(e) => setPatinaStory(e.target.value)}
                      placeholder="e.g. My sovereign belt has acquired a deeper, honeyed glow around the buckle. A beautiful recording of my winter trips..."
                      className="w-full bg-alabaster border border-espresso/5 rounded-sm p-3 text-xs leading-relaxed focus:outline-none focus:border-gold-burnished placeholder:text-espresso/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingPatina || !patinaStory}
                    className="w-full py-3 bg-espresso text-alabaster text-[10px] uppercase tracking-widest font-semibold hover:bg-gold-burnished transition-colors rounded-sm flex items-center justify-center gap-2"
                  >
                    {submittingPatina ? "Broadcasting to Gallery..." : "Publish Artifact Record"}
                  </button>

                  <AnimatePresence>
                    {uploadedSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-green-50 text-[10px] text-green-800 p-2 text-center rounded-sm border border-green-200"
                      >
                        ✓ Story recorded. Your patina has been entered into the global registry.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
