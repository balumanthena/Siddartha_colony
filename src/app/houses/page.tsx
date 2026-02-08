'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

const HOUSES = [
    { number: '1', owner: 'Ramesh Gupta' },
    { number: '2', owner: 'Srinivas Rao' },
    { number: '3', owner: 'Lakshmi Narayana' },
    { number: '4', owner: 'Mohd. Ali' },
    { number: '5', owner: 'Krishna Reddy' },
    { number: '6', owner: 'Venkatesh' },
    { number: '7', owner: 'Sujatha' },
    { number: '8', owner: 'Prasad' },
    { number: '9', owner: 'Anitha' },
    { number: '10', owner: 'Ramakrishna' },
    { number: '11', owner: 'Narsimha' },
    { number: '12', owner: 'Balu' },
    { number: '13', owner: 'Satyanarayana' },
    { number: '14', owner: 'Ravi Kumar' },
    { number: '15', owner: 'Vijay' },
];

export default function HousesPage() {
    const { t, language } = useLanguage();

    return (
        <div className="space-y-4 pb-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 sticky top-0 bg-gray-50 pt-4 pb-2 z-10">
                {t('nav.houses')} <span className="text-sm font-normal text-gray-500">(15)</span>
            </h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {HOUSES.map((house) => (
                    <div key={house.number} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-sm">
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-lg font-medium text-gray-400 w-8">
                                {house.number}
                            </span>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{house.owner}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    {language === 'en' ? 'Owner' : 'యజమాని'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
