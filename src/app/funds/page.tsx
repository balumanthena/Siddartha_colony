'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';

// Sample Data mimicking DB structure
const FUNDS = [
    {
        id: 1,
        title_en: 'Ganesh Chaturthi 2024',
        title_te: 'వినాయక చవితి 2024',
        target: 50000,
        collected: 42000,
        status: 'active', // active, closed
        is_voluntary: true,
    },
    {
        id: 2,
        title_en: 'Street Light Repairs',
        title_te: 'వీధి దీపాల మరమ్మతులు',
        target: 15000,
        collected: 15000,
        status: 'closed',
        is_voluntary: true,
    },
];

export default function FundsPage() {
    const { t, language } = useLanguage();

    return (
        <div className="pb-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 sticky top-0 bg-gray-50 pt-4 pb-2 z-10">
                {t('nav.funds')}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
                {FUNDS.map((fund) => {
                    const progress = Math.min(Math.round((fund.collected / fund.target) * 100), 100);
                    return (
                        <Card key={fund.id} className="relative overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg text-gray-900">
                                        {language === 'en' ? fund.title_en : fund.title_te}
                                    </h3>
                                    <span className={clsx(
                                        "px-2 py-0.5 rounded text-xs font-medium",
                                        fund.status === 'active'
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                    )}>
                                        {fund.status.toUpperCase()}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between text-sm mb-4 border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">{t('funds.collected')}</span>
                                    <span className="font-mono font-medium text-gray-900">₹{fund.collected.toLocaleString()}</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                                    <div
                                        className="h-full bg-gray-900"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mb-6">
                                    <span>{progress}% funded</span>
                                    <span>Target: ₹{fund.target.toLocaleString()}</span>
                                </div>

                                <Button className="w-full bg-gray-900 hover:bg-black text-white rounded font-medium h-10">
                                    {t('funds.contribute')}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
