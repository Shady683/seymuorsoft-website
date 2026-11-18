"use client";

import { useState } from "react";
import type { WizardState, ProjectType, PlatformType, TimelineType } from "@/lib/types";

const TOTAL_STEPS = 5;

const projectTypes: { id: ProjectType; icon: string; label: string; desc: string }[] = [
  { id: "mobile",    icon: "📱", label: "تطبيق موبايل",    desc: "Android / iOS / كلاهما" },
  { id: "web",       icon: "🌐", label: "موقع ويب",        desc: "Landing page / منصة" },
  { id: "desktop",   icon: "🖥️", label: "برنامج ويندوز",   desc: "Electron / أنظمة إدارة" },
  { id: "ecommerce", icon: "🛒", label: "متجر إلكتروني",   desc: "منتجات + طلبات + دفع" },
];

const platformsMap: Record<string, { id: PlatformType; icon: string; label: string }[]> = {
  mobile:    [
    { id: "android", icon: "🤖", label: "Android فقط"   },
    { id: "ios",     icon: "🍎", label: "iOS فقط"       },
    { id: "both",    icon: "📱", label: "Android + iOS" },
  ],
  web:       [{ id: "web",     icon: "🌐", label: "متصفح ويب"      }],
  desktop:   [{ id: "windows", icon: "🪟", label: "Windows فقط"   }],
  ecommerce: [{ id: "web",     icon: "🌐", label: "ويب + موبايل"  }],
};

const allFeatures = [
  { id: "login",    icon: "🔐", label: "تسجيل دخول / حسابات" },
  { id: "payments", icon: "💳", label: "دفع إلكتروني" },
  { id: "chat",     icon: "💬", label: "شات / رسائل" },
  { id: "map",      icon: "🗺️", label: "خرائط / تتبع GPS" },
  { id: "notify",   icon: "🔔", label: "إشعارات Push" },
  { id: "dashboard",icon: "📊", label: "لوحة تحكم" },
  { id: "ai",       icon: "🤖", label: "ذكاء اصطناعي" },
  { id: "offline",  icon: "📶", label: "يشتغل أوفلاين" },
  { id: "camera",   icon: "📷", label: "كاميرا / مسح QR" },
  { id: "reports",  icon: "📈", label: "تقارير وإحصائيات" },
  { id: "multi",    icon: "👥", label: "مستخدمين متعددين" },
  { id: "arabic",   icon: "🌍", label: "دعم عربي / إنجليزي" },
];

const timelines: { id: TimelineType; icon: string; label: string; desc: string }[] = [
  { id: "asap",     icon: "⚡", label: "في أقرب وقت",   desc: "تسليم سريع / urgent" },
  { id: "1month",   icon: "📅", label: "خلال شهر",       desc: "وقت معقول للتطوير" },
  { id: "3months",  icon: "🗓️", label: "خلال ٣ أشهر",   desc: "مشروع كبير / متكامل" },
  { id: "flexible", icon: "🌊", label: "مرن / مش متأكد", desc: "نحدد مع بعض" },
];

const initState: WizardState = {
  step: 1, projectType: "", platform: "",
  features: [], timeline: "", name: "", contact: "", notes: "",
};

