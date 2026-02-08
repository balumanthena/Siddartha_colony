'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone, MoreHorizontal, User } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { useState } from 'react';

// Mock Data - STRICTLY TENANTS
// In real app, filter WHERE role = 'tenant'
const MOCK_TENANTS = [
    {
        id: 2,
        name: 'Srinivas Rao',
        currentHouse: '102',
        email: 'srinivas@example.com',
        phone: '9848012346',
        status: 'Active',
        history: 'Moved in: Jan 2024'
    },
    {
        id: 4,
        name: 'David Raj',
        currentHouse: '105',
        email: 'david@example.com',
        phone: '9848012349',
        status: 'Active',
        history: 'Moved in: Feb 2024'
    },
    {
        id: 5,
        name: 'Priya Sharma',
        currentHouse: null,
        email: 'priya@example.com',
        phone: '9848012350',
        status: 'Former',
        history: 'Resided in #201 (2022-2023)'
    },
];

export default function TenantsManagement() {
    const { t } = useLanguage();
    const [tenants, setTenants] = useState(MOCK_TENANTS);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newTenant, setNewTenant] = useState({ name: '', email: '', phone: '' });

    const handleAddTenant = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTenant.name) {
            setTenants([...tenants, {
                id: tenants.length + 1,
                name: newTenant.name,
                currentHouse: null,
                email: newTenant.email || 'pending@example.com',
                phone: newTenant.phone,
                status: 'Active',
                history: 'New Registration'
            }]);
            setNewTenant({ name: '', email: '', phone: '' });
            setIsAddModalOpen(false);
        }
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                        {t('admin.sidebar.tenants')}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">{t('admin.sidebar.tenants_subtitle')}</p>
                </div>
                <button
                    onClick={() => {
                        const name = prompt("Enter Tenant Name:");
                        if (name) {
                            setTenants([...tenants, {
                                id: tenants.length + 1,
                                name,
                                currentHouse: null,
                                email: 'pending@example.com',
                                phone: '',
                                status: 'Active',
                                history: 'New Registration'
                            }]);
                        }
                    }}
                    className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <User size={16} />
                    Add Tenant
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Residency</th>
                            <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tenants.map((tenant) => (
                            <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 align-top">{tenant.name}</td>
                                <td className="px-6 py-4 align-top">
                                    {tenant.currentHouse ? (
                                        <div>
                                            <span className="text-xs text-gray-500 uppercase tracking-wider">Current</span>
                                            <p className="font-mono font-medium text-gray-900">#{tenant.currentHouse}</p>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">No active lease</span>
                                    )}
                                    <div className="mt-1 text-xs text-gray-500 bg-gray-50 inline-block px-1.5 py-0.5 rounded">
                                        {tenant.history}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500 space-y-1 align-top">
                                    <div className="flex items-center gap-2">
                                        <Mail size={12} /> {tenant.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={12} /> {tenant.phone}
                                    </div>
                                </td>
                                <td className="px-6 py-4 align-top">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tenant.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${tenant.status === 'Active' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                                        {tenant.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right align-top">
                                    <button className="text-gray-400 hover:text-gray-900 transition-colors">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {tenants.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-sm border border-dashed border-gray-300">
                    <p>No active tenants found.</p>
                </div>
            )}
        </div>
    );
}
