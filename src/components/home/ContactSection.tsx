import Link from "next/link";

export default function ContactSection() {
  return (
    <section id="contact" className="section-pad max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-primary to-[#6366F1] rounded-[2rem] p-10 md:p-14 text-center text-white relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            عندك فكرة؟ سيب الباقي علينا
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            ابدأ بملء الويزارد وهيوصلنا تفاصيل مشروعك — هنرد عليك في أقل من ٢٤ ساعة.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/wizard"
              className="bg-white text-primary px-7 py-3.5 rounded-2xl font-900 text-base hover:bg-opacity-90 transition-all shadow-lg hover:-translate-y-0.5"
            >
              ابدأ ويزارد المشروع ←
            </Link>
            <a
              href="https://wa.me/201277980805"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white/40 text-white px-7 py-3.5 rounded-2xl font-700 text-base hover:bg-white/10 transition-all"
            >
              💬 واتساب مباشر
            </a>
          </div>

          <p className="text-white/50 text-sm mt-6">
            أو راسلنا على: <span className="text-white/80">seymoursoftsolution@gmail.com</span>
          </p>
        </div>
      </div>
    </section>
  );
}
