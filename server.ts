import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { LUXURY_PRODUCTS } from "./src/data/products";
import { Category, Status, Order, PatinaRecord, StyleProfile, Product } from "./src/types";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to JSON persistence file in container
const DB_FILE = path.join(process.cwd(), "database.json");

// Define local DB interface
interface LocalDB {
  users: Record<string, {
    id: string;
    email: string;
    name: string | null;
    styleProfile: StyleProfile | null;
    wishlist: string[];
  }>;
  orders: Order[];
  patinaRecords: PatinaRecord[];
  products?: Product[];
}

// Initial DB state
const initialDBState: LocalDB = {
  users: {
    "qcquantumclimb@gmail.com": {
      id: "usr-001",
      email: "qcquantumclimb@gmail.com",
      name: "Calvino Guest",
      styleProfile: null,
      wishlist: []
    }
  },
  orders: [],
  patinaRecords: [
    {
      id: "pat-01",
      userId: "usr-001",
      userName: "Alexander Vance",
      productName: "The Torvani Executive Briefcase",
      productId: "prod-briefcase-01",
      imageUrl: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80",
      yearsOld: 3,
      notes: "Carried across 14 countries. The English Bridle leather has developed a stunning espresso patina and a glass-like sheen on the handle. The saddle stitches remain flawless.",
      createdAt: "2026-07-10T12:00:00Z"
    },
    {
      id: "pat-02",
      userId: "usr-002",
      userName: "Isabella Sterling",
      productName: "The Atelier Slouchy Tote",
      productId: "prod-tote-01",
      imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
      yearsOld: 1,
      notes: "The French calfskin has softened into an incredibly luxurious drape. The color has rich, nuanced variations under sunlight.",
      createdAt: "2026-07-12T15:30:00Z"
    }
  ]
};

// Helper to read database
function getDB(): LocalDB {
  let db: LocalDB;
  if (!fs.existsSync(DB_FILE)) {
    db = { ...initialDBState, products: LUXURY_PRODUCTS };
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    return db;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    db = JSON.parse(raw);
    if (!db.products || db.products.length === 0) {
      db.products = LUXURY_PRODUCTS;
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    }
    return db;
  } catch (e) {
    console.error("Failed to parse DB, resetting", e);
    db = { ...initialDBState, products: LUXURY_PRODUCTS };
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    return db;
  }
}

// Helper to save database
function saveDB(db: LocalDB) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Initialize Gemini client (server-side only, secure)
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      }
    }
  });
} else {
  console.warn("⚠️ GEMINI_API_KEY is missing. AI Style Recommendations will fall back to local rule-based system.");
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// 1. Retrieve all premium products
app.get("/api/products", (req, res) => {
  const db = getDB();
  res.json({ products: db.products || LUXURY_PRODUCTS });
});

// 2. Validate/Verify NFC Authenticity
app.get("/api/nfc/verify/:serial", (req, res) => {
  const { serial } = req.params;
  const db = getDB();
  const productsList = db.products || LUXURY_PRODUCTS;
  const product = productsList.find(p => p.nfcDetails?.serialNumber === serial);
  
  if (!product) {
    return res.status(404).json({
      verified: false,
      message: "Security certificate signature mismatch. Counterfeit warning."
    });
  }

  res.json({
    verified: true,
    product: {
      name: product.name,
      leatherType: product.leatherType,
      category: product.category
    },
    certificate: {
      serialNumber: product.nfcDetails?.serialNumber,
      craftsman: product.nfcDetails?.craftsmanName,
      stitchDate: product.nfcDetails?.stitchDate,
      origin: product.nfcDetails?.leatherOrigin,
      tannery: product.nfcDetails?.tanneryName,
      status: "AUTHENTIC / REGISTERED OWNERSHIP",
      hash: `SHA256:7c2f82c...${serial}`
    }
  });
});

// 2.5 Admin Shop Inventory CRUD endpoints
app.post("/api/admin/products", (req, res) => {
  const productData = req.body;
  if (!productData.id || !productData.name || !productData.price) {
    return res.status(400).json({ error: "Missing required fields (id, name, price)" });
  }

  const db = getDB();
  if (!db.products) db.products = [...LUXURY_PRODUCTS];

  const existingIndex = db.products.findIndex(p => p.id === productData.id);
  if (existingIndex > -1) {
    // Update existing
    db.products[existingIndex] = {
      ...db.products[existingIndex],
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock ?? 5)
    };
  } else {
    // Add new
    db.products.push({
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock ?? 5),
      createdAt: new Date().toISOString()
    });
  }

  saveDB(db);
  res.json({ success: true, products: db.products });
});

