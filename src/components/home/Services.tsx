"use client";
import { useEffect, useState } from "react";
import { getSiteConfig, ServicesConfig, DEFAULT_CONFIG } from "@/lib/siteConfig";

export default function Services() {
  const [cfg, setCfg] = useState<ServicesConfig>(DEFAULT_CONFIG.services);

  useEffect(() => {
    getSiteConfig().then(c => setCfg(c.services));

    // Live update من الـ Editor Panel
    const handler = (e: Event) => {
      const full = (e as CustomEvent).detail;
      if (full?.services) setCfg(full.services);
    };
    window.addEventListener("siteConfigUpdated", handler);
    return () => window.removeEventListener("siteConfigUpdated", handler);
  }, []);

  return (
    <section id="services" className="section-pad max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-primary-bg border border-primary/20 rounded-full px-4 py-1.5 mb-4">
          <span className="text-primary text-sm font-700">خدماتنا</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-heading mb-4">
          {cfg.heading}
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          {cfg.subheading}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cfg.items.map((s) => (
          <div
            key={s.title}
            className="bg-white rounded-3xl p-7 border border-border shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 group"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5 transition-transform group-hover:scale-110"
              style={{ background: s.bg }}
            >
              {s.icon}
            </div>
            <h3 className="text-xl font-900 text-heading mb-2">{s.title}</h3>
            <p className="text-muted text-sm leading-relaxed mb-5">{s.desc}</p>
            <div className="flex flex-wrap gap-2">
              {s.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs font-700 px-3 py-1 rounded-full"
                  style={{ color: s.color, background: s.bg }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
