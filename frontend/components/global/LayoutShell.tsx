"use client";

import { usePathname } from "next/navigation";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideChrome = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!hideChrome && (
        <header className="sticky top-0 z-50">
          <TopBar />
        </header>
      )}

      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {!hideChrome && (
        <footer className="sticky bottom-0 z-50">
          <BottomNav />
        </footer>
      )}
    </>
  );
}
