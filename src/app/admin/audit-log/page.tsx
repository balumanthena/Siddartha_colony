'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

// Mock Data (Real app fetches from audit_logs table)
const AUDIT_LOGS = [
    { id: 1, action: 'UPDATE', table: 'funds', user: 'admin@siddharth.com', time: '10:42 AM', details: 'Changed Fund "Ganesh" target from 40k to 50k' },
    { id: 2, action: 'INSERT', table: 'contributions', user: 'admin@siddharth.com', time: '10:30 AM', details: 'Added manual payment ₹1000 for House #5' },
    { id: 3, action: 'ARCHIVE', table: 'houses', user: 'admin@siddharth.com', time: 'Yesterday', details: 'Archived House "Plot 12"' },
];

export default function AuditLogViewer() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">System Audit Log</h2>
            </div>

            <div className="space-y-4">
                {AUDIT_LOGS.map((log) => (
                    <Card key={log.id} className="border-l-4 border-l-gray-400">
                        <CardContent className="pt-4 pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded text-white ${log.action === 'DELETE' || log.action === 'ARCHIVE' ? 'bg-red-500' :
                                            log.action === 'UPDATE' ? 'bg-amber-500' : 'bg-green-500'
                                        }`}>
                                        {log.action}
                                    </span>
                                    <span className="text-xs font-mono text-gray-500 ml-2 uppercase">
                                        {log.table}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400">{log.time}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{log.details}</p>
                            <p className="text-xs text-gray-500 mt-1">User: {log.user}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
