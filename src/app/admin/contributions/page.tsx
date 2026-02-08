'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Plus, Search } from 'lucide-react';

// Mock Data
const MOCK_CONTRIBUTIONS = [
    { id: 1, house: '1', date: '2024-10-01', amount: 500, fund: 'Ganesh Chaturthi', method: 'Cash' },
    { id: 2, house: '5', date: '2024-10-02', amount: 1000, fund: 'Ganesh Chaturthi', method: 'UPI' },
];

export default function ContributionManagement() {
    const { language } = useLanguage();
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                    {language === 'en' ? 'Contributions' : 'విరాళాలు'}
                </h2>
                <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
                    <Plus size={16} />
                    {language === 'en' ? 'Add Entry' : 'నమోదు చేయండి'}
                </Button>
            </div>

            {showForm && (
                <Card className="bg-gray-50 border-gray-200">
                    <CardHeader><CardTitle className="text-base">Manual Entry (Offline Payment)</CardTitle></CardHeader>
                    <CardContent>
                        <form className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">House No.</label>
                                    <select className="w-full p-2 border rounded bg-white">
                                        <option>Select House...</option>
                                        <option value="1">1 - Ramesh</option>
                                        <option value="2">2 - Srinivas</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fund</label>
                                    <select className="w-full p-2 border rounded bg-white">
                                        <option>Ganesh Chaturthi</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (₹)</label>
                                <input type="number" className="w-full p-2 border rounded" placeholder="0.00" />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
                                <Button size="sm">Save Receipt</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 font-medium">
                        <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">House</th>
                            <th className="px-4 py-3">Fund</th>
                            <th className="px-4 py-3 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {MOCK_CONTRIBUTIONS.map((c) => (
                            <tr key={c.id}>
                                <td className="px-4 py-3 text-gray-500">{c.date}</td>
                                <td className="px-4 py-3 font-medium">#{c.house}</td>
                                <td className="px-4 py-3 text-gray-600 truncate max-w-[100px]">{c.fund}</td>
                                <td className="px-4 py-3 text-right font-bold text-gray-900">₹{c.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
