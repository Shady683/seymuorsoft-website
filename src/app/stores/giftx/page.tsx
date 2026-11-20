import type { Metadata } from "next";
import TwoSectionStoreLayout from "@/components/stores/TwoSectionStoreLayout";
import { fetchGiftArtsProducts, fetchGiftArtsCategories, fetchToysXProducts, fetchToysXCategories } from "@/lib/firestore";

export const metadata: Metadata = {
  title: "Gift X — ألعاب وهدايا مميزة",
  description: "تسوق أجمل الألعاب والهدايا والإكسسوارات بأسعار تنافسية وتوصيل سريع",
};

export default async function GiftXPage() {
  const [giftArtsProducts, giftArtsCategories, toysXProducts, toysXCategories] = await Promise.all([
    fetchGiftArtsProducts(),
    fetchGiftArtsCategories(),
    fetchToysXProducts(),
    fetchToysXCategories(),
  ]);

  return (
    <TwoSectionStoreLayout
      storeName="Gift X"
      storeDesc="ألعاب، هدايا، وإكسسوارات مختارة بعناية بأسعار تنافسية وتوصيل سريع"
      emoji="🎁"
      primaryColor="#F97316"
      primaryBg="#FFF7ED"
      sections={[
        {
          id: "giftarts",
          name: "Gift X",
          subtitle: "Gift Arts",
          emoji: "🎁",
          sectionColor: "#F97316",
          categories: giftArtsCategories,
          products: giftArtsProducts,
        },
        {
          id: "toysx",
          name: "Toys X",
          subtitle: "Children\'s Dreams",
          emoji: "🚗",
          sectionColor: "#EF4444",
          categories: toysXCategories,
          products: toysXProducts,
        },
      ]}
    />
  );
}