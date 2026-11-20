import { giftxDb, karellaDb } from "./firebase";
import type { Firestore } from "firebase/firestore";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StoreSection {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  color: string;
  /** Firestore collection names for this section */
  collections: {
    products: string;
    categories: string;
  };
}

export interface StoreConfig {
  slug: string;
  name: string;
  description: string;
  emoji: string;
  primaryColor: string;
  secondaryColor: string;
  primaryBg: string;
  /** Firebase db instance for this store */
  db: Firestore;
  /** One section = simple layout, two+ = tab layout */
  sections: StoreSection[];
  /** Firestore path to shop info (logoUrl, whatsapp) */
  settingsCollection: string;
  settingsDoc?: string;
  metadata: {
    title: string;
    description: string;
  };
}

// ─── Store Definitions ───────────────────────────────────────────────────────

export const STORES: Record<string, StoreConfig> = {
  giftx: {
    slug: "giftx",
    name: "Gift X",
    description: "ألعاب، هدايا، وإكسسوارات مختارة بعناية بأسعار تنافسية وتوصيل سريع",
    emoji: "🎁",
    primaryColor: "#F97316",
    secondaryColor: "#EF4444",
    primaryBg: "#FFF7ED",
    db: giftxDb,
    settingsCollection: "settings",
    sections: [
      {
        id: "giftarts",
        name: "Gift X",
        subtitle: "Gift Arts",
        emoji: "🎁",
        color: "#F97316",
        collections: { products: "gift_products", categories: "gift_categories" },
      },
      {
        id: "toysx",
        name: "Toys X",
        subtitle: "Children's Dreams",
        emoji: "🚗",
        color: "#EF4444",
        collections: { products: "products", categories: "categories" },
      },
    ],
    metadata: {
      title: "Gift X — ألعاب وهدايا مميزة",
      description: "تسوق أجمل الألعاب والهدايا والإكسسوارات بأسعار تنافسية وتوصيل سريع",
    },
  },

  karella: {
    slug: "karella",
    name: "Karella",
    description: "أقمشة ومفروشات راقية — جمّل بيتك بأفضل الخامات",
    emoji: "🛋️",
    primaryColor: "#8B5CF6",
    secondaryColor: "#EC4899",
    primaryBg: "#F5F3FF",
    db: karellaDb,
    settingsCollection: "settings",
    sections: [
      {
        id: "karella",
        name: "Karella",
        subtitle: "أقمشة ومفروشات",
        emoji: "🛋️",
        color: "#8B5CF6",
        collections: { products: "products", categories: "categories" },
      },
    ],
    metadata: {
      title: "Karella — أقمشة ومفروشات راقية",
      description: "أجود الأقمشة والمفروشات بأسعار تنافسية في مكادي والغردقة",
    },
  },
};

export function getStore(slug: string): StoreConfig | null {
  return STORES[slug] ?? null;
}

export function getAllStoreSlugs(): string[] {
  return Object.keys(STORES);
}
