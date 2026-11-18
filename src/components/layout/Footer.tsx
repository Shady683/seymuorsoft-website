import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-heading text-white/60 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-[10px]">SSS</span>
              </div>
              <span className="text-white font-black text-sm">Seymour Soft Solution</span>
            </div>
            <p className="text-sm leading-relaxed">
              نبني تطبيقات موبايل وبرامج مخصصة للمحلات والشركات — سريع، احترافي، ومتكيف مع طبيعة عملك.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-800 text-sm mb-4">روابط سريعة</h4>
            <div className="flex flex-col gap-2">
              {["الصفحة الرئيسية", "خدماتنا", "أعمالنا", "ابدأ مشروعك"].map((l, i) => (
                <a key={i} href="#" className="text-sm hover:text-primary transition-colors">{l}</a>
              ))}
            </div>
          </div>

          {/* Clients */}
          <div>
            <h4 className="text-white font-800 text-sm mb-4">متاجر عملائنا</h4>
            <div className="flex flex-col gap-2">
              <Link href="/stores/giftx"   className="text-sm hover:text-giftx transition-colors flex items-center gap-2">🎁 Gift X</Link>
              <Link href="/stores/karella" className="text-sm hover:text-karella transition-colors flex items-center gap-2">👗 Karella</Link>
              <Link href="/dashboard"      className="text-sm hover:text-primary transition-colors flex items-center gap-2">🔐 بوابة أصحاب المتاجر</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} Seymour Soft Solution — جميع الحقوق محفوظة</p>
          <p className="text-white/40">Made with ❤️ in Egypt 🇪🇬</p>
        </div>
      </div>
    </footer>
  );
}
