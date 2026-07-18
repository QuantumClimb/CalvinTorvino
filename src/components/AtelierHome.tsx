import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product, Category, StyleProfile } from "../types";
import AIStyleCuration from "./AIStyleCuration";
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  Users, 
  Thermometer, 
  Droplets, 
  Layers, 
  BookOpen, 
  ChevronRight, 
  Star,
  MessageSquare,
  MapPin,
  Clock
} from "lucide-react";

interface AtelierHomeProps {
  products: Product[];
  userProfile: StyleProfile;
  onUpdateProfile: (updatedProfile: StyleProfile) => void;
  onNavigate: (tab: "home" | "shop" | "vault" | "lookbooks" | "concierge" | "nfc") => void;
  onSelectProduct: (product: Product) => void;
  userName: string;
}

interface GuestbookEntry {
  id: string;
  name: string;
  location: string;
  message: string;
  date: string;
}

export default function AtelierHome({ 
  products, 
  userProfile, 
  onUpdateProfile, 
  onNavigate, 
  onSelectProduct, 
  userName 
}: AtelierHomeProps) {
  // Florence Workshop Microclimate Simulation states
  const [temperature, setTemperature] = useState<number>(21.4);
  const [humidity, setHumidity] = useState<number>(47.8);
  const [currentTask, setCurrentTask] = useState<string>("Hot-foil gold monogramming on French Vachetta wallets");
  const [activeCraftsmenCount, setActiveCraftsmenCount] = useState<number>(3);

  // Active philosophy pillar index
  const [activePillar, setActivePillar] = useState<number>(0);

  // Guestbook messages
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>([
    {
      id: "g-1",
      name: "Jean-Pierre Laurent",
      location: "Lyon, France",
      message: "The double-faced Merino Shearling feels like absolute architectural armor. Masterfully executed.",
      date: "July 12, 2026"
    },
    {
      id: "g-2",
      name: "Keiko Tanaka",
      location: "Tokyo, Japan",
      message: "Matteo’s 45-degree linen saddle stitch is flawless. Standard machine stitches simply cannot compare.",
      date: "July 15, 2026"
    }
  ]);
  const [newGuestName, setNewGuestName] = useState<string>(userName);
  const [newGuestLocation, setNewGuestLocation] = useState<string>("New York, USA");
  const [newGuestMsg, setNewGuestMsg] = useState<string>("");
  const [guestSuccess, setGuestSuccess] = useState<boolean>(false);

  // Periodic Florence state fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature((prev) => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1));
      setHumidity((prev) => +(prev + (Math.random() * 0.8 - 0.4)).toFixed(1));
      
      const tasks = [
        "Beeswax edge-rubbing on Sovereign Belts",
        "Fine hand-skiving Spanish Lambskin seams",
        "Stitching invisible NFC shielding under Vachetta linings",
        "Soaking organic French calf hide in chestnut oak liquor",
        "Polishing Swiss gunmetal zipper teeth with organic flannel"
      ];
      if (Math.random() > 0.7) {
        setCurrentTask(tasks[Math.floor(Math.random() * tasks.length)]);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handlePostGuestbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestMsg.trim()) return;

    const entry: GuestbookEntry = {
      id: `g-${Date.now()}`,
      name: newGuestName || "Anonymous Collector",
      location: newGuestLocation || "Florence, Italy",
      message: newGuestMsg,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    };

    setGuestbook([entry, ...guestbook]);
    setNewGuestMsg("");
    setGuestSuccess(true);
    setTimeout(() => setGuestSuccess(false), 3000);
  };

  const featuredSpotlights = products.filter(
    p => p.id === "prod-jacket-01" || p.id === "prod-duffle-01" || p.id === "prod-exotic-01"
  );

  const pillars = [
    {
      title: "The 45° Saddle Stitch",
      badge: "Sartorial Resilience",
      desc: "Using dual blunt needles and wax-coated linen threads, our artisans sew in a persistent 45-degree angle. If any single fiber breaks, the surrounding knots lock securely in place. Machines simply unravel; Calvino Torvani endures.",
      stat: "Lifetime Stitching Warranty"
    },
    {
      title: "Chestnut Oak Bark Liquors",
      badge: "Organic Tanning",
      desc: "Our Vachetta hides are cured for thirty days in slow-rotating oak drums filled with natural barks of chestnut, mimosa, and quebracho. This fully preserves the raw protein structural collagen, which is what creates the legendary deep honey patina.",
      stat: "100% Metal-Free Tannery"
    },
    {
      title: "The NFC Integrity Shield",
      badge: "Provenance Guarantee",
      desc: "Stitched directly beneath the suede backing of every item is an ultra-thin, passive microchip. When tapped with a smartphone, it communicates directly with our cryptographic registry, displaying craftsman name, leather origin, and serial key.",
      stat: "Zero-Power Passive Shield"
    }
  ];

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. EDITORIAL HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-espresso/5 rounded-sm overflow-hidden shadow-xs">
        
        {/* Left Side: Brand Narrative */}
        <div className="lg:col-span-7 p-8 md:p-12 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 bg-gold-burnished/10 border border-gold-burnished/20 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-gold-burnished" />
            <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-gold-burnished">The Florence Digital Atelier</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-espresso tracking-tight leading-[1.1]">
              Quiet Luxury. <br />
              <span className="text-gold-burnished font-normal italic">Whispered Legacy.</span>
            </h2>
            <p className="text-xs text-espresso/70 leading-relaxed font-light max-w-lg">
              We do not scream for attention; we whisper to those who appreciate details. Our leatherwork represents decades of Florentine tradition—from organic chestnut tanning to gold-leaf monograms and embedded NFC provenance shields.
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-espresso/5">
            <div>
              <span className="text-xs font-serif font-bold text-espresso">100%</span>
              <span className="block text-[8px] uppercase tracking-wider text-espresso/45">Pure Aniline Hide</span>
            </div>
            <div>
              <span className="text-xs font-serif font-bold text-espresso">Matteo</span>
              <span className="block text-[8px] uppercase tracking-wider text-espresso/45">Chief Conservator</span>
            </div>
            <div>
              <span className="text-xs font-serif font-bold text-espresso">NFC</span>
              <span className="block text-[8px] uppercase tracking-wider text-espresso/45">Stitched Integrity</span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("shop")}
              className="px-6 py-3 bg-espresso hover:bg-gold-burnished text-white text-[10px] tracking-widest uppercase font-semibold rounded-sm transition-all flex items-center gap-2"
            >
              Order Heirloom Pieces <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate("vault")}
              className="px-6 py-3 bg-white border border-espresso/15 hover:border-espresso text-espresso text-[10px] tracking-widest uppercase font-semibold rounded-sm transition-all"
            >
              Custom Monogram Stage
            </button>
          </div>
        </div>

        {/* Right Side: Showcase Image with Interactive NFC Floating Widget */}
        <div className="lg:col-span-5 relative h-96 lg:h-full min-h-[420px] bg-alabaster">
          <img
            src="https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1200&q=80"
            alt="Atelier Vachetta Hide"
            className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />

          {/* Floating Cryptographic Security badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm border border-gold-burnished/30 p-4 rounded-sm shadow-xl space-y-2 text-left"
          >
            <div className="flex justify-between items-center">
              <span className="text-[9px] tracking-widest text-gold-burnished uppercase font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Cryptographic NFC Shield
              </span>
              <span className="text-[8px] font-mono text-espresso/40">Verified Onboard</span>
            </div>
            <p className="text-[10px] text-espresso/70 leading-tight font-light">
              Tap the device to authenticate Sandro Moretti's 45-degree stitched French Vachetta holdall in our registry log.
            </p>
            <button 
              onClick={() => onNavigate("nfc")}
              className="text-[9px] uppercase tracking-wider text-gold-burnished font-semibold block hover:text-espresso transition-colors text-right w-full"
            >
              Access Registry Scanner →
            </button>
          </motion.div>
        </div>

      </div>

      {/* 2. LIVE FLORENCE ATELIER STATUS BOARD */}
      <div className="bg-espresso text-alabaster rounded-sm p-6 md:p-8 border border-gold-burnished/20 space-y-6 shadow-xl">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gold-burnished/15 pb-4">
          <div className="space-y-1 text-left">
            <span className="text-[8px] tracking-[0.3em] uppercase text-gold-burnished font-bold block">Physical Workshop Feeds</span>
            <h3 className="text-xl font-serif text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-gold-burnished animate-spin" style={{ animationDuration: '8s' }} /> 
              Florence Atelier Dashboard
            </h3>
          </div>
          <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-mono tracking-wider text-alabaster/70">CONNECTED TO FLORENCE NETWORK</span>
          </div>
        </div>

        {/* Real-time stats widgets */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white/5 border border-white/5 p-4 rounded-sm space-y-2 text-left">
            <div className="flex justify-between items-center text-gold-burnished">
              <Thermometer className="w-4 h-4" />
              <span className="text-[8px] font-mono">Sensors</span>
            </div>
            <span className="block text-2xl font-serif text-white">{temperature}°C</span>
            <span className="block text-[8px] tracking-wider text-white/40 uppercase">Atelier Room Temp</span>
          </div>

          <div className="bg-white/5 border border-white/5 p-4 rounded-sm space-y-2 text-left">
            <div className="flex justify-between items-center text-gold-burnished">
              <Droplets className="w-4 h-4" />
              <span className="text-[8px] font-mono">Curing Shield</span>
            </div>
            <span className="block text-2xl font-serif text-white">{humidity}%</span>
            <span className="block text-[8px] tracking-wider text-white/40 uppercase">Vachetta Humidity</span>
          </div>

          <div className="bg-white/5 border border-white/5 p-4 rounded-sm space-y-2 text-left">
            <div className="flex justify-between items-center text-gold-burnished">
              <Users className="w-4 h-4" />
              <span className="text-[8px] font-mono">Staff</span>
            </div>
            <span className="block text-2xl font-serif text-white">{activeCraftsmenCount} Artisans</span>
            <span className="block text-[8px] tracking-wider text-white/40 uppercase">At Work Today</span>
          </div>

          <div className="bg-white/5 border border-white/5 p-4 rounded-sm space-y-2 text-left">
            <div className="flex justify-between items-center text-gold-burnished">
              <Layers className="w-4 h-4" />
              <span className="text-[8px] font-mono">Drying racks</span>
            </div>
            <span className="block text-2xl font-serif text-white">84% Capacity</span>
            <span className="block text-[8px] tracking-wider text-white/40 uppercase">Patina Curing Racks</span>
          </div>

        </div>

        {/* Current task ticker */}
        <div className="bg-white/5 border border-white/5 p-4 rounded-sm flex items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold-burnished/10 rounded-full text-gold-burnished">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[8px] text-gold-burnished uppercase tracking-widest block font-semibold">Active Tannery & Bench Job</span>
              <p className="text-xs text-white font-light mt-0.5">{currentTask}</p>
            </div>
          </div>
          <span className="text-[9px] font-mono text-white/40 uppercase hidden sm:inline">LIVE DRIFT</span>
        </div>

      </div>

      {/* AI STYLE CURATION ENGINE */}
      <AIStyleCuration
        products={products}
        userProfile={userProfile}
        onUpdateProfile={onUpdateProfile}
        onSelectProduct={onSelectProduct}
        userName={userName}
      />

      {/* 3. BRAND PILLARS / ARTISANAL METHODOLOGY */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side text */}
        <div className="md:col-span-4 space-y-4 text-left self-center">
          <span className="text-[9px] tracking-widest text-gold-burnished uppercase font-semibold">Decisions of the Bench</span>
          <h3 className="text-3xl font-serif text-espresso leading-tight">The Tenets of Calvino Torvani</h3>
          <p className="text-xs text-espresso/60 leading-relaxed font-light">
            We follow Florentine handiwork rules established generations ago. Choose a method on the right to read how we craft every wallet, belt, coat, and bag.
          </p>
          <div className="pt-2 hidden md:block">
            <button
              onClick={() => onNavigate("concierge")}
              className="text-xs font-serif italic text-gold-burnished border-b border-gold-burnished/30 hover:border-gold-burnished flex items-center gap-1.5"
            >
              Consult Care Concierge <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side accordions */}
        <div className="md:col-span-8 space-y-3">
          {pillars.map((p, idx) => {
            const isActive = activePillar === idx;
            return (
              <div 
                key={idx}
                onClick={() => setActivePillar(idx)}
                className={`p-5 rounded-sm border transition-all text-left cursor-pointer ${
                  isActive 
                    ? "bg-white border-gold-burnished/30 shadow-sm" 
                    : "bg-white/40 border-espresso/5 hover:border-espresso/20"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase tracking-wider text-gold-burnished font-semibold">{p.badge}</span>
                    <h4 className="text-sm font-serif font-bold text-espresso">{p.title}</h4>
                  </div>
                  <span className="text-[9px] font-mono text-espresso/45">{p.stat}</span>
                </div>
                
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-[11px] text-espresso/70 leading-relaxed font-light mt-3 pt-3 border-t border-espresso/5">
                        {p.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>

      {/* 4. THE CURATOR'S SPOTLIGHTS */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="text-left space-y-1">
            <span className="text-[8px] tracking-widest text-gold-burnished uppercase font-bold block">Signature Releases</span>
            <h3 className="text-2xl font-serif text-espresso">Master Craft Highlights</h3>
          </div>
          <button
            onClick={() => onNavigate("shop")}
            className="text-[10px] tracking-widest uppercase text-gold-burnished border-b border-gold-burnished/20 hover:border-gold-burnished font-semibold"
          >
            Explore Whole Catalog →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSpotlights.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-espresso/5 rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div className="h-56 bg-alabaster overflow-hidden relative">
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-103 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-espresso text-white text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-xs">
                  ${prod.price}
                </span>
              </div>
              <div className="p-5 text-left space-y-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-serif font-bold text-espresso truncate">{prod.name}</h4>
                  <span className="text-[9px] text-gold-burnished uppercase tracking-wider block font-medium">{prod.leatherType}</span>
                </div>
                <p className="text-[11px] text-espresso/60 leading-relaxed font-light line-clamp-2">
                  {prod.description}
                </p>
                <div className="flex gap-2 pt-2 border-t border-espresso/5">
                  <button
                    onClick={() => onSelectProduct(prod)}
                    className="flex-1 py-1.5 bg-white border border-espresso/15 hover:border-espresso text-espresso text-[9px] uppercase tracking-wider font-semibold rounded-xs transition-colors"
                  >
                    Customize Monogram
                  </button>
                  <button
                    onClick={() => {
                      onSelectProduct(prod);
                      onNavigate("vault");
                    }}
                    className="py-1.5 px-3 bg-espresso hover:bg-gold-burnished text-white text-[9px] uppercase rounded-xs transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. INTERACTIVE CLIENT LEDGER (GUESTBOOK) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-espresso/5 rounded-sm overflow-hidden shadow-xs p-6 md:p-8">
        
        {/* Left column: Submit note */}
        <form onSubmit={handlePostGuestbook} className="lg:col-span-5 space-y-4 text-left self-center">
          <div className="space-y-1.5">
            <span className="text-[8px] tracking-[0.2em] uppercase text-gold-burnished font-bold block">The Atelier Ledger</span>
            <h3 className="text-xl font-serif text-espresso">Sign Our Guestbook</h3>
            <p className="text-xs text-espresso/60 leading-relaxed font-light">
              We highly value the global family of collectors. Leave a note, tell our craftsmen which pieces you own, or send greetings to Florence.
            </p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[8px] uppercase tracking-wider text-espresso/50 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  className="w-full bg-alabaster border border-espresso/10 rounded-sm py-2 px-3 text-xs focus:outline-none focus:border-gold-burnished text-espresso"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-wider text-espresso/50 mb-1">Your City / Region</label>
                <input
                  type="text"
                  required
                  value={newGuestLocation}
                  onChange={(e) => setNewGuestLocation(e.target.value)}
                  className="w-full bg-alabaster border border-espresso/10 rounded-sm py-2 px-3 text-xs focus:outline-none focus:border-gold-burnished text-espresso"
                />
              </div>
            </div>

            <div>
              <label className="block text-[8px] uppercase tracking-wider text-espresso/50 mb-1">A Greeting for the Craftsmen</label>
              <textarea
                required
                rows={3}
                placeholder="I recently customized a Saffiano wallet in cognac foil..."
                value={newGuestMsg}
                onChange={(e) => setNewGuestMsg(e.target.value)}
                className="w-full bg-alabaster border border-espresso/10 rounded-sm py-2 px-3 text-xs focus:outline-none focus:border-gold-burnished text-espresso placeholder:text-espresso/30 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-espresso hover:bg-gold-burnished text-white text-[9px] tracking-widest uppercase font-semibold rounded-sm transition-colors flex items-center justify-center gap-2"
            >
              Sign the Digital Ledger <BookOpen className="w-3.5 h-3.5" />
            </button>

            {guestSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] text-green-700 bg-green-50 border border-green-200 p-2 text-center rounded-sm"
              >
                ✓ Your signature has been penned into the Florentine archive. Thank you.
              </motion.div>
            )}
          </div>
        </form>

        {/* Right column: Ledger feed */}
        <div className="lg:col-span-7 space-y-4 max-h-[380px] overflow-y-auto pr-2">
          <span className="text-[8px] tracking-[0.2em] uppercase text-espresso/40 font-bold block text-left">Live Ledger Signatures</span>
          <div className="space-y-3">
            {guestbook.map((entry) => (
              <div key={entry.id} className="bg-alabaster p-4 rounded-sm space-y-2 border border-espresso/5 text-left">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-serif font-bold text-espresso">{entry.name}</span>
                  <span className="text-[8px] text-espresso/40 font-mono">{entry.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-gold-burnished font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{entry.location}</span>
                </div>
                <p className="text-[11px] text-espresso/70 leading-relaxed font-light font-serif italic">
                  "{entry.message}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
