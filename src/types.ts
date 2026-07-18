export enum Category {
  BAG = "BAG",
  BELT = "BELT",
  WALLET = "WALLET",
  ACCESSORY = "ACCESSORY",
  JACKET = "JACKET"
}

export enum Status {
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  styleProfile?: StyleProfile | null;
  orders?: Order[];
  wishlist?: string[]; // Product IDs
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  leatherType: string; // Full-grain, Top-grain, Saffiano, Vachetta, Ostrich
  price: number;
  stock: number;
  images: string[];
  baseColor: string; // Hex code for rendering
  secondaryColor?: string; // Hex for interior or accents
  model3dUrl?: string;
  createdAt: string;
  nfcDetails?: NFCDetails;
}

export interface NFCDetails {
  serialNumber: string;
  craftsmanName: string;
  stitchDate: string;
  leatherOrigin: string; // e.g. "Tuscany, Italy"
  tanneryName: string;
}

export interface StyleProfile {
  id: string;
  userId: string;
  preferredColors: string[];
  preferredStyle: string; // Minimalist, Bold, Vintage, Architectural
  seasonalInterests: string[];
  onboardingCompleted: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: Status;
  shippingOption: "STANDARD" | "WHITE_GLOVE";
  monogramInitials?: string;
  monogramFoil?: "gold" | "silver";
  giftNote?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  monogram?: {
    initials: string;
    foil: "gold" | "silver";
  };
}

export interface PatinaRecord {
  id: string;
  userId: string;
  userName: string;
  productName: string;
  productId: string;
  imageUrl: string;
  yearsOld: number;
  notes: string;
  createdAt: string;
}

export interface CareLog {
  id: string;
  productId: string;
  productName: string;
  action: string; // "Conditioned", "Waxed", "Cleaned"
  date: string;
  nextDueDate: string;
}
