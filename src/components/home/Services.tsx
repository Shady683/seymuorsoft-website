const services = [
  {
    icon: "📱", title: "تطبيق موبايل",
    desc: "Flutter لـ Android و iOS — واجهة سلسة وأداء عالي وتسليم لكلا المتجرين.",
    tags: ["Flutter", "Firebase", "Android", "iOS"],
    color: "#4A6CF7", bg: "#EEF2FF",
  },
  {
    icon: "🛒", title: "متجر إلكتروني",
    desc: "نظام عرض منتجات، سلة مشتريات، وطلبات مرتبطة بالواتساب — جاهز للبيع من اليوم الأول.",
    tags: ["Next.js", "Tailwind", "WhatsApp API"],
    color: "#F97316", bg: "#FFF7ED",
  },
  {
    icon: "🖥️", title: "برنامج ويندوز",
    desc: "برامج إدارة محلات وأنظمة حسابات مخصصة بواجهات سهلة ومناسبة لطبيعة عملك.",
    tags: ["Electron", "Windows", "SQL"],
    color: "#8B5CF6", bg: "#F5F3FF",
  },
  {
    icon: "🌐", title: "موقع ويب",
    desc: "مواقع سريعة ومتجاوبة مع كل الشاشات — landing pages، بورتفوليو، أو منصات متكاملة.",
    tags: ["Next.js", "Vercel", "SEO"],
    color: "#10B981", bg: "#ECFDF5",
  },
];

export default function Services() {
  return (
    <section id="services" className="section-pad max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-primary-bg border border-primary/20 rounded-full px-4 py-1.5 mb-4">
          <span className="text-primary text-sm font-700">خدماتنا</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-heading mb-4">
          كل اللى محتاجه في مكان واحد
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          من الفكرة للمنتج النهائي — بنغطي كل تقنيات البناء اللى محتاجها مشروعك
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s) => (
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
