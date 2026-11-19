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
  price: number;
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
