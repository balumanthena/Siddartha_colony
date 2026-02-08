'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ShieldAlert } from 'lucide-react';

export default function Home() {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section className="py-6 border-b border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-1 tracking-tight">
          {t('home.welcome')} {t('app.title')}
        </h2>
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <MapPin size={14} />
          {t('home.area')}, {t('home.road')}
        </p>
      </section>

      {/* Community Identity Card */}
      <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">
          {language === 'en' ? 'Community Details' : 'కమ్యూనిటీ వివరాలు'}
        </h3>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-500">{language === 'en' ? 'Area' : 'ప్రాంతం'}</span>
            <span className="font-medium text-gray-900">{t('home.area')}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-500">{language === 'en' ? 'Road' : 'రోడ్డు'}</span>
            <span className="font-medium text-gray-900">{t('home.road')}</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-gray-500">{language === 'en' ? 'Association' : 'సంఘం'}</span>
            <span className="font-medium text-gray-900">Siddhartha Welfare Association</span>
          </div>
        </div>
      </div>

      {/* Disclaimer Card */}
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm flex gap-4">
        <ShieldAlert className="text-gray-400 shrink-0" size={20} />
        <p className="text-xs text-gray-500 leading-relaxed max-w-prose">
          {t('home.disclaimer')}
        </p>
      </div>

    </div>
  );
}
