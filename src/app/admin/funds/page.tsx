'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Plus, Archive, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

// Mock Data
const MOCK_FUNDS = [
    { id: 1, title_en: 'Ganesh Chaturthi 2024', target: 50000, collected: 42000, status: 'active', is_voluntary: true },
    { id: 2, title_en: 'Street Light Repairs', target: 15000, collected: 15000, status: 'closed', is_voluntary: true },
];

export default function FundManagement() {
    const { language } = useLanguage();
    const [funds, setFunds] = useState(MOCK_FUNDS);
    const [showForm, setShowForm] = useState(false);
    const [newFund, setNewFund] = useState({ title_en: '', target: '', description: '' });
    const [error, setError] = useState('');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // strict validation
        const forbiddenWords = ['mandatory', 'renewal fee', 'maintenance fee', 'fixed'];
        const lowerTitle = newFund.title_en.toLowerCase();

        if (forbiddenWords.some(word => lowerTitle.includes(word))) {
            setError('Error: Only VOLUNTARY funds are allowed. Words like "mandatory" or "fee" are blocked.');
            return;
        }

        // Add mock fund
        const fund = {
            id: Date.now(),
            title_en: newFund.title_en,
            target: Number(newFund.target),
            collected: 0,
            status: 'active',
            is_voluntary: true
        };

        setFunds([...funds, fund]);
        setShowForm(false);
        setNewFund({ title_en: '', target: '', description: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                    {language === 'en' ? 'Manage Funds' : 'నిధులను నిర్వహించండి'}
                </h2>
                <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
                    <Plus size={16} />
                    {language === 'en' ? 'Create Fund' : 'కొత్త నిధి'}
                </Button>
            </div>

            {showForm && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardHeader><CardTitle>New Voluntary Fund</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Fund Title (Purpose)</label>
                                <input
                                    className="w-full p-2 border rounded"
                                    placeholder="e.g., Festival Celebration"
                                    value={newFund.title_en}
                                    onChange={(e) => setNewFund({ ...newFund, title_en: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Target Amount (₹)</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded"
                                    placeholder="50000"
                                    value={newFund.target}
                                    onChange={(e) => setNewFund({ ...newFund, target: e.target.value })}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-600 text-sm font-bold bg-red-100 p-2 rounded">
                                    <AlertTriangle size={16} />
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                                <Button type="submit">Create Voluntary Fund</Button>
                            </div>
                            <p className="text-xs text-gray-500 italic mt-2">
                                * Note: All funds are strictly voluntary. You cannot create mandatory collections.
                            </p>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-4">
                {funds.map((fund) => (
                    <Card key={fund.id} className="relative">
                        <CardContent className="pt-6 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{fund.title_en}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={clsx(
                                        "px-2 py-0.5 rounded text-xs font-medium",
                                        fund.status === 'active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                    )}>
                                        {fund.status.toUpperCase()}
                                    </span>
                                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">Voluntary</span>
                                </div>
                                <div className="mt-4 text-sm">
                                    <p>Target: ₹{fund.target.toLocaleString()}</p>
                                    <p>Collected: <span className="font-bold text-green-600">₹{fund.collected.toLocaleString()}</span></p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Archive size={16} />
                                <span className="sr-only">Archive</span>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
