'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { Plus, ThumbsUp, ThumbsDown, MessageSquare, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { format } from 'date-fns';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';

type Proposal = {
    id: string;
    title: string;
    description: string;
    status: 'discussion' | 'approved' | 'rejected' | 'implemented';
    created_at: string;
    proposer_id: string; // join with users
    users?: { name: string };
    votes_for: number;
    votes_against: number;
};

// ... imports
import { Modal } from '@/components/ui/modal';

// ...

export default function ProposalsManagement() {
    const { language, t } = useLanguage();
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newProposal, setNewProposal] = useState({ title: '', description: '' });

    const fetchProposals = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('proposals')
            .select('*, users(name)')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setProposals(data as any);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchProposals();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const user = (await supabase.auth.getUser()).data.user;

        const { error } = await supabase.from('proposals').insert([{
            title_en: newProposal.title,
            title_te: newProposal.title, // Auto-fill
            description_en: newProposal.description,
            description_te: newProposal.description, // Auto-fill
            status: 'discussion',
            created_by: user?.id
        }]);

        if (error) {
            alert("Error creating proposal: " + error.message);
        } else {
            setIsAddModalOpen(false);
            setNewProposal({ title: '', description: '' });
            fetchProposals();
        }
        setIsSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                    {language === 'en' ? 'Community Proposals' : 'సంఘం ప్రతిపాదనలు'}
                </h2>
                <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
                    <Plus size={16} />
                    {language === 'en' ? 'New Proposal' : 'కొత్త ప్రతిపాదన'}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                        Loading Proposals...
                    </div>
                ) : proposals.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 border border-dashed rounded-lg">
                        <MessageSquare size={32} className="mx-auto mb-2 opacity-20" />
                        <p>No active proposals.</p>
                    </div>
                ) : (
                    proposals.map((proposal) => (
                        <div key={proposal.id} className="bg-white border border-gray-200 rounded-sm shadow-sm flex flex-col">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={clsx(
                                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                                        proposal.status === 'discussion' && "bg-blue-50 text-blue-700 border-blue-200",
                                        proposal.status === 'approved' && "bg-green-50 text-green-700 border-green-200",
                                        proposal.status === 'rejected' && "bg-red-50 text-red-700 border-red-200",
                                        proposal.status === 'implemented' && "bg-gray-50 text-gray-700 border-gray-200"
                                    )}>
                                        {proposal.status}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {format(new Date(proposal.created_at), 'MMM d')}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 leading-tight">
                                    {(proposal as any).title_en || proposal.title}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {(proposal as any).description_en || proposal.description}
                                </p>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                        {proposal.users?.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="text-xs text-gray-500">Proposed by {proposal.users?.name || 'Unknown'}</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center text-xs font-medium">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1 text-green-700">
                                        <ThumbsUp size={14} /> {proposal.votes_for || 0}
                                    </span>
                                    <span className="flex items-center gap-1 text-red-700">
                                        <ThumbsDown size={14} /> {proposal.votes_against || 0}
                                    </span>
                                </div>
                                <button className="text-blue-600 hover:underline">View Details</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Create Proposal"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                        <input
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newProposal.title}
                            onChange={e => setNewProposal({ ...newProposal, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none h-32"
                            value={newProposal.description}
                            onChange={e => setNewProposal({ ...newProposal, description: e.target.value })}
                            required
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Submit Proposal'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
