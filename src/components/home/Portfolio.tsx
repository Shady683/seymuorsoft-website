import Link from "next/link";

const projects = [
  {
    emoji: "🎁",
    name: "Gift X",
    type: "تطبيق موبايل + متجر",
    desc: "تطبيق Flutter لمتجر ألعاب وهدايا — كاتالوج منتجات، واجهة أنيقة، وتكامل واتساب.",
    tags: ["Flutter", "Firebase"],
    color: "#F97316",
    bg: "#FFF7ED",
    storeUrl: "/stores/giftx",
  },
  {
    emoji: "👗",
    name: "Karella",
    type: "بوتيك أزياء",
    desc: "واجهة عرض بوتيك نسائي راقي — فساتين، إكسسوارات، وتجربة تسوق أنيقة.",
    tags: ["Next.js", "Tailwind"],
    color: "#8B5CF6",
    bg: "#F5F3FF",
    storeUrl: "/stores/karella",
  },
  {
    emoji: "🚌",
    name: "SafeRide",
    type: "تطبيق نقل مدرسي",
    desc: "منظومة تتبع حافلات المدارس والشركات — real-time GPS، إشعارات للأهل، لوحة تحكم.",
    tags: ["Flutter", "Firebase", "Maps"],
    color: "#10B981",
    bg: "#ECFDF5",
    storeUrl: null,
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
            مشاريع تكلم عن نفسها
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            كل مشروع اتبنى بفكر واهتمام — مش بس كود، ده حل حقيقي لمشكلة حقيقية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
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
                {p.storeUrl && (
                  <Link
                    href={p.storeUrl}
                    className="text-xs font-700 px-3 py-1.5 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
                  >
                    شوف المتجر →
                  </Link>
                )}
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
