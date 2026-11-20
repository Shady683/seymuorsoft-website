"use client";
import { useState } from "react";
import type { Product } from "@/lib/types";

interface Section {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  sectionColor: string;
  categories: string[];
  products: Product[];
}
interface Props {
  storeName: string;
  storeDesc: string;
  emoji: string;
  primaryColor: string;
  primaryBg: string;
  whatsapp?: string;
  sections: Section[];
}

function ProductCard({ product, color, bg }: { product: Product; color: string; bg: string }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column" }}>
      <div style={{ background: bg, aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {product.imageUrl && !err
          ? <img src={product.imageUrl} alt={product.name} onError={() => setErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ fontSize: 52 }}>{product.emoji}</span>}
      </div>
      <div style={{ padding: "10px 10px 12px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, textAlign: "right", lineHeight: 1.4, color: "#1a1a1a" }}>{product.name}</div>
        <div style={{ fontSize: 11, color: color, textAlign: "right" }}>{product.category}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <button style={{ background: color, color: "white", border: "none", borderRadius: 10, width: 34, height: 34, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>🛒</button>
          <span style={{ fontWeight: 700, fontSize: 14 }}>{product.price.toFixed(0)} ج</span>
        </div>
      </div>
    </div>
  );
}

export default function TwoSectionStoreLayout({ storeName, storeDesc, emoji, primaryColor, primaryBg, whatsapp, sections }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeCat, setActiveCat] = useState("الكل");
  const section = sections[activeIdx];
  const filtered = activeCat === "الكل" ? section.products : section.products.filter(p => p.category === activeCat);

  const switchSection = (i: number) => { setActiveIdx(i); setActiveCat("الكل"); };

  return (
    <div style={{ minHeight: "100vh", background: primaryBg, fontFamily: "system-ui, -apple-system, sans-serif", direction: "rtl" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(160deg, ${primaryBg} 0%, #fff 100%)`, padding: "40px 20px 20px", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, background: "white", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 40, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>{emoji}</div>
        <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 800, color: "#1a1a1a" }}>{storeName}</h1>
        <p style={{ margin: 0, color: "#666", fontSize: 13, lineHeight: 1.6 }}>{storeDesc}</p>
      </div>

      {/* Section Tabs */}
      <div style={{ padding: "16px 16px 8px", display: "flex", gap: 10 }}>
        {sections.map((s, i) => (
          <button key={s.id} onClick={() => switchSection(i)} style={{ flex: 1, background: activeIdx === i ? "white" : "rgba(255,255,255,0.55)", border: `2px solid ${activeIdx === i ? s.sectionColor : "transparent"}`, borderRadius: 14, padding: "10px 8px", cursor: "pointer", textAlign: "right", display: "flex", alignItems: "center", gap: 8, transition: "all .2s" }}>
            <span style={{ fontSize: 22 }}>{s.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: activeIdx === i ? s.sectionColor : "#333" }}>{s.name}</div>
              <div style={{ fontSize: 10, color: "#999" }}>{s.subtitle}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Section Title */}
      <div style={{ padding: "12px 20px 4px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>{section.emoji}</span>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>{section.subtitle}</span>
      </div>

      {/* Categories */}
      <div style={{ overflowX: "auto", padding: "10px 16px 12px", display: "flex", gap: 8, scrollbarWidth: "none" }}>
        {section.categories.map(cat => (
          <button key={cat} onClick={() => setActiveCat(cat)} style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 20, border: "none", background: activeCat === cat ? section.sectionColor : "white", color: activeCat === cat ? "white" : "#444", fontWeight: activeCat === cat ? 700 : 400, cursor: "pointer", fontSize: 12, whiteSpace: "nowrap", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>{cat}</button>
        ))}
      </div>

      {/* Count */}
      <div style={{ padding: "2px 20px 10px", textAlign: "left", color: "#888", fontSize: 12 }}>{filtered.length} منتج</div>

      {/* Grid */}
      <div style={{ padding: "0 14px 24px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {filtered.map(p => <ProductCard key={p.id} product={p} color={section.sectionColor} bg={primaryBg} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#aaa" }}>لا توجد منتجات في هذا القسم</div>
      )}

      {/* WhatsApp */}
      <div style={{ margin: "0 16px 32px", background: primaryColor, borderRadius: 20, padding: "24px 20px", textAlign: "center", color: "white" }}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>حابب تطلب بسهولة أكتر؟</div>
        <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 16 }}>تواصل معنا مباشرة على الواتساب</div>
        <a href={`https://wa.me/${whatsapp || "201000000000"}`} target="_blank" rel="noreferrer" style={{ background: "white", color: primaryColor, padding: "11px 28px", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 14 }}>💬 واتساب</a>
      </div>
    </div>
  );
}