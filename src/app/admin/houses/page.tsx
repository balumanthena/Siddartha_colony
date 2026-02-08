'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Trash2, Edit2, Plus, Home } from 'lucide-react';
import { useState } from 'react';

// Mock Data - Updated structure with explicit status
const MOCK_HOUSES = [
    { id: 1, number: '101', owner: 'Ramesh Gupta', tenant: null, status: 'owner_occupied', residents: 4 },
    { id: 2, number: '102', owner: 'Venkatesh', tenant: 'Srinivas Rao', status: 'rented', residents: 3 },
    { id: 3, number: '103', owner: 'Lakshmi Narayana', tenant: null, status: 'vacant', residents: 0 },
    { id: 4, number: '105', owner: 'Rajesh Kumar', tenant: 'David Raj', status: 'rented', residents: 2 },
];

export default function HouseManagement() {
    const { t, language } = useLanguage();
    const [houses, setHouses] = useState(MOCK_HOUSES);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newHouse, setNewHouse] = useState({ number: '', owner: '' });

    const handleAddHouse = (e: React.FormEvent) => {
        e.preventDefault();
        if (newHouse.number && newHouse.owner) {
            setHouses([...houses, {
                id: houses.length + 1,
                number: newHouse.number,
                owner: newHouse.owner,
                tenant: null,
                status: 'owner_occupied',
                residents: 1
            }]);
            setNewHouse({ number: '', owner: '' });
            setIsAddModalOpen(false);
        }
    };

    // Mock Move-In/Out Logic
    const handleMoveIn = (id: number) => {
        const tenantName = prompt("Enter Tenant Name:");
        if (tenantName) {
            setHouses(houses.map(h =>
                h.id === id ? { ...h, tenant: tenantName, status: 'rented', residents: h.residents + 1 } : h
            ));
        }
    };

    const handleMoveOut = (id: number) => {
        if (confirm("End current tenancy? This will archive the occupancy record.")) {
            setHouses(houses.map(h =>
                h.id === id ? { ...h, tenant: null, status: 'vacant' } : h
            ));
        }
    };

    const handleDelete = (id: number) => {
        if (confirm(language === 'en' ? 'Are you sure you want to archive this house?' : 'మీరు ఖచ్చితంగా ఈ ఇంటిని ఆర్కైవ్ చేయాలనుకుంటున్నారా?')) {
            setHouses(houses.filter(h => h.id !== id));
        }
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                        {t('admin.sidebar.houses')}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Directory of owners and tenants</p>
                </div>

                <button
                    onClick={() => {
                        const number = prompt("Enter House Number:");
                        const owner = prompt("Enter Owner Name:");
                        if (number && owner) {
                            setHouses([...houses, {
                                id: houses.length + 1,
                                number,
                                owner,
                                tenant: null,
                                status: 'owner_occupied',
                                residents: 1
                            }]);
                        }
                    }}
                    className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} />
                    {language === 'en' ? 'Add House' : 'ఇల్లు జోడించండి'}
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Number</th>
                            <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {houses.map((house) => (
                            <tr key={house.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 align-top">
                                    <div className="bg-gray-100 w-12 h-8 flex items-center justify-center rounded-sm text-gray-700 font-bold">
                                        {house.number}
                                    </div>
                                </td>
                                <td className="px-6 py-4 align-top">
                                    {house.status === 'owner_occupied' && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                            {t('admin.status.ownerOccupied')}
                                        </span>
                                    )}
                                    {house.status === 'rented' && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                            {t('admin.status.rented')}
                                        </span>
                                    )}
                                    {house.status === 'vacant' && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                            {t('admin.status.vacant')}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 space-y-2 align-top">
                                    <div>
                                        <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Owner</span>
                                        <p className="text-sm font-medium text-gray-900">{house.owner}</p>
                                    </div>
                                    {house.tenant && (
                                        <div>
                                            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Tenant</span>
                                            <p className="text-sm font-medium text-gray-900">{house.tenant}</p>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right align-top">
                                    {house.status === 'rented' ? (
                                        <button
                                            onClick={() => handleMoveOut(house.id)}
                                            className="text-xs font-medium text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-sm transition-colors"
                                        >
                                            {t('admin.action.moveOut')}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleMoveIn(house.id)}
                                            className="text-xs font-medium text-gray-900 border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-sm transition-colors"
                                        >
                                            {t('admin.action.moveIn')}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
