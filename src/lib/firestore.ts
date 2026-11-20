import { getDocs, collection, doc, getDoc } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import type { Product } from "./types";
import type { StoreConfig, StoreSection } from "./stores.config";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getName(name: unknown): string {
  if (typeof name === "string") return name;
  if (typeof name === "object" && name !== null) {
    const n = name as Record<string, string>;
    return n.ar || n.en || "";
  }
  return "";
}

function isActive(data: Record<string, unknown>): boolean {
  if (data.status === "active") return true;
  if (data.status !== undefined) return false;
  return data.isActive !== false;
}

function mapProduct(
  d: { id: string; data(): Record<string, unknown> },
  catMap: Record<string, string>,
  emoji: string
): Product {
  const data = d.data();
  return {
    id: d.id,
    name: getName(data.name),
    description: getName(data.description) || undefined,
    price:
      (data.offerPrice as number) ||
      (data.regularPrice as number) ||
      (data.price as number) ||
      0,
    regularPrice: (data.regularPrice as number) || undefined,
    category:
      catMap[data.categoryId as string] ||
      getName(data.category) ||
      getName(data.categoryName) ||
      "عام",
    emoji,
    imageUrl: Array.isArray(data.imageUrls)
      ? ((data.imageUrls[0] as string) || null)
      : ((data.imageUrl as string) || null),
    badge: data.badge as string,
    badgeColor: data.badgeColor as string,
  };
}

// ─── Generic Section Fetch ────────────────────────────────────────────────────

export async function fetchSectionProducts(
  db: Firestore,
  section: StoreSection
): Promise<Product[]> {
  try {
    const [catSnap, prodSnap] = await Promise.all([
      getDocs(collection(db, section.collections.categories)),
      getDocs(collection(db, section.collections.products)),
    ]);
    const catMap: Record<string, string> = {};
    catSnap.docs.forEach((d) => {
      catMap[d.id] = getName(d.data().name);
    });
    return prodSnap.docs
      .filter((d) => isActive(d.data()))
      .map((d) => mapProduct(d, catMap, section.emoji))
      .filter((p) => p.name);
  } catch (e) {
    console.error(`fetchSectionProducts [${section.id}]:`, e);
    return [];
  }
}

export async function fetchSectionCategories(
  db: Firestore,
  section: StoreSection
): Promise<string[]> {
  try {
    const snap = await getDocs(collection(db, section.collections.categories));
    return snap.docs
      .filter((d) => isActive(d.data()))
      .sort(
        (a, b) =>
          ((a.data().order as number) || 0) - ((b.data().order as number) || 0)
      )
      .map((d) => getName(d.data().name))
      .filter(Boolean);
  } catch {
    return [];
  }
}

// ─── Store Settings ───────────────────────────────────────────────────────────

export async function fetchStoreSettings(
  store: StoreConfig
): Promise<{ logoUrl?: string; whatsapp?: string; storeName?: string; storeDesc?: string }> {
  try {
    // Try doc first (settings/shop_info), then collection first doc
    const results = await Promise.allSettled([
      getDoc(doc(store.db, store.settingsCollection, store.settingsDoc || "shop_info")),
      getDocs(collection(store.db, store.settingsCollection)),
    ]);

    // Check specific doc
    const docResult = results[0];
    if (docResult.status === "fulfilled" && docResult.value.exists()) {
      const data = docResult.value.data();
      return {
        logoUrl: (data.logoUrl || data.logo || data.logoImage) as string | undefined,
        whatsapp: (data.whatsapp || data.phone || data.whatsappNumber) as string | undefined,
        storeName: (data.storeName || data.name) as string | undefined,
        storeDesc: (data.storeDesc || data.description) as string | undefined,
      };
    }

    // Fallback: first doc in collection
    const colResult = results[1];
    if (colResult.status === "fulfilled" && !colResult.value.empty) {
      const data = colResult.value.docs[0].data();
      return {
        logoUrl: (data.logoUrl || data.logo || data.logoImage) as string | undefined,
        whatsapp: (data.whatsapp || data.phone || data.whatsappNumber) as string | undefined,
        storeName: (data.storeName || data.name) as string | undefined,
        storeDesc: (data.storeDesc || data.description) as string | undefined,
      };
    }

    return {};
  } catch {
    return {};
  }
}

// ─── Full Store Data ──────────────────────────────────────────────────────────

export interface SectionData {
  section: StoreSection;
  products: Product[];
  categories: string[];
}

export async function fetchStoreData(store: StoreConfig): Promise<{
  settings: { logoUrl?: string; whatsapp?: string; storeName?: string; storeDesc?: string };
  sections: SectionData[];
}> {
  const [settings, ...sectionResults] = await Promise.all([
    fetchStoreSettings(store),
    ...store.sections.map(async (section) => {
      const [products, categories] = await Promise.all([
        fetchSectionProducts(store.db, section),
        fetchSectionCategories(store.db, section),
      ]);
      return { section, products, categories } as SectionData;
    }),
  ]);

  return { settings, sections: sectionResults as SectionData[] };
}

// ─── Legacy exports (keep for backward compat during migration) ───────────────
// These can be removed once the dashboard uses the new generic API

import { STORES } from "./stores.config";

export async function fetchGiftArtsProducts() {
  const store = STORES["giftx"];
  const result = await fetchSectionProducts(store.db, store.sections[0]);
  return result;
}
export async function fetchGiftArtsCategories() {
  const store = STORES["giftx"];
  return fetchSectionCategories(store.db, store.sections[0]);
}
export async function fetchToysXProducts() {
  const store = STORES["giftx"];
  return fetchSectionProducts(store.db, store.sections[1]);
}
export async function fetchToysXCategories() {
  const store = STORES["giftx"];
  return fetchSectionCategories(store.db, store.sections[1]);
}
export async function fetchKarellaProducts() {
  const store = STORES["karella"];
  return fetchSectionProducts(store.db, store.sections[0]);
}
export async function fetchKarellaCategories() {
  const store = STORES["karella"];
  return fetchSectionCategories(store.db, store.sections[0]);
}
export async function fetchGiftXSettings() {
  return fetchStoreSettings(STORES["giftx"]);
}
