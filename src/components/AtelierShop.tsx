import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product, Category } from "../types";
import { 
  Briefcase, 
  CreditCard, 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  Eye, 
  Plus, 
  Check, 
  ShieldCheck, 
  TrendingUp, 
  Info, 
  Maximize2,
  ChevronRight,
  User,
  ShoppingBag,
  RotateCcw
} from "lucide-react";

interface AtelierShopProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToBag: (product: Product, monogram: { initials: string; foil: "gold" | "silver" } | null) => void;
}

export default function AtelierShop({ products, onSelectProduct, onAddToBag }: AtelierShopProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(3500);
  const [selectedLeather, setSelectedLeather] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "newest">("newest");
  
  // Custom quick monogram preview state in shop
  const [quickMonogramId, setQuickMonogramId] = useState<string | null>(null);
  const [monogramInitials, setMonogramInitials] = useState<string>("");
  const [monogramFoil, setMonogramFoil] = useState<"gold" | "silver">("gold");
  const [addedItemSuccess, setAddedItemSuccess] = useState<string | null>(null);

  // Quick compare list
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareDrawer, setShowCompareDrawer] = useState<boolean>(false);

  // Detail Modal view
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Categories metadata with beautiful translations
  const categoryMeta = [
    { key: "ALL", label: "The Entire Atelier", icon: Sparkles, desc: "All current heirloom grade releases." },
    { key: Category.BAG, label: "Luggage & Bags", icon: Briefcase, desc: "Structured holdalls, slouchy totes & briefcases." },
    { key: Category.JACKET, label: "Sartorial Outerwear", icon: Sparkles, desc: "Extremely soft lambskins & heavy double-faced shearlings." },
    { key: Category.WALLET, label: "Fine Wallets", icon: CreditCard, desc: "Scratch-resistant saffiano and silk-lined card sleeves." },
    { key: Category.BELT, label: "Sovereign Belts", icon: Sparkles, desc: "Single-bend English bridle leather with sand-cast solid brass." },
    { key: Category.ACCESSORY, label: "Exotic Curios", icon: Sparkles, desc: "Limited series utilizing precious ostrich and gold-leaf details." }
  ];

  // Distinct leather types in catalog for filter
  const leatherTypes = useMemo(() => {
    const types = new Set<string>();
    products.forEach(p => {
      if (p.leatherType) types.add(p.leatherType);
    });
    return ["ALL", ...Array.from(types)];
  }, [products]);

  // Handle filtering
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== "ALL") {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.leatherType.toLowerCase().includes(q)
      );
    }

    // Filter by leather type
    if (selectedLeather !== "ALL") {
      result = result.filter(p => p.leatherType === selectedLeather);
    }

    // Filter by price
    result = result.filter(p => p.price <= maxPrice);

    // Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      // Sort by simulated custom sorting or id
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [products, selectedCategory, searchQuery, selectedLeather, maxPrice, sortBy]);

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter(x => x !== id));
    } else {
      if (compareIds.length >= 3) {
        alert("You may compare up to 3 atelier artifacts at once.");
        return;
      }
      setCompareIds([...compareIds, id]);
      setShowCompareDrawer(true);
    }
  };

  const executeQuickAdd = (product: Product) => {
    if (product.category === Category.BAG || product.category === Category.ACCESSORY || product.category === Category.WALLET) {
      // Trigger quick monogram config drawer
      setQuickMonogramId(product.id);
      setMonogramInitials("");
    } else {
      // Standard direct add for belts, jackets, etc.
      onAddToBag(product, null);
      setAddedItemSuccess(product.id);
      setTimeout(() => setAddedItemSuccess(null), 3000);
    }
  };

  const handleQuickMonogramSubmit = (product: Product) => {
    const monogram = monogramInitials.trim() !== "" 
      ? { initials: monogramInitials.toUpperCase().slice(0, 3), foil: monogramFoil }
      : null;
    
    onAddToBag(product, monogram);
    setQuickMonogramId(null);
    setAddedItemSuccess(product.id);
    setTimeout(() => setAddedItemSuccess(null), 3000);
  };

  // Luxury category icons helper
  const getCatIcon = (cat: Category) => {
    switch (cat) {
      case Category.BAG: return <Briefcase className="w-4 h-4 text-gold-burnished" />;
      case Category.WALLET: return <CreditCard className="w-4 h-4 text-gold-burnished" />;
      case Category.JACKET: return <Sparkles className="w-4 h-4 text-gold-burnished" />;
      case Category.BELT: return <Sparkles className="w-4 h-4 text-gold-burnished" />;
      default: return <Sparkles className="w-4 h-4 text-gold-burnished" />;
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Dynamic Announcement and Section Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <span className="text-[10px] tracking-[0.25em] text-gold-burnished uppercase font-semibold">Ready to Order Heirloom Standards</span>
        <h3 className="text-4xl font-serif text-espresso">The Atelier Leatherwork Shop</h3>
        <p className="text-xs text-espresso/60 leading-relaxed font-light">
          From full-length Spanish shearlings and masterfully draped French suede coats, to hand-waxed English bridle wallets and custom hot-foil monogrammed Vachetta briefcases.
        </p>
      </div>

      {/* CATEGORY SWIPER CHIPS */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-espresso/5 pb-6">
        {categoryMeta.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key as any)}
              className={`px-4 py-3 rounded-sm transition-all text-left flex items-center gap-3 border ${
                isSelected 
                  ? "bg-espresso border-espresso text-white shadow-sm" 
                  : "bg-white border-espresso/5 hover:border-espresso/30 text-espresso"
              }`}
            >
              <div className="p-1 rounded-xs bg-gold-burnished/10">
                <cat.icon className={`w-3.5 h-3.5 ${isSelected ? "text-gold-light" : "text-gold-burnished"}`} />
              </div>
              <div>
                <span className="text-[10px] tracking-wider uppercase font-semibold block">{cat.label}</span>
                <span className="text-[8px] opacity-60 font-light block hidden sm:inline">{cat.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* SEARCH AND ADVANCED FILTERS BAR */}
      <div className="bg-white border border-espresso/5 p-5 rounded-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-xs">
        
        {/* Search input */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-espresso/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search our catalog (e.g. Suede, Vachetta, Lambskin)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-alabaster border border-espresso/10 rounded-sm py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-gold-burnished text-espresso placeholder:text-espresso/30"
          />
        </div>

        {/* Leather material selection */}
        <div className="md:col-span-3">
          <label className="block text-[8px] uppercase tracking-wider text-espresso/40 font-semibold mb-1.5">Sartorial Leather</label>
          <select
            value={selectedLeather}
            onChange={(e) => setSelectedLeather(e.target.value)}
            className="w-full bg-alabaster border border-espresso/10 rounded-sm py-2 px-3 text-xs focus:outline-none focus:border-gold-burnished text-espresso font-light"
          >
            {leatherTypes.map(t => (
              <option key={t} value={t}>{t === "ALL" ? "All Master Hides" : t}</option>
            ))}
          </select>
        </div>

        {/* Price slider */}
        <div className="md:col-span-3 space-y-1">
          <div className="flex justify-between text-[8px] uppercase tracking-wider text-espresso/40 font-semibold">
            <span>Price ceiling</span>
            <span className="font-mono text-gold-burnished font-bold">${maxPrice}</span>
          </div>
          <input
            type="range"
            min={200}
            max={3500}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-gold-burnished bg-espresso/5 cursor-pointer h-1 rounded-lg"
          />
        </div>

        {/* Sorting options */}
        <div className="md:col-span-2">
          <label className="block text-[8px] uppercase tracking-wider text-espresso/40 font-semibold mb-1.5">Sort Atelier</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-alabaster border border-espresso/10 rounded-sm py-2 px-3 text-xs focus:outline-none focus:border-gold-burnished text-espresso font-light"
          >
            <option value="newest">Latest Releases</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

      </div>

      {/* PRODUCTS DISPLAY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredProducts.map((product) => {
            const isComparing = compareIds.includes(product.id);
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-espresso/5 rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group relative"
              >
                {/* Category Badge & Traceability Shield */}
                <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                  <span className="bg-espresso text-alabaster text-[8px] tracking-widest uppercase font-semibold px-2 py-1 rounded-xs flex items-center gap-1">
                    {getCatIcon(product.category)}
                    {product.category}
                  </span>
                  {product.nfcDetails && (
                    <span className="bg-gold-burnished/10 border border-gold-burnished/20 text-gold-burnished text-[8px] font-mono px-1.5 py-1 rounded-xs uppercase">
                      NFC Secured
                    </span>
                  )}
                </div>

                {/* Product Cover Photo with premium hover scale */}
                <div className="h-64 bg-alabaster overflow-hidden relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale opacity-95 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Hover Quick actions overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setDetailProduct(product)}
                      className="p-3 bg-white hover:bg-gold-burnished hover:text-white rounded-full transition-colors text-espresso shadow-lg"
                      title="Inspect Specifics"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="p-3 bg-white hover:bg-gold-burnished hover:text-white rounded-full transition-colors text-espresso shadow-lg"
                      title="Customize Monogram in the Vault"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card description details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="text-sm font-serif font-semibold text-espresso truncate group-hover:text-gold-burnished transition-colors">
                        {product.name}
                      </h4>
                      <span className="font-mono text-xs text-gold-burnished font-semibold">${product.price}</span>
                    </div>
                    <span className="block text-[9px] uppercase tracking-wider text-espresso/40">{product.leatherType}</span>
                    <p className="text-[11px] text-espresso/60 leading-relaxed font-light line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Material specification pills */}
                  <div className="flex gap-2 text-[9px] text-espresso/50 border-t border-espresso/5 pt-3">
                    <span className="bg-alabaster px-2 py-0.5 rounded-xs">Stock: {product.stock} units</span>
                    <span className="bg-alabaster px-2 py-0.5 rounded-xs">{product.nfcDetails?.leatherOrigin.split(",")[0] || "Italian Tannery"}</span>
                  </div>

                  {/* Action triggers */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => toggleCompare(product.id)}
                      className={`py-2 text-[8px] uppercase tracking-widest font-semibold border rounded-xs transition-colors ${
                        isComparing 
                          ? "bg-gold-burnished/10 border-gold-burnished text-gold-burnished" 
                          : "bg-transparent border-espresso/10 hover:border-espresso text-espresso/70"
                      }`}
                    >
                      {isComparing ? "✓ Comparing" : "Compare Specs"}
                    </button>
                    <button
                      onClick={() => executeQuickAdd(product)}
                      className={`py-2 text-[8px] uppercase tracking-widest font-semibold rounded-xs transition-all flex items-center justify-center gap-1 ${
                        addedItemSuccess === product.id 
                          ? "bg-green-600 text-white" 
                          : "bg-espresso hover:bg-gold-burnished text-white"
                      }`}
                    >
                      {addedItemSuccess === product.id ? (
                        <>
                          <Check className="w-3 h-3" /> Added
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" /> Quick Order
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <div className="col-span-full bg-white border border-espresso/5 p-16 text-center space-y-4 rounded-sm">
            <SlidersHorizontal className="w-10 h-10 text-espresso/20 mx-auto" />
            <div className="space-y-1">
              <h5 className="text-base font-serif text-espresso">No Matching Artifacts</h5>
              <p className="text-xs text-espresso/50 font-light">We do not currently have products matching your criteria in our Florence ledger.</p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchQuery("");
                setMaxPrice(3500);
                setSelectedLeather("ALL");
              }}
              className="text-xs uppercase tracking-widest font-semibold text-gold-burnished border-b border-gold-burnished/30 hover:border-gold-burnished"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* QUICK MONOGRAM MODAL DRAWER */}
      <AnimatePresence>
        {quickMonogramId && (() => {
          const product = products.find(p => p.id === quickMonogramId);
          if (!product) return null;
          return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-alabaster max-w-md w-full rounded-sm border border-gold-burnished/20 overflow-hidden shadow-2xl"
              >
                <div className="bg-espresso text-alabaster p-4 flex justify-between items-center border-b border-gold-burnished/20">
                  <span className="text-xs font-serif font-semibold">Gold-Foil Monogram Assistant</span>
                  <button onClick={() => setQuickMonogramId(null)} className="text-white hover:text-gold-burnished">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6 space-y-5">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] tracking-widest text-gold-burnished uppercase font-semibold">Custom Personalization</span>
                    <h4 className="text-lg font-serif text-espresso">{product.name}</h4>
                    <p className="text-xs text-espresso/60 font-light">
                      Would you like our master craftsman, Matteo Torvani, to hot-press a permanent hand-aligned foil monogram on the leather?
                    </p>
                  </div>

                  <div className="space-y-4 bg-white p-4 border border-espresso/5 rounded-xs">
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-espresso/50 mb-1">Initials (Up to 3 Letters)</label>
                      <input
                        type="text"
                        maxLength={3}
                        value={monogramInitials}
                        onChange={(e) => setMonogramInitials(e.target.value.toUpperCase())}
                        placeholder="e.g. AVV"
                        className="w-full bg-alabaster border-b border-espresso/20 py-2 text-center text-lg font-serif font-semibold tracking-widest focus:outline-none focus:border-gold-burnished"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-espresso/50 mb-1">Foil Type</label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setMonogramFoil("gold")}
                          className={`py-2 text-[10px] uppercase font-semibold border rounded-xs ${
                            monogramFoil === "gold" 
                              ? "bg-gold-burnished/10 border-gold-burnished text-gold-burnished" 
                              : "border-espresso/5 hover:border-espresso text-espresso/60"
                          }`}
                        >
                          ✨ Florentine Gold Leaf
                        </button>
                        <button
                          type="button"
                          onClick={() => setMonogramFoil("silver")}
                          className={`py-2 text-[10px] uppercase font-semibold border rounded-xs ${
                            monogramFoil === "silver" 
                              ? "bg-slate-200 border-slate-400 text-slate-700" 
                              : "border-espresso/5 hover:border-espresso text-espresso/60"
                          }`}
                        >
                          ❄ Classic Silver Foil
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleQuickMonogramSubmit(product)}
                      className="py-3 bg-white border border-espresso/10 hover:border-espresso text-espresso text-[10px] uppercase tracking-widest font-semibold rounded-xs"
                    >
                      Skip Personalization
                    </button>
                    <button
                      onClick={() => handleQuickMonogramSubmit(product)}
                      disabled={!monogramInitials}
                      className="py-3 bg-espresso hover:bg-gold-burnished text-white text-[10px] uppercase tracking-widest font-semibold rounded-xs disabled:opacity-40"
                    >
                      Apply Monogram
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* DETAIL MODAL VIEW */}
      <AnimatePresence>
        {detailProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white max-w-3xl w-full rounded-sm border border-gold-burnished/20 overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
            >
              {/* Image side */}
              <div className="h-72 md:h-full relative bg-alabaster">
                <img
                  src={detailProduct.images[0]}
                  alt={detailProduct.name}
                  className="w-full h-full object-cover grayscale opacity-90"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setDetailProduct(null)}
                  className="absolute top-4 left-4 p-2 bg-espresso hover:bg-gold-burnished text-white rounded-full md:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Specifics content side */}
              <div className="p-6 space-y-6 flex flex-col justify-between overflow-y-auto max-h-[500px] md:max-h-full">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-gold-burnished uppercase tracking-widest font-semibold block">{detailProduct.category} Catalog</span>
                      <h4 className="text-2xl font-serif font-bold text-espresso">{detailProduct.name}</h4>
                    </div>
                    <button onClick={() => setDetailProduct(null)} className="p-1 hover:text-gold-burnished hidden md:inline">
                      <X className="w-5 h-5 text-espresso/40 hover:text-espresso" />
                    </button>
                  </div>

                  <p className="text-xs text-espresso/70 leading-relaxed font-light font-serif italic">
                    "{detailProduct.description}"
                  </p>

                  <div className="border-t border-b border-espresso/5 py-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-espresso/50 font-light">Sartorial Leather Hide</span>
                      <span className="font-semibold">{detailProduct.leatherType}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-espresso/50 font-light">Valued Heritage Price</span>
                      <span className="font-semibold text-gold-burnished">${detailProduct.price}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-espresso/50 font-light">Florence Registry Stock</span>
                      <span className="font-semibold">{detailProduct.stock} units available</span>
                    </div>
                  </div>

                  {detailProduct.nfcDetails && (
                    <div className="bg-gold-burnished/5 border border-gold-burnished/15 p-4 rounded-sm space-y-2">
                      <span className="text-[9px] tracking-widest text-gold-burnished font-semibold block uppercase flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Hand-Stitched NFC Microchip Provenance
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-espresso/70 font-mono">
                        <div>
                          <span className="text-espresso/40 block">Serial Key</span>
                          <span className="font-semibold">{detailProduct.nfcDetails.serialNumber}</span>
                        </div>
                        <div>
                          <span className="text-espresso/40 block">Chief Craftsman</span>
                          <span className="font-semibold">{detailProduct.nfcDetails.craftsmanName}</span>
                        </div>
                        <div>
                          <span className="text-espresso/40 block">Tannery Origin</span>
                          <span className="font-semibold">{detailProduct.nfcDetails.tanneryName}</span>
                        </div>
                        <div>
                          <span className="text-espresso/40 block">Leather Source</span>
                          <span className="font-semibold">{detailProduct.nfcDetails.leatherOrigin}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-espresso/5">
                  <button
                    onClick={() => {
                      onSelectProduct(detailProduct);
                      setDetailProduct(null);
                    }}
                    className="py-3 bg-white border border-espresso hover:bg-espresso hover:text-white text-espresso text-[10px] uppercase tracking-widest font-semibold rounded-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Monogram Stage
                  </button>
                  <button
                    onClick={() => {
                      executeQuickAdd(detailProduct);
                      setDetailProduct(null);
                    }}
                    className="py-3 bg-espresso hover:bg-gold-burnished text-white text-[10px] uppercase tracking-widest font-semibold rounded-xs transition-colors"
                  >
                    Order Artifact
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPARISON DRAWER */}
      <AnimatePresence>
        {showCompareDrawer && compareIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gold-burnished/20 shadow-2xl z-40 max-h-[350px] overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-espresso/5 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-gold-burnished" />
                  <h5 className="text-xs uppercase tracking-widest font-semibold text-espresso">Artifact Comparison Atelier ({compareIds.length}/3)</h5>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setCompareIds([])}
                    className="text-[10px] uppercase tracking-wider text-espresso/40 hover:text-espresso"
                  >
                    Clear Comparison
                  </button>
                  <button 
                    onClick={() => setShowCompareDrawer(false)}
                    className="text-[10px] uppercase tracking-wider text-gold-burnished font-semibold"
                  >
                    Minimize Drawer
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {compareIds.map((id) => {
                  const prod = products.find(x => x.id === id);
                  if (!prod) return null;
                  return (
                    <div key={prod.id} className="border border-espresso/5 p-4 rounded-xs bg-alabaster/10 flex flex-col justify-between gap-3 relative">
                      <button
                        onClick={() => toggleCompare(prod.id)}
                        className="absolute top-2 right-2 p-1 bg-white border border-espresso/10 hover:border-espresso text-espresso/40 hover:text-espresso rounded-full transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded-sm border border-espresso/10 grayscale"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-[11px] font-serif font-semibold text-espresso block">{prod.name}</span>
                            <span className="text-[9px] text-gold-burnished font-mono font-bold">${prod.price}</span>
                          </div>
                        </div>

                        <div className="text-[10px] space-y-1 pt-2 border-t border-espresso/5">
                          <div className="flex justify-between">
                            <span className="text-espresso/45">Leather Hide:</span>
                            <span className="font-semibold">{prod.leatherType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-espresso/45">Origin:</span>
                            <span className="font-semibold text-espresso/80">{prod.nfcDetails?.leatherOrigin || "Italy"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-espresso/45">Craftsman:</span>
                            <span className="font-semibold text-espresso/80">{prod.nfcDetails?.craftsmanName || "Matteo Torvani"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-espresso/45">Stock Level:</span>
                            <span className="font-semibold text-espresso/80">{prod.stock} left</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-espresso/5">
                        <button
                          onClick={() => {
                            onSelectProduct(prod);
                            setShowCompareDrawer(false);
                          }}
                          className="py-1.5 text-[8px] tracking-widest uppercase bg-white border border-espresso text-espresso hover:bg-espresso hover:text-white rounded-xs transition-colors"
                        >
                          Customize
                        </button>
                        <button
                          onClick={() => {
                            executeQuickAdd(prod);
                          }}
                          className="py-1.5 text-[8px] tracking-widest uppercase bg-espresso hover:bg-gold-burnished text-white rounded-xs transition-colors"
                        >
                          Quick Order
                        </button>
                      </div>
                    </div>
                  );
                })}

                {compareIds.length < 3 && (
                  <div className="border border-dashed border-espresso/15 p-6 rounded-xs flex flex-col justify-center items-center text-center text-espresso/40">
                    <Plus className="w-5 h-5 mb-2 text-espresso/25" />
                    <span className="text-[10px] tracking-wider uppercase font-semibold">Select Another Artifact</span>
                    <span className="text-[9px] font-light max-w-[150px] mt-1">Pick items from the catalog above to compare side-by-side.</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Compact Close button wrapper
function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
