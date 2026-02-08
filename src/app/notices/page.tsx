'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card'; // Import Card and CardContent separately.
import { Calendar, FileText } from 'lucide-react';
import clsx from 'clsx'; // Import clsx


const NOTICES = [
    {
        id: 1,
        title_en: 'General Body Meeting',
        title_te: 'సర్వసభ్య సమావేశం',
        date: '2024-10-15',
        type: 'meeting',
        content_en: 'Agenda: Election of new committee members.',
        content_te: 'ఎజెండా: కొత్త కమిటీ సభ్యుల ఎన్నిక.',
    },
    {
        id: 2,
        title_en: 'MoM: Oct 2024 Meeting',
        title_te: 'సమావేశ వివరాలు: అక్టోబర్ 2024',
        date: '2024-10-16',
        type: 'mom',
        content_en: 'Decided to collect funds for Ganesh Chaturthi.',
        content_te: 'వినాయక చవితికి నిధులు సేకరించాలని నిర్ణయించారు.',
    },
];

export default function NoticesPage() {
    const { t, language } = useLanguage();

    return (
        <div className="space-y-4 pb-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 sticky top-0 bg-gray-50 pt-4 pb-2 z-10">
                {t('nav.notices')}
            </h2>

            {NOTICES.map((notice) => (
                <div key={notice.id} className="bg-white border border-gray-200 p-5 rounded-sm mb-4">
                    <div className="flex justify-between items-start mb-3">
                        <div className="space-y-1">
                            {/* Type Label */}
                            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 border border-gray-200 px-2 py-0.5 rounded-sm">
                                {notice.type === 'meeting'
                                    ? (language === 'en' ? 'Meeting' : 'సమావేశం')
                                    : (language === 'en' ? 'Minutes' : 'నివేదిక')
                                }
                            </span>

                            <h3 className="font-semibold text-gray-900 mt-1">
                                {language === 'en' ? notice.title_en : notice.title_te}
                            </h3>
                        </div>
                        <div className="text-xs font-mono text-gray-400">
                            {notice.date}
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed border-l-2 border-gray-100 pl-3">
                        {language === 'en' ? notice.content_en : notice.content_te}
                    </p>
                </div>
            ))}
        </div>
    );
}
