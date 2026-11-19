import type { Metadata } from next;
import ./globals.css;

export const metadata: Metadata = {
  title: Seymour Soft Solution | حلول برمجية متكاملة,
  description: نبني تطبيقات موبايل وبرامج مخصصة للمحلات والشركات - سريع، احترافي، ومتكيف مع طبيعة عملك,
  keywords: [تطبيق موبايل, برمجة, Flutter, تطبيق متجر, Seymour Soft, سيمور سوفت],
  authors: [{ name: Seymour Soft Solution }],
  metadataBase: new URL(https://seymuorsoft-website.vercel.app),
  openGraph: {
    title: Seymour Soft Solution | حلول برمجية متكاملة,
    description: نبني تطبيقات موبايل وبرامج مخصصة للمحلات والشركات,
    type: website,
    locale: ar_EG,
    url: https://seymuorsoft-website.vercel.app,
    siteName: Seymour Soft Solution,
  },
  twitter: {
    card: summary_large_image,
    title: Seymour Soft Solution,
    description: نبني تطبيقات موبايل وبرامج مخصصة,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang=ar dir=rtl>
      <body className=font-cairo bg-bg text-heading antialiased>
        {children}
      </body>
    </html>
  );
}
