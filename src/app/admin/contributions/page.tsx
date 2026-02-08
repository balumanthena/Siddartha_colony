'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, IndianRupee, Printer } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import clsx from 'clsx';

type Contribution = {
    id: string;
    amount: number;
    payment_method: string;
    status: string;
    paid_date: string;
    // Joins
    users: { name: string } | null;
    funds: { title: string } | null;
    houses: { door_number: string } | null;
};

// ... imports
import { Modal } from '@/components/ui/modal';

// ... existing types ...

export default function Contributions() {
    const { language } = useLanguage();
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fundsList, setFundsList] = useState<{ id: string, title_en: string }[]>([]);
    const [housesList, setHousesList] = useState<{ id: string, door_number: string }[]>([]);

    const [newContribution, setNewContribution] = useState({
        fund_id: '',
        house_id: '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0]
    });

    const fetchContributions = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('contributions')
            .select(`
                *,
                users ( name ),
                funds ( title_en ),
                houses ( door_number )
            `)
            .order('paid_date', { ascending: false });

        if (!error && data) {
            setContributions(data as any);
        }
        setIsLoading(false);
    };

    const fetchDropdowns = async () => {
        const { data: funds } = await supabase.from('funds').select('id, title_en').eq('status', 'active');
        const { data: houses } = await supabase.from('houses').select('id, door_number').order('door_number');

        if (funds) setFundsList(funds);
        if (houses) setHousesList(houses);
    }

    useEffect(() => {
        fetchContributions();
        fetchDropdowns();
    }, []);

    const handleRecordPayment = () => {
        setIsAddModalOpen(true);
    };

    const submitContribution = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { error } = await supabase.from('contributions').insert([{
            fund_id: newContribution.fund_id,
            house_id: newContribution.house_id || null, // Optional if user selected? Enforce House for now.
            amount: Number(newContribution.amount),
            payment_date: newContribution.payment_date
            // user_id left null for Admin entry unless we map House -> Owner User
        }]);

        if (error) {
            alert("Error recording payment: " + error.message);
        } else {
            setIsAddModalOpen(false);
            setNewContribution({
                fund_id: '',
                house_id: '',
                amount: '',
                payment_date: new Date().toISOString().split('T')[0]
            });
            fetchContributions();
        }
        setIsSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                    {language === 'en' ? 'Contributions' : 'చందాలు'}
                </h2>
                <Button onClick={handleRecordPayment} className="flex items-center gap-2">
                    <Plus size={16} />
                    {language === 'en' ? 'Record Payment' : 'చెల్లింపును నమోదు చేయండి'}
                </Button>
            </div>

            <Card className="border-gray-200">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium uppercase text-gray-500">
                        Recent Transactions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="py-8 text-center text-gray-500">
                            <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                            Loading Transactions...
                        </div>
                    ) : contributions.length === 0 ? (
                        <div className="py-8 text-center text-gray-400">
                            No contributions recorded yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2">Date</th>
                                        <th className="px-4 py-2">Resident / House</th>
                                        <th className="px-4 py-2">Fund</th>
                                        <th className="px-4 py-2">Amount</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2 text-right">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {contributions.map((c) => (
                                        <tr key={c.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-mono text-gray-600">
                                                {c.paid_date ? c.paid_date.split('T')[0] : '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900">{c.users?.name || 'Manual Entry'}</div>
                                                <div className="text-xs text-gray-500">
                                                    {c.houses?.door_number ? `House #${c.houses.door_number}` : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {(c.funds as any)?.title_en || (c.funds as any)?.title || 'Fund'}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-gray-900">
                                                ₹{c.amount.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={clsx(
                                                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                                    // c.status is missing in schema, assuming strictly collected. 
                                                    // Logic: if exists, it is collected.
                                                    "bg-green-100 text-green-700"
                                                )}>
                                                    PAID
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button className="text-gray-400 hover:text-blue-600">
                                                    <Printer size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Record Contribution"
            >
                <form onSubmit={submitContribution} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fund</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newContribution.fund_id}
                            onChange={e => setNewContribution({ ...newContribution, fund_id: e.target.value })}
                            required
                        >
                            <option value="">Select Fund</option>
                            {fundsList.map(f => (
                                <option key={f.id} value={f.id}>{f.title_en}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">House</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newContribution.house_id}
                            onChange={e => setNewContribution({ ...newContribution, house_id: e.target.value })}
                            required
                        >
                            <option value="">Select House</option>
                            {housesList.map(h => (
                                <option key={h.id} value={h.id}>{h.door_number}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (₹)</label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newContribution.amount}
                            onChange={e => setNewContribution({ ...newContribution, amount: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                        <input
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newContribution.payment_date}
                            onChange={e => setNewContribution({ ...newContribution, payment_date: e.target.value })}
                            required
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Record Payment'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
