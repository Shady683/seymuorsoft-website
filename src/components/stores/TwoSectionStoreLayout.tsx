"use client";
import { useState } from "react";
import type { Product } from "@/lib/types";

interface Section {
  id: string; name: string; subtitle: string; emoji: string;
  sectionColor: string; categories: string[]; products: Product[];
}
interface Props {
  storeName: string; storeDesc: string; emoji: string; logoUrl?: string;
  primaryColor: string; primaryBg: string; whatsapp?: string; sections: Section[];
}

function ProductModal({ product, color, bg, whatsapp, onClose }: { product: Product; color: string; bg: string; whatsapp?: string; onClose: () => void }) {
  const [err, setErr] = useState(false);
  const wa = `https://wa.me/${whatsapp || "201000000000"}?text=${encodeURIComponent("أريد الاستفسار عن: " + product.name)}`;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "white", width: "100%", borderRadius: "24px 24px 0 0", maxHeight: "88vh", overflow: "auto", direction: "rtl" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 36, height: 4, background: "#ddd", borderRadius: 2 }} />
        </div>
        <div style={{ background: bg, height: 240, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {product.imageUrl && !err
            ? <img src={product.imageUrl} alt={product.name} onError={() => setErr(true)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            : <span style={{ fontSize: 80 }}>{product.emoji}</span>}
        </div>
        <div style={{ padding: "16px 20px 32px" }}>
          <div style={{ fontSize: 11, color: color, marginBottom: 4 }}>{product.category}</div>
          <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>{product.name}</div>
          {product.description && <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 12 }}>{product.description}</div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1.5px solid #f0f0f0" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 24, color: color }}>{product.price.toFixed(0)} ج</div>
              {product.regularPrice && product.regularPrice > product.price && (
                <div style={{ fontSize: 12, color: "#bbb", textDecoration: "line-through" }}>{product.regularPrice.toFixed(0)} ج</div>
              )}
            </div>
            <a href={wa} target="_blank" rel="noreferrer" style={{ background: "#25D366", color: "white", borderRadius: 14, padding: "12px 22px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>💬 اطلب</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, color, bg, onSelect }: { product: Product; color: string; bg: string; onSelect: () => void }) {
  const [err, setErr] = useState(false);
  return (
    <div onClick={onSelect} style={{ background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", cursor: "pointer" }}>
      <div style={{ background: bg, height: 120, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {product.imageUrl && !err
          ? <img src={product.imageUrl} alt={product.name} onError={() => setErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ fontSize: 42 }}>{product.emoji}</span>}
      </div>
      <div style={{ padding: "7px 9px 9px", display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textAlign: "right", lineHeight: 1.35, color: "#1a1a1a", overflow: "hidden", maxHeight: "2.7em" }}>{product.name}</div>
        <div style={{ fontSize: 10, color: color, textAlign: "right" }}>{product.category}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 5 }}>
          <div style={{ width: 26, height: 26, background: color, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🛒</div>
          <span style={{ fontWeight: 700, fontSize: 12 }}>{product.price.toFixed(0)} ج</span>
        </div>
      </div>
    </div>
  );
}

export default function TwoSectionStoreLayout({ storeName, storeDesc, emoji, logoUrl, primaryColor, primaryBg, whatsapp, sections }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeCat, setActiveCat] = useState("الكل");
  const [selected, setSelected] = useState<Product | null>(null);
  const section = sections[activeIdx];
  const filtered = activeCat === "الكل" ? section.products : section.products.filter(p => p.category === activeCat);
  const switchSection = (i: number) => { setActiveIdx(i); setActiveCat("الكل"); };

  return (
    <div style={{ minHeight: "100vh", background: primaryBg, fontFamily: "system-ui, -apple-system, sans-serif", direction: "rtl" }}>
      <div style={{ background: `linear-gradient(160deg, ${primaryBg} 0%, #fff 100%)`, padding: "36px 20px 16px", textAlign: "center" }}>
        <div style={{ width: 68, height: 68, background: "white", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
          {logoUrl ? <img src={logoUrl} alt={storeName} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ fontSize: 32 }}>{emoji}</span>}
        </div>
        <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#1a1a1a" }}>{storeName}</h1>
        <p style={{ margin: 0, color: "#666", fontSize: 12, lineHeight: 1.6 }}>{storeDesc}</p>
      </div>

      <div style={{ padding: "10px 14px 8px", display: "flex", gap: 10 }}>
        {sections.map((s, i) => (
          <button key={s.id} onClick={() => switchSection(i)} style={{ flex: 1, background: activeIdx === i ? "white" : "rgba(255,255,255,0.55)", border: `2px solid ${activeIdx === i ? s.sectionColor : "transparent"}`, borderRadius: 14, padding: "10px 8px", cursor: "pointer", textAlign: "right", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>{s.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: activeIdx === i ? s.sectionColor : "#333" }}>{s.name}</div>
              <div style={{ fontSize: 10, color: "#999" }}>{s.subtitle}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ padding: "6px 18px 2px", display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ fontSize: 15 }}>{section.emoji}</span>
        <span style={{ fontWeight: 700, fontSize: 13, color: "#1a1a1a" }}>{section.subtitle}</span>
      </div>

      <div style={{ overflowX: "auto", padding: "7px 12px 8px", display: "flex", gap: 6, scrollbarWidth: "none" }}>
        {section.categories.map(cat => (
          <button key={cat} onClick={() => setActiveCat(cat)} style={{ flexShrink: 0, padding: "5px 11px", borderRadius: 20, border: "none", background: activeCat === cat ? section.sectionColor : "white", color: activeCat === cat ? "white" : "#444", fontWeight: activeCat === cat ? 700 : 400, cursor: "pointer", fontSize: 11, whiteSpace: "nowrap", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>{cat}</button>
        ))}
      </div>

      <div style={{ padding: "3px 16px 5px", textAlign: "left", color: "#bbb", fontSize: 11 }}>{filtered.length} منتج</div>

      <div style={{ padding: "0 11px 24px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
        {filtered.map(p => <ProductCard key={p.id} product={p} color={section.sectionColor} bg={primaryBg} onSelect={() => setSelected(p)} />)}
      </div>

      {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 20px", color: "#aaa" }}>لا توجد منتجات</div>}

      <div style={{ margin: "0 12px 32px", background: primaryColor, borderRadius: 20, padding: "18px", textAlign: "center", color: "white" }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>حابب تطلب بسهولة أكتر؟</div>
        <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 13 }}>تواصل معنا مباشرة على الواتساب</div>
        <a href={`https://wa.me/${whatsapp || "201000000000"}`} target="_blank" rel="noreferrer" style={{ background: "white", color: primaryColor, padding: "10px 22px", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 13 }}>💬 واتساب</a>
      </div>

      {selected && <ProductModal product={selected} color={section.sectionColor} bg={primaryBg} whatsapp={whatsapp} onClose={() => setSelected(null)} />}
    </div>
  );
}