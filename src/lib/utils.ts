import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Status badge colors for orders */
export function orderStatusStyle(status: string) {
  switch (status) {
    case "جديد":          return { color: "#4A6CF7", bg: "#EEF2FF" };
    case "قيد التجهيز":   return { color: "#F59E0B", bg: "#FFFBEB" };
    case "تم التوصيل":   return { color: "#16A34A", bg: "#DCFCE7" };
    case "ملغي":          return { color: "#EF4444", bg: "#FEF2F2" };
    default:              return { color: "#64748B", bg: "#F1F5F9" };
  }
}
