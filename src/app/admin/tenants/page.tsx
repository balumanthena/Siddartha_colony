'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { Search, UserCheck, MoreVertical, Loader2, UserPlus, Phone, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';

type Tenant = {
    id: string;
    name: string;
    email: string;
    house_id: string;
    phone_number: string;
    role: string;
    houses?: { house_number: string };
};

export default function TenantManagement() {
    const { language, t } = useLanguage();
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [houses, setHouses] = useState<{ id: string, house_number: string, owner_name: string }[]>([]);

    const fetchTenants = async () => {
        setIsLoading(true);
        // Fetch users who are residents/tenants
        const { data, error } = await supabase
            .from('users')
            .select(`
                *,
                houses ( house_number )
            `)
            .in('role', ['resident', 'tenant'])
            .order('email'); // fallback sort

        if (!error && data) {
            // Manual sort by name if available in metadata, else email
            // But we can just use what we have.
            setTenants(data as any);
        }
        setIsLoading(false);
    };

    const fetchHouses = async () => {
        const { data } = await supabase.from('houses').select('id, house_number, owner_name').order('house_number');
        if (data) setHouses(data);
    }

    useEffect(() => {
        fetchTenants();
        fetchHouses();
    }, []);

    const filteredTenants = tenants.filter(t =>
        (t.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.houses?.house_number || '').includes(searchTerm)
        // Name is in metadata usually, but let's assume we might display email if name missing
    );

    const handleAddTenant = () => {
        setIsAddModalOpen(true);
    };

    // Server Action Wrapper
    async function onSubmit(formData: FormData) {
        setIsLoading(true);
        const { createTenant } = await import('@/app/actions/createTenant'); // Dynamic import to avoid server/client issues if any
        const result = await createTenant(null, formData);

        if (result?.error) {
            alert(result.error);
        } else {
            alert("Tenant added successfully!");
            setIsAddModalOpen(false);
            fetchTenants();
        }
        setIsLoading(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                        {language === 'en' ? 'Tenant Registry' : 'అద్దెదారులు'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        {language === 'en'
                            ? `Active Residents: ${tenants.length}`
                            : `క్రియాశీల నివాసితులు: ${tenants.length}`}
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search Email or House #..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleAddTenant} className="flex items-center gap-2">
                        <UserPlus size={16} />
                        <span className="hidden md:inline">Add Tenant</span>
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-xs">Resident</th>
                                <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-xs">House #</th>
                                <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-xs">Role</th>
                                <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                                        Loading Tenants...
                                    </td>
                                </tr>
                            ) : filteredTenants.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                        No residents found.
                                    </td>
                                </tr>
                            ) : (
                                filteredTenants.map((tenant) => (
                                    <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs uppercase">
                                                    {(tenant.email || '?').slice(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{tenant.email}</div>
                                                    {/* Phone etc would go here if we had it in public table */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-600">
                                            {tenant.houses?.house_number || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-bold uppercase tracking-wider border border-gray-200">
                                                {tenant.role || 'RESIDENT'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-gray-600 p-1">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Tenant Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-800">Add New Tenant</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>

                        <form action={onSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                                <input name="name" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter full name" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                                <input name="phone_number" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91..." />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assign House</label>
                                <select name="house_id" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                    <option value="">Select House...</option>
                                    {houses.map(h => (
                                        <option key={h.id} value={h.id}>
                                            {h.house_number} ({h.owner_name})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <p className="text-xs text-gray-400 italic">
                                Note: This will create a local "shadow" account. No email or password is required for the tenant.
                            </p>

                            <div className="pt-4 flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Create Tenant'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
