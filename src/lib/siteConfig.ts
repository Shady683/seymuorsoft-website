import { doc, getDoc, setDoc } from "firebase/firestore";
import { siteDb } from "./firebase";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface HeroStat   { n: string; label: string }
export interface HeroConfig {
  tagline:     string;
  highlight:   string;
  description: string;
  available:   boolean;
  cta_primary: string;
  cta_secondary: string;
  stats:       HeroStat[];
}

export interface ServiceItem {
  icon:  string;
  title: string;
  desc:  string;
  tags:  string[];
  color: string;
  bg:    string;
}
export interface ServicesConfig {
  heading:    string;
  subheading: string;
  items:      ServiceItem[];
}

export interface SiteConfig {
  hero:     HeroConfig;
  services: ServicesConfig;
}

// ── Defaults (نفس المحتوى الموجود حالياً) ────────────────────────────────────

export const DEFAULT_CONFIG: SiteConfig = {
  hero: {
    tagline:       "نبني لك تطبيق",
    highlight:     "يشتغل لوحده",
    description:   "من تطبيقات الموبايل لأنظمة إدارة المحلات — بنصمم ونبرمج ونسلم مشاريع تقنية متكاملة بسرعة واحترافية.",
    available:     true,
    cta_primary:   "ابدأ مشروعك الآن",
    cta_secondary: "شوف أعمالنا",
    stats: [
      { n: "10+",  label: "مشروع منجز" },
      { n: "5★",   label: "تقييم العملاء" },
      { n: "100%", label: "دعم بعد التسليم" },
    ],
  },
  services: {
    heading:    "كل اللى محتاجه في مكان واحد",
    subheading: "من الفكرة للمنتج النهائي — بنغطي كل تقنيات البناء اللى محتاجها مشروعك",
    items: [
      {
        icon: "📱", title: "تطبيق موبايل",
        desc: "Flutter لـ Android و iOS — واجهة سلسة وأداء عالي وتسليم لكلا المتجرين.",
        tags: ["Flutter", "Firebase", "Android", "iOS"],
        color: "#4A6CF7", bg: "#EEF2FF",
      },
      {
        icon: "🛒", title: "متجر إلكتروني",
        desc: "نظام عرض منتجات، سلة مشتريات، وطلبات مرتبطة بالواتساب — جاهز للبيع من اليوم الأول.",
        tags: ["Next.js", "Tailwind", "WhatsApp API"],
        color: "#F97316", bg: "#FFF7ED",
      },
      {
        icon: "🖥️", title: "برنامج ويندوز",
        desc: "برامج إدارة محلات وأنظمة حسابات مخصصة بواجهات سهلة ومناسبة لطبيعة عملك.",
        tags: ["Electron", "Windows", "SQL"],
        color: "#8B5CF6", bg: "#F5F3FF",
      },
      {
        icon: "🌐", title: "موقع ويب",
        desc: "مواقع سريعة ومتجاوبة مع كل الشاشات — landing pages، بورتفوليو، أو منصات متكاملة.",
        tags: ["Next.js", "Vercel", "SEO"],
        color: "#10B981", bg: "#ECFDF5",
      },
    ],
  },
};

// ── Firestore helpers ─────────────────────────────────────────────────────────

const REF = () => doc(siteDb, "site_config", "homepage");

/** اجلب الكونفيج — لو مش موجود استخدم الافتراضي */
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const snap = await getDoc(REF());
    if (snap.exists()) return snap.data() as SiteConfig;
    return DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

/** احفظ الكونفيج (من الداشبورد فقط) */
export async function saveSiteConfig(config: SiteConfig): Promise<void> {
  await setDoc(REF(), config);
}
