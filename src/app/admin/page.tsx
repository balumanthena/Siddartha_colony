'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Users, Home, IndianRupee, Activity, FileText, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
    const { t } = useLanguage();

    return (
        <div className="space-y-4">
            {/* 1. Dense Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="rounded-none border-gray-300 shadow-sm">
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Funds</span>
                        <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-gray-900 font-mono">₹57,000</span>
                            <IndianRupee size={16} className="text-gray-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-none border-gray-300 shadow-sm">
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Houses</span>
                        <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-gray-900 font-mono">15</span>
                            <Home size={16} className="text-gray-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-none border-gray-300 shadow-sm">
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Tenants</span>
                        <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-gray-900 font-mono">12</span>
                            <Users size={16} className="text-gray-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-none border-gray-300 shadow-sm">
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Pending Actions</span>
                        <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-amber-600 font-mono">3</span>
                            <Activity size={16} className="text-amber-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 2. Split View: Logs & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-180px)]">

                {/* Main: Activity Log (Table Style) */}
                <Card className="col-span-2 rounded-none border-gray-300 shadow-sm flex flex-col">
                    <CardHeader className="py-3 px-4 border-b border-gray-200 bg-gray-50/50">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-gray-700">System Activity Log</CardTitle>
                    </CardHeader>
                    <div className="flex-1 overflow-auto p-0">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 font-semibold text-gray-600 border-b border-gray-200">Timestamp</th>
                                    <th className="px-4 py-2 font-semibold text-gray-600 border-b border-gray-200">Event</th>
                                    <th className="px-4 py-2 font-semibold text-gray-600 border-b border-gray-200">User</th>
                                    <th className="px-4 py-2 font-semibold text-gray-600 border-b border-gray-200 text-right">Ref ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-4 py-2 text-gray-500 font-mono whitespace-nowrap">2024-02-08 10:4{i}</td>
                                        <td className="px-4 py-2 text-gray-900">Contribution Recorded for Maintenance Fund</td>
                                        <td className="px-4 py-2 text-gray-600">Admin</td>
                                        <td className="px-4 py-2 text-gray-400 font-mono text-right">#TRX-{1000 + i}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Sidebar: Status & Quick Actions */}
                <div className="space-y-4">
                    {/* Notices Status */}
                    <Card className="rounded-none border-gray-300 shadow-sm">
                        <CardHeader className="py-3 px-4 border-b border-gray-200 bg-gray-50/50 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-gray-700">Active Notices</CardTitle>
                            <FileText size={14} className="text-gray-400" />
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="p-4 text-center text-xs text-gray-500 italic border-b border-gray-100">
                                No public notices are currently active.
                            </div>
                            <button className="w-full py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors uppercase tracking-wide">
                                + Draft New Notice
                            </button>
                        </CardContent>
                    </Card>

                    {/* Pending Items List */}
                    <Card className="rounded-none border-gray-300 shadow-sm flex-1">
                        <CardHeader className="py-3 px-4 border-b border-gray-200 bg-amber-50/50 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-amber-800">Action Items</CardTitle>
                            <AlertCircle size={14} className="text-amber-600" />
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-100">
                                <div className="p-3 hover:bg-gray-50 cursor-pointer">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold text-gray-900">Verify User #15</span>
                                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">NEW</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500">New registration request from Hrafn.</p>
                                </div>
                                <div className="p-3 hover:bg-gray-50 cursor-pointer">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold text-gray-900">Proposal #102</span>
                                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">PENDING</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500">Awaiting executive committee review.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
