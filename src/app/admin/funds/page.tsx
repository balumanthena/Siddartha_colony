'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Plus, Archive, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import clsx from 'clsx';

// DB Schema Type
// ... imports

// DB Schema Type (Bilingual)
type Fund = {
    id: string;
    title_en: string; // Changed from title
    title_te: string;
    description: string; // The "simple" description column we added earlier might exist, OR use en/te
    description_en?: string;
    description_te?: string; // Optional if schema allows
    target_amount: number;
    start_date: string;
    end_date: string | null;
    status: 'active' | 'closed' | 'completed';
    is_voluntary: boolean;
    created_at: string;
    amount_collected?: number;
};

export default function FundManagement() {
    const { language } = useLanguage();
    // const supabase = createClient(); 

    const [funds, setFunds] = useState<Fund[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [newFund, setNewFund] = useState({ title: '', target_amount: '', description: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Funds
    const fetchFunds = async () => {
        setIsLoading(true);
        // We select * which pulls everything.
        const { data, error } = await supabase
            .from('funds')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setFunds(data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchFunds();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const currentUser = (await supabase.auth.getUser()).data.user;
        console.log('Current User ID:', currentUser?.id);


        // Strict Validation
        const forbiddenWords = ['mandatory', 'renewal fee', 'maintenance fee', 'fixed'];
        const lowerTitle = newFund.title.toLowerCase();

        if (forbiddenWords.some(word => lowerTitle.includes(word))) {
            setError('Error: Only VOLUNTARY funds are allowed. Words like "mandatory" or "fee" are blocked.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Map single input to bilingual fields to satisfy DB constraints
            // If the DB has `title` (my migration) AND `title_en` (original schema), we fill ALL to be safe.
            const fundData = {
                title: newFund.title,           // For my migration column
                title_en: newFund.title,        // For original schema (Not Null)
                title_te: newFund.title,        // For original schema (Not Null) - Auto-fill English for now
                description: newFund.description || 'Community Fund',
                description_en: newFund.description || 'Community Fund',
                description_te: newFund.description || 'Community Fund',
                target_amount: Number(newFund.target_amount),
                status: 'active',
                is_voluntary: true,
                start_date: new Date().toISOString().split('T')[0], // Today
                created_by: currentUser?.id || null
            };

            const { data, error } = await supabase
                .from('funds')
                .insert([fundData])
                .select()
                .single();

            if (error) throw error;

            // Update UI
            if (data) {
                setFunds([data, ...funds]);
                setShowForm(false);
                setNewFund({ title: '', target_amount: '', description: '' });
            }
        } catch (err: any) {
            console.error('Error creating fund (Full):', JSON.stringify(err, null, 2));
            console.error('Error message:', err.message);
            console.error('Error details:', err.details);
            console.error('Error hint:', err.hint);
            setError(err.message || 'Failed to create fund. Check console for details.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Close Fund Action
    const handleCloseFund = async (id: string) => {
        const { error } = await supabase
            .from('funds')
            .update({ status: 'closed' })
            .eq('id', id);

        if (!error) {
            fetchFunds(); // Refresh
        }
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

            {/* Creation Form */}
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
                                    value={newFund.title}
                                    onChange={(e) => setNewFund({ ...newFund, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Target Amount (₹)</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded"
                                    placeholder="50000"
                                    value={newFund.target_amount}
                                    onChange={(e) => setNewFund({ ...newFund, target_amount: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    className="w-full p-2 border rounded"
                                    placeholder="Brief details..."
                                    value={newFund.description}
                                    onChange={(e) => setNewFund({ ...newFund, description: e.target.value })}
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-600 text-sm font-bold bg-red-100 p-2 rounded">
                                    <AlertTriangle size={16} />
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => setShowForm(false)} disabled={isSubmitting}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin mr-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Voluntary Fund'
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 italic mt-2">
                                * Note: All funds are strictly voluntary. You cannot create mandatory collections.
                            </p>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Funds List */}
            {isLoading ? (
                <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                    <Loader2 size={32} className="animate-spin mb-2" />
                    Loading funds...
                </div>
            ) : funds.length === 0 ? (
                <div className="text-center py-10 text-gray-400 bg-white rounded border border-gray-200">
                    No active funds found. Create one to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {funds.map((fund) => (
                        <Card key={fund.id} className="relative transition-all hover:shadow-md">
                            <CardContent className="pt-6 flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">
                                        {/* Fallback to title_en or simple title depending on what data we have */}
                                        {language === 'en' ? (fund.title_en || (fund as any).title) : (fund.title_te || fund.title_en || (fund as any).title)}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-2">
                                        {language === 'en' ? (fund.description_en || fund.description) : (fund.description_te || fund.description)}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={clsx(
                                            "px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider",
                                            fund.status === 'active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                        )}>
                                            {fund.status}
                                        </span>
                                        {fund.is_voluntary && (
                                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">Voluntary</span>
                                        )}
                                    </div>
                                    <div className="mt-4 text-sm">
                                        <p>Target: ₹{fund.target_amount?.toLocaleString()}</p>
                                        {/* Future: Add real collection calculation */}
                                        <p>Collected: <span className="font-bold text-green-600">₹0</span></p>
                                    </div>
                                </div>
                                {fund.status === 'active' && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleCloseFund(fund.id)}
                                    >
                                        <Archive size={16} />
                                        <span className="sr-only">Close Fund</span>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
