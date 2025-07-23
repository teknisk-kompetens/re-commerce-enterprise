
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "re:Commerce Enterprise - Magical 4-in-1 Campaign",
  description: "Transform your business with our magical 4-level campaign system. From Verktygslåda to OneStopShop - experience the complete transformation.",
  keywords: "re:Commerce, Enterprise, CRM, Business Tools, Automation, Campaign",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
