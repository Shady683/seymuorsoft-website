"use client";
import { useEffect, useState } from "react";
import { getPortfolioConfig, PortfolioConfig, DEFAULT_PORTFOLIO } from "@/lib/portfolioConfig";

export default function PortfolioPage() {
  const [config, setConfig] = useState<PortfolioConfig>(DEFAULT_PORTFOLIO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolioConfig().then(c => { setConfig(c); setLoading(false); });
  }, []);

  const visible = config.projects.filter(p => p.available).sort((a, b) => a.order - b.order);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFF", direction: "rtl", fontFamily: "Cairo, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #EEF2FF", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, background: "#4A6CF7", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 16 }}>S</div>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#1E293B" }}>Seymo Soft</span>
        </a>
        <nav style={{ display: "flex", gap: 24 }}>
          {[["خدماتنا", "/#services"], ["أعمالنا", "/portfolio"], ["تواصل معنا", "/#contact"]].map(([label, href]) => (
            <a key={href} href={href} style={{ color: href === "/portfolio" ? "#4A6CF7" : "#64748B", textDecoration: "none", fontWeight: href === "/portfolio" ? 700 : 500, fontSize: 14 }}>{label}</a>
          ))}
        </nav>
        <a href="/#contact" style={{ background: "#4A6CF7", color: "white", padding: "8px 20px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 13 }}>ابدأ مشروعك →</a>
      </div>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "64px 32px 48px" }}>
        <div style={{ display: "inline-block", background: "#EEF2FF", color: "#4A6CF7", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
          🚀 مشاريع حقيقية
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 900, color: "#1E293B", margin: "0 0 12px", lineHeight: 1.3 }}>
          {loading ? "..." : config.title}
        </h1>
        <p style={{ color: "#64748B", fontSize: 17, margin: 0 }}>
          {loading ? "" : config.subtitle}
        </p>
      </div>

      {/* Projects Grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
        {loading
          ? [1,2,3,4].map(i => (
              <div key={i} style={{ background: "white", borderRadius: 20, padding: 28, height: 220, opacity: 0.4, animation: "pulse 1.5s infinite" }} />
            ))
          : visible.map(project => (
              <div key={project.id} style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; }}
              >
                {/* Icon */}
                <div style={{ width: 60, height: 60, borderRadius: 16, background: project.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, marginBottom: 16 }}>
                  {project.image}
                </div>

                {/* Name */}
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1E293B", margin: "0 0 8px" }}>{project.name}</h3>

                {/* Description */}
                <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.7, margin: "0 0 16px" }}>{project.description}</p>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: project.link ? 16 : 0 }}>
                  {project.tags.map(tag => (
                    <span key={tag} style={{ background: project.color + "15", color: project.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{tag}</span>
                  ))}
                </div>

                {/* Link */}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, color: project.color, textDecoration: "none", fontWeight: 700, fontSize: 13, marginTop: 4 }}>
                    عرض المشروع ←
                  </a>
                )}
              </div>
            ))
        }
      </div>

      {/* CTA */}
      <div style={{ background: "linear-gradient(135deg, #4A6CF7, #6C8EF7)", padding: "60px 32px", textAlign: "center" }}>
        <h2 style={{ color: "white", fontSize: 28, fontWeight: 900, margin: "0 0 12px" }}>عايز مشروعك الجاي يبقى هنا؟</h2>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, margin: "0 0 28px" }}>نبني لك تطبيق يشتغل لوحده ويكبر معاك</p>
        <a href="/#contact" style={{ background: "white", color: "#4A6CF7", padding: "14px 32px", borderRadius: 12, textDecoration: "none", fontWeight: 800, fontSize: 16 }}>
          ابدأ مشروعك الآن →
        </a>
      </div>
    </div>
  );
}