app.delete("/api/admin/products/:id", (req, res) => {
  const { id } = req.params;
  const db = getDB();
  if (!db.products) db.products = [...LUXURY_PRODUCTS];

  db.products = db.products.filter(p => p.id !== id);
  saveDB(db);
  res.json({ success: true, products: db.products });
});

app.post("/api/admin/products/reset", (req, res) => {
  const db = getDB();
  db.products = [...LUXURY_PRODUCTS];
  saveDB(db);
  res.json({ success: true, products: db.products });
});

// 3. Style Profile & Onboarding endpoints
app.post("/api/user/profile", (req, res) => {
  const { email, name, preferredColors, preferredStyle, seasonalInterests } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const db = getDB();
  const userId = db.users[email]?.id || `usr-${Date.now()}`;

  const styleProfile: StyleProfile = {
    id: `prof-${Date.now()}`,
    userId,
    preferredColors: preferredColors || [],
    preferredStyle: preferredStyle || "Minimalist",
    seasonalInterests: seasonalInterests || [],
    onboardingCompleted: true
  };

  db.users[email] = {
    id: userId,
    email,
    name: name || db.users[email]?.name || "Luxury Patron",
    styleProfile,
    wishlist: db.users[email]?.wishlist || []
  };

  saveDB(db);
  res.json({ user: db.users[email] });
});

// Get user profile
app.get("/api/user/profile/:email", (req, res) => {
  const { email } = req.params;
  const db = getDB();
  const user = db.users[email];
  if (!user) {
    return res.status(404).json({ error: "User profile not found" });
  }
  res.json({ user });
});

// 4. Weather Simulation API (Support custom global luxury destinations)
app.get("/api/weather", (req, res) => {
  const city = (req.query.city as string) || "Paris";
  
  // Real or mock weather profiles optimized for high-end styling
  const DESTINATIONS: Record<string, { weather: string; temp: number; humidity: number; desc: string }> = {
    "London": { weather: "Rainy", temp: 14, humidity: 88, desc: "An atmospheric London drizzle. Perfect for Saffiano scratch resistance and weather-resistant lining." },
    "Paris": { weather: "Clear", temp: 21, humidity: 45, desc: "A crisp evening walk down Avenue Montaigne. Excellent environment for rich French Calfskin." },
    "Milan": { weather: "Sunny", temp: 26, humidity: 38, desc: "Brilliant sunshine over Piazza del Duomo. Highlights the deep, glossy shine of hand-painted English Bridle." },
    "Tokyo": { weather: "Overcast", temp: 19, humidity: 65, desc: "A moody, architectural skyline in Ginza. Complements structural geometry and minimalist matte hardware." },
    "Aspen": { weather: "Chilly", temp: 4, humidity: 75, desc: "Snowy alpine air in Colorado. Call for high-nourishment organic beeswax conditioning." },
    "St. Tropez": { weather: "Sunny", temp: 31, humidity: 40, desc: "Warm ocean breezes along the French Riviera. Pairs perfectly with light Tan Ostrich leather and slouchy totes." }
  };

  const current = DESTINATIONS[city] || DESTINATIONS["Paris"];
  res.json({ city, ...current });
});

