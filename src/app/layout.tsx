import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlopCoin.art",
  description: "FlopCoin's home page",
  icons: {
    icon: "/coin.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0d" },
  ],
};

// Runs before first paint: apply the stored theme, or fall back to the OS
// preference, so there is no light/dark flash on load.
const noFlashTheme = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashTheme }} />
        {/* With JS disabled, scroll-reveal content would stay hidden — show it. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <header className="site-header sticky top-0 z-40">
          <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5 sm:px-8">
            <Link
              href="/"
              className="group flex items-center gap-2.5 rounded-lg"
              aria-label="FlopCoin home"
            >
              <Image
                src="/coin.svg"
                alt=""
                width={30}
                height={30}
                className="transition-transform duration-500 group-hover:rotate-[18deg] dark:invert"
                priority
              />
              <span className="text-base font-semibold tracking-tight">
                FlopCoin
              </span>
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/owners" className="nav-link">
                Owners
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <div className="flex-grow">{children}</div>

        <footer className="border-t border-line">
          <div className="mx-auto max-w-content px-5 py-8 text-center text-sm text-fg-muted sm:px-8">
            © 2026 FlopCoin.art
          </div>
        </footer>
      </body>
    </html>
  );
}
