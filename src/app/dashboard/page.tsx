import type { Metadata } from "next";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "لوحة التحكم | Seymour Soft Solution",
  description: "بوابة أصحاب المتاجر — أدر متجرك بسهولة",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
