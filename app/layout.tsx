import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.scss";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Lorem Ipsum — Violin Artist & Composer",
  description: "Classical & contemporary works, performed with feeling",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      {/* Browser extensions (Grammarly, ColorZilla, …) inject attributes on <body> before hydration. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
