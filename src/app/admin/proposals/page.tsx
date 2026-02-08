'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Plus, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import clsx from 'clsx';

// Mock Data
const MOCK_ITEMS = [
    { id: 1, type: 'proposal', title: 'Road Widening', status: 'discussion', date: '2024-10-01' },
    { id: 2, type: 'notice', title: 'General Meeting', status: 'published', date: '2024-10-05' },
];

export default function ProposalNoticeManagement() {
    const { language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'proposals' | 'notices'>('proposals');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                    {language === 'en' ? 'Proposals & Notices' : 'ప్రతిపాదనలు & గమనికలు'}
                </h2>
                <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    {language === 'en' ? 'Add New' : 'కొత్తది జోడించండి'}
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('proposals')}
                    className={clsx(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'proposals' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                >
                    Proposals
                </button>
                <button
                    onClick={() => setActiveTab('notices')}
                    className={clsx(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'notices' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                >
                    Notices
                </button>
            </div>

            <div className="space-y-4">
                {MOCK_ITEMS.filter(i => activeTab === 'proposals' ? i.type === 'proposal' : i.type === 'notice').map((item) => (
                    <Card key={item.id}>
                        <CardContent className="pt-6 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-900">{item.title}</h3>
                                <p className="text-xs text-gray-500">{item.date}</p>

                                {item.type === 'proposal' && (
                                    <div className="flex gap-2 mt-2">
                                        <button className="text-xs flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                            <Clock size={12} /> Discussion
                                        </button>
                                        <button className="text-xs flex items-center gap-1 hover:bg-green-100 text-gray-400 hover:text-green-800 px-2 py-1 rounded transition-colors">
                                            <CheckCircle size={12} /> Approve
                                        </button>
                                        <button className="text-xs flex items-center gap-1 hover:bg-red-100 text-gray-400 hover:text-red-800 px-2 py-1 rounded transition-colors">
                                            <XCircle size={12} /> Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <FileText size={14} /> Docs
                                </Button>
                                <p className="text-[10px] text-red-500 mt-1">
                                    {language === 'en' ? 'No doc uploaded' : 'పత్రం లేదు'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {MOCK_ITEMS.filter(i => activeTab === 'proposals' ? i.type === 'proposal' : i.type === 'notice').length === 0 && (
                    <p className="text-center text-gray-500 py-8">No items found.</p>
                )}
            </div>
        </div>
    );
}
