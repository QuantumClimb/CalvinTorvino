import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product, Category, NFCDetails } from "../types";
import { 
  Package, DollarSign, Tag, Archive, Plus, 
  Trash2, Edit3, RefreshCw, X, ShieldCheck, 
  Layers, Search, Check, Image as ImageIcon 
} from "lucide-react";

interface AtelierManagerProps {
  products: Product[];
  onRefreshProducts: () => void;
}

export default function AtelierManager({ products, onRefreshProducts }: AtelierManagerProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState<Category>(Category.BAG);
  const [formLeatherType, setFormLeatherType] = useState("");
  const [formPrice, setFormPrice] = useState(0);
  const [formStock, setFormStock] = useState(5);
  const [formBaseColor, setFormBaseColor] = useState("#8b4513");
  const [formImage, setFormImage] = useState("");

  // NFC Form States
  const [nfcSerial, setNfcSerial] = useState("");
  const [nfcCraftsman, setNfcCraftsman] = useState("Matteo Torvani");
  const [nfcStitchDate, setNfcStitchDate] = useState("");
  const [nfcOrigin, setNfcOrigin] = useState("Tuscany, Italy");
  const [nfcTannery, setNfcTannery] = useState("Conceria Walpier");

  // Load product into form for editing or reset form for new
  const openAddForm = () => {
    setEditingProduct(null);
    setFormId(`prod-custom-${Date.now().toString().slice(-4)}`);
    setFormName("");
    setFormDesc("");
    setFormCategory(Category.BAG);
    setFormLeatherType("French Calfskin");
    setFormPrice(1200);
    setFormStock(8);
    setFormBaseColor("#1e1412");
    setFormImage("");
    
    // NFC Defaults
    setNfcSerial(`CT-CUST-${Math.floor(1000 + Math.random() * 9000)}`);
    setNfcCraftsman("Matteo Torvani");
    setNfcStitchDate(new Date().toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }));
    setNfcOrigin("Tuscany, Italy");
    setNfcTannery("Conceria Walpier");
    
    setIsFormOpen(true);
  };

  const openEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setFormId(prod.id);
    setFormName(prod.name);
    setFormDesc(prod.description);
    setFormCategory(prod.category);
    setFormLeatherType(prod.leatherType);
    setFormPrice(prod.price);
    setFormStock(prod.stock);
    setFormBaseColor(prod.baseColor);
    setFormImage(prod.images?.[0] || "");

    // NFC details
    setNfcSerial(prod.nfcDetails?.serialNumber || "");
    setNfcCraftsman(prod.nfcDetails?.craftsmanName || "Matteo Torvani");
    setNfcStitchDate(prod.nfcDetails?.stitchDate || "");
    setNfcOrigin(prod.nfcDetails?.leatherOrigin || "Tuscany, Italy");
    setNfcTannery(prod.nfcDetails?.tanneryName || "Conceria Walpier");

    setIsFormOpen(true);
  };

  // Submit product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formId || formPrice <= 0) return;

    setIsSubmitting(true);
    const defaultImage = formImage || "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80";

    const payload = {
      id: formId,
      name: formName,
      description: formDesc,
      category: formCategory,
      leatherType: formLeatherType,
      price: Number(formPrice),
      stock: Number(formStock),
      baseColor: formBaseColor,
      images: [defaultImage],
      nfcDetails: {
        serialNumber: nfcSerial,
        craftsmanName: nfcCraftsman,
        stitchDate: nfcStitchDate,
        leatherOrigin: nfcOrigin,
        tanneryName: nfcTannery
      }
    };

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsFormOpen(false);
        onRefreshProducts();
      }
    } catch (err) {
      console.error("Failed to submit product", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product
  const handleDelete = async (id: string) => {
    if (!confirm("Are you certain you wish to retire this luxury piece from our active catalogue?")) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        onRefreshProducts();
      }
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  // Reset to defaults
  const handleResetCatalog = async () => {
    if (!confirm("Warning: This will restore the workspace's default, curated Florentine product list. All custom products or price changes will be restored to defaults.")) return;
    setIsResetting(true);
    try {
      const response = await fetch("/api/admin/products/reset", {
        method: "POST"
      });
      if (response.ok) {
        onRefreshProducts();
      }
    } catch (err) {
      console.error("Failed to reset products", err);
    } finally {
      setIsResetting(false);
    }
  };

  // Filtered list
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.id.toLowerCase().includes(search.toLowerCase()) ||
                          p.leatherType.toLowerCase().includes(search.toLowerCase()) ||
                          p.nfcDetails?.serialNumber.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate stats
  const totalCatalogValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const totalItemsCount = products.reduce((sum, p) => sum + p.stock, 0);
  const uniqueProductsCount = products.length;

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-espresso/5 pb-6">
        <div>
          <span className="text-[10px] tracking-[0.2em] text-gold-burnished uppercase font-semibold block">Administrative Console</span>
          <h2 className="text-4xl font-serif text-espresso leading-tight">Atelier Store Manager</h2>
          <p className="text-xs text-espresso/60 font-light mt-1">
            Manage your boutique's luxury inventory, customize pricing tiers, configure product tags, and issue NFC Authenticity security signatures.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleResetCatalog}
            disabled={isResetting}
            className="px-4 py-2 border border-espresso/10 hover:border-espresso/30 text-espresso text-xs uppercase tracking-widest flex items-center gap-2 transition-colors rounded-sm disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
            Reset Defaults
          </button>
          <button
            onClick={openAddForm}
            className="px-4 py-2 bg-espresso hover:bg-gold-burnished text-alabaster text-xs uppercase tracking-widest flex items-center gap-2 transition-all rounded-sm shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add Custom Piece
          </button>
        </div>
      </div>

      {/* STATS TILES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-espresso/5 p-6 rounded-sm flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-espresso/40 font-semibold block">Bespoke Vault Valuation</span>
            <span className="text-2xl font-serif text-espresso">${totalCatalogValue.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 bg-gold-burnished/5 rounded-full flex items-center justify-center text-gold-burnished">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-espresso/5 p-6 rounded-sm flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-espresso/40 font-semibold block">Total Pieces in Workshop</span>
            <span className="text-2xl font-serif text-espresso">{totalItemsCount} pieces</span>
          </div>
          <div className="w-10 h-10 bg-espresso/5 rounded-full flex items-center justify-center text-espresso">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-espresso/5 p-6 rounded-sm flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-espresso/40 font-semibold block">Discreet Catalogue Lines</span>
            <span className="text-2xl font-serif text-espresso">{uniqueProductsCount} lines</span>
          </div>
          <div className="w-10 h-10 bg-emerald-500/5 rounded-full flex items-center justify-center text-emerald-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* CONTROLS BAR */}
      <div className="bg-white border border-espresso/5 p-4 rounded-sm flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-espresso/30" />
          <input
            type="text"
            placeholder="Search by name, serial, leather..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-alabaster border border-espresso/10 rounded-sm py-2 pl-9 pr-4 text-xs font-light focus:outline-none focus:border-gold-burnished transition-colors"
          />
        </div>

        {/* Categories Tab selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {["ALL", ...Object.values(Category)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-[9px] tracking-widest uppercase transition-all rounded-xs border font-medium ${
                selectedCategory === cat 
                  ? "bg-espresso border-espresso text-alabaster" 
                  : "bg-transparent border-espresso/10 text-espresso/60 hover:border-espresso/30 hover:text-espresso"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS DIRECTORY */}
      <div className="bg-white border border-espresso/5 rounded-sm overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-alabaster border-b border-espresso/5 text-[9px] tracking-widest uppercase text-espresso/40 font-semibold">
                <th className="py-4 px-6">Artifact</th>
                <th className="py-4 px-6">Ref ID</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Leather Type</th>
                <th className="py-4 px-6 text-right">Price</th>
                <th className="py-4 px-6 text-center">Stock</th>
                <th className="py-4 px-6">NFC Serial</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso/5">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-espresso/40 italic">
                    No matching luxury pieces found in the current catalogue filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-alabaster/25 transition-colors text-xs font-light">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={prod.images?.[0] || "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=100&q=80"} 
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-cover rounded-xs border border-espresso/10 bg-alabaster shadow-xs"
                        />
                        <div className="space-y-0.5">
                          <span className="font-serif text-espresso font-semibold block">{prod.name}</span>
                          <span className="text-[10px] text-espresso/40 block max-w-xs truncate">{prod.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-[10px] text-espresso/60">{prod.id}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 bg-gold-burnished/10 text-gold-burnished text-[9px] tracking-widest uppercase rounded-xs font-medium">
                        {prod.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-espresso/70">{prod.leatherType}</td>
                    <td className="py-4 px-6 text-right font-serif font-semibold text-gold-burnished text-sm">
                      ${prod.price.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2 py-0.5 text-[10px] rounded-xs font-mono font-medium ${
                        prod.stock === 0 
                          ? "bg-red-500/10 text-red-600" 
                          : prod.stock <= 2 
                            ? "bg-amber-500/10 text-amber-600" 
                            : "bg-emerald-500/10 text-emerald-600"
                      }`}>
                        {prod.stock} left
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-espresso/60">
                        <ShieldCheck className="w-3.5 h-3.5 text-gold-burnished" />
                        {prod.nfcDetails?.serialNumber || "No Chip"}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => openEditForm(prod)}
                          className="p-1.5 hover:bg-gold-burnished/10 rounded-sm text-espresso/60 hover:text-gold-burnished transition-all"
                          title="Edit pricing and specifications"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-1.5 hover:bg-red-500/10 rounded-sm text-espresso/60 hover:text-red-500 transition-all"
                          title="Retire from catalogue"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT/ADD MODAL OVERLAY */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 bg-espresso/40 backdrop-blur-xs flex justify-end z-50">
            {/* Slide-over panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              {/* Form header */}
              <div className="p-6 border-b border-espresso/5 bg-alabaster flex justify-between items-center">
                <div>
                  <span className="text-[9px] tracking-widest text-gold-burnished uppercase font-semibold block">Workshop Registrar</span>
                  <h3 className="text-xl font-serif text-espresso">
                    {editingProduct ? "Revise Artifact Profile" : "Register Custom Piece"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 hover:bg-espresso/5 rounded-full transition-colors text-espresso/40 hover:text-espresso"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  {/* ID */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-widest text-espresso/50 font-semibold">Catalogue Ref ID</label>
                    <input
                      type="text"
                      disabled={!!editingProduct}
                      value={formId}
                      onChange={(e) => setFormId(e.target.value)}
                      placeholder="e.g. prod-bag-09"
                      className="w-full bg-transparent border-b border-espresso/15 py-1 text-xs focus:outline-none focus:border-gold-burnished font-mono disabled:text-espresso/30 transition-colors"
                      required
                    />
                  </div>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-widest text-espresso/50 font-semibold">Artifact Name</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="The Sovereign Slouchy Tote"
                      className="w-full bg-transparent border-b border-espresso/15 py-1 text-xs focus:outline-none focus:border-gold-burnished transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-widest text-espresso/50 font-semibold">Sophisticated Narrative</label>
                  <textarea
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Handcrafted from organic vegetable calfskin. Designed for..."
                    rows={2}
                    className="w-full bg-transparent border-b border-espresso/15 py-1 text-xs focus:outline-none focus:border-gold-burnished transition-colors resize-none leading-relaxed font-light"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-widest text-espresso/50 font-semibold">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as Category)}
                      className="w-full bg-transparent border-b border-espresso/15 py-1 text-xs focus:outline-none focus:border-gold-burnished transition-colors cursor-pointer"
                    >
                      {Object.values(Category).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-widest text-espresso/50 font-semibold">Price ($ USD)</label>
                    <input
                      type="number"
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      placeholder="1800"
                      className="w-full bg-transparent border-b border-espresso/15 py-1 text-xs font-serif font-bold text-gold-burnished focus:outline-none focus:border-gold-burnished transition-colors"
                      min={1}
                      required
                    />
                  </div>

                  {/* Stock */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-widest text-espresso/50 font-semibold">Workshop Stock</label>
                    <input
                      type="number"
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      placeholder="5"
                      className="w-full bg-transparent border-b border-espresso/15 py-1 text-xs focus:outline-none focus:border-gold-burnished transition-colors"
                      min={0}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Leather Type */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-widest text-espresso/50 font-semibold">Leather Class</label>
                    <input
                      type="text"
                      value={formLeatherType}
                      onChange={(e) => setFormLeatherType(e.target.value)}
                      placeholder="French Vachetta / Saffiano"
                      className="w-full bg-transparent border-b border-espresso/15 py-1 text-xs focus:outline-none focus:border-gold-burnished transition-colors"
                      required
                    />
                  </div>

                  {/* Base Color Swatch Hex */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-widest text-espresso/50 font-semibold">Base Swatch Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formBaseColor}
                        onChange={(e) => setFormBaseColor(e.target.value)}
                        className="w-6 h-6 border-0 p-0 rounded-xs bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formBaseColor}
                        onChange={(e) => setFormBaseColor(e.target.value)}
                        placeholder="#123456"
                        className="w-full bg-transparent border-b border-espresso/15 py-1 text-xs font-mono focus:outline-none focus:border-gold-burnished transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Unsplash Image */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-widest text-espresso/50 font-semibold">Atelier Photograph URL (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-transparent border-b border-espresso/15 py-1 text-xs focus:outline-none focus:border-gold-burnished transition-colors"
                    />
                  </div>
                </div>

                {/* NFC SECURITY BLOCK */}
                <div className="bg-alabaster p-4 border border-gold-burnished/10 space-y-4">
                  <div className="flex items-center gap-2 border-b border-gold-burnished/10 pb-2">
                    <ShieldCheck className="w-4 h-4 text-gold-burnished" />
                    <span className="text-[10px] uppercase tracking-widest text-gold-burnished font-semibold">NFC Security Signature Chip</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* NFC Serial */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] uppercase tracking-widest text-espresso/50 font-medium">Authenticity Serial</label>
                      <input
                        type="text"
                        value={nfcSerial}
                        onChange={(e) => setNfcSerial(e.target.value)}
                        placeholder="CT-VACH-8801"
                        className="w-full bg-transparent border-b border-espresso/15 py-1 text-xs focus:outline-none focus:border-gold-burnished font-mono transition-colors"
                        required
                      />
                    </div>

                    {/* Craftsman Name */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] uppercase tracking-widest text-espresso/50 font-medium">Assigned Artisan</label>
                      <input
                        type="text"
                        value={nfcCraftsman}
                        onChange={(e) => setNfcCraftsman(e.target.value)}
                        placeholder="Matteo Torvani"
                        className="w-full bg-transparent border-b border-espresso/15 py-1 text-xs focus:outline-none focus:border-gold-burnished transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Stitch Date */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] uppercase tracking-widest text-espresso/50 font-medium">Stitch Completion</label>
                      <input
                        type="text"
                        value={nfcStitchDate}
                        onChange={(e) => setNfcStitchDate(e.target.value)}
                        placeholder="June 12, 2026"
                        className="w-full bg-transparent border-b border-espresso/15 py-1 text-xs focus:outline-none focus:border-gold-burnished transition-colors"
                        required
                      />
                    </div>

                    {/* Leather Origin */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] uppercase tracking-widest text-espresso/50 font-medium">Material Origin</label>
                      <input
                        type="text"
                        value={nfcOrigin}
                        onChange={(e) => setNfcOrigin(e.target.value)}
                        placeholder="Tuscany, Italy"
                        className="w-full bg-transparent border-b border-espresso/15 py-1 text-xs focus:outline-none focus:border-gold-burnished transition-colors"
                        required
                      />
                    </div>

                    {/* Tannery Name */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] uppercase tracking-widest text-espresso/50 font-medium">Certified Tannery</label>
                      <input
                        type="text"
                        value={nfcTannery}
                        onChange={(e) => setNfcTannery(e.target.value)}
                        placeholder="Conceria Walpier"
                        className="w-full bg-transparent border-b border-espresso/15 py-1 text-xs focus:outline-none focus:border-gold-burnished transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Form Footer actions inside sliding panel */}
                <div className="pt-6 border-t border-espresso/5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="w-1/3 py-3 border border-espresso/10 hover:border-espresso/30 text-espresso text-xs uppercase tracking-widest rounded-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-3 bg-espresso hover:bg-gold-burnished text-alabaster text-xs uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-40"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Saving Piece...
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Publish to Atelier
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