// 5. Bespoke Gemini-powered AI Recommendation Engine
app.post("/api/recommendations", async (req, res) => {
  const { styleProfile, weather, city, browsingHistory } = req.body;

  const stylePref = styleProfile?.preferredStyle || "Minimalist";
  const colorsPref = styleProfile?.preferredColors?.join(", ") || "Espresso, Burnished Gold, Charcoal";
  const weatherCond = weather?.weather || "Clear";
  const temp = weather?.temp || 21;
  const humidity = weather?.humidity || 40;

  const db = getDB();
  const activeProducts = db.products || LUXURY_PRODUCTS;

  const prompt = `
    You are the elite "Digital Personal Shopper & Care Concierge" for Calvino Torvani, an ultra-luxury atelier.
    We handcraft leather products of exceptional quality.
    
    User Style Profile:
    - Preferred Style: ${stylePref}
    - Favorite Tones: ${colorsPref}
    - Location: ${city || "Paris"}
    - Current Climate: ${weatherCond}, ${temp}°C, Humidity ${humidity}%
    - Browsing/Purchase History: ${browsingHistory || "None"}
    
    Inventory:
    ${JSON.stringify(activeProducts, null, 2)}

    Tasks:
    1. Select the top 1 or 2 products from our inventory that represent a flawless, personalized look for today's weather and style profile.
    2. Write a highly sophisticated, brief styling advice (under 120 words). Keep the tone elegant, poetic, and highly knowledgeable ("Quiet Luxury" brand style).
    3. Generate a "Care Concierge Reminder" based on the current humidity (${humidity}%). (e.g., if too dry, remind to apply wax; if rainy, warn against water marks and recommend a Saffiano protective guard).

    Format your output strictly as a JSON object with this schema:
    {
      "recommendedProductIds": ["prod-briefcase-01"],
      "stylingNarrative": "A bespoke narrative describing why this piece aligns with their style and today's weather...",
      "careAdvice": "A professional tip from our workshop based on today's local climate."
    }
  `;

  // Fallback local rule recommendations in case Gemini key isn't provided
  const getLocalFallback = () => {
    let recs = ["prod-briefcase-01"];
    let narrative = "To complement your refined aesthetic, our atelier recommends the Torvani Executive Briefcase. The hand-painted burnished edges and organic leather are suited to today's elegant weather.";
    let care = "Keep your fine leather away from direct damp areas today. Gently buff with a microfiber cloth to maintain its glow.";

    if (weatherCond === "Rainy" || weatherCond === "Overcast") {
      recs = ["prod-wallet-01", "prod-tote-01"];
      narrative = "Given today's wet weather, our scratch-resistant, tightly-grained Saffiano Slim Fold and Pebble-Grain Calfskin Atelier Tote offer the perfect blend of luxurious protection and functional elegance.";
      care = "With humidity at ${humidity}%, consider applying our waterproof organic leather spray. Buff lightly.";
    } else if (stylePref === "Architectural" || stylePref === "Minimalist") {
      recs = ["prod-wallet-01", "prod-belt-01"];
      narrative = "Your clean, minimalist tastes demand structural perfection. The Sovereign Bridle Belt and Saffiano Cardholder focus entirely on the pure geometry of quiet luxury.";
    } else if (stylePref === "Vintage") {
      recs = ["prod-messenger-01", "prod-briefcase-01"];
      narrative = "Our English Bridle Crossbody Messenger highlights standard saddle stitching, evoking equestrian tradition that gains beautiful character over time.";
    }

    return { recommendedProductIds: recs, stylingNarrative: narrative, careAdvice: care };
  };

  if (!ai) {
    return res.json(getLocalFallback());
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "The product IDs that match the styling criteria."
            },
            stylingNarrative: {
              type: Type.STRING,
              description: "An elegant, bespoke style narrative explaining the recommendation."
            },
            careAdvice: {
              type: Type.STRING,
              description: "A tailored workshop conditioning tip matching the climate humidity."
            }
          },
          required: ["recommendedProductIds", "stylingNarrative", "careAdvice"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err) {
    console.error("Gemini recommendation failure, falling back:", err);
    res.json(getLocalFallback());
  }
});

