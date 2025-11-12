import './globals.css';
import type { Metadata } from 'next';
import TopBar from '@/components/global/TopBar';
import BottomNav from '@/components/global/BottomNav';

export const metadata: Metadata = {
  title: 'BetSync',
  description: 'Sports betting analytics and research platform',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  ),
  openGraph: {
    title: 'BetSync',
    description:
      'Sports betting analytics and research platform for insights, expert analysis, and predictive modeling.',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    siteName: 'BetSync',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BetSync',
    description: 'Sports betting analytics and research platform.',
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
        {/* GLOBAL TOP BAR */}
        <header className="sticky top-0 z-50">
          <TopBar />
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto pb-20">
          {children}
        </main>

        {/* GLOBAL BOTTOM NAV */}
        <footer className="sticky bottom-0 z-50">
          <BottomNav />
        </footer>
      </body>
    </html>
  );
}
