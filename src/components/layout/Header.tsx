"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useEditor } from "@/components/editor/EditorContext";

const navLinks = [
  { href: "/#services", label: "خدماتنا" },
  { href: "/portfolio", label: "أعمالنا" },
  { href: "/#contact",  label: "تواصل معنا" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const { user, loading, signInWithEmail, signOut, isAdmin } = useAuth();
  const { openEditor } = useEditor();
  const router = useRouter();
  const isSuperAdmin = user?.role === "super_admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = () => setUserMenuOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [userMenuOpen]);

  // أغلق login modal لو user اتغير
  useEffect(() => {
    if (user) { setLoginOpen(false); setLoginEmail(""); setLoginPassword(""); setLoginError(""); }
  }, [user]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    const err = await signInWithEmail(loginEmail, loginPassword);
    if (err) setLoginError(err);
    setLoginLoading(false);
  }

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-card border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 select-none">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-[10px] tracking-tight">SSS</span>
            </div>
            <span className="font-black text-heading text-sm leading-tight hidden sm:block">
              Seymour Soft<br />
              <span className="text-muted font-medium text-xs">Solution</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-body hover:text-primary transition-colors font-medium">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Auth + CTA */}
          <div className="flex items-center gap-3">
            {!loading && !user && (
              <button
                onClick={() => setLoginOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-white hover:bg-gray-50 text-sm font-semibold text-heading transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                دخول
              </button>
            )}

            {!loading && user && (
              <div style={{ position: "relative" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 10, border: "1px solid #E2E8F0", background: "white", cursor: "pointer" }}
                >
                  <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#4A6CF7,#7C3AED)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 800 }}>
                    {user.email[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>
                    {user.role === "super_admin" ? "⭐" : user.role === "store_admin" ? "🏪" : "👤"}
                  </span>
                </button>

                {userMenuOpen && (
                  <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", left: 0, top: "calc(100% + 8px)", background: "white", borderRadius: 14, border: "1px solid #E2E8F0", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", minWidth: 220, zIndex: 100, padding: 8, direction: "rtl" }}>
                    <div style={{ padding: "10px 12px", borderBottom: "1px solid #F1F5F9", marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{user.email}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
                        {user.role === "super_admin" ? "⭐ Super Admin" : user.role === "store_admin" ? "🏪 صاحب متجر" : "👤 عميل"}
                      </div>
                    </div>
                    {isSuperAdmin && (
                      <button
                        onClick={() => { openEditor(); setUserMenuOpen(false); }}
                        style={{ width: "100%", padding: "9px 12px", textAlign: "right", background: "#F0FDF4", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#10B981", marginBottom: 4 }}
                      >
                        🎛️ تعديل الموقع
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => { router.push("/dashboard"); setUserMenuOpen(false); }}
                        style={{ width: "100%", padding: "9px 12px", textAlign: "right", background: "#EEF2FF", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#4A6CF7", marginBottom: 4 }}
                      >
                        ⚙️ إدارة المتجر
                      </button>
                    )}
                    <button
                      onClick={() => { signOut(); setUserMenuOpen(false); }}
                      style={{ width: "100%", padding: "9px 12px", textAlign: "right", background: "none", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#EF4444", fontWeight: 600 }}
                    >
                      خروج
                    </button>
                  </div>
                )}
              </div>
            )}

            <Link href="#contact" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all">
              ابدأ مشروعك ←
            </Link>

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="w-5 h-0.5 bg-heading mb-1 transition-all" />
              <div className="w-5 h-0.5 bg-heading mb-1 transition-all" />
              <div className="w-5 h-0.5 bg-heading transition-all" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-border px-6 py-4 flex flex-col gap-4">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-body hover:text-primary font-medium" onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            ))}
            {!user && (
              <button onClick={() => { setLoginOpen(true); setMenuOpen(false); }} className="text-sm font-semibold text-primary text-right">
                دخول
              </button>
            )}
            {user && isAdmin && (
              <button onClick={() => { router.push("/dashboard"); setMenuOpen(false); }} className="text-sm font-semibold text-primary text-right">
                ⚙️ إدارة المتجر
              </button>
            )}
            {user && (
              <button onClick={() => signOut()} className="text-sm font-semibold text-red-500 text-right">
                خروج
              </button>
            )}
          </div>
        )}
      </header>

      {/* Login Modal */}
      {loginOpen && (
        <div
          onClick={() => setLoginOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "white", borderRadius: 20, padding: 28, width: "100%", maxWidth: 380, direction: "rtl", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
          >
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🔐</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1E293B", margin: 0 }}>تسجيل الدخول</h2>
              <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>ادخل بالإيميل وكلمة المرور</p>
            </div>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>البريد الإلكتروني</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  placeholder="example@email.com"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, outline: "none", boxSizing: "border-box", direction: "ltr", textAlign: "left" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>كلمة المرور</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {loginError && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#EF4444", fontWeight: 600 }}>
                  ❌ {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                style={{ background: loginLoading ? "#94A3B8" : "#4A6CF7", color: "white", border: "none", borderRadius: 12, padding: "12px", fontSize: 15, fontWeight: 800, cursor: loginLoading ? "not-allowed" : "pointer", marginTop: 4 }}
              >
                {loginLoading ? "جاري الدخول..." : "دخول ←"}
              </button>
            </form>

            <button
              onClick={() => setLoginOpen(false)}
              style={{ width: "100%", marginTop: 10, background: "none", border: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer", padding: "8px" }}
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </>
  );
}
