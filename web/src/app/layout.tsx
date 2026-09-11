import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeContext";
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
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <Navigation />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
          <CookieConsentModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
