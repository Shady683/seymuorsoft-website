import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Seymour Soft Solution | حلول برمجية متكاملة",
  description: "نبني تطبيقات موبايل وبرامج مخصصة للمحلات والشركات - سريع، احترافي، ومتكيف مع طبيعة عملك",
  keywords: ["تطبيق موبايل", "برمجة", "Flutter", "تطبيق متجر", "Seymour Soft", "سيمور سوفت"],
  authors: [{ name: "Seymour Soft Solution" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
