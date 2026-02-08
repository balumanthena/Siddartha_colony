'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { Search, MoreVertical, Loader2, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

// Updated House type to match new schema
type House = {
    id: string;
    house_number: string;
    owner_name: string;
    total_portions: number;
    rented_portions: number;
    vacant_portions: number;
    resident_count: number; // Kept for legacy/total count
    pending_dues: number;
};

export default function HousesRegistry() {
    const { language } = useLanguage();
    const [houses, setHouses] = useState<House[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        house_number: '',
        owner_name: '',
        total_portions: 1,
        rented_portions: 0,
        owner_occupied: 0,
        vacant_portions: 1
    });

    const fetchHouses = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('houses')
            .select('*')
            .order('house_number', { ascending: true });

        if (!error && data) {
            setHouses(data as any);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchHouses();
    }, []);

    // Filter houses
    const filteredHouses = houses.filter(h =>
        h.house_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddHouse = () => {
        setEditingId(null);
        setFormData({
            house_number: '',
            owner_name: '',
            total_portions: 1,
            rented_portions: 0,
            owner_occupied: 0,
            vacant_portions: 1
        });
        setIsAddModalOpen(true);
    };

    const handleEditHouse = (house: House) => {
        setEditingId(house.id);
        const total = house.total_portions || 1;
        const rented = house.rented_portions || 0;
        // Calculate owner occupied if not explicitly stored (backward compat)
        // If schema is brand new, we can assume logic: Owner = Total - Rented - Vacant
        const vacant = house.vacant_portions || 0;
        const owner = Math.max(0, total - rented - vacant);

        setFormData({
            house_number: house.house_number,
            owner_name: house.owner_name,
            total_portions: total,
            rented_portions: rented,
            owner_occupied: owner,
            vacant_portions: vacant
        });
        setIsAddModalOpen(true);
    };

    const handleDeleteHouse = async (id: string) => {
        if (!confirm("Are you sure you want to delete this house? This cannot be undone.")) return;

        const { error } = await supabase.from('houses').delete().eq('id', id);
        if (error) {
            alert("Failed to delete: " + error.message);
        } else {
            fetchHouses();
        }
    };

    const submitHouse = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic validation
        if (!formData.house_number || !formData.owner_name) {
            alert("House number and Owner name are required.");
            setIsSubmitting(false);
            return;
        }

        const calculatedVacant = formData.total_portions - formData.rented_portions - formData.owner_occupied;
        if (calculatedVacant < 0) {
            alert("Error: Rented + Owner Occupied cannot exceed Total Portions.");
            setIsSubmitting(false);
            return;
        }

        // Quick fetch community check (only for new inserts if needed, but good for linking)
        // For edits, we don't strictly need it if we aren't changing community_id

        const payload = {
            house_number: formData.house_number,
            owner_name: formData.owner_name,
            total_portions: formData.total_portions,
            rented_portions: formData.rented_portions,
            vacant_portions: calculatedVacant,
            resident_count: (formData.total_portions - calculatedVacant) * 2, // Estimate
        };

        let result;
        if (editingId) {
            // Update
            result = await supabase.from('houses').update(payload).eq('id', editingId);
        } else {
            // Insert
            // Need community_id for insert
            const { data: comms } = await supabase.from('communities').select('id').limit(1);
            if (comms?.[0]?.id) {
                result = await supabase.from('houses').insert([{ ...payload, community_id: comms[0].id }]);
            } else {
                result = { error: { message: "No Community Found" } } as any;
            }
        }

        const { error } = result;

        if (error) {
            console.error(error);
            if (error.message?.includes('column')) {
                alert("Database Error: Schema missing.\n\nPlease run the SQL command in Supabase Dashboard to add 'rented_portions' columns.");
            } else {
                alert("Failed to save house: " + error.message);
            }
        } else {
            setIsAddModalOpen(false);
            fetchHouses();
        }
        setIsSubmitting(false);
    };

    // Helper to update state and auto-calculate vacant
    const updatePortions = (field: 'total' | 'rented' | 'owner', value: number) => {
        let total = formData.total_portions;
        let rented = formData.rented_portions;
        let owner = formData.owner_occupied;

        if (field === 'total') total = value;
        if (field === 'rented') rented = value;
        if (field === 'owner') owner = value;

        // Ensure no negative values
        total = Math.max(1, total);
        rented = Math.max(0, rented);
        owner = Math.max(0, owner);

        const vacant = total - rented - owner;

        setFormData({
            ...formData,
            total_portions: total,
            rented_portions: rented,
            owner_occupied: owner,
            vacant_portions: Math.max(0, vacant)
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                        {language === 'en' ? 'House Registry' : 'ఇంటి రిజిస్ట్రీ'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        {language === 'en'
                            ? `Total Registered Properties: ${houses.length}`
                            : `మొత్తం నమోదైన ఆస్తులు: ${houses.length}`}
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search House # or Owner..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleAddHouse} className="flex items-center gap-2">
                        <Plus size={16} />
                        <span className="hidden md:inline">Add House</span>
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-xs">House #</th>
                                <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-xs">Owner Name</th>
                                <th className="px-6 py-3 font-semibold text-center text-gray-700 uppercase tracking-wider text-xs">Portions</th>
                                <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-xs">Occupancy</th>
                                <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                                        Loading Registry...
                                    </td>
                                </tr>
                            ) : filteredHouses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                        No houses found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredHouses.map((house) => {
                                    // Fallback for old data where columns might be null/undefined strictly in TS view
                                    const total = house.total_portions || 1;
                                    const rented = house.rented_portions || 0;
                                    const vacant = house.vacant_portions || 0;
                                    const ownerOccupied = Math.max(0, total - (rented + vacant));

                                    return (
                                        <tr key={house.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono font-medium text-gray-900 pointer-events-none">
                                                {house.house_number}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {house.owner_name}
                                            </td>
                                            <td className="px-6 py-4 text-center font-mono font-medium text-gray-600">
                                                {total}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 text-xs flex-wrap">
                                                    {ownerOccupied > 0 && (
                                                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded border border-green-200 font-medium whitespace-nowrap">
                                                            {ownerOccupied} Own
                                                        </span>
                                                    )}
                                                    {rented > 0 && (
                                                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-medium whitespace-nowrap">
                                                            {rented} Rented
                                                        </span>
                                                    )}
                                                    {vacant > 0 && (
                                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 font-medium whitespace-nowrap">
                                                            {vacant} Vacant
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        onClick={() => handleEditHouse(house)}
                                                    >
                                                        <span className="sr-only">Edit</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDeleteHouse(house.id)}
                                                    >
                                                        <span className="sr-only">Delete</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit House Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title={editingId ? "Edit House Details" : "Add New House"}
            >
                <form onSubmit={submitHouse} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">House Number</label>
                            <input
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. 1-2-123"
                                value={formData.house_number}
                                onChange={e => setFormData({ ...formData, house_number: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total Portions</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.total_portions}
                                onChange={e => updatePortions('total', parseInt(e.target.value) || 1)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Owner Name</label>
                        <input
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Full Name"
                            value={formData.owner_name}
                            onChange={e => setFormData({ ...formData, owner_name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rented Portions</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.rented_portions}
                                    onChange={e => updatePortions('rented', parseInt(e.target.value) || 0)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Owner Occupied</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.owner_occupied}
                                    onChange={e => updatePortions('owner', parseInt(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 text-right pt-1 border-t border-gray-200 mt-2">
                            Remaining (Vacant): <strong>{formData.vacant_portions}</strong>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (editingId ? 'Save Changes' : 'Add House')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
