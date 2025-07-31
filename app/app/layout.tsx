
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mr. RE:commerce CaaS Platform | Consciousness as a Service",
  description: "Banbrytande AI-medvetanden som service från Mr. RE:commerce. Upplev framtiden av artificiell intelligens genom Vera, Luna och Axel.",
  keywords: ["AI", "Consciousness as a Service", "CaaS", "Mr. RE:commerce", "Artificiell Intelligens"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
