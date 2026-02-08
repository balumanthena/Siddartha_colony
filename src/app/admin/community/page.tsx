'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { BadgeCheck, Plus, UserMinus, UserPlus } from 'lucide-react';
import { OfficeBearer } from '@/components/admin/DocumentTemplate';
import { Modal } from '@/components/ui/modal';
import { DESIGNATIONS } from '@/lib/translations/designations';

// Types
interface RegistryData {
    id: string;
    role: OfficeBearer['role'];
    full_name: string;
    phone?: string;
    start_date: string;
    end_date?: string;
    status: 'active' | 'former';
}

// Initial Mock Data
const INITIAL_IDENTITY = {
    official_area: 'Kisan Nagar',
    road_name: 'Road No. 6',
    association_name: 'Siddhartha Welfare Association',
    registration_number: '123/2010',
    registration_year: '2010',
};

const INITIAL_REGISTRY: RegistryData[] = [
    { id: '1', role: 'president', full_name: 'Ramesh Gupta', start_date: '2023-01-01', status: 'active' },
    { id: '2', role: 'vice_president', full_name: 'K. Venkatesh', start_date: '2023-01-01', status: 'active' },
    { id: '3', role: 'secretary', full_name: 'Lakshmi Narayana', start_date: '2023-01-01', status: 'active' },
    { id: '4', role: 'treasurer', full_name: 'Rajesh Kumar', start_date: '2023-01-01', status: 'active' },
    { id: '5', role: 'executive_member', full_name: 'P. Suresh', start_date: '2023-01-01', status: 'active' },
];

export default function CommunitySettings() {
    const { language } = useLanguage();
    const [identity, setIdentity] = useState(INITIAL_IDENTITY);
    const [registry, setRegistry] = useState<RegistryData[]>(INITIAL_REGISTRY);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<OfficeBearer['role']>('executive_member');
    const [newBearerName, setNewBearerName] = useState('');
    const [newBearerPhone, setNewBearerPhone] = useState('');

    // Persist to LocalStorage for Document Generator to pick up
    useEffect(() => {
        const communityData = {
            ...identity,
            bearers: registry // Pass the whole registry, Template filters for 'active'
        };
        localStorage.setItem('community_settings', JSON.stringify(communityData));
    }, [identity, registry]);

    // Actions
    const handleUpdateIdentity = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API
        setTimeout(() => setLoading(false), 500);
    };

    const openAddModal = () => {
        setNewBearerName('');
        setNewBearerPhone('');
        // Default to first role or keep previous? Executive member is a safe default.
        setSelectedRole('executive_member');
        setIsAddModalOpen(true);
    };

    const handleAddBearer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole || !newBearerName) return;

        const today = new Date().toISOString().split('T')[0];
        const isMultiSeat = DESIGNATIONS.find(d => d.key === selectedRole)?.isExecutive;

        let updatedRegistry = [...registry];

        // 1. Auto-Archive Logic (for single-seat roles)
        if (!isMultiSeat) {
            updatedRegistry = updatedRegistry.map(bearer => {
                if (bearer.role === selectedRole && bearer.status === 'active') {
                    return { ...bearer, status: 'former', end_date: today } as RegistryData;
                }
                return bearer;
            });
        }

        // 2. Add New Bearer
        updatedRegistry.push({
            id: Date.now().toString(),
            role: selectedRole,
            full_name: newBearerName,
            phone: newBearerPhone,
            start_date: today,
            status: 'active'
        });

        setRegistry(updatedRegistry);
        setIsAddModalOpen(false);
    };

    const handleRemoveBearer = (id: string) => {
        if (confirm('Are you sure you want to remove this member? This will archive them.')) {
            const today = new Date().toISOString().split('T')[0];
            const updatedRegistry = registry.map(bearer => {
                if (bearer.id === id) {
                    return { ...bearer, status: 'former', end_date: today } as RegistryData;
                }
                return bearer;
            });
            setRegistry(updatedRegistry);
        }
    }

    // Helper to get active bearer
    const getActive = (role: string) => registry.find(r => r.role === role && r.status === 'active');
    const getActiveExecutives = () => registry.filter(r => r.role === 'executive_member' && r.status === 'active');

    return (
        <div className="max-w-5xl mx-auto space-y-8">

            {/* 1. Identity Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Community Identity</CardTitle>
                    <CardDescription>Legal registration details of the association.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdateIdentity} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Association Name</label>
                            <input
                                type="text"
                                value={identity.association_name}
                                onChange={e => setIdentity({ ...identity, association_name: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Registration No.</label>
                            <input
                                type="text"
                                value={identity.registration_number}
                                onChange={e => setIdentity({ ...identity, registration_number: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Official Area (Locked)</label>
                            <div className="w-full bg-gray-50 border border-gray-200 rounded-md p-2 text-gray-500 font-medium">
                                {identity.official_area}
                            </div>
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Identity'}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* 2. Office Bearers Registry with Unified Add Action */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <BadgeCheck className="text-blue-600" />
                            Office Bearers Registry
                        </CardTitle>
                        <CardDescription>
                            Master record of all elected members.
                        </CardDescription>
                    </div>
                    <Button onClick={openAddModal} className="gap-2">
                        <UserPlus size={16} /> Add Office Bearer
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Core Posts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {DESIGNATIONS.filter(d => !d.isExecutive).map((designation) => {
                            const active = getActive(designation.key);
                            return (
                                <div key={designation.key} className="border border-gray-200 rounded-lg p-4 bg-white relative group min-h-[100px] flex flex-col justify-center">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                                        {language === 'en' ? designation.en : designation.te}
                                    </p>

                                    {active ? (
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-gray-900 text-lg">{active.full_name}</p>
                                                {active.phone && <p className="text-sm text-gray-500 font-mono">{active.phone}</p>}
                                                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                    Active since {active.start_date}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-gray-400">
                                            <p className="text-xs italic">Vacant</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Executive Members Section */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-gray-900 uppercase">Executive Members</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {getActiveExecutives().map(member => (
                                <div key={member.id} className="bg-white border border-gray-200 p-3 rounded shadow-sm flex justify-between items-start group">
                                    <div>
                                        <p className="font-bold text-gray-900">{member.full_name}</p>
                                        {member.phone && <p className="text-xs text-gray-500 font-mono mb-1">{member.phone}</p>}
                                        <p className="text-xs text-gray-400">Since {member.start_date}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveBearer(member.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Remove Member"
                                    >
                                        <UserMinus size={14} />
                                    </button>
                                </div>
                            ))}
                            {getActiveExecutives().length === 0 && (
                                <p className="text-sm text-gray-400 italic">No executive members listed.</p>
                            )}
                        </div>
                    </div>

                </CardContent>
            </Card>

            {/* Unified Add Person Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add / Update Office Bearer"
            >
                <form onSubmit={handleAddBearer} className="space-y-4">

                    {/* 1. Designation Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                        <select
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as OfficeBearer['role'])}
                        >
                            {DESIGNATIONS.map((d) => (
                                <option key={d.key} value={d.key}>
                                    {language === 'en' ? d.en : d.te}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 2. Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Person Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            placeholder="Full Legal Name"
                            value={newBearerName}
                            onChange={(e) => setNewBearerName(e.target.value)}
                        />
                    </div>

                    {/* 3. Phone Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <input
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            placeholder="Mobile Number"
                            value={newBearerPhone}
                            onChange={(e) => setNewBearerPhone(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-6">
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
