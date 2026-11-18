"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";

interface StoreLayoutProps {
  storeName: string;
  storeDesc: string;
  emoji: string;
  primaryColor: string;
  secondaryColor: string;
  primaryBg: string;
  categories: string[];
  products: Product[];
  whatsappNumber?: string;
}

export default function StoreLayout({
  storeName, storeDesc, emoji, primaryColor, secondaryColor,
  primaryBg, categories, products, whatsappNumber = "201XXXXXXXXX",
}: StoreLayoutProps) {
  const [activeCategory, setActiveCategory] = useState("الكل");

  const filtered = activeCategory === "الكل"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const waLink = (productName: string) =>
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`أريد الاستفسار عن: ${productName}`)}`;

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <section
        className="relative py-20 px-6 text-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${primaryBg} 0%, #F8FAFC 100%)` }}
      >
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: primaryColor, transform: "translate(50%, -50%)" }}
        />
        <div className="relative max-w-2xl mx-auto">
          <div
            className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-5xl mb-5 shadow-card-hover"
            style={{ background: primaryBg }}
          >
            {emoji}
          </div>
          <h1 className="text-4xl font-black text-heading mb-3">{storeName}</h1>
          <p className="text-muted text-lg">{storeDesc}</p>

          {/* Rating */}
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-card border border-border mt-4">
            <span className="text-warning text-sm">★★★★★</span>
            <span className="text-sm font-700 text-heading">٥/٥</span>
            <span className="text-sm text-muted">· ١٠٠+ عميل سعيد</span>
          </div>
        </div>
      </section>

      {/* Category filters */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-border px-6 py-3">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-700 transition-all"
              style={{
                background: activeCategory === cat ? primaryColor : "#F1F5F9",
                color:      activeCategory === cat ? "#fff" : "#64748B",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-muted text-sm mb-6 font-500">
          {filtered.length} منتج
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 overflow-hidden group"
            >
              {/* Product image placeholder */}
              <div
                className="aspect-square flex items-center justify-center text-5xl relative"
                style={{ background: primaryBg }}
              >
                {p.emoji}
                {p.badge && (
                  <div
                    className="absolute top-2 right-2 text-white text-[10px] font-800 px-2 py-0.5 rounded-full"
                    style={{ background: p.badgeColor }}
                  >
                    {p.badge}
                  </div>
                )}
              </div>

              <div className="p-3">
                <div className="text-sm font-800 text-heading mb-1 leading-tight">{p.name}</div>
                <div
                  className="text-xs font-700 px-2 py-0.5 rounded-full inline-block mb-2"
                  style={{ color: primaryColor, background: primaryBg }}
                >
                  {p.category}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-900 text-heading text-base">{p.price} ج</span>
                  <a
                    href={waLink(p.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm transition-transform group-hover:scale-110"
                    style={{ background: primaryColor }}
                    title="اطلب عبر واتساب"
                  >
                    🛒
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / Download app banner */}
      <section
        className="mx-6 mb-10 rounded-3xl p-8 text-center text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
      >
        <h3 className="text-2xl font-900 mb-2">حابب تطلب بسهولة أكتر؟</h3>
        <p className="text-white/80 text-sm mb-5">تواصل معنا مباشرة على الواتساب</p>
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-xl font-800 transition-transform hover:scale-105"
          style={{ color: primaryColor }}
        >
          <span>💬</span> واتساب
        </a>
      </section>

      {/* Footer */}
      <div className="text-center py-6 text-muted text-xs border-t border-border">
        <p>
          هذا المتجر مشغّل بواسطة{" "}
          <a href="/" className="text-primary font-700 hover:underline">
            Seymour Soft Solution
          </a>
        </p>
      </div>
    </div>
  );
}
