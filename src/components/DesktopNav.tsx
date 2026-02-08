'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Home, Building2, Coins, Vote, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageToggle } from './LanguageToggle';
import clsx from 'clsx';

export function DesktopNav() {
    const { t } = useLanguage();
    const pathname = usePathname();

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    const navItems = [
        { href: '/', labelKey: 'nav.home', icon: Home },
        { href: '/houses', labelKey: 'nav.houses', icon: Building2 },
        { href: '/funds', labelKey: 'nav.funds', icon: Coins },
        { href: '/decisions', labelKey: 'nav.decisions', icon: Vote },
        { href: '/notices', labelKey: 'nav.notices', icon: Bell },
    ];

    return (
        <header className="hidden lg:block fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                {/* Logo / Brand - Text Only */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900 tracking-tight">Siddhartha Colony</span>
                </div>

                {/* Navigation Links */}
                <nav className="flex items-center gap-6">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "text-sm font-medium transition-colors flex items-center gap-2",
                                    isActive
                                        ? "text-gray-900"
                                        : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                {/* Icons optional in pure institutional design, often removed for text-only. Keeping small for clarity but mute them. */}
                                <item.icon size={16} className={isActive ? "text-gray-900" : "text-gray-400"} />
                                {t(item.labelKey)}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <LanguageToggle />
                    {/* Simple User Indicator */}
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                        SC
                    </div>
                </div>
            </div>
        </header>
    );
}
