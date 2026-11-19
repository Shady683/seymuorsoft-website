import type { Metadata } from "next";
import StoreLayout from "@/components/stores/StoreLayout";
import { fetchGiftXProducts, fetchGiftXCategories } from "@/lib/firestore";

export const metadata: Metadata = {
  title: "Gift X — ألعاب وهدايا مميزة",
  description: "تسوق أجمل الألعاب والهدايا والإكسسوارات بأسعار تنافسية وتوصيل سريع",
};

export default async function GiftXPage() {
  const [products, categories] = await Promise.all([
    fetchGiftXProducts(),
    fetchGiftXCategories(),
  ]);
  return (
    <StoreLayout
      storeName="Gift X"
      storeDesc="ألعاب، هدايا، وإكسسوارات مختارة بعناية بأسعار تنافسية وتوصيل سريع"
      emoji="🎁"
      primaryColor="#F97316"
      secondaryColor="#EAB308"
      primaryBg="#FFF7ED"
      categories={categories}
      products={products}
    />
  );
}
