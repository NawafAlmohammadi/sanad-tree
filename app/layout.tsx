import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "شجرة الأسانيد | استكشف رحلة الحديث",
  description: "استكشاف بصري لأسانيد الحديث والرواة، ومساعد معرفي محصور في مصادر المشروع.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html:"try{var t=localStorage.getItem('sanad-theme');document.documentElement.dataset.theme=t==='dark'||t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}"}} /></head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
