'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Hourglass, CheckCircle2, XCircle } from 'lucide-react';
import clsx from 'clsx';

const PROPOSALS = [
    {
        id: 1,
        title_en: 'Road Widening at Entrance',
        title_te: 'ప్రవేశ ద్వారం వద్ద రోడ్డు విస్తరణ',
        status: 'discussion', // discussion, approved, rejected
        docs: [],
    },
    {
        id: 2,
        title_en: 'CCTV Camera Installation',
        title_te: 'సీసీ కెమెరాల ఏర్పాటు',
        status: 'approved',
        docs: ['quote.pdf'],
    },
];

const STATUS_CONFIG = {
    discussion: {
        icon: Hourglass,
        color: 'text-amber-600',
        bg: 'bg-amber-100',
        label_en: 'Discussion',
        label_te: 'చర్చ'
    },
    approved: {
        icon: CheckCircle2,
        color: 'text-green-600',
        bg: 'bg-green-100',
        label_en: 'Approved',
        label_te: 'ఆమోదించబడింది'
    },
    rejected: {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-100',
        label_en: 'Rejected',
        label_te: 'తిరస్కరించబడింది'
    }
};

export default function DecisionsPage() {
    const { t, language } = useLanguage();

    return (
        <div className="space-y-4 pb-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 sticky top-0 bg-gray-50 pt-4 pb-2 z-10">
                {t('nav.decisions')}
            </h2>

            {PROPOSALS.map((proposal) => {
                // Simplified status mapping - minimal colors
                const statusStyles = {
                    discussion: "bg-gray-100 text-gray-600",
                    approved: "bg-gray-900 text-white",
                    rejected: "bg-white border border-gray-200 text-gray-400 decoration-line-through"
                };

                const statusLabel = {
                    discussion: language === 'en' ? 'Discussion' : 'చర్చ',
                    approved: language === 'en' ? 'Approved' : 'ఆమోదించబడింది',
                    rejected: language === 'en' ? 'Rejected' : 'తిరస్కరించబడింది',
                };

                return (
                    <div key={proposal.id} className="bg-white border border-gray-200 rounded-sm p-5 mb-4">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-medium text-gray-900">
                                {language === 'en' ? proposal.title_en : proposal.title_te}
                            </h3>
                            <span className={clsx("text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-sm", statusStyles[proposal.status as keyof typeof statusStyles])}>
                                {statusLabel[proposal.status as keyof typeof statusLabel]}
                            </span>
                        </div>

                        <div className="text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                <FileText size={14} className="text-gray-300" />
                                {proposal.docs.length > 0 ? (
                                    <span className="underline decoration-gray-300 underline-offset-4">Reference Document PDF</span>
                                ) : (
                                    <span className="italic text-gray-400">No documents attached.</span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
