"use client";
import { useEffect, useState } from "react";
import { giftxDb } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  fetchGiftArtsProducts,
  fetchToysXProducts,
  fetchGiftArtsCategories,
  fetchToysXCategories,
  fetchOrders,
} from "@/lib/firestore";
import OrdersDashboard from "@/components/dashboard/OrdersDashboard";

type DashTab = "overview" | "orders" | "stores" | "website";

export default function DashboardPage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading, isAdmin, signOut: authSignOut } = useAuth();
  const [statsLoading, setStatsLoading] = useState(true);
  const [tab, setTab] = useState<DashTab>("overview");
  const [stats, setStats] = useState({ giftArts: 0, toysX: 0, giftCats: 0, toysCats: 0, orders: 0, pendingOrders: 0 });

  // Guard: لو مش admin يرجع للصفحة الرئيسية
  useEffect(() => {
    if (authLoading) return;
    if (!authUser) { router.replace("/"); return; }
    if (!isAdmin) { router.replace("/"); return; }
  }, [authUser, authLoading, isAdmin, router]);

  // Load stats once admin is confirmed
  useEffect(() => {
    if (authLoading || !authUser || !isAdmin) return;
    (async () => {
      const [ga, tx, gc, tc, orders] = await Promise.all([
        fetchGiftArtsProducts(),
        fetchToysXProducts(),
        fetchGiftArtsCategories(),
        fetchToysXCategories(),
        fetchOrders(giftxDb, 200),
      ]);
      setStats({
        giftArts: ga.length,
        toysX: tx.length,
        giftCats: Math.max(0, gc.length - 1),
        toysCats: Math.max(0, tc.length - 1),
        orders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
      });
      setStatsLoading(false);
    })();
  }, [authUser, authLoading, isAdmin]);

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
          <div style={{ color: "#94A3B8", fontSize: 14, fontWeight: 600 }}>جاري التحميل...</div>
        </div>
      </div>
    );
  }

  const NAV: { id: DashTab; icon: string; label: string; badge?: number }[] = [
    { id: "overview", icon: "📊", label: "نظرة عامة" },
    { id: "orders",   icon: "🛒", label: "الطلبات", badge: stats.pendingOrders || undefined },
    { id: "stores",   icon: "🏪", label: "المتاجر" },
    { id: "website",  icon: "✏️", label: "الموقع" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "system-ui, sans-serif", direction: "rtl" }}>
      {/* Top Bar */}
      <div style={{ background: "white", borderBottom: "1px solid #F1F5F9", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #F97316, #EAB308)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            🎁
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#1E293B" }}>Seymo Soft</div>
            <div style={{ fontSize: 10, color: "#94A3B8" }}>لوحة التحكم</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 12, color: "#94A3B8" }}>{authUser?.email}</div>
          <button
            onClick={() => { authSignOut(); router.replace("/"); }}
            style={{ background: "#FEE2E2", color: "#EF4444", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}
          >
            خروج
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div style={{ background: "white", borderBottom: "1px solid #F1F5F9", padding: "0 16px", display: "flex", gap: 4, overflowX: "auto" }}>
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => setTab(n.id)}
            style={{
              background: "none",
              border: "none",
              padding: "12px 16px",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: tab === n.id ? 800 : 500,
              color: tab === n.id ? "#4A6CF7" : "#64748B",
              borderBottom: tab === n.id ? "2px solid #4A6CF7" : "2px solid transparent",
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
            }}
          >
            <span>{n.icon}</span>
            <span>{n.label}</span>
            {n.badge ? (
              <span style={{ background: "#EF4444", color: "white", fontSize: 10, fontWeight: 900, padding: "1px 6px", borderRadius: 999, minWidth: 18, textAlign: "center" }}>
                {n.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "overview" && (
        <div style={{ padding: "20px 16px", maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: "#1E293B" }}>نظرة عامة</h2>

          {/* Stats Grid */}
          {statsLoading && <div style={{ textAlign: "center", padding: "20px 0", color: "#94A3B8", fontSize: 13 }}>⏳ جاري تحميل الإحصائيات...</div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Gift X — هدايا",   value: stats.giftArts,      sub: `${stats.giftCats} فئة`,        color: "#F97316", emoji: "🎁", bg: "#FFF7ED" },
              { label: "Toys X — ألعاب",  value: stats.toysX,         sub: `${stats.toysCats} فئة`,         color: "#EF4444", emoji: "🚗", bg: "#FEF2F2" },
              { label: "إجمالي الطلبات",  value: stats.orders,        sub: "من التطبيق",                    color: "#4A6CF7", emoji: "🛒", bg: "#EEF2FF" },
              { label: "طلبات جديدة",     value: stats.pendingOrders, sub: "تحتاج مراجعة",                  color: "#F97316", emoji: "⏳", bg: "#FFF7ED" },
            ].map(s => (
              <div key={s.label} style={{ background: "white", borderRadius: 16, padding: "16px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
                <div style={{ fontSize: 22, marginBottom: 6, background: s.bg, width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.emoji}</div>
                <div style={{ fontWeight: 900, fontSize: 28, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1E293B", marginTop: 4 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {stats.pendingOrders > 0 && (
              <button
                onClick={() => setTab("orders")}
                style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 12, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: "#EA580C" }}>⏳ {stats.pendingOrders} طلب جديد ينتظر مراجعتك</span>
                <span style={{ color: "#F97316", fontSize: 16 }}>←</span>
              </button>
            )}
            <a href="/stores/giftx" target="_blank" style={{ background: "white", borderRadius: 12, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none", border: "1px solid #F1F5F9" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>🏪 عرض متجر Gift X</span>
              <span style={{ color: "#94A3B8", fontSize: 16 }}>←</span>
            </a>
            <a href="/stores/karella" target="_blank" style={{ background: "white", borderRadius: 12, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none", border: "1px solid #F1F5F9" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>👗 عرض متجر Karella</span>
              <span style={{ color: "#94A3B8", fontSize: 16 }}>←</span>
            </a>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <OrdersDashboard db={giftxDb} storeLabel="Gift X" />
      )}

      {tab === "website" && (
        <div style={{ padding: "20px 16px", maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: "#1E293B" }}>تعديل الموقع</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="/dashboard/homepage" style={{ background: "white", borderRadius: 16, padding: "18px 20px", border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, background: "#EEF2FF", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏠</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#1E293B" }}>الصفحة الرئيسية</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>Hero، الخدمات، الأرقام والنصوص</div>
                </div>
              </div>
              <span style={{ color: "#4A6CF7", fontSize: 18 }}>←</span>
            </a>
          </div>
        </div>
      )}

      {tab === "stores" && (
        <div style={{ padding: "20px 16px", maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: "#1E293B" }}>المتاجر</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { name: "Gift X", desc: "هدايا وألعاب — toysx + giftarts", slug: "giftx", emoji: "🎁", color: "#F97316" },
              { name: "Karella", desc: "أقمشة وستائر — Makadi / Hurghada", slug: "karella", emoji: "👗", color: "#8B5CF6" },
            ].map(s => (
              <div key={s.slug} style={{ background: "white", borderRadius: 16, padding: "16px", border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 42, height: 42, background: s.color + "22", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.emoji}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#1E293B" }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{s.desc}</div>
                    </div>
                  </div>
                  <a
                    href={`/stores/${s.slug}`}
                    target="_blank"
                    style={{ background: s.color + "22", color: s.color, padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}
                  >
                    عرض المتجر ←
                  </a>
                </div>
                <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "#64748B" }}>
                  🔧 تخصيص الألوان والأقسام — قريباً
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
