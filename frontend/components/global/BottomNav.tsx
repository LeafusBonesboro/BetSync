'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, DollarSign, Users, CalendarDays, Star, Wallet } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Offers', href: '/offers', icon: DollarSign },
  { name: 'Following', href: '/following', icon: Users },
  { name: 'Events', href: '/events', icon: CalendarDays },
  { name: 'Get Pro', href: '/pro', icon: Star },
  { name: 'Summary', href: '/summary', icon: Wallet },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#0B0B0F] border-t border-gray-800 flex justify-around items-center py-2 z-50">
      {navItems.map(({ name, href, icon: Icon }) => {
        const isActive =
          pathname === href ||
          (href !== '/' && pathname.startsWith(href));

        return (
          <button
            key={name}
            onClick={() => router.push(href)}
            className={`flex flex-col items-center justify-center text-xs ${
              isActive ? 'text-amber-400' : 'text-gray-400 hover:text-gray-300'
            } transition`}
          >
            <Icon
              size={22}
              className={`${isActive ? 'text-amber-400' : 'text-gray-500'}`}
            />
            <span className="mt-1">{name}</span>
          </button>
        );
      })}
    </nav>
  );
}
