"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { giftxAuth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { fetchGiftArtsProducts, fetchToysXProducts, fetchGiftArtsCategories, fetchToysXCategories } from "@/lib/firestore";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [stats, setStats] = useState({ giftArts: 0, toysX: 0, giftCats: 0, toysCats: 0 });

  useEffect(() => {
    const unsub = onAuthStateChanged(giftxAuth, async (u) => {
      if (!u) { router.replace("/dashboard/login"); return; }
      setUserEmail(u.email);
      const [ga, tx, gc, tc] = await Promise.all([
        fetchGiftArtsProducts(), fetchToysXProducts(),
        fetchGiftArtsCategories(), fetchToysXCategories(),
      ]);
      setStats({ giftArts: ga.length, toysX: tx.length, giftCats: gc.length - 1, toysCats: tc.length - 1 });
      setLoading(false);
    });
    return unsub;
  }, [router]);

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF7ED", fontSize: 32 }}>⏳</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#FFF7ED", fontFamily: "system-ui, sans-serif", direction: "rtl", padding: "24px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>🎁 لوحة التحكم</h1>
          <div style={{ color: "#aaa", fontSize: 11, marginTop: 2 }}>{userEmail}</div>
        </div>
        <button onClick={() => signOut(giftxAuth)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>خروج</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Gift X", sub: "هدايا", value: stats.giftArts, cats: stats.giftCats, color: "#F97316", emoji: "🎁" },
          { label: "Toys X", sub: "ألعاب", value: stats.toysX, cats: stats.toysCats, color: "#EF4444", emoji: "🚗" },
        ].map(s => (
          <div key={s.label} style={{ background: "white", borderRadius: 18, padding: "16px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.emoji}</div>
            <div style={{ fontWeight: 800, fontSize: 28, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>{s.label} · {s.sub}</div>
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{s.cats} فئة</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <a href="/stores/giftx" target="_blank" style={{ background: "white", borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>🏪 عرض متجر Gift X</span>
          <span style={{ color: "#aaa", fontSize: 18 }}>←</span>
        </a>
        <a href="/stores/karella" target="_blank" style={{ background: "white", borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>👗 عرض متجر Karella</span>
          <span style={{ color: "#aaa", fontSize: 18 }}>←</span>
        </a>
      </div>
      <div style={{ marginTop: 20, padding: "14px 16px", background: "white", borderRadius: 14, textAlign: "center", color: "#bbb", fontSize: 12 }}>
        🛠️ إضافة وتعديل المنتجات — قريباً
      </div>
    </div>
  );
}