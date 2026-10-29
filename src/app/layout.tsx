import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduChain — Learn. Connect. Unlock.",
  description: "High-performance gamified curriculum platform. Master independent subject chains, forge past mistakes, and compete on the global scholar leaderboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('educhain_v2_store');
                if (stored) {
                  const data = JSON.parse(stored);
                  if (data?.state?.settings?.theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-black text-[#111827] dark:text-[#ededed] antialiased selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black font-sans flex flex-col transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
