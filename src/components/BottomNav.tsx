'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Home as HomeIcon, Building2, Coins, Vote, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export function BottomNav() {
    const { t } = useLanguage();
    const pathname = usePathname();

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    const navItems = [
        { href: '/', labelKey: 'nav.home', icon: HomeIcon },
        { href: '/houses', labelKey: 'nav.houses', icon: Building2 },
        { href: '/funds', labelKey: 'nav.funds', icon: Coins },
        { href: '/decisions', labelKey: 'nav.decisions', icon: Vote },
        { href: '/notices', labelKey: 'nav.notices', icon: Bell },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe-area-inset-bottom z-50 lg:hidden user-select-none">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 active:opacity-70 transition-opacity",
                                isActive ? "text-gray-900" : "text-gray-400"
                            )}
                        >
                            <item.icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                            <span className={clsx("text-[10px] font-medium leading-none", isActive ? "font-semibold" : "font-normal")}>
                                {t(item.labelKey)}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
