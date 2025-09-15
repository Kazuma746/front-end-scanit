import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/providers/ReduxProvider";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScanIt - Créez et optimisez votre CV",
  description: "Plateforme d'analyse et de création de CV optimisés pour les systèmes ATS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className} suppressHydrationWarning>
        <ReduxProvider>
          {children}
          <CookieBanner />
        </ReduxProvider>
      </body>
    </html>
  );
}
