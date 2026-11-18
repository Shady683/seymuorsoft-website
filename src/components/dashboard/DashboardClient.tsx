"use client";

import { useState } from "react";
import type { DashboardNav } from "@/lib/types";
import { mockOrders } from "@/lib/data";
import { orderStatusStyle } from "@/lib/utils";

const NAV_ITEMS: { id: DashboardNav | "messages"; icon: string; label: string; badge?: string }[] = [
  { id: "overview",  icon: "📊", label: "نظرة عامة" },
  { id: "products",  icon: "📦", label: "المنتجات" },
  { id: "orders",    icon: "🛒", label: "الطلبات",   badge: "3" },
  { id: "messages",  icon: "💬", label: "الرسائل",   badge: "1" },
];

const STAT_CARDS = [
  { icon: "💰", iconBg: "#FFF7ED", label: "الإيرادات (شهري)",  value: "48,750 ج", change: "+12%", positive: true },
  { icon: "🛒", iconBg: "#EEF2FF", label: "إجمالي الطلبات",   value: "142",      change: "+8%",  positive: true },
  { icon: "📦", iconBg: "#FEF9C3", label: "منتج متاح",         value: "12",       change: "±0",   positive: null },
  { icon: "👥", iconBg: "#FCE7F3", label: "عملاء جدد",         value: "28",       change: "+5%",  positive: true },
];

const PRODUCTS = [
  { name: "دمية أميرة الثلج",    cat: "ألعاب",  price: 150, emoji: "🧸", stock: "٢٤", stockOk: true },
  { name: "مجموعة ليغو 200",     cat: "ألعاب",  price: 280, emoji: "🧱", stock: "١٢", stockOk: true },
  { name: "سيارة ريموت",         cat: "ألعاب",  price: 380, emoji: "🚗", stock: "٨",  stockOk: true },
  { name: "بوكس هدية كيوت",      cat: "هدايا",  price: 220, emoji: "🎁", stock: "٣٠", stockOk: true },
  { name: "شوكولاتة بلجيكية",    cat: "هدايا",  price: 95,  emoji: "🍫", stock: "٥٠", stockOk: true },
  { name: "بازل 1000 قطعة",      cat: "ألعاب",  price: 190, emoji: "🧩", stock: "نفد", stockOk: false },
];

const ORDER_FILTERS = ["الكل", "جديد", "جارية", "مكتملة", "ملغية"];

