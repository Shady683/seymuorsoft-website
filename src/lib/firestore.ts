import { getDocs, collection } from "firebase/firestore";
import { giftxDb, karellaDb } from "./firebase";
import type { Product } from "./types";

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
function mapProduct(d: { id: string; data(): Record<string, unknown> }, catMap: Record<string, string>, emoji: string): Product {
  const data = d.data();
  return {
    id: d.id,
    name: getName(data.name),
    description: getName(data.description) || undefined,
    price: (data.offerPrice as number) || (data.regularPrice as number) || (data.price as number) || 0,
    regularPrice: (data.regularPrice as number) || undefined,
    category: catMap[data.categoryId as string] || getName(data.category) || getName(data.categoryName) || "????",
    emoji,
    imageUrl: Array.isArray(data.imageUrls) ? ((data.imageUrls[0] as string) || null) : ((data.imageUrl as string) || null),
    badge: data.badge as string,
    badgeColor: data.badgeColor as string,
  };
}

export async function fetchGiftXSettings(): Promise<{ logoUrl?: string; whatsapp?: string }> {
  try {
    const results = await Promise.allSettled([
      getDocs(collection(giftxDb, "settings")),
      getDocs(collection(giftxDb, "app_settings")),
    ]);
    for (const r of results) {
      if (r.status === "fulfilled" && !r.value.empty) {
        const data = r.value.docs[0].data();
        return {
          logoUrl: (data.logoUrl || data.logo || data.logoImage) as string | undefined,
          whatsapp: (data.whatsapp || data.phone || data.whatsappNumber) as string | undefined,
        };
      }
    }
    return {};
  } catch { return {}; }
}

export async function fetchGiftArtsProducts(): Promise<Product[]> {
  try {
    const [catSnap, snap] = await Promise.all([getDocs(collection(giftxDb, "gift_categories")), getDocs(collection(giftxDb, "gift_products"))]);
    const catMap: Record<string, string> = {};
    catSnap.docs.forEach(d => { catMap[d.id] = getName(d.data().name); });
    return snap.docs.filter(d => isActive(d.data())).map(d => mapProduct(d, catMap, "??")).filter(p => p.name);
  } catch (e) { console.error("fetchGiftArtsProducts:", e); return []; }
}
export async function fetchGiftArtsCategories(): Promise<string[]> {
  try {
    const snap = await getDocs(collection(giftxDb, "gift_categories"));
    const names = snap.docs.filter(d => isActive(d.data())).sort((a, b) => ((a.data().order as number) || 0) - ((b.data().order as number) || 0)).map(d => getName(d.data().name)).filter(Boolean);
    return ["????", ...names];
  } catch { return ["????"]; }
}
export async function fetchToysXProducts(): Promise<Product[]> {
  try {
    const [catSnap, snap] = await Promise.all([getDocs(collection(giftxDb, "categories")), getDocs(collection(giftxDb, "products"))]);
    const catMap: Record<string, string> = {};
    catSnap.docs.forEach(d => { catMap[d.id] = getName(d.data().name); });
    return snap.docs.filter(d => isActive(d.data())).map(d => mapProduct(d, catMap, "??")).filter(p => p.name);
  } catch (e) { console.error("fetchToysXProducts:", e); return []; }
}
export async function fetchToysXCategories(): Promise<string[]> {
  try {
    const snap = await getDocs(collection(giftxDb, "categories"));
    const names = snap.docs.filter(d => isActive(d.data())).sort((a, b) => ((a.data().order as number) || 0) - ((b.data().order as number) || 0)).map(d => getName(d.data().name)).filter(Boolean);
    return ["????", ...names];
  } catch { return ["????"]; }
}
export async function fetchKarellaProducts(): Promise<Product[]> {
  try {
    const catSnap = await getDocs(collection(karellaDb, "categories"));
    const catMap: Record<string, string> = {};
    catSnap.docs.forEach(d => { catMap[d.id] = getName(d.data().name); });
    const snap = await getDocs(collection(karellaDb, "products"));
    return snap.docs.filter(d => d.data().isActive !== false).map(d => mapProduct(d, catMap, "??")).filter(p => p.name);
  } catch (e) { console.error("fetchKarellaProducts:", e); return []; }
}
export async function fetchKarellaCategories(): Promise<string[]> {
  try {
    const snap = await getDocs(collection(karellaDb, "categories"));
    const names = snap.docs.filter(d => d.data().isActive !== false).sort((a, b) => ((a.data().order as number) || 0) - ((b.data().order as number) || 0)).map(d => getName(d.data().name)).filter(Boolean);
    return ["????", ...names];
  } catch { return ["????"]; }
}