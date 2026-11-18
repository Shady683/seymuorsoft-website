import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ["var(--font-cairo)", "Cairo", "sans-serif"],
      },
      colors: {
        bg:         "#F8FAFC",
        surface:    "#FFFFFF",
        primary:    "#4A6CF7",
        "primary-bg": "#EEF2FF",
        "primary-dark": "#3B5CE4",
        heading:    "#0F172A",
        body:       "#334155",
        muted:      "#64748B",
        subtle:     "#94A3B8",
        border:     "#E2E8F0",
        "border-light": "#F1F5F9",
        giftx:      "#F97316",
        "giftx-bg": "#FFF7ED",
        karella:    "#8B5CF6",
        "karella-bg": "#F5F3FF",
        success:    "#16A34A",
        "success-bg": "#DCFCE7",
        warning:    "#F59E0B",
        "warning-bg": "#FFFBEB",
        danger:     "#EF4444",
        "danger-bg": "#FEF2F2",
      },
      boxShadow: {
        card:   "0 2px 16px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.10)",
        primary: "0 6px 24px rgba(74,108,247,0.35)",
        giftx:  "0 6px 24px rgba(249,115,22,0.30)",
        karella: "0 6px 24px rgba(139,92,246,0.30)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
