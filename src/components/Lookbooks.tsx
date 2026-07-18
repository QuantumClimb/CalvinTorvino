import React from "react";
import { Product } from "../types";
import { Sparkles, ShoppingBag, ArrowUpRight } from "lucide-react";

interface LookbooksProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function Lookbooks({ products, onSelectProduct }: LookbooksProps) {
  const lookbooks = [
    {
      id: "look-corporate",
      title: "The Autumn Corporate Look",
      season: "Fall / Winter Capsule",
      tagline: "Structured lines and robust English Bridle designed to command respect in boardrooms.",
      apparel: [
        "Sartorial Camel-Wool Double-Breasted Overcoat",
        "Tailored Charcoal Flannel Two-Piece Suit",
        "Hand-welted Dark Espresso Oxford Brogues"
      ],
      accessoryIds: ["prod-briefcase-01", "prod-belt-01"],
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "look-riviera",
      title: "The Riviera Summer Escapes",
      season: "Spring / Summer Capsule",
      tagline: "Relaxed unstructured forms paired with precious exotics for seaside lounges.",
      apparel: [
        "Unstructured Bleached Italian Linen Blazer",
        "Off-White Pleated Cotton Trousers",
        "Bespoke Suede Driving Moccasins"
      ],
      accessoryIds: ["prod-tote-01", "prod-exotic-01"],
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <span className="text-[10px] tracking-widest text-gold-burnished uppercase font-semibold">Curated Pairings</span>
        <h3 className="text-3xl font-serif text-espresso">Seasonal Capsule Lookbooks</h3>
        <p className="text-xs text-espresso/60 font-light leading-relaxed max-w-xl">
          Quiet luxury is the art of effortless styling. We coordinate our finest leather work with recommended sartorial clothing elements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {lookbooks.map((look) => {
          // Find matching products
          const lookAccessories = products.filter((p) => look.accessoryIds.includes(p.id));

          return (
            <div
              key={look.id}
              className="bg-white border border-espresso/5 rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-500"
            >
              {/* Cover Photo */}
              <div className="h-64 relative overflow-hidden bg-alabaster">
                <img
                  src={look.image}
                  alt={look.title}
                  className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:scale-[1.02] transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6">
                  <span className="text-[10px] tracking-widest uppercase text-gold-light font-medium">{look.season}</span>
                  <h4 className="text-2xl font-serif text-white">{look.title}</h4>
                </div>
              </div>

              {/* Lookbook details */}
              <div className="p-6 space-y-6 flex-1 flex flex-col justify-between bg-alabaster/20">
                <div className="space-y-4">
                  <p className="text-xs text-espresso/70 leading-relaxed font-light italic">
                    "{look.tagline}"
                  </p>

                  {/* Apparel Pieces List */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-widest text-espresso/40 font-semibold block">Sartorial Apparel Pieces</span>
                    <ul className="space-y-1.5 pl-3 border-l border-gold-burnished/30">
                      {look.apparel.map((item, idx) => (
                        <li key={idx} className="text-xs text-espresso/80 font-light flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-gold-burnished" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Paired Calvino Torvani Accessories */}
                <div className="space-y-3 pt-4 border-t border-espresso/5">
                  <span className="text-[9px] uppercase tracking-widest text-gold-burnished font-semibold block flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Paired Atelier Accessories
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {lookAccessories.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => onSelectProduct(p)}
                        className="bg-white border border-espresso/5 p-3 rounded-sm flex justify-between items-center cursor-pointer hover:border-gold-burnished transition-colors group"
                      >
                        <div>
                          <span className="text-xs font-serif font-semibold text-espresso block group-hover:text-gold-burnished transition-colors">
                            {p.name.replace("The Torvani ", "").replace("The Torvino ", "").replace("The Sovereign ", "")}
                          </span>
                          <span className="text-[10px] text-gold-burnished font-mono mt-0.5 block">${p.price}</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-espresso/30 group-hover:text-gold-burnished group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
