import { Product, Category } from "../types";

export const LUXURY_PRODUCTS: Product[] = [
  {
    id: "prod-briefcase-01",
    name: "The Torvani Executive Briefcase",
    description: "A masterclass in functional elegance. Handcrafted from premium French Vachetta leather that develops a magnificent amber patina over decades. Accented with sand-casted solid brass hardware.",
    category: Category.BAG,
    leatherType: "French Vachetta",
    price: 1850,
    stock: 7,
    images: ["/assets/briefcase.png"],
    baseColor: "#3d2314", // Deep Cognac/Espresso
    createdAt: "2026-01-15T00:00:00Z",
    nfcDetails: {
      serialNumber: "CT-VACH-8801",
      craftsmanName: "Matteo Torvani",
      stitchDate: "May 12, 2026",
      leatherOrigin: "Tuscany, Italy",
      tanneryName: "Conceria Walpier"
    }
  },
  {
    id: "prod-tote-01",
    name: "The Atelier Slouchy Tote",
    description: "Unstructured sophistication. Crafted in supple pebble-grain full-grain calfskin, offering a relaxed silhouette while maintaining a commanding presence. Features raw suede lining.",
    category: Category.BAG,
    leatherType: "Pebble-Grain Calfskin",
    price: 1420,
    stock: 12,
    images: ["/assets/tote.png"],
    baseColor: "#1a1210", // Dark Espresso
    createdAt: "2026-02-10T00:00:00Z",
    nfcDetails: {
      serialNumber: "CT-CALF-9912",
      craftsmanName: "Sandro Moretti",
      stitchDate: "June 24, 2026",
      leatherOrigin: "Lyon, France",
      tanneryName: "Tanneries Haas"
    }
  },
  {
    id: "prod-messenger-01",
    name: "The Saddle Crossbody Messenger",
    description: "Inspired by equestrian heritage. This bag features structured, architectural lines carved from durable English Bridle leather, sewn with heavy linen threads using the time-honored saddle stitch.",
    category: Category.BAG,
    leatherType: "English Bridle",
    price: 1150,
    stock: 5,
    images: ["/assets/messenger.png"],
    baseColor: "#543310", // Cognac
    createdAt: "2026-03-01T00:00:00Z",
    nfcDetails: {
      serialNumber: "CT-BRID-4422",
      craftsmanName: "Guillaume Laurent",
      stitchDate: "March 18, 2026",
      leatherOrigin: "Walsall, England",
      tanneryName: "J&E Sedgwick"
    }
  },
  {
    id: "prod-wallet-01",
    name: "The Torvani Slim Fold",
    description: "An ultra-thin, highly functional credit card companion. Created from cross-hatched, scratch-resistant Saffiano leather. Designed for the cosmopolitan traveler.",
    category: Category.WALLET,
    leatherType: "Saffiano",
    price: 390,
    stock: 25,
    images: ["/assets/wallet.png"],
    baseColor: "#111111", // Pitch Black
    createdAt: "2026-03-15T00:00:00Z",
    nfcDetails: {
      serialNumber: "CT-SAFF-1052",
      craftsmanName: "Elena Rossi",
      stitchDate: "July 01, 2026",
      leatherOrigin: "Florence, Italy",
      tanneryName: "Conceria Stefania"
    }
  },
  {
    id: "prod-belt-01",
    name: "The Sovereign Bridle Belt",
    description: "A signature statement. Single-bend English Bridle leather finished with a burnished edge, paired with an individually polished solid brass buckle that catches evening gala lights beautifully.",
    category: Category.BELT,
    leatherType: "English Bridle",
    price: 320,
    stock: 18,
    images: ["/assets/belt.png"],
    baseColor: "#331d0f", // Dark Brown
    createdAt: "2026-04-05T00:00:00Z",
    nfcDetails: {
      serialNumber: "CT-BRID-3081",
      craftsmanName: "Matteo Torvani",
      stitchDate: "April 29, 2026",
      leatherOrigin: "Walsall, England",
      tanneryName: "J&E Sedgwick"
    }
  },
  {
    id: "prod-exotic-01",
    name: "The Limited Ostrich Cardholder",
    description: "An exclusive drop. Made from selected South African Ostrich hide with distinct, elegant quill patterns. Hand-painted edges with real gold-leaf accents.",
    category: Category.ACCESSORY,
    leatherType: "Ostrich Leather",
    price: 680,
    stock: 3, // Rare/Limited drop!
    images: ["https://images.unsplash.com/photo-1627124718515-e23e7102dbdb?auto=format&fit=crop&w=800&q=80"],
    baseColor: "#8b5a2b", // Golden Tan
    createdAt: "2026-05-18T00:00:00Z",
    nfcDetails: {
      serialNumber: "CT-OSTR-003",
      craftsmanName: "Matteo Torvani",
      stitchDate: "June 10, 2026",
      leatherOrigin: "Oudtshoorn, South Africa",
      tanneryName: "Klein Karoo Tannery"
    }
  },
  {
    id: "prod-duffle-01",
    name: "The Weekender Duffle Bag",
    description: "Your ultimate travel companion. A spacious holdall crafted in sturdy double-tanned Vachetta leather with side reinforcement straps and premium metal feet.",
    category: Category.BAG,
    leatherType: "French Vachetta",
    price: 2100,
    stock: 5,
    images: ["https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80"],
    baseColor: "#4a2c11", // Raw umber
    createdAt: "2026-06-01T00:00:00Z",
    nfcDetails: {
      serialNumber: "CT-DUFF-1201",
      craftsmanName: "Sandro Moretti",
      stitchDate: "June 15, 2026",
      leatherOrigin: "Tuscany, Italy",
      tanneryName: "Conceria Walpier"
    }
  },
  {
    id: "prod-wallet-02",
    name: "The Florentine Zip Wallet",
    description: "A secure and elegant zip-around wallet featuring twelve hand-aligned card slots, lined with pure raw silk and fine grained calfskin lining.",
    category: Category.WALLET,
    leatherType: "Pebble-Grain Calfskin",
    price: 450,
    stock: 14,
    images: ["https://images.unsplash.com/photo-1627124718515-e23e7102dbdb?auto=format&fit=crop&w=800&q=80"],
    baseColor: "#24150b", // Deep chestnut
    createdAt: "2026-05-20T00:00:00Z",
    nfcDetails: {
      serialNumber: "CT-ZIP-8290",
      craftsmanName: "Elena Rossi",
      stitchDate: "May 25, 2026",
      leatherOrigin: "Lyon, France",
      tanneryName: "Tanneries Haas"
    }
  },
  {
    id: "prod-wallet-03",
    name: "The Minimalist Card Sleeve",
    description: "Ultra-compact and elegant sleeve crafted from scratch-resistant Epsom Calfskin. Holds four cards and folded notes with minimal bulk.",
    category: Category.WALLET,
    leatherType: "Epsom Calfskin",
    price: 280,
    stock: 30,
    images: ["https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80"],
    baseColor: "#1d2d44", // Navy Blue
    createdAt: "2026-06-10T00:00:00Z",
    nfcDetails: {
      serialNumber: "CT-SLEEVE-142",
      craftsmanName: "Elena Rossi",
      stitchDate: "June 12, 2026",
      leatherOrigin: "Florence, Italy",
      tanneryName: "Conceria Stefania"
    }
  },
  {
    id: "prod-belt-02",
    name: "The Dress Calfskin Belt",
    description: "A refined belt crafted from premium French Box-Calf with a subtle satin finish, rounded edges, and an exquisite silver-palladium finished buckle.",
    category: Category.BELT,
    leatherType: "French Box-Calf",
    price: 340,
    stock: 12,
    images: ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80"],
    baseColor: "#0f0f0f", // Jet Black
    createdAt: "2026-06-15T00:00:00Z",
    nfcDetails: {
      serialNumber: "CT-CALF-3281",
      craftsmanName: "Guillaume Laurent",
      stitchDate: "June 20, 2026",
      leatherOrigin: "Lyon, France",
      tanneryName: "Tanneries Haas"
    }
  },
  {
    id: "prod-jacket-01",
    name: "The Atelier Lambskin Cafe Racer",
    description: "The ultimate sartorial outerwear. Hand-selected, exceptionally soft Italian Lambskin that molds to your silhouette. Silk-lined interior and hand-polished gunmetal Swiss zippers.",
    category: Category.JACKET,
    leatherType: "Italian Lambskin",
    price: 2450,
    stock: 4,
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"],
    baseColor: "#1f1412", // Espresso Brown
    createdAt: "2026-04-18T00:00:00Z",
    nfcDetails: {
      serialNumber: "CT-RACER-091",
      craftsmanName: "Matteo Torvani",
      stitchDate: "May 05, 2026",
      leatherOrigin: "Tuscany, Italy",
      tanneryName: "Conceria Walpier"
    }
  },
  {
    id: "prod-jacket-02",
    name: "The Shearling Bomber Jacket",
    description: "Immersive warmth and architectural form. Double-faced Spanish Merino wool shearling with hand-painted leather bindings. Thick plush wool interior with a robust weather-resistant finish.",
    category: Category.JACKET,
    leatherType: "Spanish Merino Shearling",
    price: 3200,
    stock: 2,
    images: ["https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80"],
    baseColor: "#cfb591", // Desert Sand/Merino Camel
    createdAt: "2026-05-01T00:00:00Z",
    nfcDetails: {
      serialNumber: "CT-SHEAR-103",
      craftsmanName: "Sandro Moretti",
      stitchDate: "May 20, 2026",
      leatherOrigin: "Zaragoza, Spain",
      tanneryName: "Inpelsa"
    }
  },
  {
    id: "prod-jacket-03",
    name: "The Classic Suede Trench Coat",
    description: "An elegant, fluid drape crafted from premium velvet-touch French Suede. Featuring structured double-breasted horn buttons, epaulets, and a customized buckled waist belt.",
    category: Category.JACKET,
    leatherType: "French Suede",
    price: 2900,
    stock: 3,
    images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80"],
    baseColor: "#c29e6c", // Suede Tan
    createdAt: "2026-05-15T00:00:00Z",
    nfcDetails: {
      serialNumber: "CT-TRENCH-441",
      craftsmanName: "Guillaume Laurent",
      stitchDate: "May 28, 2026",
      leatherOrigin: "Lyon, France",
      tanneryName: "Tanneries Haas"
    }
  }
];
