import { doc, getDoc, setDoc } from "firebase/firestore";
import { siteDb } from "./firebase";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SiteTheme {
  colors: {
    primary:      string;
    primaryDark:  string;
    primaryBg:    string;
    bg:           string;
    heading:      string;
    body:         string;
    muted:        string;
    border:       string;
    giftx:        string;
    giftxBg:      string;
    karella:      string;
    karellaBg:    string;
  };
  font: {
    family:    string;  // Google Font name e.g. "Cairo"
    sizeBase:  number;  // px e.g. 16
    sizeH1:    number;  // px e.g. 56
    sizeH2:    number;  // px e.g. 36
    sizeH3:    number;  // px e.g. 24
    weightBase: number; // 400 | 500 | 600 | 700
  };
  radius: {
    card:   number; // px e.g. 20
    button: number; // px e.g. 16
  };
  spacing: {
    sectionPadY: number; // px e.g. 80
  };
}

// ── Defaults ──────────────────────────────────────────────────────────────────

export const DEFAULT_THEME: SiteTheme = {
  colors: {
    primary:     "#4A6CF7",
    primaryDark: "#3B5CE4",
    primaryBg:   "#EEF2FF",
    bg:          "#F8FAFC",
    heading:     "#0F172A",
    body:        "#334155",
    muted:       "#64748B",
    border:      "#E2E8F0",
    giftx:       "#F97316",
    giftxBg:     "#FFF7ED",
    karella:     "#8B5CF6",
    karellaBg:   "#F5F3FF",
  },
  font: {
    family:     "Cairo",
    sizeBase:   16,
    sizeH1:     56,
    sizeH2:     36,
    sizeH3:     24,
    weightBase: 400,
  },
  radius: {
    card:   20,
    button: 16,
  },
  spacing: {
    sectionPadY: 80,
  },
};

// ── Apply theme to CSS variables ──────────────────────────────────────────────

export function applyTheme(theme: SiteTheme) {
  if (typeof document === "undefined") return;
  const r = document.documentElement.style;

  // Colors
  r.setProperty("--color-primary",      theme.colors.primary);
  r.setProperty("--color-primary-dark", theme.colors.primaryDark);
  r.setProperty("--color-primary-bg",   theme.colors.primaryBg);
  r.setProperty("--color-bg",           theme.colors.bg);
  r.setProperty("--color-heading",      theme.colors.heading);
  r.setProperty("--color-body",         theme.colors.body);
  r.setProperty("--color-muted",        theme.colors.muted);
  r.setProperty("--color-border",       theme.colors.border);
  r.setProperty("--color-giftx",        theme.colors.giftx);
  r.setProperty("--color-giftx-bg",     theme.colors.giftxBg);
  r.setProperty("--color-karella",      theme.colors.karella);
  r.setProperty("--color-karella-bg",   theme.colors.karellaBg);

  // Font
  r.setProperty("--font-size-base",   `${theme.font.sizeBase}px`);
  r.setProperty("--font-size-h1",     `${theme.font.sizeH1}px`);
  r.setProperty("--font-size-h2",     `${theme.font.sizeH2}px`);
  r.setProperty("--font-size-h3",     `${theme.font.sizeH3}px`);
  r.setProperty("--font-weight-base", `${theme.font.weightBase}`);

  // Radius
  r.setProperty("--radius-card",   `${theme.radius.card}px`);
  r.setProperty("--radius-button", `${theme.radius.button}px`);

  // Spacing
  r.setProperty("--section-pad-y", `${theme.spacing.sectionPadY}px`);

  // Font family (dynamic Google Font load)
  loadGoogleFont(theme.font.family);
  r.setProperty("--font-family", `'${theme.font.family}', sans-serif`);
  document.body.style.fontFamily = `var(--font-family)`;
}

function loadGoogleFont(family: string) {
  const id = `gfont-${family.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id   = id;
  link.rel  = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
}

// ── Firestore helpers ─────────────────────────────────────────────────────────

const REF = () => doc(siteDb, "site_config", "theme");

export async function getSiteTheme(): Promise<SiteTheme> {
  try {
    const snap = await getDoc(REF());
    if (snap.exists()) return snap.data() as SiteTheme;
    return DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export async function saveSiteTheme(theme: SiteTheme): Promise<void> {
  await setDoc(REF(), theme);
}

// ── Available Google Fonts ────────────────────────────────────────────────────

export const GOOGLE_FONTS = [
  "Cairo",
  "Tajawal",
  "Almarai",
  "IBM Plex Sans Arabic",
  "Noto Sans Arabic",
  "Rubik",
  "Inter",
  "Poppins",
];
