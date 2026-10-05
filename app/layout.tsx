import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "شجرة الأسانيد | استكشف رحلة الحديث",
  description: "استكشاف بصري لأسانيد الحديث والرواة، ومساعد معرفي محصور في مصادر المشروع.",
  icons: {
    icon: { url: "/favicon.svg?v=navy", type: "image/svg+xml" },
    shortcut: "/favicon.svg?v=navy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-theme="dark" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html:"try{var t=localStorage.getItem('sanad-university-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}"}} /></head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
