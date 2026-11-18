import type { Metadata } from "next";
import StoreLayout from "@/components/stores/StoreLayout";
import { karellaProducts, karellaCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Karella — بوتيك أزياء نسائية",
  description: "فساتين، إكسسوارات، وعطور راقية — أناقتك مسؤوليتنا",
};

export default function KarellaPage() {
  return (
    <StoreLayout
      storeName="Karella"
      storeDesc="فساتين، إكسسوارات، وعطور راقية — أناقتك مسؤوليتنا ✨"
      emoji="👗"
      primaryColor="#8B5CF6"
      secondaryColor="#EC4899"
      primaryBg="#F5F3FF"
      categories={karellaCategories}
      products={karellaProducts}
    />
  );
}
