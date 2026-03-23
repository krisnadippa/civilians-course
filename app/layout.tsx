import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Civilians | Platform E-Learning Teknik Sipil",
  description:
    "Platform belajar dan jasa profesional terlengkap khusus mahasiswa dan praktisi Teknik Sipil. Kursus, perancangan, mentor, dan template tugas.",
  keywords: [
    "Civilians",
    "Teknik Sipil",
    "E-Learning",
    "Kursus Online",
    "RAB",
    "Struktur",
    "AutoCAD",
    "Civil 3D",
    "Manajemen Konstruksi",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
