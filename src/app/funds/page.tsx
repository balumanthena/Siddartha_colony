'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Bilingual Fund Type
type Fund = {
    id: string;
    title_en: string;
    title_te: string;
    description_en?: string;
    description_te?: string;
    target_amount: number;
    amount_collected?: number; // DB likely confusingly named 'collected' or 'collected_amount'
    collected_amount: number; // The actual column in schema
    status: 'active' | 'closed' | 'completed';
    is_voluntary: boolean;
};

export default function FundsPage() {
    const { t, language } = useLanguage();
    const [funds, setFunds] = useState<Fund[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFunds = async () => {
        const { data, error } = await supabase
            .from('funds')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching funds:', error);
        } else {
            setFunds(data as any);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchFunds();

        // Realtime Subscription
        const channel = supabase
            .channel('public:funds')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'funds' }, (payload) => {
                console.log('Realtime Fund Update:', payload);
                fetchFunds(); // Simple refresh strategy
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
                <Loader2 size={32} className="animate-spin mb-4 text-blue-600" />
                <p>Loading community funds...</p>
            </div>
        );
    }

    return (
        <div className="pb-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 sticky top-0 bg-gray-50 pt-4 pb-4 z-10 flex items-center gap-3">
                <Coins className="text-blue-600" />
                {t('nav.funds')}
            </h2>

            {funds.length === 0 ? (
                <div className="bg-white border rounded-lg p-8 text-center text-gray-500">
                    <p>No active funds found at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
                    {funds.map((fund) => {
                        // Use collected_amount from DB (default 0)
                        const collected = fund.collected_amount || 0;
                        const target = fund.target_amount || 1; // Prevent division by zero
                        const progress = Math.min(Math.round((collected / target) * 100), 100);

                        // Localization Fallbacks
                        const title = language === 'en'
                            ? (fund.title_en || 'Untitled Fund')
                            : (fund.title_te || fund.title_en || 'నిధి');

                        const description = language === 'en'
                            ? fund.description_en
                            : fund.description_te;

                        return (
                            <Card key={fund.id} className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2 bg-white border-b border-gray-50">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 leading-tight">
                                                {title}
                                            </h3>
                                            {fund.is_voluntary && (
                                                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                    Voluntary
                                                </span>
                                            )}
                                        </div>
                                        <span className={clsx(
                                            "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                                            fund.status === 'active'
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                        )}>
                                            {fund.status}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    {description && (
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                            {description}
                                        </p>
                                    )}

                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500">{t('funds.collected')}</span>
                                        <span className="font-mono font-bold text-gray-900">₹{collected.toLocaleString()}</span>
                                    </div>

                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                                        <div
                                            className="h-full bg-slate-900 transition-all duration-1000 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between text-xs text-gray-400 mb-6">
                                        <span>{progress}% funded</span>
                                        <span>Target: ₹{target.toLocaleString()}</span>
                                    </div>

                                    <Button
                                        disabled={fund.status !== 'active'}
                                        className={clsx(
                                            "w-full font-medium h-10 transition-colors",
                                            fund.status === 'active'
                                                ? "bg-slate-900 hover:bg-black text-white"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        )}
                                    >
                                        {fund.status === 'active' ? t('funds.contribute') : 'Closed'}
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
