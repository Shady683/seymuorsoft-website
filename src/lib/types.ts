export type DashboardNav = "overview" | "products" | "orders";

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