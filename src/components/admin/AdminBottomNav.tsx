'use client';

import { LayoutDashboard, Users, IndianRupee, FileText, Menu, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';
import { MoreMenuSheet } from './MoreMenuSheet';

export function AdminBottomNav() {
    const pathname = usePathname();
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    const mainItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/documents', label: 'Documents', icon: FileText },
        { href: '/admin/houses', label: 'Houses', icon: Home },
    ];

    return (
        <>
            {/* Bottom Nav Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-safe">
                {mainItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform",
                                isActive ? "text-blue-700" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
                        </Link>
                    );
                })}

                {/* More Button */}
                <button
                    onClick={() => setIsMoreOpen(true)}
                    className={clsx(
                        "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform",
                        isMoreOpen ? "text-blue-700" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    <Menu size={24} strokeWidth={isMoreOpen ? 2.5 : 2} />
                    <span className="text-[10px] font-medium tracking-tight">More</span>
                </button>
            </nav>

            {/* More Menu Sheet */}
            <MoreMenuSheet isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
        </>
    );
}
