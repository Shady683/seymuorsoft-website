import type { Metadata } from "next";
import StoreLayout from "@/components/stores/StoreLayout";
import { fetchKarellaProducts, fetchKarellaCategories } from "@/lib/firestore";

export const metadata: Metadata = {
  title: "Karella — بوتيك أزياء نسائية",
  description: "فساتين، إكسسوارات، وعطور راقية — أناقتك مسؤوليتنا",
};

export default async function KarellaPage() {
  const [products, categories] = await Promise.all([
    fetchKarellaProducts(),
    fetchKarellaCategories(),
  ]);
  return (
    <StoreLayout
      storeName="Karella"
      storeDesc="فساتين، إكسسوارات، وعطور راقية — أناقتك مسؤوليتنا ♥"
      emoji="👗"
      primaryColor="#8B5CF6"
      secondaryColor="#EC4899"
      primaryBg="#F5F3FF"
      categories={categories}
      products={products}
    />
  );
}
