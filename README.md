# Seymour Soft Solution — Website

موقع البورتفوليو + المنصة لـ Seymour Soft Solution — مبني بـ Next.js 15 و Tailwind CSS.

## الصفحات

| الصفحة | المسار | الوصف |
|--------|---------|-------|
| الصفحة الرئيسية | `/` | Hero + خدمات + أعمال + تواصل |
| ويزارد المشروع | `/wizard` | ٥ خطوات لطلب مشروع + إرسال بـ EmailJS |
| متجر Gift X | `/stores/giftx` | عرض منتجات + فلترة + واتساب |
| متجر Karella | `/stores/karella` | بوتيك أزياء + فلترة + واتساب |
| لوحة التحكم | `/dashboard` | لوجين + إدارة المنتجات والطلبات |

## تشغيل المشروع

```bash
# تثبيت المكتبات
npm install

# تشغيل في وضع التطوير
npm run dev

# بناء للإنتاج
npm run build
```

افتح http://localhost:3000

## إعداد EmailJS (للويزارد)

1. اعمل حساب على emailjs.com
2. أنشئ Service + Template
3. انسخ `.env.local.example` لـ `.env.local`
4. ضع المفاتيح في الملف

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
```

## النشر على Vercel

```bash
npm install -g vercel
vercel
```

أو اربط المشروع من Vercel Dashboard → Import Git Repository.

## Stack

- **Next.js 15** — App Router + React Server Components
- **Tailwind CSS** — Styling system
- **TypeScript** — Type safety
- **Cairo (Google Font)** — Arabic font
- **EmailJS** — إرسال الطلبات بدون backend
- **Vercel** — Hosting

## الخطوات القادمة (Phase 4)

- [ ] ربط Firebase Firestore لبيانات المنتجات الحقيقية
- [ ] Auth لأصحاب المتاجر عبر Firebase Auth
- [ ] لوحة تحكم حقيقية مع Realtime updates
