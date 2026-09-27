import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeContext";
import { BookmarkProvider } from "@/components/BookmarkContext";
import { SearchProvider } from "@/components/SearchContext";
import { SearchModal } from "@/components/SearchModal";
import { CookieConsentModal } from "@/components/CookieConsentModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WinnegansFake — Scholarly Annotations for Finnegans Wake",
  description: "A zero-copyright, crowdsourced scholarly annotation engine, critical dissertation, and decentralized reader for James Joyce's Finnegans Wake.",
  keywords: [
    "Finnegans Wake",
    "James Joyce",
    "Annotations",
    "Literature",
    "Digital Humanities",
    "Vico",
    "Roland McHugh",
    "Sigla",
    "Dublin Topography"
  ],
  authors: [{ name: "WinnegansFake Contributors" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-LNDMB466MG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-LNDMB466MG');
          `}
        </Script>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <Script id="register-sw" strategy="lazyOnload">
          {`
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol === 'https:') {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').catch(function(err) {
                  console.warn('SW registration skipped:', err);
                });
              });
            }
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <BookmarkProvider>
            <SearchProvider>
              <Navigation />
              <div className="flex-1 flex flex-col">
                {children}
              </div>
              <Footer />
              <SearchModal />
              <CookieConsentModal />
            </SearchProvider>
          </BookmarkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
