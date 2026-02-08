'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Users, Home, IndianRupee, Activity, FileText, AlertCircle, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const { t } = useLanguage();

    return (
        <div className="space-y-0 h-[calc(100vh-60px)] flex flex-col">

            {/* 1. GOVERNMENT STATS STRIP (Flat, Text-Only, High Density) */}
            <div className="w-full bg-white border-b border-gray-300 flex flex-wrap md:flex-nowrap shrink-0">
                {/* Item 1 */}
                <div className="flex-1 min-w-[140px] p-4 border-r border-gray-200">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Funds</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-gray-900 font-mono">₹57,000</span>
                    </div>
                </div>
                {/* Item 2 */}
                <div className="flex-1 min-w-[140px] p-4 border-r border-gray-200">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Houses</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-gray-900 font-mono">15</span>
                        <span className="text-xs text-gray-400">Registered</span>
                    </div>
                </div>
                {/* Item 3 */}
                <div className="flex-1 min-w-[140px] p-4 border-r border-gray-200">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Tenants</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-gray-900 font-mono">12</span>
                        <span className="text-xs text-gray-400">Active</span>
                    </div>
                </div>
                {/* Item 4 */}
                <div className="flex-1 min-w-[140px] p-4 border-r border-gray-200 bg-amber-50/30">
                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1">Pending</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-amber-700 font-mono">3</span>
                        <span className="text-xs text-amber-600/70">Actions Required</span>
                    </div>
                </div>
            </div>

            {/* 2. MAIN LAYOUT (Split View) */}
            <div className="flex-1 flex min-h-0">

                {/* LEFT: ACTIVITY LOG (Full Width Table) */}
                <div className="flex-1 flex flex-col min-w-0 bg-white border-r border-gray-200">
                    {/* Toolbar */}
                    <div className="h-10 border-b border-gray-200 bg-gray-50 flex items-center justify-between px-4 shrink-0">
                        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                            System Activity Log
                        </h2>
                        <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-gray-200 rounded">
                                <Search size={14} className="text-gray-500" />
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded">
                                <Filter size={14} className="text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Content (Scrollable) */}
                    <div className="flex-1 overflow-y-auto">
                        {/* Desktop Table (Hidden on Mobile) */}
                        <table className="hidden md:table w-full text-left border-collapse">
                            <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase border-b border-gray-200 w-32">Timestamp</th>
                                    <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase border-b border-gray-200">Event Description</th>
                                    <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase border-b border-gray-200 w-32">User</th>
                                    <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase border-b border-gray-200 w-24 text-right">Reference</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
                                    <tr key={i} className="hover:bg-blue-50/30 transition-colors text-xs">
                                        <td className="px-4 py-2 text-gray-500 font-mono border-r border-gray-100">2024-02-08 10:{i < 10 ? `0${i}` : i}</td>
                                        <td className="px-4 py-2 text-gray-900 font-medium">
                                            Contribution Recorded for Maintenance Fund
                                        </td>
                                        <td className="px-4 py-2 text-gray-600 border-l border-gray-100">Admin</td>
                                        <td className="px-4 py-2 text-gray-400 font-mono text-right border-l border-gray-100">#TRX-{1000 + i}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile List View (Visible on Mobile) */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="p-3 bg-white">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-mono text-gray-500">2024-02-08 10:{i < 10 ? `0${i}` : i}</span>
                                        <span className="text-[10px] font-mono text-gray-400">#TRX-100{i}</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 leading-tight mb-1">
                                        Contribution Recorded for Maintenance Fund
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                        <span className="text-xs text-gray-500">Admin</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: ACTION ITEMS (Fixed Width Column on Desktop, Stacked on Mobile) */}
                <div className="hidden md:flex flex-col w-72 bg-gray-50 shrink-0">
                    {/* Header */}
                    <div className="h-10 border-b border-gray-200 bg-gray-100 flex items-center px-4 shrink-0">
                        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                            Action Items (3)
                        </h2>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-0">
                        <div className="divide-y divide-gray-200 border-b border-gray-200">
                            <div className="p-3 bg-white hover:bg-gray-50 cursor-pointer group border-l-2 border-transparent hover:border-blue-500">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold text-gray-900 group-hover:text-blue-700">Verify User #15</span>
                                    <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-sm font-bold uppercase">New</span>
                                </div>
                                <p className="text-[10px] text-gray-500 leading-snug">New registration request from Hrafn.</p>
                            </div>

                            <div className="p-3 bg-white hover:bg-gray-50 cursor-pointer group border-l-2 border-transparent hover:border-amber-500">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold text-gray-900 group-hover:text-amber-700">Proposal #102</span>
                                    <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-sm font-bold uppercase">Pending</span>
                                </div>
                                <p className="text-[10px] text-gray-500 leading-snug">Awaiting executive committee review.</p>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="mt-4 px-3">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Quick Actions</h3>
                            <div className="space-y-1">
                                <button className="w-full text-left px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                    + Draft Notice
                                </button>
                                <button className="w-full text-left px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                    + Record Expense
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* MOBILE ONLY: Icon Grid (Yashoda Style) - Visible only on small screens */}
            <div className="md:hidden border-t border-gray-200 bg-white p-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Access</h3>
                <div className="grid grid-cols-4 gap-4">
                    <Link href="/admin/community" className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
                            <Users size={18} />
                        </div>
                        <span className="text-[10px] font-medium text-gray-600">People</span>
                    </Link>
                    <Link href="/admin/documents" className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700">
                            <FileText size={18} />
                        </div>
                        <span className="text-[10px] font-medium text-gray-600">Docs</span>
                    </Link>
                    <Link href="/admin/notices" className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                            <AlertCircle size={18} />
                        </div>
                        <span className="text-[10px] font-medium text-gray-600">Notices</span>
                    </Link>
                    <Link href="/admin/funds" className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-700">
                            <IndianRupee size={18} />
                        </div>
                        <span className="text-[10px] font-medium text-gray-600">Funds</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
