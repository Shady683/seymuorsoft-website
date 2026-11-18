// ── Project Wizard ─────────────────────────────────────────
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

// ── Store / Product ────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
  badge?: string;
  badgeColor?: string;
}

// ── Dashboard ──────────────────────────────────────────────
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
  status: "جديد" | "قيد التجهيز" | "تم التوصيل" | "ملغي";
  date: string;
  cat: string;
}
