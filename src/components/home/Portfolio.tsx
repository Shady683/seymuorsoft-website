import Link from "next/link";

// ── بلاطات خاصة لكل متجر ──────────────────────────────────────────────────────

function GiftXCard() {
  return (
    <div
      className="rounded-3xl overflow-hidden relative hover:-translate-y-1 transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1200 50%, #0a0a0a 100%)",
        border: "1px solid #c9922a",
        boxShadow: "0 0 40px rgba(201,146,42,0.15), inset 0 1px 0 rgba(255,215,100,0.1)",
      }}
    >
      {/* خلفية بريق */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 30% 20%, rgba(201,146,42,0.08) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <div className="p-6 relative">
        {/* هيدر */}
        <div className="flex items-start justify-between mb-5">
          {/* لوجو */}
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: "linear-gradient(135deg, #1a1200, #0a0a0a)",
            border: "1.5px solid #c9922a",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(201,146,42,0.3)",
            fontSize: 32,
          }}>
            🎁
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/stores/giftx"
              style={{
                fontSize: 12, fontWeight: 700,
                padding: "6px 14px", borderRadius: 100,
                background: "linear-gradient(135deg, #c9922a, #f0c060)",
                color: "#0a0a0a",
                textDecoration: "none",
                boxShadow: "0 2px 12px rgba(201,146,42,0.4)",
              }}
            >
              شوف المتجر ←
            </Link>
          </div>
        </div>

        {/* badge */}
        <div style={{
          display: "inline-block",
          fontSize: 11, fontWeight: 700,
          padding: "4px 12px", borderRadius: 100,
          background: "rgba(201,146,42,0.15)",
          color: "#f0c060",
          border: "1px solid rgba(201,146,42,0.3)",
          marginBottom: 10,
        }}>
          تطبيق موبايل + متجر
        </div>

        {/* اسم */}
        <h3 style={{ fontSize: 24, fontWeight: 900, color: "white", margin: "0 0 4px" }}>
          Gift<span style={{ color: "#f0c060" }}>X</span>
        </h3>
        <p style={{ fontSize: 11, color: "#c9922a", fontWeight: 600, margin: "0 0 10px", letterSpacing: 1 }}>
          MORE THAN JUST GIFTS
        </p>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6, margin: "0 0 16px" }}>
          تطبيق Flutter لمتجر ألعاب وهدايا — كاتالوج منتجات، واجهة فاخرة، وتكامل واتساب.
        </p>

        {/* tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["Flutter", "Firebase", "واتساب"].map((t) => (
            <span key={t} style={{
              fontSize: 11, fontWeight: 600,
              padding: "4px 10px", borderRadius: 100,
              background: "rgba(201,146,42,0.1)",
              color: "#c9922a",
              border: "1px solid rgba(201,146,42,0.25)",
            }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function KarellaCard() {
  return (
    <div
      className="rounded-3xl overflow-hidden relative hover:-translate-y-1 transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, #0d0510 0%, #1a0a2e 50%, #0d0510 100%)",
        border: "1px solid #9d4edd",
        boxShadow: "0 0 40px rgba(157,78,221,0.15), inset 0 1px 0 rgba(220,160,255,0.08)",
      }}
    >
      {/* خلفية بريق */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 70% 20%, rgba(157,78,221,0.1) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <div className="p-6 relative">
        {/* هيدر */}
        <div className="flex items-start justify-between mb-5">
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: "linear-gradient(135deg, #1a0a2e, #0d0510)",
            border: "1.5px solid #9d4edd",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(157,78,221,0.35)",
            fontSize: 32,
          }}>
            👗
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/stores/karella"
              style={{
                fontSize: 12, fontWeight: 700,
                padding: "6px 14px", borderRadius: 100,
                background: "linear-gradient(135deg, #9d4edd, #c77dff)",
                color: "white",
                textDecoration: "none",
                boxShadow: "0 2px 12px rgba(157,78,221,0.4)",
              }}
            >
              شوف المتجر ←
            </Link>
          </div>
        </div>

        {/* badge */}
        <div style={{
          display: "inline-block",
          fontSize: 11, fontWeight: 700,
          padding: "4px 12px", borderRadius: 100,
          background: "rgba(157,78,221,0.15)",
          color: "#c77dff",
          border: "1px solid rgba(157,78,221,0.3)",
          marginBottom: 10,
        }}>
          بوتيك أزياء
        </div>

        <h3 style={{ fontSize: 24, fontWeight: 900, color: "white", margin: "0 0 4px" }}>
          Kare<span style={{ color: "#c77dff" }}>lla</span>
        </h3>
        <p style={{ fontSize: 11, color: "#9d4edd", fontWeight: 600, margin: "0 0 10px", letterSpacing: 1 }}>
          ELEGANT FASHION BOUTIQUE
        </p>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6, margin: "0 0 16px" }}>
          واجهة عرض بوتيك نسائي راقي — فساتين، إكسسوارات، وتجربة تسوق أنيقة.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["Next.js", "Tailwind", "Framer Motion"].map((t) => (
            <span key={t} style={{
              fontSize: 11, fontWeight: 600,
              padding: "4px 10px", borderRadius: 100,
              background: "rgba(157,78,221,0.1)",
              color: "#9d4edd",
              border: "1px solid rgba(157,78,221,0.25)",
            }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── البلاطات العادية ───────────────────────────────────────────────────────────

const otherProjects = [
  {
    emoji: "🚌",
    name: "SafeRide",
    type: "تطبيق نقل مدرسي",
    desc: "منظومة تتبع حافلات المدارس والشركات — real-time GPS، إشعارات للأهل، لوحة تحكم.",
    tags: ["Flutter", "Firebase", "Maps"],
    color: "#10B981",
    bg: "#ECFDF5",
    storeUrl: null,
    wip: true,
  },
  {
    emoji: "🎮",
    name: "SSS Accounting",
    type: "برنامج إدارة محل PS",
    desc: "نظام إدارة اشتراكات وحسابات لمحل بلايستيشن — Electron، تقارير، وقاعدة بيانات محلية.",
    tags: ["Electron", "SQLite", "Windows"],
    color: "#F59E0B",
    bg: "#FFFBEB",
    storeUrl: null,
    wip: false,
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="section-pad bg-heading text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
            <span className="text-white/80 text-sm font-700">أعمالنا</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            مشاريع تتكلم عن نفسها
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            كل مشروع اتبنى بفكر واهتمام — مش بس كود، ده حل حقيقي لمشكلة حقيقية
          </p>
        </div>

        {/* بلاطات المتاجر */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <GiftXCard />
          <KarellaCard />
        </div>

        {/* باقي المشاريع */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherProjects.map((p) => (
            <div
              key={p.name}
              className="bg-white/5 rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: p.bg }}
                >
                  {p.emoji}
                </div>
                <div className="flex items-center gap-2">
                  {p.wip && (
                    <span className="text-xs font-700 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      🔧 تحت التنفيذ
                    </span>
                  )}
                </div>
              </div>
              <div
                className="text-xs font-700 px-2.5 py-1 rounded-full inline-block mb-2"
                style={{ color: p.color, background: p.bg }}
              >
                {p.type}
              </div>
              <h3 className="text-xl font-900 mb-2">{p.name}</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-4">{p.desc}</p>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="text-xs font-600 px-3 py-1 bg-white/10 rounded-full text-white/70">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
