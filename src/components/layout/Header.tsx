"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const navLinks = [
  { href: "#services", label: "خدماتنا" },
  { href: "#portfolio", label: "أعمالنا" },
  { href: "#contact",  label: "تواصل معنا" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, loading, signInWithGoogle, signOut, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // أغلق الـ user menu لو ضغط برا
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = () => setUserMenuOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [userMenuOpen]);

  return (
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
            <span className="text-primary">Solution</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-2 rounded-lg text-sm font-700 text-muted hover:text-primary hover:bg-primary-bg transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* Admin dashboard button */}
          {isAdmin && (
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-1.5 bg-[#1E293B] text-white px-3 py-2 rounded-xl text-xs font-800 hover:bg-[#0F172A] transition-colors"
            >
              ⚙️ إدارة المتجر
            </Link>
          )}

          {/* Auth button */}
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-border-light animate-pulse" />
          ) : user ? (
            /* User avatar + dropdown */
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-white border-2 border-border rounded-xl px-2 py-1.5 hover:border-primary transition-colors"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName ?? ""}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black">
                    {(user.displayName || user.email)[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-700 text-heading hidden sm:block max-w-[100px] truncate">
                  {user.displayName?.split(" ")[0] || "أنت"}
                </span>
                <span className="text-[#94A3B8] text-xs">{userMenuOpen ? "▲" : "▼"}</span>
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-border overflow-hidden z-50" style={{ direction: "rtl" }}>
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-border-light">
                    <div className="flex items-center gap-2.5">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-black">
                          {(user.displayName || user.email)[0].toUpperCase()}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <div className="text-sm font-800 text-heading truncate">{user.displayName || "مستخدم"}</div>
                        <div className="text-xs text-muted truncate">{user.email}</div>
                      </div>
                    </div>
                    {/* Role badge */}
                    <div className="mt-2">
                      <span
                        className="text-[10px] font-800 px-2 py-0.5 rounded-full"
                        style={
                          user.role === "super_admin"
                            ? { background: "#FEF3C7", color: "#D97706" }
                            : user.role === "store_admin"
                            ? { background: "#EEF2FF", color: "#4A6CF7" }
                            : { background: "#F1F5F9", color: "#64748B" }
                        }
                      >
                        {user.role === "super_admin"
                          ? "⭐ Super Admin"
                          : user.role === "store_admin"
                          ? "🏪 صاحب متجر"
                          : "👤 عميل"}
                      </span>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-2">
                    {isAdmin && (
                      <button
                        onClick={() => { setUserMenuOpen(false); router.push("/dashboard"); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-700 text-heading hover:bg-primary-bg hover:text-primary transition-colors text-right"
                      >
                        <span>⚙️</span>
                        <span>إدارة المتجر</span>
                      </button>
                    )}
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-700 text-[#EF4444] hover:bg-[#FEF2F2] transition-colors text-right"
                    >
                      <span>🚪</span>
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Sign in button */
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-2 bg-white border-2 border-border rounded-xl px-3 py-2 text-sm font-800 text-heading hover:border-primary hover:text-primary transition-colors shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
                <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
              </svg>
              <span className="hidden sm:inline">دخول</span>
            </button>
          )}

          {/* CTA */}
          <Link
            href="/wizard"
            className="hidden sm:flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-800 shadow-primary hover:bg-primary-dark transition-colors"
          >
            ابدأ مشروعك ←
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-border-light"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="قائمة"
          >
            <span className={`block w-5 h-0.5 bg-heading transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-heading transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-heading transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-6 py-4 flex flex-col gap-2">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-700 text-heading hover:bg-primary-bg hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}

          {/* Mobile auth */}
          {user ? (
            <>
              <div className="flex items-center gap-2.5 px-4 py-3 bg-[#F8FAFC] rounded-xl">
                {user.photoURL && (
                  <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                )}
                <div>
                  <div className="text-sm font-800 text-heading">{user.displayName || "مستخدم"}</div>
                  <div className="text-xs text-muted">{user.email}</div>
                </div>
              </div>
              {isAdmin && (
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-800 text-[#1E293B] bg-[#F1F5F9] text-center"
                >
                  ⚙️ إدارة المتجر
                </Link>
              )}
              <button
                onClick={() => { setMenuOpen(false); signOut(); }}
                className="px-4 py-3 rounded-xl text-sm font-700 text-[#EF4444] bg-[#FEF2F2] text-center"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <button
              onClick={() => { setMenuOpen(false); signInWithGoogle(); }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-800 text-heading border-2 border-border"
            >
              <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
                <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
              </svg>
              دخول بـ Google
            </button>
          )}

          <Link
            href="/wizard"
            className="mt-2 bg-primary text-white px-4 py-3 rounded-xl text-sm font-800 text-center"
            onClick={() => setMenuOpen(false)}
          >
            ابدأ مشروعك ←
          </Link>
        </div>
      )}
    </header>
  );
}
