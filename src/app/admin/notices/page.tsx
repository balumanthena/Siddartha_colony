'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Calendar, Plus } from 'lucide-react';

// Mock Data
const NOTICES = [
    { id: 1, title: 'General Body Meeting', date: '2024-10-15', type: 'Meeting', status: 'Active' },
    { id: 2, title: 'Water Tank Cleaning', date: '2024-10-20', type: 'Maintenance', status: 'Scheduled' },
];

export default function NoticesManagement() {
    const { t } = useLanguage();

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                        {t('admin.sidebar.notices')}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Broadcast information to residents</p>
                </div>
                <button className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
                    <Plus size={16} />
                    {t('admin.action.createNotice')}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {NOTICES.map((notice) => (
                    <div key={notice.id} className="bg-white border border-gray-200 rounded-sm p-6 flex justify-between items-center hover:border-gray-300 transition-colors">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-sm">
                                    {notice.type}
                                </span>
                                <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-sm flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                    {notice.status}
                                </span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">{notice.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar size={14} />
                                <span>{notice.date}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="text-sm border border-gray-200 px-3 py-1.5 rounded-sm hover:bg-gray-50 text-gray-700">
                                Edit
                            </button>
                            <button className="text-sm border border-gray-200 px-3 py-1.5 rounded-sm hover:bg-red-50 text-red-600 hover:border-red-200">
                                Archive
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {NOTICES.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-sm border border-dashed border-gray-300">
                    <p>{t('admin.label.noNotices')}</p>
                </div>
            )}
        </div>
    );
}