export default function DashboardClient() {
  const [screen, setScreen] = useState<"login" | "dashboard">("login");
  const [nav, setNav] = useState<string>("overview");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orderFilter, setOrderFilter] = useState("الكل");

  const canLogin = email.trim() !== "" && password.trim() !== "";

  const handleLogin = () => {
    if (canLogin) setScreen("dashboard");
  };

  const filteredOrders = mockOrders.filter(
    (o) => orderFilter === "الكل" || o.cat === orderFilter
  );

  if (screen === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-bg via-bg to-[#F5F3FF] flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2.5 bg-white px-5 py-3 rounded-2xl shadow-card border border-border">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xs">SSS</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-900 text-heading leading-none">Seymour Soft Solution</div>
                <div className="text-xs text-muted mt-0.5">بوابة أصحاب المتاجر</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-10 shadow-card-hover border border-border">
            <h1 className="text-2xl font-black text-heading mb-1 text-center">أهلاً بيك 👋</h1>
            <p className="text-muted text-sm text-center mb-8">ادخل بياناتك عشان تدير متجرك</p>

            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="block text-sm font-700 text-heading mb-2">الإيميل</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="store@gmail.com"
                  className="w-full px-4 py-3 border-2 border-border rounded-xl text-sm text-heading focus:border-primary outline-none bg-bg ltr text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-700 text-heading mb-2">كلمة السر</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-border rounded-xl text-sm text-heading focus:border-primary outline-none bg-bg"
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={!canLogin}
              className="w-full py-3.5 rounded-xl font-900 text-white transition-all"
              style={{
                background: canLogin ? "#4A6CF7" : "#CBD5E1",
                boxShadow: canLogin ? "0 6px 24px rgba(74,108,247,0.35)" : "none",
              }}
            >
              دخول ←
            </button>

            <p className="text-center text-xs text-muted mt-4">
              للتجربة: أي إيميل + أي كلمة سر
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──────────────────────────────────────────────
  return (
    <div className="flex min-h-screen" style={{ direction: "ltr" }}>
      {/* Sidebar */}
      <aside className="w-60 bg-heading flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Store identity */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5" style={{ direction: "rtl" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #F97316, #EAB308)" }}>
              🎁
            </div>
            <div>
              <div className="text-white font-900 text-sm">Gift X</div>
              <div className="text-white/40 text-xs">متجر الهدايا والألعاب</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3 flex-1" style={{ direction: "rtl" }}>
          <p className="text-white/30 text-[10px] font-700 tracking-widest px-2 mb-2">القائمة</p>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setNav(item.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-1 font-700 text-sm transition-colors text-right"
              style={{
                background: nav === item.id ? "#1E3A5F" : "transparent",
                color:      nav === item.id ? "#fff" : "#64748B",
              }}
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-danger text-white text-[10px] font-900 px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <p className="text-white/30 text-[10px] font-700 tracking-widest px-2 mb-2 mt-4">الإعدادات</p>
          <button
            onClick={() => setNav("settings")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-700 text-sm transition-colors text-right"
            style={{
              background: nav === "settings" ? "#1E3A5F" : "transparent",
              color:      nav === "settings" ? "#fff" : "#64748B",
            }}
          >
            <span className="text-base">⚙️</span>
            <span>الإعدادات</span>
          </button>
        </nav>

        {/* User + logout */}
        <div className="p-3 border-t border-white/10" style={{ direction: "rtl" }}>
          <div className="flex items-center gap-2.5 bg-white/5 rounded-xl p-2.5 mb-2">
            <div className="w-8 h-8 bg-giftx rounded-full flex items-center justify-center text-white font-900 text-sm flex-shrink-0">
              {email ? email[0].toUpperCase() : "G"}
            </div>
            <div className="overflow-hidden">
              <div className="text-white text-xs font-700 truncate">{email || "store@gmail.com"}</div>
              <div className="text-white/40 text-[10px]">صاحب المتجر</div>
            </div>
          </div>
          <button
            onClick={() => { setScreen("login"); setEmail(""); setPassword(""); }}
            className="w-full text-center text-white/40 hover:text-white text-xs py-2 transition-colors"
          >
            تسجيل خروج →
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-bg" style={{ direction: "rtl" }}>
        {/* Topbar */}
        <div className="sticky top-0 z-10 bg-white border-b border-border px-8 h-16 flex items-center justify-between">
          <h1 className="text-lg font-900 text-heading">
            {{ overview: "نظرة عامة", products: "المنتجات", orders: "الطلبات", messages: "الرسائل", settings: "الإعدادات" }[nav] || nav}
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="w-9 h-9 bg-border-light rounded-xl flex items-center justify-center text-lg">🔔</button>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white" />
            </div>
            <span className="text-xs text-muted font-500">الاثنين ١٧ نوفمبر ٢٠٢٤</span>
          </div>
        </div>

        {/* ── Overview ── */}
        {nav === "overview" && (
          <div className="p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {STAT_CARDS.map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-5 border border-border shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: s.iconBg }}>{s.icon}</div>
                    <span
                      className="text-xs font-700 px-2.5 py-1 rounded-full"
                      style={
                        s.positive === true  ? { color: "#16A34A", background: "#DCFCE7" }
                      : s.positive === false ? { color: "#EF4444", background: "#FEF2F2" }
                      :                        { color: "#64748B", background: "#F1F5F9" }
                      }
                    >{s.change}</span>
                  </div>
                  <div className="text-2xl font-900 text-heading">{s.value}</div>
                  <div className="text-xs text-muted mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent orders */}
              <div className="bg-white rounded-2xl p-6 border border-border shadow-card">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-900 text-heading">آخر الطلبات</h3>
                  <button onClick={() => setNav("orders")} className="text-xs font-700 text-primary bg-primary-bg px-3 py-1.5 rounded-lg">
                    عرض الكل
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {mockOrders.slice(0, 5).map((o) => {
                    const ss = orderStatusStyle(o.status);
                    return (
                      <div key={o.id} className="flex items-center gap-3 bg-bg p-3 rounded-xl">
                        <div className="w-9 h-9 bg-primary-bg rounded-xl flex items-center justify-center text-base flex-shrink-0">🛍️</div>
                        <div className="flex-1">
                          <div className="text-sm font-700 text-heading">{o.name}</div>
                          <div className="text-xs text-muted">{o.date}</div>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-900 text-heading">{o.amount} ج</div>
                          <span className="text-[10px] font-700 px-2 py-0.5 rounded-full"
                            style={{ color: ss.color, background: ss.bg }}>{o.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top products */}
              <div className="bg-white rounded-2xl p-6 border border-border shadow-card">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-900 text-heading">الأكثر مبيعاً</h3>
                  <button onClick={() => setNav("products")} className="text-xs font-700 text-primary bg-primary-bg px-3 py-1.5 rounded-lg">إدارة</button>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { name:"مجموعة ليغو",    emoji:"🧱", sold:48, w:"88%" },
                    { name:"بوكس هدية كيوت",emoji:"🎁", sold:36, w:"66%" },
                    { name:"سيارة ريموت",   emoji:"🚗", sold:29, w:"52%" },
                    { name:"دمية أميرة",    emoji:"🧸", sold:21, w:"38%" },
                    { name:"بازل 1000",     emoji:"🧩", sold:15, w:"27%" },
                  ].map((tp) => (
                    <div key={tp.name} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-giftx-bg rounded-xl flex items-center justify-center text-xl flex-shrink-0">{tp.emoji}</div>
                      <div className="flex-1">
                        <div className="text-sm font-700 text-heading mb-1">{tp.name}</div>
                        <div className="h-1.5 bg-border-light rounded-full overflow-hidden">
                          <div className="h-full bg-giftx rounded-full" style={{ width: tp.w }} />
                        </div>
                      </div>
                      <div className="text-sm font-800 text-heading flex-shrink-0">{tp.sold}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Products ── */}
        {nav === "products" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted text-sm">٦ منتجات في المتجر</p>
              <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-800 text-sm shadow-primary hover:bg-primary-dark transition-colors">
                <span className="text-lg">+</span> إضافة منتج
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-5 bg-bg border-b border-border">
                {["المنتج", "الفئة", "السعر", "المخزون", "إجراء"].map((h) => (
                  <div key={h} className="p-4 text-xs font-700 text-muted">{h}</div>
                ))}
              </div>
              {PRODUCTS.map((p) => (
                <div key={p.name} className="grid grid-cols-5 border-b border-border-light last:border-0">
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-giftx-bg rounded-lg flex items-center justify-center text-lg flex-shrink-0">{p.emoji}</div>
                    <span className="text-sm font-700 text-heading">{p.name}</span>
                  </div>
                  <div className="p-4 flex items-center">
                    <span className="text-xs font-700 px-2.5 py-1 bg-giftx-bg text-giftx rounded-full">{p.cat}</span>
                  </div>
                  <div className="p-4 flex items-center text-sm font-800 text-heading">{p.price} ج</div>
                  <div className="p-4 flex items-center">
                    <span
                      className="text-xs font-700 px-2.5 py-1 rounded-full"
                      style={p.stockOk
                        ? { color: "#16A34A", background: "#DCFCE7" }
                        : { color: "#EF4444", background: "#FEF2F2" }
                      }
                    >
                      {p.stockOk ? `متاح ${p.stock}` : "نفد المخزون"}
                    </span>
                  </div>
                  <div className="p-4 flex items-center gap-2">
                    <button className="bg-primary-bg text-primary px-3 py-1.5 rounded-lg text-xs font-700">تعديل</button>
                    <button className="bg-danger-bg text-danger px-3 py-1.5 rounded-lg text-xs font-700">حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Orders ── */}
        {nav === "orders" && (
          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {ORDER_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setOrderFilter(f)}
                  className="px-4 py-1.5 rounded-full text-sm font-700 border-2 transition-colors"
                  style={{
                    background: orderFilter === f ? "#4A6CF7" : "#fff",
                    color:      orderFilter === f ? "#fff"    : "#64748B",
                    borderColor:orderFilter === f ? "#4A6CF7" : "#E2E8F0",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="grid grid-cols-6 bg-bg border-b border-border">
                {["#", "العميل", "المنتجات", "المبلغ", "الحالة", "التاريخ"].map((h) => (
                  <div key={h} className="p-4 text-xs font-700 text-muted">{h}</div>
                ))}
              </div>
              {filteredOrders.map((o) => {
                const ss = orderStatusStyle(o.status);
                const avatarColors = ["#F97316","#8B5CF6","#EC4899","#06B6D4","#10B981"];
                const avatarColor = avatarColors[parseInt(o.id) % avatarColors.length];
                return (
                  <div key={o.id} className="grid grid-cols-6 border-b border-border-light last:border-0">
                    <div className="p-4 flex items-center text-sm font-700 text-primary">#{o.id}</div>
                    <div className="p-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-900 flex-shrink-0"
                        style={{ background: avatarColor }}>{o.name[0]}</div>
                      <span className="text-sm font-700 text-heading">{o.name}</span>
                    </div>
                    <div className="p-4 flex items-center text-sm text-muted">{o.items} منتج</div>
                    <div className="p-4 flex items-center text-sm font-900 text-heading">{o.amount} ج</div>
                    <div className="p-4 flex items-center">
                      <span className="text-xs font-700 px-2.5 py-1 rounded-full"
                        style={{ color: ss.color, background: ss.bg }}>{o.status}</span>
                    </div>
                    <div className="p-4 flex items-center text-xs text-muted">{o.date}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Settings ── */}
        {nav === "settings" && (
          <div className="p-8 max-w-lg">
            <div className="bg-white rounded-2xl p-6 border border-border shadow-card mb-5">
              <h3 className="font-900 text-heading mb-5 pb-4 border-b border-border-light">بيانات المتجر</h3>
              <div className="flex flex-col gap-4">
                {[
                  { label: "اسم المتجر",    val: "Gift X",          ltr: false },
                  { label: "رابط الصفحة",   val: "giftx",           ltr: true  },
                  { label: "رقم الواتساب",  val: "01XXXXXXXXX",     ltr: true  },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-sm font-700 text-heading mb-2">{f.label}</label>
                    <input
                      defaultValue={f.val}
                      className="w-full px-4 py-3 border-2 border-border rounded-xl text-sm text-heading focus:border-primary outline-none bg-bg"
                      style={{ direction: f.ltr ? "ltr" : "rtl", textAlign: "right" }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-700 text-heading mb-2">وصف المتجر</label>
                  <textarea rows={3} defaultValue="ألعاب، هدايا، وإكسسوارات مختارة بعناية بأسعار تنافسية وتوصيل سريع"
                    className="w-full px-4 py-3 border-2 border-border rounded-xl text-sm text-heading focus:border-primary outline-none bg-bg resize-none" />
                </div>
              </div>
              <button className="mt-5 bg-primary text-white px-6 py-2.5 rounded-xl font-800 text-sm shadow-primary hover:bg-primary-dark transition-colors">
                حفظ التغييرات ✓
              </button>
            </div>
            <div className="bg-danger-bg rounded-2xl p-5 border border-red-200">
              <h3 className="font-900 text-danger mb-1">منطقة الخطر</h3>
              <p className="text-muted text-sm mb-4">حذف المتجر سيمسح كل البيانات بشكل نهائي</p>
              <button className="bg-danger text-white px-5 py-2 rounded-xl font-800 text-sm">حذف المتجر</button>
            </div>
          </div>
        )}

        {/* Messages placeholder */}
        {nav === "messages" && (
          <div className="p-8 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-900 text-heading mb-2">الرسائل</h3>
              <p className="text-muted">قريباً — نظام رسائل متكامل مع العملاء</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
