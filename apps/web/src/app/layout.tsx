import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: "Forja", template: "%s · Forja" },
  description: "La plataforma white-label para coaches fitness de alto rendimiento.",
  metadataBase: new URL(
    process.env["NEXT_PUBLIC_APP_URL"] ?? "http://app.lvh.me:3000"
  ),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
