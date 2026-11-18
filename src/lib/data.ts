import type { Product, Order } from "./types";

// ── Gift X Products ────────────────────────────────────────
export const giftxProducts: Product[] = [
  { id: "g1",  name: "دمية أميرة الثلج",    price: 150, category: "ألعاب",       emoji: "🧸", badge: "الأكثر مبيعاً", badgeColor: "#F97316" },
  { id: "g2",  name: "مجموعة ليغو 200 قطعة",price: 280, category: "ألعاب",       emoji: "🧱" },
  { id: "g3",  name: "سيارة ريموت كنترول",  price: 380, category: "ألعاب",       emoji: "🚗", badge: "جديد", badgeColor: "#4A6CF7" },
  { id: "g4",  name: "بوكس هدية كيوت",      price: 220, category: "هدايا",       emoji: "🎁", badge: "الأكثر طلباً", badgeColor: "#EC4899" },
  { id: "g5",  name: "شوكولاتة بلجيكية",    price: 95,  category: "هدايا",       emoji: "🍫" },
  { id: "g6",  name: "بازل 1000 قطعة",      price: 190, category: "ألعاب",       emoji: "🧩" },
  { id: "g7",  name: "سماعة بلوتوث",        price: 450, category: "إكسسوارات",   emoji: "🎧", badge: "عرض", badgeColor: "#16A34A" },
  { id: "g8",  name: "ساعة أطفال ذكية",     price: 320, category: "إكسسوارات",   emoji: "⌚" },
  { id: "g9",  name: "طقم ألوان رسم",       price: 85,  category: "مستلزمات",    emoji: "🎨" },
  { id: "g10", name: "كيس ظهر مدرسي",       price: 160, category: "مستلزمات",    emoji: "🎒" },
  { id: "g11", name: "لعبة بناء خشبية",     price: 110, category: "ألعاب",       emoji: "🪵" },
  { id: "g12", name: "دمية تفاعلية",        price: 275, category: "ألعاب",       emoji: "🤖" },
];

export const giftxCategories = ["الكل", "ألعاب", "هدايا", "إكسسوارات", "مستلزمات"];

// ── Karella Products ───────────────────────────────────────
export const karellaProducts: Product[] = [
  { id: "k1",  name: "فستان سهرة كلاسيك",   price: 850, category: "فساتين",      emoji: "👗", badge: "الأكثر طلباً", badgeColor: "#8B5CF6" },
  { id: "k2",  name: "فستان كاجوال صيفي",   price: 420, category: "فساتين",      emoji: "🌸" },
  { id: "k3",  name: "فستان زفاف",           price: 2400, category: "فساتين",     emoji: "💍", badge: "مميز", badgeColor: "#EC4899" },
  { id: "k4",  name: "إيشارب حرير",          price: 180, category: "إكسسوارات",   emoji: "🧣" },
  { id: "k5",  name: "طقم مجوهرات ذهبي",    price: 650, category: "إكسسوارات",   emoji: "✨", badge: "جديد", badgeColor: "#4A6CF7" },
  { id: "k6",  name: "نظارة شمس أنيقة",     price: 290, category: "إكسسوارات",   emoji: "🕶️" },
  { id: "k7",  name: "شنطة جلد كلاسيك",     price: 780, category: "حقائب",       emoji: "👜", badge: "الأكثر مبيعاً", badgeColor: "#EC4899" },
  { id: "k8",  name: "شنطة سفر أنيقة",      price: 540, category: "حقائب",       emoji: "🧳" },
  { id: "k9",  name: "محفظة جلد نسائية",    price: 220, category: "حقائب",       emoji: "👛" },
  { id: "k10", name: "عطر Rose & Oud",       price: 490, category: "عطور",        emoji: "🌹", badge: "الأكثر طلباً", badgeColor: "#8B5CF6" },
  { id: "k11", name: "عطر Velvet Bloom",     price: 380, category: "عطور",        emoji: "💐" },
  { id: "k12", name: "كريم مرطب فاخر",      price: 160, category: "عطور",        emoji: "🧴" },
];

export const karellaCategories = ["الكل", "فساتين", "إكسسوارات", "حقائب", "عطور"];

// ── Dashboard Mock Orders ──────────────────────────────────
export const mockOrders: Order[] = [
  { id: "1042", name: "أحمد محمود",   items: 2, amount: 380, status: "جديد",          date: "اليوم ٥:١٢ م",    cat: "جديد"   },
  { id: "1041", name: "منى السيد",    items: 1, amount: 220, status: "قيد التجهيز",   date: "اليوم ٤:٤٥ م",    cat: "جارية"  },
  { id: "1040", name: "خالد عمر",     items: 1, amount: 150, status: "تم التوصيل",    date: "اليوم ٢:٣٠ م",    cat: "مكتملة" },
  { id: "1039", name: "نورا حسن",     items: 1, amount: 450, status: "تم التوصيل",    date: "أمس ٨:١٠ م",      cat: "مكتملة" },
  { id: "1038", name: "يوسف علي",     items: 3, amount: 640, status: "تم التوصيل",    date: "أمس ٥:٢٢ م",      cat: "مكتملة" },
  { id: "1037", name: "سارة عبدالله", items: 1, amount: 95,  status: "ملغي",           date: "١٥ نوف",          cat: "ملغية"  },
  { id: "1036", name: "محمد إبراهيم", items: 2, amount: 310, status: "تم التوصيل",    date: "١٤ نوف",          cat: "مكتملة" },
  { id: "1035", name: "هبة كمال",     items: 1, amount: 220, status: "جديد",           date: "١٤ نوف",          cat: "جديد"   },
];
