import {
  getDocs,
  collection,
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import type { Firestore, Unsubscribe } from "firebase/firestore";
import type { Product, FirestoreOrder, OrderStatus, PaymentStatus } from "./types";
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

// ─── Orders ───────────────────────────────────────────────────────────────────

function mapTimestamp(val: unknown): Date | undefined {
  if (!val) return undefined;
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  if (typeof val === "object" && val !== null && "seconds" in val) {
    return new Timestamp((val as { seconds: number }).seconds, 0).toDate();
  }
  return undefined;
}

function mapOrder(d: { id: string; data(): Record<string, unknown> }): FirestoreOrder {
  const data = d.data();

  // Map items array
  const rawItems = Array.isArray(data.items) ? data.items : [];
  const items = rawItems.map((item: Record<string, unknown>) => ({
    productId: (item.productId || item.id || "") as string,
    name: getName(item.name),
    price: (item.price || item.offerPrice || 0) as number,
    quantity: (item.quantity || item.qty || 1) as number,
    imageUrl: (item.imageUrl || (Array.isArray(item.imageUrls) ? item.imageUrls[0] : undefined) || undefined) as string | undefined,
  }));

  // Map delivery address
  const rawAddr = (data.deliveryAddress || data.address) as Record<string, unknown> | undefined;
  const deliveryAddress = rawAddr ? {
    street: rawAddr.street as string | undefined,
    area: rawAddr.area as string | undefined,
    city: rawAddr.city as string | undefined,
    notes: rawAddr.notes as string | undefined,
  } : undefined;

  // Map payment receipt
  const rawReceipt = (data.paymentReceipt || data.receipt) as Record<string, unknown> | undefined;
  const paymentReceipt = rawReceipt ? {
    imageUrl: rawReceipt.imageUrl as string | undefined,
    uploadedAt: mapTimestamp(rawReceipt.uploadedAt),
    transactionId: rawReceipt.transactionId as string | undefined,
  } : undefined;

  return {
    id: d.id,
    orderNumber: (data.orderNumber || data.orderNo) as string | undefined,
    userId: (data.userId || data.customerId || "") as string,
    customerName: (data.customerName || data.name || data.userName) as string | undefined,
    customerPhone: (data.customerPhone || data.phone || data.mobile) as string | undefined,
    customerEmail: (data.customerEmail || data.email) as string | undefined,
    items,
    totalAmount: (data.totalAmount || data.total || data.amount || 0) as number,
    status: (data.status || "pending") as OrderStatus,
    paymentStatus: (data.paymentStatus || "pending") as PaymentStatus,
    paymentMethod: (data.paymentMethod || "cash") as FirestoreOrder["paymentMethod"],
    deliveryAddress,
    paymentReceipt,
    adminNotes: (data.adminNotes || data.notes) as string | undefined,
    storeId: (data.storeId || data.appId) as string | undefined,
    createdAt: mapTimestamp(data.createdAt),
    updatedAt: mapTimestamp(data.updatedAt),
    confirmedAt: mapTimestamp(data.confirmedAt),
    deliveredAt: mapTimestamp(data.deliveredAt),
  };
}

/** Fetch recent orders from a store's Firestore (one-time) */
export async function fetchOrders(
  db: Firestore,
  maxResults = 100
): Promise<FirestoreOrder[]> {
  try {
    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
      limit(maxResults)
    );
    const snap = await getDocs(q);
    return snap.docs.map(mapOrder);
  } catch (e) {
    console.error("fetchOrders:", e);
    // Fallback: no orderBy (in case index not created yet)
    try {
      const snap = await getDocs(collection(db, "orders"));
      const orders = snap.docs.map(mapOrder);
      orders.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
      return orders.slice(0, maxResults);
    } catch {
      return [];
    }
  }
}

/** Subscribe to real-time order updates */
export function subscribeToOrders(
  db: Firestore,
  onUpdate: (orders: FirestoreOrder[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(100));
    return onSnapshot(
      q,
      (snap) => onUpdate(snap.docs.map(mapOrder)),
      (err) => {
        console.warn("subscribeToOrders error, falling back to unordered:", err);
        // Fallback without orderBy
        const unsub = onSnapshot(
          collection(db, "orders"),
          (snap) => {
            const orders = snap.docs.map(mapOrder);
            orders.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
            onUpdate(orders);
          },
          onError
        );
        return unsub;
      }
    );
  } catch (e) {
    console.error("subscribeToOrders:", e);
    return () => {};
  }
}

/** Update order status */
export async function updateOrderStatus(
  db: Firestore,
  orderId: string,
  status: OrderStatus,
  adminNotes?: string
): Promise<void> {
  const ref = doc(db, "orders", orderId);
  const update: Record<string, unknown> = {
    status,
    updatedAt: Timestamp.now(),
  };
  if (status === "confirmed") update.confirmedAt = Timestamp.now();
  if (status === "delivered") update.deliveredAt = Timestamp.now();
  if (adminNotes !== undefined) update.adminNotes = adminNotes;
  await updateDoc(ref, update);
}

/** Verify or reject payment */
export async function updatePaymentStatus(
  db: Firestore,
  orderId: string,
  paymentStatus: PaymentStatus,
  adminNotes?: string
): Promise<void> {
  const ref = doc(db, "orders", orderId);
  const update: Record<string, unknown> = {
    paymentStatus,
    updatedAt: Timestamp.now(),
  };
  if (adminNotes !== undefined) update.adminNotes = adminNotes;
  await updateDoc(ref, update);
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
