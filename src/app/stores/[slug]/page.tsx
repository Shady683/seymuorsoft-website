import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStore, getAllStoreSlugs } from "@/lib/stores.config";
import { fetchStoreData } from "@/lib/firestore";
import TwoSectionStoreLayout from "@/components/stores/TwoSectionStoreLayout";

// ─── Static params (pre-render all stores at build time) ─────────────────────

export function generateStaticParams() {
  return getAllStoreSlugs().map((slug) => ({ slug }));
}

// ─── Dynamic metadata per store ──────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const store = getStore(slug);
  if (!store) return { title: "متجر غير موجود" };
  return {
    title: store.metadata.title,
    description: store.metadata.description,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function StorePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const store = getStore(slug);
  if (!store) notFound();

  const { settings, sections } = await fetchStoreData(store);

  // Override store name/desc from Firebase if set by admin
  const storeName = settings.storeName || store.name;
  const storeDesc = settings.storeDesc || store.description;

  return (
    <TwoSectionStoreLayout
      storeName={storeName}
      storeDesc={storeDesc}
      emoji={store.emoji}
      logoUrl={settings.logoUrl}
      whatsapp={settings.whatsapp}
      primaryColor={store.primaryColor}
      primaryBg={store.primaryBg}
      sections={sections.map(({ section, products, categories }) => ({
        id: section.id,
        name: section.name,
        subtitle: section.subtitle,
        emoji: section.emoji,
        sectionColor: section.color,
        categories: ["الكل", ...categories],
        products,
      }))}
    />
  );
}
