'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { LayoutDashboard, LogOut, ArrowLeft, Menu, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);

    const { t } = useLanguage();

    const isDashboard = pathname === '/admin';

    const navItems = [
        { href: '/admin', labelKey: 'admin.sidebar.dashboard' },
        { href: '/admin/community', labelKey: 'admin.sidebar.community' },
        { href: '/admin/houses', labelKey: 'admin.sidebar.houses' },
        { href: '/admin/tenants', labelKey: 'admin.sidebar.tenants' },
        { href: '/admin/funds', labelKey: 'admin.sidebar.funds' },
        { href: '/admin/contributions', labelKey: 'admin.sidebar.contributions' },
        { href: '/admin/proposals', labelKey: 'admin.sidebar.decisions' },
        { href: '/admin/notices', labelKey: 'admin.sidebar.notices' },
        { href: '/admin/audit-log', labelKey: 'admin.sidebar.auditLog' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
            {/* Desktop Sidebar (Hidden on Mobile) */}
            <aside className="hidden md:flex flex-col w-64 bg-[#0a0a0a] text-gray-400 flex-shrink-0 border-r border-gray-800">
                <div className="p-6 h-16 flex items-center gap-2 text-white">
                    <ShieldCheck size={18} className="text-blue-500" />
                    <span className="text-xs font-bold tracking-widest uppercase">Admin Console</span>
                </div>

                <div className="px-6 pb-4">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-gray-600 mb-2">Governance</div>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors",
                                    isActive
                                        ? "text-white bg-white/10 font-medium"
                                        : "hover:text-gray-200 hover:bg-white/5"
                                )}
                            >
                                <span>{t(item.labelKey)}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-sm transition-colors"
                    >
                        <LogOut size={14} />
                        <span>Exit to Community App</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header (Hidden on Desktop) */}
            <header className="md:hidden bg-[#0a0a0a] text-white p-4 sticky top-0 z-40 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowMenu(!showMenu)} className="text-gray-400 hover:text-white">
                        <Menu size={24} />
                    </button>
                    <span className="text-sm font-bold tracking-widest text-gray-200 uppercase flex items-center gap-2">
                        <ShieldCheck size={16} className="text-blue-500" />
                        Admin Console
                    </span>
                </div>
                <Link href="/" className="text-xs text-gray-400 hover:text-white border border-gray-700 px-2 py-1 rounded">
                    Exit
                </Link>
            </header>

            {/* Mobile Menu Overlay */}
            {showMenu && (
                <div className="fixed inset-0 z-50 bg-[#0a0a0a] p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                        <span className="text-sm font-bold tracking-widest text-white uppercase flex items-center gap-2">
                            <ShieldCheck size={16} className="text-blue-500" />
                            Admin Console
                        </span>
                        <button onClick={() => setShowMenu(false)} className="text-gray-400">
                            <ArrowLeft size={24} />
                        </button>
                    </div>
                    <nav className="flex-1 space-y-4 overflow-y-auto">
                        {navItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setShowMenu(false)}
                                className={clsx(
                                    "block text-lg font-medium py-2 border-b border-gray-900",
                                    pathname === item.href ? "text-blue-400" : "text-gray-400"
                                )}
                            >
                                {t(item.labelKey)}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-8">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-800 text-white font-medium rounded-sm"
                        >
                            <LogOut size={16} />
                            Exit to App
                        </Link>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 pb-24 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    );
}
