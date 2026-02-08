'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button'; // Assuming we will create a basic button or use shadcn later
import clsx from 'clsx';

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
            <button
                onClick={() => setLanguage('en')}
                className={clsx(
                    "px-3 py-1 rounded-full text-sm font-medium transition-all",
                    language === 'en'
                        ? "bg-white text-blue-800 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                )}
            >
                EN
            </button>
            <button
                onClick={() => setLanguage('te')}
                className={clsx(
                    "px-3 py-1 rounded-full text-sm font-medium transition-all",
                    language === 'te'
                        ? "bg-white text-blue-800 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                )}
            >
                తెలుగు
            </button>
        </div>
    );
}
