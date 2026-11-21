import { doc, getDoc, setDoc } from "firebase/firestore";
import { siteDb } from "./firebase";

export interface PortfolioProject {
  id: string;
  name: string;
  description: string;
  tags: string[];        // Flutter, Firebase, Next.js ...
  image: string;         // emoji or URL
  color: string;         // hex لون البطاقة
  link?: string;         // رابط اختياري
  available: boolean;
  order: number;
}

export interface PortfolioConfig {
  title: string;
  subtitle: string;
  projects: PortfolioProject[];
}

export const DEFAULT_PORTFOLIO: PortfolioConfig = {
  title: "أعمالنا",
  subtitle: "مشاريع حقيقية، عملاء حقيقيون",
  projects: [
    {
      id: "giftx",
      name: "Gift X",
      description: "تطبيق متجر هدايا وألعاب — إدارة كاملة للمنتجات والطلبات مع واجهة عملاء احترافية",
      tags: ["Flutter", "Firebase", "Android", "iOS"],
      image: "🎁",
      color: "#FF6B35",
      available: true,
      order: 1,
    },
    {
      id: "karella",
      name: "Karella",
      description: "تطبيق متجر أقمشة ومفروشات — كتالوج منتجات وإدارة طلبات مع تنبيهات واتساب",
      tags: ["Flutter", "Firebase", "WhatsApp API"],
      image: "🛋️",
      color: "#6C5CE7",
      available: true,
      order: 2,
    },
    {
      id: "saferide",
      name: "SafeRide",
      description: "تطبيق نقل طلاب مدارس وشركات — تتبع مباشر وإشعارات للأهل",
      tags: ["Flutter", "Firebase", "GPS"],
      image: "🚌",
      color: "#00B894",
      available: true,
      order: 3,
    },
    {
      id: "gameX",
      name: "Game X",
      description: "برنامج إدارة محل PlayStation — محاسبة، اشتراكات، تقارير يومية",
      tags: ["Electron", "Windows", "SQL"],
      image: "🎮",
      color: "#0984E3",
      available: true,
      order: 4,
    },
  ],
};

const REF = () => doc(siteDb, "site_config", "portfolio");

export async function getPortfolioConfig(): Promise<PortfolioConfig> {
  try {
    const snap = await getDoc(REF());
    if (snap.exists()) {
      return snap.data() as PortfolioConfig;
    }
  } catch {}
  return DEFAULT_PORTFOLIO;
}

export async function savePortfolioConfig(config: PortfolioConfig): Promise<void> {
  await setDoc(REF(), config);
}
