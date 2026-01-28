import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio Professionnel - Développeur Full-Stack",
  description: "Portfolio professionnel d'un développeur Full-Stack spécialisé dans la création de solutions digitales à Cotonou, Bénin",
  keywords: "développeur, full-stack, portfolio, Cotonou, Bénin, web development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
