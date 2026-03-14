import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { headers } from "next/headers"; // Import headers Next.js

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Staking Rewards DApp",
  description: "Stake your tokens and earn rewards",
};

export default async function RootLayout({ // ✅ async
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Récupère les cookies côté serveur pour les passer au provider
  const headersObj = await headers()
  const cookie = headersObj.get('cookie')

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers cookie={cookie}> {/* Passe le cookie */}
          {children}
        </Providers>
      </body>
    </html>
  );
}