// 5.5 Bespoke Chatbot API using requested low-latency model
app.post("/api/chat", async (req, res) => {
  const { email, messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  const db = getDB();
  const user = db.users[email] || { name: "Alexander Vance", styleProfile: { preferredStyle: "Minimalist", preferredColors: ["Espresso", "Cognac"] } };
  const userName = user.name || "Alexander Vance";
  const preferredStyle = user.styleProfile?.preferredStyle || "Minimalist";
  const preferredColors = user.styleProfile?.preferredColors?.join(", ") || "Espresso, Cognac";

  const activeProducts = db.products || LUXURY_PRODUCTS;

  const systemInstruction = `
    You are "Matteo", the Chief Leather Conservator and Stylist for the Calvino Torvani Digital Atelier.
    The Calvino Torvani brand is built on "Quiet Luxury" — we do not shout; we whisper. Our tone is exquisite, polite, poetically detailed, highly professional, and welcoming. We care deeply about:
    - The protein structure of fine aniline leathers.
    - 45-degree hand-sewn linen saddle-stitch techniques.
    - Hot-foil monogramming and traditional Florentine edge-painting.
    - The beautiful, honeyed evolution of "The Patina Journey".

    You are talking to:
    - Name: ${userName}
    - Style Preference: ${preferredStyle}
    - Color Preference: ${preferredColors}

    Our exclusive product catalog:
    ${JSON.stringify(activeProducts, null, 2)}

    Provide helpful advice about:
    1. Product styling matching their style profile (${preferredStyle}).
    2. Conditioning and cleaning premium leather (recommending pH-balanced cleaners, organic beeswax, avoiding synthetic spray, etc.).
    3. Explaining our NFC authenticity shield, which is a microchip embedded beneath the leather lining of every item. It holds the serial key, craftsman name, origin, and lifetime warranty details.
    4. Navigating the app (The Collection Vault to customize monograms and lighting, lookbooks, care concierge climate logs, and NFC scanner tab).

    Remember: Keep responses under 130 words to maintain a highly exclusive, crisp, low-latency, and refined conversation. Never use bold exclamation marks or cheesy marketing slang. Speak with standard European poise and deep artisanal authority.
  `;

  // Fallback if AI isn't available
  const getChatFallback = (lastUserMsg: string) => {
    const text = lastUserMsg.toLowerCase();
    if (text.includes("care") || text.includes("clean") || text.includes("condition")) {
      return "Greetings from our Florence workshop. To care for your fine Calvino Torvani calfskin, always use our organic beeswax balm rather than synthetic sprays. Gently work it in with standard chamois in circular motions every six months.";
    }
    if (text.includes("nfc") || text.includes("authentic") || text.includes("shield")) {
      return "Every authentic Calvino Torvani artifact features a microchip stitched under the lining. It holds a unique serial code, its craftsman's name, and the tannery source. You can scan it under our NFC Authenticity tab.";
    }
    if (text.includes("style") || text.includes("look") || text.includes("match")) {
      return `To complement your ${preferredStyle} preference, our atelier recommends looking at the Sovereign Bridle Belt or the Saffiano Cardholder. Their clean geometries embody true quiet luxury.`;
    }
    return `Greetings, ${userName}. I am Matteo, your personal atelier guardian. Whether you wish to discuss leather protein structures, find the perfect complement to your ${preferredStyle} style, or verify an NFC signature, I am at your service.`;
  };

  if (!ai) {
    const lastMsg = messages[messages.length - 1]?.content || "";
    return res.json({ reply: getChatFallback(lastMsg) });
  }

  try {
    // Format messages for @google/genai SDK
    // SDK expects content objects like: { role: 'user' | 'model', parts: [{ text: string }] }
    const formattedContents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite", // Low-latency requested model!
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text || "I apologize, my attention was momentarily diverted. How can I assist you in our atelier today?" });
  } catch (err) {
    console.error("Gemini Chat failure, falling back:", err);
    const lastMsg = messages[messages.length - 1]?.content || "";
    res.json({ reply: getChatFallback(lastMsg) });
  }
});

// 6. Orders and Checkout
app.post("/api/orders", (req, res) => {
  const { email, items, total, shippingOption, monogramInitials, monogramFoil, giftNote } = req.body;
  if (!email || !items || !total) {
    return res.status(400).json({ error: "Missing required order fields" });
  }

  const db = getDB();
  const newOrder: Order = {
    id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId: db.users[email]?.id || "usr-guest",
    items,
    total,
    status: Status.PROCESSING,
    shippingOption: shippingOption || "STANDARD",
    monogramInitials,
    monogramFoil,
    giftNote,
    createdAt: new Date().toISOString()
  };

  db.orders.push(newOrder);
  saveDB(db);

  res.json({ success: true, order: newOrder });
});

// Retrieve orders
app.get("/api/orders/:email", (req, res) => {
  const { email } = req.params;
  const db = getDB();
  const userId = db.users[email]?.id;
  if (!userId) {
    return res.json({ orders: [] });
  }
  const userOrders = db.orders.filter(o => o.userId === userId);
  res.json({ orders: userOrders });
});

// 7. Patina Journey Uploads
app.post("/api/patina", (req, res) => {
  const { email, userName, productName, productId, imageUrl, yearsOld, notes } = req.body;
  if (!productId || !notes) {
    return res.status(400).json({ error: "Product name and story description required." });
  }

  const db = getDB();
  const newPatina: PatinaRecord = {
    id: `pat-${Date.now()}`,
    userId: db.users[email]?.id || "usr-guest",
    userName: userName || "Atelier Patron",
    productName: productName || "Calvino Torvani Piece",
    productId,
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80",
    yearsOld: Number(yearsOld) || 1,
    notes,
    createdAt: new Date().toISOString()
  };

  db.patinaRecords.unshift(newPatina); // Newest first
  saveDB(db);

  res.json({ success: true, patina: newPatina });
});

// Retrieve patina records
app.get("/api/patina", (req, res) => {
  const db = getDB();
  res.json({ patinaRecords: db.patinaRecords });
});

// -------------------------------------------------------------
// VITE OR STATIC SERVING MIDDLEWARE
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Calvino Torvani Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
