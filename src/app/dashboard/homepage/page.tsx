"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  getSiteConfig, saveSiteConfig,
  SiteConfig, DEFAULT_CONFIG, HeroStat, ServiceItem,
} from "@/lib/siteConfig";

export default function HomepageDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fetching, setFetching] = useState(true);

  // حماية الصفحة
  useEffect(() => {
    if (!loading && (!user || user.role === "customer")) router.push("/");
  }, [user, loading, router]);

  // جلب البيانات
  useEffect(() => {
    getSiteConfig().then(c => { setConfig(c); setFetching(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await saveSiteConfig(config);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // helpers
  const setHero = (k: keyof typeof config.hero, v: unknown) =>
    setConfig(c => ({ ...c, hero: { ...c.hero, [k]: v } }));

  const setSvc = (k: keyof typeof config.services, v: unknown) =>
    setConfig(c => ({ ...c, services: { ...c.services, [k]: v } }));

  const updateStat = (i: number, k: keyof HeroStat, v: string) => {
    const stats = [...config.hero.stats];
    stats[i] = { ...stats[i], [k]: v };
    setHero("stats", stats);
  };

  const updateService = (i: number, k: keyof ServiceItem, v: string) => {
    const items = [...config.services.items];
    items[i] = { ...items[i], [k]: k === "tags" ? v.split(",").map(t => t.trim()) : v };
    setSvc("items", items);
  };

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-muted text-lg">جاري التحميل...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-20 pb-16 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-900 text-heading">تعديل الصفحة الرئيسية</h1>
            <p className="text-sm text-muted mt-1">التغييرات تظهر فوراً على الموقع</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-800 shadow-primary hover:bg-primary-dark transition-all disabled:opacity-60"
          >
            {saving ? "جاري الحفظ..." : saved ? "✅ تم الحفظ!" : "💾 حفظ التغييرات"}
          </button>
        </div>

        {/* ── Hero Section ── */}
        <Card title="🏠 القسم الرئيسي (Hero)">
          <Field label="السطر الأول">
            <input value={config.hero.tagline} onChange={e => setHero("tagline", e.target.value)} />
          </Field>
          <Field label="السطر الملوّن">
            <input value={config.hero.highlight} onChange={e => setHero("highlight", e.target.value)} />
          </Field>
          <Field label="الوصف">
            <textarea rows={3} value={config.hero.description} onChange={e => setHero("description", e.target.value)} />
          </Field>
          <Field label="زر CTA الرئيسي">
            <input value={config.hero.cta_primary} onChange={e => setHero("cta_primary", e.target.value)} />
          </Field>
          <Field label="زر CTA الثاني">
            <input value={config.hero.cta_secondary} onChange={e => setHero("cta_secondary", e.target.value)} />
          </Field>
          <Field label="متاح للمشاريع؟">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setHero("available", !config.hero.available)}
                className={`w-12 h-6 rounded-full transition-colors ${config.hero.available ? "bg-primary" : "bg-gray-300"} relative`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${config.hero.available ? "right-1" : "left-1"}`} />
              </div>
              <span className="text-sm font-700 text-heading">{config.hero.available ? "ظاهر ✅" : "مخفي"}</span>
            </label>
          </Field>

          {/* Stats */}
          <div className="mt-4">
            <div className="text-sm font-800 text-heading mb-3">الأرقام (Stats)</div>
            <div className="grid grid-cols-3 gap-3">
              {config.hero.stats.map((s, i) => (
                <div key={i} className="bg-[#F8F9FB] rounded-2xl p-3 flex flex-col gap-2">
                  <input
                    className="text-center font-900 text-primary bg-white rounded-xl px-3 py-2 border border-border text-sm"
                    value={s.n} onChange={e => updateStat(i, "n", e.target.value)}
                  />
                  <input
                    className="text-center text-muted bg-white rounded-xl px-3 py-2 border border-border text-xs"
                    value={s.label} onChange={e => updateStat(i, "label", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* ── Services Section ── */}
        <Card title="🛠️ الخدمات">
          <Field label="عنوان القسم">
            <input value={config.services.heading} onChange={e => setSvc("heading", e.target.value)} />
          </Field>
          <Field label="الوصف">
            <input value={config.services.subheading} onChange={e => setSvc("subheading", e.target.value)} />
          </Field>

          <div className="mt-4 flex flex-col gap-4">
            {config.services.items.map((s, i) => (
              <div key={i} className="bg-[#F8F9FB] rounded-2xl p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    className="w-12 text-center bg-white rounded-xl border border-border py-2 text-xl"
                    value={s.icon} onChange={e => updateService(i, "icon", e.target.value)}
                  />
                  <input
                    className="flex-1 bg-white rounded-xl border border-border px-3 py-2 font-800 text-heading text-sm"
                    value={s.title} onChange={e => updateService(i, "title", e.target.value)}
                  />
                </div>
                <textarea
                  rows={2}
                  className="w-full bg-white rounded-xl border border-border px-3 py-2 text-sm text-muted mb-3 resize-none"
                  value={s.desc} onChange={e => updateService(i, "desc", e.target.value)}
                />
                <input
                  className="w-full bg-white rounded-xl border border-border px-3 py-2 text-xs text-muted"
                  placeholder="tags (مفصولة بفاصلة)"
                  value={s.tags.join(", ")} onChange={e => updateService(i, "tags", e.target.value)}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Save bottom */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-6 bg-primary text-white py-4 rounded-2xl font-900 text-lg shadow-primary hover:bg-primary-dark transition-all disabled:opacity-60"
        >
          {saving ? "جاري الحفظ..." : saved ? "✅ تم الحفظ!" : "💾 حفظ كل التغييرات"}
        </button>
      </div>
    </div>
  );
}

// ── UI helpers ────────────────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-border shadow-card mb-6">
      <h2 className="text-lg font-900 text-heading mb-5">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-800 text-muted mb-1.5">{label}</label>
      <div className="[&_input]:w-full [&_input]:bg-[#F8F9FB] [&_input]:border [&_input]:border-border [&_input]:rounded-xl [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-sm [&_input]:text-heading [&_input]:outline-none [&_input]:focus:border-primary [&_textarea]:w-full [&_textarea]:bg-[#F8F9FB] [&_textarea]:border [&_textarea]:border-border [&_textarea]:rounded-xl [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:text-sm [&_textarea]:text-heading [&_textarea]:outline-none [&_textarea]:focus:border-primary [&_textarea]:resize-none">
        {children}
      </div>
    </div>
  );
}
