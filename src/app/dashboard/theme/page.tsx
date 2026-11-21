"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  getSiteTheme, saveSiteTheme, applyTheme,
  SiteTheme, DEFAULT_THEME, GOOGLE_FONTS,
} from "@/lib/themeConfig";

export default function ThemeEditor() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [theme, setTheme] = useState<SiteTheme>(DEFAULT_THEME);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role === "customer")) router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    getSiteTheme().then(t => { setTheme(t); setFetching(false); applyTheme(t); });
  }, []);

  // Preview in real-time
  const updateColor = (key: keyof SiteTheme["colors"], val: string) => {
    const next = { ...theme, colors: { ...theme.colors, [key]: val } };
    setTheme(next);
    applyTheme(next);
  };

  const updateFont = (key: keyof SiteTheme["font"], val: string | number) => {
    const next = { ...theme, font: { ...theme.font, [key]: val } };
    setTheme(next);
    applyTheme(next);
  };

  const updateRadius = (key: keyof SiteTheme["radius"], val: number) => {
    const next = { ...theme, radius: { ...theme.radius, [key]: val } };
    setTheme(next);
    applyTheme(next);
  };

  const updateSpacing = (key: keyof SiteTheme["spacing"], val: number) => {
    const next = { ...theme, spacing: { ...theme.spacing, [key]: val } };
    setTheme(next);
    applyTheme(next);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveSiteTheme(theme);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setTheme(DEFAULT_THEME);
    applyTheme(DEFAULT_THEME);
  };

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-muted">جاري التحميل...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-20 pb-16 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-900 text-heading">🎨 محرر الثيم</h1>
            <p className="text-sm text-muted mt-1">التغييرات تظهر مباشرة على الموقع</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleReset} className="px-4 py-2.5 rounded-xl border border-border text-sm font-700 text-muted bg-white hover:bg-gray-50 transition-all">
              إعادة ضبط
            </button>
            <button onClick={handleSave} disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-800 shadow-primary hover:bg-primary-dark transition-all disabled:opacity-60">
              {saving ? "جاري الحفظ..." : saved ? "✅ تم!" : "💾 حفظ"}
            </button>
          </div>
        </div>

        {/* ── الألوان ── */}
        <Section title="🎨 الألوان">
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "primary",    label: "اللون الأساسي" },
              { key: "primaryDark",label: "الأساسي (داكن)" },
              { key: "primaryBg",  label: "خلفية الأساسي" },
              { key: "bg",         label: "خلفية الموقع" },
              { key: "heading",    label: "لون العناوين" },
              { key: "muted",      label: "لون النص الخافت" },
              { key: "border",     label: "لون الحدود" },
              { key: "giftx",      label: "لون Gift X" },
              { key: "giftxBg",    label: "خلفية Gift X" },
              { key: "karella",    label: "لون Karella" },
              { key: "karellaBg",  label: "خلفية Karella" },
            ].map(({ key, label }) => (
              <ColorPicker
                key={key}
                label={label}
                value={theme.colors[key as keyof SiteTheme["colors"]]}
                onChange={val => updateColor(key as keyof SiteTheme["colors"], val)}
              />
            ))}
          </div>
        </Section>

        {/* ── الخطوط ── */}
        <Section title="🔤 الخطوط">
          <div className="mb-4">
            <label className="block text-xs font-800 text-muted mb-2">نوع الخط</label>
            <select
              value={theme.font.family}
              onChange={e => updateFont("family", e.target.value)}
              className="w-full bg-[#F8F9FB] border border-border rounded-xl px-3 py-2.5 text-sm text-heading outline-none focus:border-primary"
            >
              {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "sizeBase", label: "حجم النص الأساسي", min: 12, max: 24 },
              { key: "sizeH1",   label: "حجم H1 (العنوان الكبير)", min: 32, max: 96 },
              { key: "sizeH2",   label: "حجم H2", min: 24, max: 72 },
              { key: "sizeH3",   label: "حجم H3", min: 16, max: 48 },
            ].map(({ key, label, min, max }) => (
              <SliderField
                key={key}
                label={label}
                value={theme.font[key as keyof typeof theme.font] as number}
                min={min} max={max} unit="px"
                onChange={val => updateFont(key as keyof SiteTheme["font"], val)}
              />
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-xs font-800 text-muted mb-2">وزن الخط الأساسي</label>
            <div className="flex gap-2 flex-wrap">
              {[400, 500, 600, 700, 800].map(w => (
                <button
                  key={w}
                  onClick={() => updateFont("weightBase", w)}
                  className={`px-4 py-2 rounded-xl text-sm transition-all ${theme.font.weightBase === w ? "bg-primary text-white" : "bg-[#F8F9FB] border border-border text-muted"}`}
                  style={{ fontWeight: w }}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ── الأحجام والمسافات ── */}
        <Section title="📐 الأحجام والشكل">
          <div className="grid grid-cols-2 gap-4">
            <SliderField
              label="استدارة الكروت"
              value={theme.radius.card} min={0} max={40} unit="px"
              onChange={val => updateRadius("card", val)}
            />
            <SliderField
              label="استدارة الأزرار"
              value={theme.radius.button} min={0} max={40} unit="px"
              onChange={val => updateRadius("button", val)}
            />
            <SliderField
              label="المسافة العمودية بين الأقسام"
              value={theme.spacing.sectionPadY} min={40} max={160} unit="px"
              onChange={val => updateSpacing("sectionPadY", val)}
            />
          </div>
        </Section>

        {/* Preview bar */}
        <div className="bg-white rounded-3xl p-5 border border-border shadow-card mt-2">
          <div className="text-xs font-800 text-muted mb-3">معاينة سريعة</div>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="w-10 h-10 rounded-full" style={{ background: theme.colors.primary }} />
            <div className="w-10 h-10 rounded-full" style={{ background: theme.colors.giftx }} />
            <div className="w-10 h-10 rounded-full" style={{ background: theme.colors.karella }} />
            <button
              className="px-5 py-2 text-white text-sm font-700"
              style={{ background: theme.colors.primary, borderRadius: theme.radius.button }}
            >
              زر تجريبي
            </button>
            <div
              className="px-5 py-3 text-sm font-800"
              style={{
                background: theme.colors.bg,
                color: theme.colors.heading,
                borderRadius: theme.radius.card,
                fontFamily: `'${theme.font.family}', sans-serif`,
                fontSize: theme.font.sizeBase,
              }}
            >
              نص تجريبي — {theme.font.family}
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full mt-6 bg-primary text-white py-4 rounded-2xl font-900 text-lg shadow-primary hover:bg-primary-dark transition-all disabled:opacity-60">
          {saving ? "جاري الحفظ..." : saved ? "✅ تم الحفظ!" : "💾 حفظ الثيم"}
        </button>
      </div>
    </div>
  );
}

// ── UI Components ─────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-border shadow-card mb-5">
      <h2 className="text-base font-900 text-heading mb-5">{title}</h2>
      {children}
    </div>
  );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-border shadow-sm flex-shrink-0">
        <input
          type="color" value={value}
          onChange={e => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="w-full h-full" style={{ background: value }} />
      </div>
      <div>
        <div className="text-xs font-700 text-heading">{label}</div>
        <div className="text-xs text-muted font-mono">{value}</div>
      </div>
    </label>
  );
}

function SliderField({ label, value, min, max, unit, onChange }: {
  label: string; value: number; min: number; max: number; unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <label className="text-xs font-800 text-muted">{label}</label>
        <span className="text-xs font-900 text-primary">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}
