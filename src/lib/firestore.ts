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

export async function fetchGiftXProducts(): Promise<Product[]> {
  try {
    const [catSnap, giftCatSnap, snap1, snap2] = await Promise.all([
      getDocs(collection(giftxDb, "categories")),
      getDocs(collection(giftxDb, "gift_categories")),
      getDocs(collection(giftxDb, "products")),
      getDocs(collection(giftxDb, "gift_products")),
    ]);
    const catMap: Record<string, string> = {};
    catSnap.docs.forEach(d => { catMap[d.id] = getName(d.data().name); });
    giftCatSnap.docs.forEach(d => { catMap[d.id] = getName(d.data().name); });
    return [...snap1.docs, ...snap2.docs]
      .filter(d => {
        const s = d.data().status;
        const a = d.data().isActive;
        return s === "active" || (s === undefined && a !== false);
      })
      .map(d => {
        const data = d.data();
        return {
          id: d.id,
          name: getName(data.name),
          price: data.offerPrice || data.regularPrice || data.price || 0,
          category: catMap[data.categoryId] || getName(data.category) || getName(data.categoryName) || "الكل",
          emoji: data.emoji || "🎁",
          imageUrl: Array.isArray(data.imageUrls) ? (data.imageUrls[0] || null) : (data.imageUrl || null),
          badge: data.badge,
          badgeColor: data.badgeColor,
        };
      })
      .filter(p => p.name);
  } catch { return []; }
}

export async function fetchGiftXCategories(): Promise<string[]> {
  try {
    const [snap1, snap2] = await Promise.all([
      getDocs(collection(giftxDb, "categories")),
      getDocs(collection(giftxDb, "gift_categories")),
    ]);
    const names = [...snap1.docs, ...snap2.docs]
      .filter(d => {
        const s = d.data().status;
        const a = d.data().isActive;
        return s === "active" || (s === undefined && a !== false);
      })
      .sort((a, b) => (a.data().order || 0) - (b.data().order || 0))
      .map(d => getName(d.data().name))
      .filter(Boolean);
    return ["الكل", ...names];
  } catch { return ["الكل"]; }
}

export async function fetchKarellaProducts(): Promise<Product[]> {
  try {
    const catSnap = await getDocs(collection(karellaDb, "categories"));
    const catMap: Record<string, string> = {};
    catSnap.docs.forEach(d => { catMap[d.id] = getName(d.data().name); });
    const snap = await getDocs(collection(karellaDb, "products"));
    return snap.docs
      .filter(d => d.data().isActive !== false)
      .map(d => {
        const data = d.data();
        return {
          id: d.id,
          name: getName(data.name),
          price: data.offerPrice || data.regularPrice || data.price || 0,
          category: catMap[data.categoryId] || "الكل",
          emoji: "👗",
          imageUrl: Array.isArray(data.imageUrls) ? (data.imageUrls[0] || null) : (data.imageUrl || null),
        };
      })
      .filter(p => p.name);
  } catch { return []; }
}

export async function fetchKarellaCategories(): Promise<string[]> {
  try {
    const snap = await getDocs(collection(karellaDb, "categories"));
    const names = snap.docs
      .filter(d => d.data().isActive !== false)
      .sort((a, b) => (a.data().order || 0) - (b.data().order || 0))
      .map(d => getName(d.data().name))
      .filter(Boolean);
    return ["الكل", ...names];
  } catch { return ["الكل"]; }
}