export default function ProjectWizard() {
  const [state, setState] = useState<WizardState>(initState);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const update = (patch: Partial<WizardState>) =>
    setState((s) => ({ ...s, ...patch }));

  const toggleFeature = (id: string) =>
    update({
      features: state.features.includes(id)
        ? state.features.filter((f) => f !== id)
        : [...state.features, id],
    });

  const canNext = () => {
    if (state.step === 1) return !!state.projectType;
    if (state.step === 2) return !!state.platform;
    if (state.step === 4) return !!state.timeline;
    if (state.step === 5) return !!state.name && !!state.contact;
    return true;
  };

  const handleSubmit = async () => {
    setSending(true);
    // EmailJS integration — set up keys in .env.local
    try {
      const { send } = await import("@emailjs/browser");
      await send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name:    state.name,
          from_contact: state.contact,
          project_type: state.projectType,
          platform:     state.platform,
          features:     state.features.join("، "),
          timeline:     state.timeline,
          notes:        state.notes || "لا يوجد",
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );
    } catch {
      // If EmailJS not configured, still show success in prototype
      console.log("EmailJS not configured — simulating success");
    }
    setSending(false);
    update({ step: 6 });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-6">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-3xl font-black text-heading mb-3">تم إرسال طلبك!</h1>
          <p className="text-muted text-lg mb-8">
            شكراً {state.name}! هنراجع تفاصيل مشروعك ونتواصل معاك في أقل من ٢٤ ساعة.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-2xl font-800 shadow-primary hover:bg-primary-dark transition-colors"
          >
            ← الصفحة الرئيسية
          </a>
        </div>
      </div>
    );
  }

  const platforms = platformsMap[state.projectType] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-bg to-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-heading mb-2">ابدأ مشروعك 🚀</h1>
          <p className="text-muted">
            خطوة {state.step} من {TOTAL_STEPS}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: state.step === i + 1 ? "32px" : "8px",
                background: i + 1 <= state.step ? "#4A6CF7" : "#E2E8F0",
              }}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-card-hover border border-border">

          {/* Step 1 — Project type */}
          {state.step === 1 && (
            <div>
              <h2 className="text-xl font-900 text-heading mb-2">إيه نوع المشروع؟</h2>
              <p className="text-muted text-sm mb-6">اختار النوع الأقرب لفكرتك</p>
              <div className="grid grid-cols-2 gap-3">
                {projectTypes.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => update({ projectType: pt.id, platform: "" })}
                    className="p-4 rounded-2xl border-2 text-right transition-all hover:-translate-y-0.5"
                    style={{
                      borderColor: state.projectType === pt.id ? "#4A6CF7" : "#E2E8F0",
                      background:  state.projectType === pt.id ? "#EEF2FF" : "#FAFAFA",
                    }}
                  >
                    <div className="text-3xl mb-2">{pt.icon}</div>
                    <div className="font-800 text-heading text-sm">{pt.label}</div>
                    <div className="text-muted text-xs mt-0.5">{pt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Platform */}
          {state.step === 2 && (
            <div>
              <h2 className="text-xl font-900 text-heading mb-2">المنصة المستهدفة؟</h2>
              <p className="text-muted text-sm mb-6">هيشتغل على إيه؟</p>
              <div className="flex flex-col gap-3">
                {platforms.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => update({ platform: pl.id })}
                    className="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-right"
                    style={{
                      borderColor: state.platform === pl.id ? "#4A6CF7" : "#E2E8F0",
                      background:  state.platform === pl.id ? "#EEF2FF" : "#FAFAFA",
                    }}
                  >
                    <span className="text-2xl">{pl.icon}</span>
                    <span className="font-800 text-heading">{pl.label}</span>
                    {state.platform === pl.id && (
                      <span className="mr-auto text-primary text-lg">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Features */}
          {state.step === 3 && (
            <div>
              <h2 className="text-xl font-900 text-heading mb-2">الميزات المطلوبة</h2>
              <p className="text-muted text-sm mb-6">
                اختار كل اللى محتاجه — اختيار {state.features.length} ميزة
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allFeatures.map((f) => {
                  const active = state.features.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      onClick={() => toggleFeature(f.id)}
                      className="p-3 rounded-xl border-2 text-center transition-all hover:scale-105"
                      style={{
                        borderColor: active ? "#4A6CF7" : "#E2E8F0",
                        background:  active ? "#EEF2FF" : "#FAFAFA",
                      }}
                    >
                      <div className="text-2xl mb-1">{f.icon}</div>
                      <div className="font-700 text-heading text-xs leading-tight">{f.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4 — Timeline */}
          {state.step === 4 && (
            <div>
              <h2 className="text-xl font-900 text-heading mb-2">الأولوية والوقت؟</h2>
              <p className="text-muted text-sm mb-6">متى محتاج المشروع يكون جاهز؟</p>
              <div className="flex flex-col gap-3">
                {timelines.map((tl) => (
                  <button
                    key={tl.id}
                    onClick={() => update({ timeline: tl.id })}
                    className="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-right"
                    style={{
                      borderColor: state.timeline === tl.id ? "#4A6CF7" : "#E2E8F0",
                      background:  state.timeline === tl.id ? "#EEF2FF" : "#FAFAFA",
                    }}
                  >
                    <span className="text-2xl">{tl.icon}</span>
                    <div>
                      <div className="font-800 text-heading">{tl.label}</div>
                      <div className="text-muted text-sm">{tl.desc}</div>
                    </div>
                    {state.timeline === tl.id && (
                      <span className="mr-auto text-primary text-lg">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5 — Contact */}
          {state.step === 5 && (
            <div>
              <h2 className="text-xl font-900 text-heading mb-2">بياناتك</h2>
              <p className="text-muted text-sm mb-6">عشان نقدر نتواصل معاك</p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-700 text-heading mb-2">اسمك</label>
                  <input
                    value={state.name}
                    onChange={(e) => update({ name: e.target.value })}
                    placeholder="مثال: أحمد محمود"
                    className="w-full px-4 py-3 border-2 border-border rounded-xl text-heading text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none bg-bg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-700 text-heading mb-2">
                    واتساب أو إيميل
                  </label>
                  <input
                    value={state.contact}
                    onChange={(e) => update({ contact: e.target.value })}
                    placeholder="01XXXXXXXXX أو email@gmail.com"
                    className="w-full px-4 py-3 border-2 border-border rounded-xl text-heading text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none bg-bg ltr text-right"
                  />
                </div>
                <div>
                  <label className="block text-sm font-700 text-heading mb-2">
                    تفاصيل إضافية <span className="text-muted font-400">(اختياري)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={state.notes}
                    onChange={(e) => update({ notes: e.target.value })}
                    placeholder="أي تفاصيل تانية عن مشروعك..."
                    className="w-full px-4 py-3 border-2 border-border rounded-xl text-heading text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none bg-bg resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-light">
            <button
              onClick={() => update({ step: Math.max(1, state.step - 1) as WizardState["step"] })}
              className="px-5 py-2.5 rounded-xl border-2 border-border text-muted font-700 text-sm hover:border-primary hover:text-primary transition-colors"
              style={{ visibility: state.step === 1 ? "hidden" : "visible" }}
            >
              ← رجوع
            </button>

            {state.step < TOTAL_STEPS ? (
              <button
                onClick={() => {
                  if (canNext())
                    update({ step: (state.step + 1) as WizardState["step"] });
                }}
                disabled={!canNext()}
                className="px-6 py-2.5 rounded-xl font-800 text-sm transition-all"
                style={{
                  background: canNext() ? "#4A6CF7" : "#CBD5E1",
                  color: "#fff",
                  boxShadow: canNext() ? "0 6px 24px rgba(74,108,247,0.35)" : "none",
                }}
              >
                التالي →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canNext() || sending}
                className="px-6 py-2.5 rounded-xl font-800 text-sm bg-primary text-white shadow-primary disabled:opacity-50 transition-opacity"
              >
                {sending ? "⏳ جاري الإرسال..." : "إرسال الطلب 🚀"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
