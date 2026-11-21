"use client";
import { useEffect } from "react";
import { getSiteTheme, applyTheme, DEFAULT_THEME } from "@/lib/themeConfig";

export default function ThemeLoader() {
  useEffect(() => {
    // طبّق الـ default فوراً (لا flash)
    applyTheme(DEFAULT_THEME);
    // بعدين جيب من Firebase
    getSiteTheme().then(applyTheme);
  }, []);

  return null;
}
