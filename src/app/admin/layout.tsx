'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { AdminBottomNav } from '@/components/admin/AdminBottomNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { t } = useLanguage();

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
        <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-sm font-sans">

            {/* 1. FIXED SIDEBAR (Hidden on Mobile) */}
            <aside className="hidden md:flex w-60 bg-slate-900 border-r border-slate-800 flex-col flex-shrink-0 z-20">
                {/* Branding */}
                <div className="h-14 flex items-center px-5 border-b border-slate-800 flex-shrink-0">
                    <div className="flex items-center gap-2 text-white">
                        <ShieldCheck size={18} className="text-gray-400" />
                        <span className="font-bold tracking-widest uppercase text-xs">Registry</span>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 custom-scrollbar">
                    <div className="px-3 mb-2 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                        Main Register
                    </div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-2 rounded-sm text-xs transition-all",
                                    isActive
                                        ? "bg-blue-900/40 text-white font-medium border-l-2 border-blue-500"
                                        : "text-gray-400 hover:text-gray-200 hover:bg-slate-800"
                                )}
                            >
                                <span>{t(item.labelKey)}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / User Profile */}
                <div className="p-4 border-t border-slate-800 flex-shrink-0 bg-slate-950">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-gray-300">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-white truncate">Administrator</div>
                            <div className="text-[10px] text-gray-500 truncate">System Access</div>
                        </div>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-gray-400 hover:text-gray-200 text-xs rounded-sm transition-colors"
                    >
                        <LogOut size={12} />
                        <span>Sign Out</span>
                    </Link>
                </div>
            </aside>

            {/* 2. MAIN LAYOUT (Right, Full Height) */}
            <main className="flex-1 flex flex-col min-w-0 bg-gray-100">

                {/* Fixed Top Bar */}
                <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10 shadow-sm relative">
                    {/* Mobile: Branding shown in header since sidebar is hidden */}
                    <div className="flex items-center gap-2 md:hidden">
                        <ShieldCheck size={18} className="text-gray-700" />
                        <h1 className="text-sm font-bold text-gray-700 uppercase tracking-tight">Siddhartha Colony</h1>
                    </div>

                    {/* Desktop: Title */}
                    <h1 className="hidden md:block text-sm font-bold text-gray-700 uppercase tracking-tight">
                        Administration Console
                    </h1>

                    <div className="flex items-center gap-4">
                        <span className="text-[10px] md:text-xs text-green-700 bg-green-50 px-2 py-0.5 border border-green-200 rounded-full font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Live
                        </span>
                    </div>
                </header>

                {/* 3. SCROLLABLE CONTENT ZONE (Only this part scrolls) */}
                {/* Added pb-24 for mobile to account for bottom nav */}
                <div className="flex-1 overflow-y-auto p-0 scroll-smooth pb-24 md:pb-0">
                    <div className="max-w-[1600px] mx-auto p-4 md:p-8">
                        {children}
                    </div>
                </div>
            </main>

            {/* 3. MOBILE BOTTOM NAVIGATION (Visible Only on Mobile) */}
            <AdminBottomNav />

        </div>
    );
}
