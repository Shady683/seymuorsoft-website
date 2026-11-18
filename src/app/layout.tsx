import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seymour Soft Solution | حلول برمجية متكاملة",
  description:
    "نبني تطبيقات موبايل وبرامج مخصصة للمحلات والشركات — سريع، احترافي، ومتكيف مع طبيعة عملك",
  keywords: ["تطبيق موبايل", "برمجة", "Flutter", "تطبيق متجر", "Seymour Soft"],
  authors: [{ name: "Seymour Soft Solution" }],
  openGraph: {
    title: "Seymour Soft Solution",
    description: "نبني تطبيقات موبايل وبرامج مخصصة",
    type: "website",
    locale: "ar_EG",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-cairo bg-bg text-heading antialiased">
        {children}
      </body>
    </html>
  );
}
