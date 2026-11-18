"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { href: "#services", label: "خدماتنا" },
  { href: "#portfolio", label: "أعمالنا" },
  { href: "#contact",  label: "تواصل معنا" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

        {/* CTA */}
        <div className="flex items-center gap-3">
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
