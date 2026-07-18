import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product, StyleProfile, CartItem, Order, Category } from "./types";
import { LUXURY_PRODUCTS } from "./data/products";

// Component imports
import StyleQuiz from "./components/StyleQuiz";
import TheVault from "./components/TheVault";
import Lookbooks from "./components/Lookbooks";
import CareConcierge from "./components/CareConcierge";
import NFCScanner from "./components/NFCScanner";
import CheckoutModal from "./components/CheckoutModal";
import AtelierChatbot from "./components/AtelierChatbot";
import AtelierShop from "./components/AtelierShop";
import AtelierHome from "./components/AtelierHome";
import CalvinoTorvaniLogo from "./components/CalvinoTorvaniLogo";
import AtelierManager from "./components/AtelierManager";

import { ShoppingBag, Sparkles, Compass, ShieldCheck, Heart, User, Clock, ChevronRight } from "lucide-react";

export default function App() {
  const [email] = useState<string>("qcquantumclimb@gmail.com"); // Logged-in premium guest
  const [userName, setUserName] = useState<string>("Alexander Vance");
  const [userProfile, setUserProfile] = useState<StyleProfile | null>(null);
  
  // Custom dynamic workshop products
  const [products, setProducts] = useState<Product[]>(LUXURY_PRODUCTS);
  
  // UI Navigation states
  const [activeTab, setActiveTab] = useState<"home" | "shop" | "vault" | "lookbooks" | "concierge" | "nfc" | "admin">("home");
  const [selectedProduct, setSelectedProduct] = useState<Product>(LUXURY_PRODUCTS[0]);
  
  // Cart & Checkout states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  // Refresh products from backend database
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
          // Auto-select first product if currently selected is deleted or outdated
          const currentExists = data.products.some((p: Product) => p.id === selectedProduct.id);
          if (!currentExists) {
            setSelectedProduct(data.products[0]);
          } else {
            // Update selected product reference to get fresh prices/stock
            const freshRef = data.products.find((p: Product) => p.id === selectedProduct.id);
            if (freshRef) setSelectedProduct(freshRef);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch products on load", err);
    }
  };

  // 1. Fetch user profile from Express backend on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/user/profile/${email}`);
        if (response.ok) {
          const data = await response.json();
          if (data.user?.styleProfile) {
            setUserProfile(data.user.styleProfile);
            if (data.user.name) setUserName(data.user.name);
          }
        }
      } catch (err) {
        console.error("Failed to load backend profile on startup", err);
        // Load local fallback if database.json doesn't exist yet
        const local = localStorage.getItem(`ct_profile_${email}`);
        if (local) {
          setUserProfile(JSON.parse(local));
        }
      }
    };

    const fetchRecentOrders = async () => {
      try {
        const response = await fetch(`/api/orders/${email}`);
        if (response.ok) {
          const data = await response.json();
          setRecentOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Failed to fetch orders on start", err);
      }
    };

    fetchUserProfile();
    fetchRecentOrders();
    fetchProducts();
  }, [email]);

  // Handle successful quiz completion
  const handleQuizComplete = (profile: StyleProfile) => {
    setUserProfile(profile);
    localStorage.setItem(`ct_profile_${email}`, JSON.stringify(profile));
  };

  // Handle updates from interactive style controls
  const handleUpdateProfile = async (profile: StyleProfile) => {
    setUserProfile(profile);
    localStorage.setItem(`ct_profile_${email}`, JSON.stringify(profile));
    try {
      await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: userName,
          preferredColors: profile.preferredColors,
          preferredStyle: profile.preferredStyle,
          seasonalInterests: profile.seasonalInterests
        })
      });
    } catch (err) {
      console.error("Failed to update profile on backend:", err);
    }
  };

  // 2. Add to bag with custom initials
  const handleAddToBag = (product: Product, monogram: { initials: string; foil: "gold" | "silver" } | null) => {
    const item: CartItem = {
      product,
      quantity: 1,
      monogram: monogram || undefined
    };
    setCart([...cart, item]);
    setIsCartOpen(true);
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleNewOrder = (order: Order) => {
    setRecentOrders([order, ...recentOrders]);
  };

  // Dynamic aesthetic header welcome subtitle based on style selection
  const getSubTitleText = () => {
    if (!userProfile) return "Quiet Luxury Bespoke Atelier";
    return `${userProfile.preferredStyle} Line Architecture • Curated for ${userName}`;
  };

  // If style quiz onboarding isn't completed, lock UI to the Quiz consultant
  if (!userProfile) {
    return (
      <StyleQuiz
        email={email}
        onComplete={handleQuizComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-alabaster text-espresso relative flex flex-col justify-between selection:bg-gold-burnished/20 select-none pb-12">
      
      {/* Dynamic Ambient Background Aura */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#f4eede]/20 via-transparent to-transparent pointer-events-none" />

      {/* LUXURY TOP ANNOUNCEMENT BAR */}
      <div className="bg-espresso text-alabaster text-[9px] tracking-widest uppercase py-2 text-center border-b border-gold-burnished/25 relative z-20 flex justify-center items-center gap-1.5 font-medium">
        <Clock className="w-3 h-3 text-gold-burnished" /> White-Glove Hand Carriage Available on All Custom Orders • Florence Atelier
      </div>

      {/* CORE HEADER NAVIGATION */}
      <header className="sticky top-0 bg-alabaster/90 backdrop-blur-md border-b border-espresso/5 py-4 px-6 md:px-12 flex justify-between items-center z-30">
        <div className="space-y-0.5 cursor-pointer" onClick={() => setActiveTab("home")}>
          <CalvinoTorvaniLogo variant="compact" />
          <span className="text-[8px] tracking-[0.25em] uppercase text-gold-burnished block font-medium pl-11">
            {getSubTitleText()}
          </span>
        </div>

        {/* Global Nav Links */}
        <nav className="hidden md:flex gap-8">
          <button
            onClick={() => setActiveTab("home")}
            className={`text-[10px] tracking-widest uppercase transition-colors py-1.5 ${
              activeTab === "home" ? "text-gold-burnished border-b border-gold-burnished/40 font-semibold" : "text-espresso/60 hover:text-espresso"
            }`}
          >
            Atelier Home
          </button>
          <button
            onClick={() => setActiveTab("shop")}
            className={`text-[10px] tracking-widest uppercase transition-colors py-1.5 ${
              activeTab === "shop" ? "text-gold-burnished border-b border-gold-burnished/40 font-semibold" : "text-espresso/60 hover:text-espresso"
            }`}
          >
            Atelier Shop
          </button>
          <button
            onClick={() => setActiveTab("vault")}
            className={`text-[10px] tracking-widest uppercase transition-colors py-1.5 ${
              activeTab === "vault" ? "text-gold-burnished border-b border-gold-burnished/40 font-semibold" : "text-espresso/60 hover:text-espresso"
            }`}
          >
            The Collection Vault
          </button>
          <button
            onClick={() => setActiveTab("lookbooks")}
            className={`text-[10px] tracking-widest uppercase transition-colors py-1.5 ${
              activeTab === "lookbooks" ? "text-gold-burnished border-b border-gold-burnished/40 font-semibold" : "text-espresso/60 hover:text-espresso"
            }`}
          >
            Seasonal Lookbooks
          </button>
          <button
            onClick={() => setActiveTab("concierge")}
            className={`text-[10px] tracking-widest uppercase transition-colors py-1.5 ${
              activeTab === "concierge" ? "text-gold-burnished border-b border-gold-burnished/40 font-semibold" : "text-espresso/60 hover:text-espresso"
            }`}
          >
            Care & Patina Concierge
          </button>
          <button
            onClick={() => setActiveTab("nfc")}
            className={`text-[10px] tracking-widest uppercase transition-colors py-1.5 ${
              activeTab === "nfc" ? "text-gold-burnished border-b border-gold-burnished/40 font-semibold" : "text-espresso/60 hover:text-espresso"
            }`}
          >
            NFC Authenticity Shield
          </button>
        </nav>

        {/* Header Right Widgets */}
        <div className="flex items-center gap-3">
          {/* User Account / Profile button */}
          <div className="flex items-center gap-2 border-r border-espresso/10 pr-3">
            <User className="w-4 h-4 text-espresso/40" />
            <span className="text-[10px] uppercase tracking-widest font-medium text-espresso/70 hidden lg:inline">
              {userName}
            </span>
          </div>

          {/* Atelier Manager Toggle */}
          <button
            onClick={() => {
              setActiveTab(activeTab === "admin" ? "home" : "admin");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`p-1.5 rounded-sm border transition-all flex items-center gap-1 ${
              activeTab === "admin"
                ? "border-gold-burnished/40 bg-gold-burnished/10 text-gold-burnished font-semibold"
                : "border-espresso/10 hover:border-espresso/30 text-espresso/60 hover:text-espresso"
            }`}
            title="Atelier Manager Console"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[8px] uppercase tracking-widest pl-0.5">Manager</span>
          </button>

          {/* Cart Bag Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-1 hover:text-gold-burnished transition-colors flex items-center gap-1.5 group pl-1"
          >
            <ShoppingBag className="w-4 h-4 text-espresso group-hover:scale-105 transition-transform" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-gold-burnished text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* MOBILE TABS MENU */}
      <div className="md:hidden bg-alabaster-dark border-b border-espresso/5 grid grid-cols-6 gap-1 p-2 sticky top-[68px] z-20">
        <button
          onClick={() => setActiveTab("home")}
          className={`py-1.5 text-[8px] uppercase tracking-widest text-center ${
            activeTab === "home" ? "text-gold-burnished font-semibold" : "text-espresso/50"
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab("shop")}
          className={`py-1.5 text-[8px] uppercase tracking-widest text-center ${
            activeTab === "shop" ? "text-gold-burnished font-semibold" : "text-espresso/50"
          }`}
        >
          Shop
        </button>
        <button
          onClick={() => setActiveTab("vault")}
          className={`py-1.5 text-[8px] uppercase tracking-widest text-center ${
            activeTab === "vault" ? "text-gold-burnished font-semibold" : "text-espresso/50"
          }`}
        >
          Vault
        </button>
        <button
          onClick={() => setActiveTab("lookbooks")}
          className={`py-1.5 text-[8px] uppercase tracking-widest text-center ${
            activeTab === "lookbooks" ? "text-gold-burnished font-semibold" : "text-espresso/50"
          }`}
        >
          Lookbooks
        </button>
        <button
          onClick={() => setActiveTab("concierge")}
          className={`py-1.5 text-[8px] uppercase tracking-widest text-center ${
            activeTab === "concierge" ? "text-gold-burnished font-semibold" : "text-espresso/50"
          }`}
        >
          Concierge
        </button>
        <button
          onClick={() => setActiveTab("nfc")}
          className={`py-1.5 text-[8px] uppercase tracking-widest text-center ${
            activeTab === "nfc" ? "text-gold-burnished font-semibold" : "text-espresso/50"
          }`}
        >
          NFC
        </button>
      </div>

      {/* MAIN CONTAINER CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-12 py-8 md:py-12 space-y-16">
        
        <AnimatePresence mode="wait">
          
          {/* TAB -1: THE WELCOME PORTAL */}
          {activeTab === "home" && (
            <motion.div
              key="home-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              <AtelierHome
                products={products}
                userProfile={userProfile!}
                onUpdateProfile={handleUpdateProfile}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onSelectProduct={(prod) => {
                  setSelectedProduct(prod);
                  setActiveTab("vault");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                userName={userName}
              />
            </motion.div>
          )}
          
          {/* TAB 0: THE ATELIER SHOP */}
          {activeTab === "shop" && (
            <motion.div
              key="shop-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              <AtelierShop
                products={products}
                onSelectProduct={(prod) => {
                  setSelectedProduct(prod);
                  setActiveTab("vault");
                }}
                onAddToBag={handleAddToBag}
              />
            </motion.div>
          )}

          {/* TAB 1: THE COLLECTION VAULT CUSTOMIZER */}
          {activeTab === "vault" && (
            <motion.div
              key="vault-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              
              {/* Introduction */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-espresso/5 pb-6">
                <div className="space-y-1.5">
                  <span className="text-[10px] tracking-[0.2em] text-gold-burnished uppercase font-semibold">The Core Artifacts</span>
                  <h2 className="text-4xl font-serif text-espresso leading-none">The Vault Customizer</h2>
                  <p className="text-xs text-espresso/60 font-light leading-relaxed max-w-xl">
                    Configure your bespoke hot-stamped monogram, inspect our 45-degree hand-sewn linen saddle-stitch under extreme macro-lens magnification, and select custom lighting states.
                  </p>
                </div>
                
                {/* Micro Details badge */}
                <div className="flex items-center gap-2 self-start md:self-auto text-[10px] tracking-widest uppercase bg-gold-burnished/5 text-gold-burnished border border-gold-burnished/10 py-1.5 px-3 rounded-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Traceable Italian Tanneries
                </div>
              </div>

              {/* Product Customizer Stage */}
              <TheVault
                product={selectedProduct}
                onAddToBag={handleAddToBag}
              />

              {/* Interactive Shelf Gallery Selection */}
              <div className="space-y-6 pt-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs uppercase tracking-widest text-espresso/40 font-semibold">Bespoke Artifact Catalog</span>
                  <span className="text-[10px] italic text-gold-burnished font-light">Select model to custom design</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {products.map((prod) => {
                    const isSelected = selectedProduct.id === prod.id;
                    return (
                      <div
                        key={prod.id}
                        onClick={() => setSelectedProduct(prod)}
                        className={`p-4 border cursor-pointer transition-all duration-300 rounded-sm text-center flex flex-col justify-between items-center bg-white ${
                          isSelected 
                            ? "border-gold-burnished shadow-xs" 
                            : "border-espresso/5 hover:border-espresso/30"
                        }`}
                      >
                        {/* Leather swatch dot */}
                        <div className="w-10 h-10 rounded-full border border-espresso/10 flex items-center justify-center mb-3 shadow-inner" style={{ backgroundColor: prod.baseColor }}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />}
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-medium text-espresso block truncate max-w-[120px]">{prod.name.replace("The Torvani ", "").replace("The Torvino ", "").replace("The Sovereign ", "")}</span>
                          <span className="text-[9px] text-espresso/45 uppercase tracking-wider block font-mono">{prod.leatherType}</span>
                          <span className="text-[11px] font-serif text-gold-burnished block font-semibold">${prod.price}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: CURATED LOOKBOOKS */}
          {activeTab === "lookbooks" && (
            <motion.div
              key="lookbooks-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              <Lookbooks
                products={products}
                onSelectProduct={(prod) => {
                  setSelectedProduct(prod);
                  setActiveTab("vault");
                }}
              />
            </motion.div>
          )}

          {/* TAB 3: CARE & PATINA CONCIERGE */}
          {activeTab === "concierge" && (
            <motion.div
              key="concierge-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              <CareConcierge
                email={email}
                userName={userName}
                products={products}
              />
            </motion.div>
          )}

          {/* TAB 4: NFC SCANNER */}
          {activeTab === "nfc" && (
            <motion.div
              key="nfc-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              <NFCScanner
                registeredSerials={products.map(p => p.nfcDetails?.serialNumber || "")}
              />
            </motion.div>
          )}

          {/* TAB 5: WORKSHOP MANAGER CONSOLE */}
          {activeTab === "admin" && (
            <motion.div
              key="admin-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              <AtelierManager
                products={products}
                onRefreshProducts={fetchProducts}
              />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* EXQUISITE LUXURY BRAND FOOTER */}
      <footer className="border-t border-espresso/5 mt-16 pt-12 max-w-7xl w-full mx-auto px-6 md:px-12 text-center space-y-6">
        <div className="flex justify-center py-4">
          <CalvinoTorvaniLogo variant="full" iconSize={60} />
        </div>
        <p className="text-xs text-espresso/40 font-light max-w-lg mx-auto leading-relaxed">
          Matteo Torvani, Master Craftsman, personally inspects and stamps every hide under full aniline mineral tannery certifications. We promise our heirloom stitch work will last generations.
        </p>
        <div className="text-[10px] text-espresso/30 pt-4 font-mono uppercase tracking-widest">
          © 2026 CALVINO TORVANI ATELIER S.p.A. ALL PROVENANCE SECURED.
        </div>
      </footer>

      {/* CHECKOUT CART MODAL DRAWER */}
      <CheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        email={email}
        onClearCart={handleClearCart}
        onNewOrder={handleNewOrder}
      />

      {/* FLOATING ARTISANAL CHAT CONCIERGE */}
      <AtelierChatbot
        email={email}
        userName={userName}
      />

    </div>
  );
}
