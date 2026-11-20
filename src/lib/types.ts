export type ProjectType = "mobile" | "web" | "desktop" | "ecommerce" | "";
export type PlatformType = "android" | "ios" | "both" | "windows" | "web" | "";
export type TimelineType = "asap" | "1month" | "3months" | "flexible" | "";

export interface WizardState {
  step: 1 | 2 | 3 | 4 | 5 | 6;
  projectType: ProjectType;
  platform: PlatformType;
  features: string[];
  timeline: TimelineType;
  name: string;
  contact: string;
  notes: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  regularPrice?: number;
  category: string;
  emoji: string;
  imageUrl?: string | null;
  badge?: string;
  badgeColor?: string;
}

export type DashboardNav = "overview" | "products" | "orders" | "settings";

export interface StatCard {
  icon: string;
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export interface Order {
  id: string;
  name: string;
  items: number;
  amount: number;
  status: string;
  date: string;
  cat: string;
}

// ─── Real Order from Firestore (matches Flutter order_model.dart) ─────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "refunded";

export type PaymentMethod =
  | "cash"
  | "vodafone_cash"
  | "instapay"
  | "card"
  | "other";

export interface DeliveryAddress {
  street?: string;
  area?: string;
  city?: string;
  notes?: string;
}

export interface PaymentReceipt {
  imageUrl?: string;
  uploadedAt?: Date;
  transactionId?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface FirestoreOrder {
  id: string;
  orderNumber?: string;
  userId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress?: DeliveryAddress;
  paymentReceipt?: PaymentReceipt;
  adminNotes?: string;
  storeId?: string;        // "giftx" | "karella"
  createdAt?: Date;
  updatedAt?: Date;
  confirmedAt?: Date;
  deliveredAt?: Date;
}