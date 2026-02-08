'use client';

import { X, Home, Users, IndianRupee, FileText, Settings, LogOut, Activity, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useLanguage } from '@/contexts/LanguageContext';

interface MoreMenuSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MoreMenuSheet({ isOpen, onClose }: MoreMenuSheetProps) {
    const pathname = usePathname();
    const { t } = useLanguage();

    if (!isOpen) return null;

    // Remaining items not in Bottom Nav (Tenants, Contributions, Decisions, Notices, Audit Log, Settings)
    const menuItems = [
        { href: '/admin/community', label: 'Community Registry', icon: Users },
        { href: '/admin/tenants', label: 'Tenants & Occupancy', icon: Users },
        { href: '/admin/contributions', label: 'Funds & Contributions', icon: IndianRupee },
        { href: '/admin/proposals', label: 'Decisions & Proposals', icon: Activity },
        { href: '/admin/notices', label: 'Public Notices', icon: FileText },
        { href: '/admin/audit-log', label: 'System Audit Log', icon: ShieldCheck },
        { href: '/admin/settings', label: 'Admin Settings', icon: Settings },
    ];

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end isolate">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Sheet Content - Full Heightish on mobile */}
            <div className="relative w-full h-[90vh] bg-white rounded-t-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">All Menu Options</h3>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={clsx(
                                    "flex items-center justify-between w-full p-4 rounded-lg transition-all active:scale-[0.98]",
                                    isActive
                                        ? "bg-blue-50 border border-blue-100"
                                        : "bg-white border border-gray-100 hover:bg-gray-50"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={clsx(
                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                        isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                                    )}>
                                        <Icon size={20} />
                                    </div>
                                    <span className={clsx(
                                        "font-semibold text-sm",
                                        isActive ? "text-blue-900" : "text-gray-700"
                                    )}>
                                        {item.label}
                                    </span>
                                </div>
                                <ChevronRight size={18} className="text-gray-300" />
                            </Link>
                        );
                    })}

                    <div className="my-6 border-t border-gray-100"></div>

                    {/* Sign Out */}
                    <Link
                        href="/"
                        className="flex items-center justify-between w-full p-4 rounded-lg bg-red-50 border border-red-100 active:scale-[0.98] transition-transform group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                <LogOut size={20} />
                            </div>
                            <span className="font-semibold text-sm text-red-700">Sign Out</span>
                        </div>
                        <ChevronRight size={18} className="text-red-300 group-hover:text-red-500" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
