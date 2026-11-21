"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSiteConfig, HeroConfig, DEFAULT_CONFIG } from "@/lib/siteConfig";

export default function Hero() {
  const [hero, setHero] = useState<HeroConfig>(DEFAULT_CONFIG.hero);

  useEffect(() => {
    getSiteConfig().then(c => setHero(c.hero));

    // Live update من الـ Editor Panel
    const handler = (e: Event) => {
      const full = (e as CustomEvent).detail;
      if (full?.hero) setHero(full.hero);
    };
    window.addEventListener("siteConfigUpdated", handler);
    return () => window.removeEventListener("siteConfigUpdated", handler);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-bg via-bg to-[#F5F3FF] pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-karella/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div>
          {hero.available && (
            <div className="inline-flex items-center gap-2 bg-primary-bg border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary text-sm font-700">متاح للمشاريع الجديدة</span>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-heading leading-tight mb-6">
            {hero.tagline}
            <span className="text-primary block">{hero.highlight}</span>
            ويكبر معاك 🚀
          </h1>

          <p className="text-lg text-muted leading-relaxed mb-8 max-w-lg">
            {hero.description}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/wizard"
              className="flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-2xl font-800 text-base shadow-primary hover:bg-primary-dark transition-all hover:-translate-y-0.5"
            >
              {hero.cta_primary}
              <span className="text-lg">←</span>
            </Link>
            <a
              href="#portfolio"
              className="flex items-center gap-2 bg-white text-heading px-6 py-3.5 rounded-2xl font-700 text-base border border-border shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5"
            >
              {hero.cta_secondary}
              <span>👇</span>
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border">
            {hero.stats.map((s) => (
              <div key={s.n}>
                <div className="text-2xl font-900 text-primary">{s.n}</div>
                <div className="text-sm text-muted mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual card */}
        <div className="relative hidden lg:flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-6 shadow-card-hover border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-giftx-bg rounded-xl flex items-center justify-center text-xl">🎁</div>
                <div>
                  <div className="text-sm font-800 text-heading">Gift X App</div>
                  <div className="text-xs text-muted">متجر هدايا وألعاب</div>
                </div>
              </div>
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-danger" />
                <span className="w-2.5 h-2.5 rounded-full bg-warning" />
                <span className="w-2.5 h-2.5 rounded-full bg-success" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["🧸 ألعاب أطفال", "🎁 هدايا مميزة", "🚗 ريموت كنترول", "🧱 ليغو مجموعات"].map((item) => (
                <div key={item} className="bg-giftx-bg rounded-xl p-3 text-sm font-600 text-heading">{item}</div>
              ))}
            </div>
            <div className="mt-3 bg-giftx rounded-xl p-3 text-white text-center text-sm font-800">
              اطلب دلوقتي 🛒
            </div>
          </div>
          <div className="absolute -top-4 -left-4 bg-white rounded-2xl px-4 py-2.5 shadow-card border border-border flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <div>
              <div className="text-xs font-800 text-heading">تسليم سريع</div>
              <div className="text-xs text-muted">٣–٦ أسابيع</div>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 bg-primary rounded-2xl px-4 py-2.5 shadow-primary flex items-center gap-2">
            <span className="text-lg">📱</span>
            <span className="text-sm font-800 text-white">Flutter + Firebase</span>
          </div>
        </div>
      </div>
    </section>
  );
}
