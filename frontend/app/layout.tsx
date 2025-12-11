

import "./globals.css";
import type { Metadata } from "next";
import LayoutShell from "@/components/global/LayoutShell";
import { AuthProvider } from "@/app/providers/AuthProvider"; // ⬅ ADD THIS

export const metadata: Metadata = {
  title: "BetSync",
  description: "Sports betting analytics and research platform",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "BetSync",
    description:
      "Sports betting analytics and research platform for insights, expert analysis, and predictive modeling.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    siteName: "BetSync",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BetSync",
    description: "Sports betting analytics and research platform.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B0B0F] text-white min-h-screen flex flex-col">
        
        {/* 🔥 WRAP YOUR APP WITH AUTH PROVIDER */}
        <AuthProvider>
          <LayoutShell>
            {children}
          </LayoutShell>
        </AuthProvider>

      </body>
    </html>
  );
}
