"use client";

import { usePathname } from "next/navigation";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideChrome = pathname === "/" || pathname === "/login" || pathname === "/register";

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0F]">
      {/* Top Navigation */}
      {!hideChrome && (
        <header className="sticky top-0 z-50 bg-[#0B0B0F] border-b border-gray-800">
          <TopBar />
        </header>
      )}

      {/* Main Page Content */}
      <main className="flex-1 overflow-y-auto px-3 pb-24 pt-2">
        {children}
      </main>

      {/* Bottom Navigation */}
      {!hideChrome && (
        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0B0F] border-t border-gray-800">
          <BottomNav />
        </footer>
      )}
    </div>
  );
}
