import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Baloo_2 } from "next/font/google";
import { texts } from "@/content/texts";
import "./globals.css";

const display = Baloo_2({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

export const metadata: Metadata = {
  title: texts.gameTitle,
  description: texts.tagline,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl" className={display.variable}>
      <body>{children}</body>
    </html>
  );
}

