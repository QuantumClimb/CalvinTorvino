import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StyleProfile } from "../types";
import { Compass, Check, ArrowRight } from "lucide-react";
import CalvinoTorvaniLogo from "./CalvinoTorvaniLogo";

interface StyleQuizProps {
  email: string;
  onComplete: (profile: StyleProfile) => void;
}

export default function StyleQuiz({ email, onComplete }: StyleQuizProps) {
  const [step, setStep] = useState<number>(0);
  const [preferredStyle, setPreferredStyle] = useState<string>("Minimalist");
  const [preferredColors, setPreferredColors] = useState<string[]>([]);
  const [seasonalInterests, setSeasonalInterests] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const styles = [
    { name: "Minimalist", desc: "Sleek, geometric forms focused entirely on material purity. Perfect line work." },
    { name: "Bold", desc: "Commanding hardware details and larger, architectural proportions." },
    { name: "Vintage", desc: "Traditional textures, rich vegetable tans, and brass rivets evoking heritage travel." }
  ];

  const colors = [
    { name: "Sartorial Black", hex: "#111111" },
    { name: "Cognac", hex: "#8b4513" },
    { name: "Deep Espresso", hex: "#1e1412" },
    { name: "Alabaster / Sand", hex: "#d2b48c" }
  ];

  const seasons = [
    { name: "The Autumn Corporate Look", desc: "Sovereign Briefcases & structured belts tailored for high-stakes business." },
    { name: "The Riviera Summer", desc: "Slouchy calfskin totes and warm ostrich cardholders for coastal escapes." },
    { name: "The Winter Alpine", desc: "Thick bridle leather crafted to withstand extreme, crisp mountain elements." },
    { name: "The Spring Yachting Capsule", desc: "Compact crossbody bags and minimalist card sleeves in marine shades." }
  ];

  const toggleColor = (color: string) => {
    if (preferredColors.includes(color)) {
      setPreferredColors(preferredColors.filter(c => c !== color));
    } else {
      setPreferredColors([...preferredColors, color]);
    }
  };

  const toggleSeason = (season: string) => {
    if (seasonalInterests.includes(season)) {
      setSeasonalInterests(seasonalInterests.filter(s => s !== season));
    } else {
      setSeasonalInterests([...seasonalInterests, season]);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || "Atelier Patron",
          preferredStyle,
          preferredColors,
          seasonalInterests
        })
      });
      const data = await response.json();
      if (data.user?.styleProfile) {
        onComplete(data.user.styleProfile);
      }
    } catch (err) {
      console.error("Failed to save profile", err);
      // Fallback local completion
      onComplete({
        id: "prof-fallback",
        userId: "usr-001",
        preferredColors,
        preferredStyle,
        seasonalInterests,
        onboardingCompleted: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-alabaster flex flex-col justify-center items-center px-4 py-16 text-espresso relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-espresso via-gold-burnished to-espresso opacity-40" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gold-burnished/5 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-espresso/5 blur-3xl" />

      <div className="w-full max-w-xl bg-white border border-espresso/5 p-8 md:p-12 shadow-sm relative z-10 rounded-sm">
        <div className="flex justify-between items-center mb-10 border-b border-espresso/5 pb-4">
          <div className="flex items-center gap-2">
            <CalvinoTorvaniLogo variant="monogram" iconSize={24} />
            <span className="text-[10px] tracking-widest text-gold-burnished uppercase font-semibold">Calvino Torvani Onboarding</span>
          </div>
          <span className="text-xs text-espresso/40 font-mono">0{step + 1} / 04</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 text-center"
            >
              <div className="py-2 flex justify-center">
                <CalvinoTorvaniLogo variant="full" iconSize={80} />
              </div>
              <h2 className="text-3xl font-serif text-espresso leading-tight mt-4">Welcome to the Atelier</h2>
              <p className="text-espresso/60 leading-relaxed font-light text-xs max-w-sm mx-auto">
                To serve you bespoke, climate-guided luxury and tailor the digital atelier to your tastes, we invite you to register your style profile.
              </p>
              
              <div className="space-y-2 pt-4 text-left max-w-sm mx-auto">
                <label className="block text-[10px] uppercase tracking-widest text-espresso/50 font-semibold">Your Distinguished Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sterling Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-espresso/20 py-2 text-md font-serif focus:outline-none focus:border-gold-burnished transition-colors placeholder:text-espresso/20 text-center"
                />
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full mt-6 py-4 bg-espresso text-alabaster text-xs uppercase tracking-widest hover:bg-gold-burnished transition-colors duration-300 flex items-center justify-center gap-2 group rounded-sm"
              >
                Begin Personal Consultation <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-serif text-espresso">Select Your Aesthetic DNA</h3>
              <p className="text-xs text-espresso/50 leading-relaxed -mt-3">
                Do you prefer the mathematical perfection of modern geometry or the warmth of heritage?
              </p>

              <div className="space-y-3 pt-2">
                {styles.map((s) => (
                  <div
                    key={s.name}
                    onClick={() => setPreferredStyle(s.name)}
                    className={`p-5 border cursor-pointer transition-all duration-300 rounded-sm flex justify-between items-start ${
                      preferredStyle === s.name
                        ? "border-gold-burnished bg-alabaster/40"
                        : "border-espresso/10 hover:border-espresso/30"
                    }`}
                  >
                    <div>
                      <h4 className="font-serif text-lg text-espresso">{s.name}</h4>
                      <p className="text-xs text-espresso/60 font-light mt-1 max-w-[90%] leading-relaxed">{s.desc}</p>
                    </div>
                    {preferredStyle === s.name && (
                      <div className="w-4 h-4 rounded-full bg-gold-burnished flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(0)}
                  className="w-1/3 py-3 border border-espresso/10 text-espresso text-xs uppercase tracking-widest hover:border-espresso/30 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="w-2/3 py-3 bg-espresso text-alabaster text-xs uppercase tracking-widest hover:bg-gold-burnished transition-colors flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-serif text-espresso">Select Your Primary Colorways</h3>
              <p className="text-xs text-espresso/50 leading-relaxed -mt-3">
                Choose the natural leather tones and metal highlights that grace your wardrobe.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {colors.map((c) => {
                  const isSelected = preferredColors.includes(c.name);
                  return (
                    <div
                      key={c.name}
                      onClick={() => toggleColor(c.name)}
                      className={`p-4 border cursor-pointer transition-all duration-300 rounded-sm flex flex-col justify-between items-start h-28 ${
                        isSelected ? "border-gold-burnished bg-alabaster/40" : "border-espresso/10 hover:border-espresso/30"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full border border-espresso/10 shadow-inner" style={{ backgroundColor: c.hex }} />
                      <div className="flex justify-between items-center w-full mt-2">
                        <span className="text-xs text-espresso font-light">{c.name}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-gold-burnished" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 border border-espresso/10 text-espresso text-xs uppercase tracking-widest hover:border-espresso/30 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={preferredColors.length === 0}
                  className="w-2/3 py-3 bg-espresso text-alabaster text-xs uppercase tracking-widest hover:bg-gold-burnished transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:hover:bg-espresso"
                >
                  Continue <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-serif text-espresso">Select Your Seasonal Intentions</h3>
              <p className="text-xs text-espresso/50 leading-relaxed -mt-3">
                Our workshop designs specialized capsules optimized for specific global climes and occasions.
              </p>

              <div className="space-y-3 pt-2 max-h-72 overflow-y-auto pr-1">
                {seasons.map((s) => {
                  const isSelected = seasonalInterests.includes(s.name);
                  return (
                    <div
                      key={s.name}
                      onClick={() => toggleSeason(s.name)}
                      className={`p-4 border cursor-pointer transition-all duration-300 rounded-sm flex justify-between items-start ${
                        isSelected ? "border-gold-burnished bg-alabaster/40" : "border-espresso/10 hover:border-espresso/30"
                      }`}
                    >
                      <div className="flex-1 pr-4">
                        <span className="text-sm text-espresso font-medium block">{s.name}</span>
                        <span className="text-xs text-espresso/60 font-light mt-0.5 block leading-relaxed">{s.desc}</span>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-gold-burnished flex items-center justify-center mt-1">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3 border border-espresso/10 text-espresso text-xs uppercase tracking-widest hover:border-espresso/30 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={submitQuiz}
                  disabled={loading || seasonalInterests.length === 0}
                  className="w-2/3 py-3 bg-espresso text-alabaster text-xs uppercase tracking-widest hover:bg-gold-burnished transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  {loading ? "Registering Atelier DNA..." : "Enter the Atelier"} <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
