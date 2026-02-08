'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple dictionary for immediate use. 
// In a larger app, we might move this to separate JSON files.
const translations: Record<string, Record<Language, string>> = {
  'app.title': { en: 'Siddhartha Colony', te: 'సిద్ధార్థ కాలనీ' },
  'nav.home': { en: 'Home', te: 'హోమ్' },
  'nav.houses': { en: 'Houses', te: 'ఇళ్లు' },
  'nav.funds': { en: 'Funds', te: 'నిధులు' },
  'nav.decisions': { en: 'Decisions', te: 'నిర్ణయాలు' },
  'nav.notices': { en: 'Notices', te: 'గమనికలు' },
  'home.welcome': { en: 'Welcome to', te: 'స్వాగతం' },
  'home.area': { en: 'Kisan Nagar', te: 'కిసాన్ నగర్' },
  'home.road': { en: 'Road No. 6', te: 'రోడ్ నం. 6' },
  'home.disclaimer': {
    en: 'This app is for transparency. It does not replace government approvals.',
    te: 'ఈ యాప్ పారదర్శకత కోసమే. ఇది ప్రభుత్వ అనుమతులను భర్తీ చేయదు.'
  },
  'common.loading': { en: 'Loading...', te: 'లోడ్ అవుతోంది...' },

  // Admin Sidebar
  'admin.sidebar.dashboard': { en: 'Dashboard', te: 'డాష్బోర్డ్' },
  'admin.sidebar.community': { en: 'Community', te: 'కమ్యూనిటీ' },
  'admin.sidebar.houses': { en: 'Houses', te: 'ఇళ్లు' },
  'admin.sidebar.tenants': { en: 'Tenants', te: 'అద్దెదారులు' }, // Renamed from Users
  'admin.sidebar.tenants_subtitle': { en: 'Manage tenants and non-owner residents', te: 'అద్దెదారులు మరియు యజమాని కాని నివాసితులను నిర్వహించండి' }, // New Subtitle
  'admin.sidebar.funds': { en: 'Funds', te: 'నిధులు' },
  'admin.sidebar.contributions': { en: 'Contributions', te: 'చందాలు' },
  'admin.sidebar.decisions': { en: 'Decisions', te: 'నిర్ణయాలు' },
  'admin.sidebar.notices': { en: 'Notices', te: 'గమనికలు' },
  'admin.sidebar.auditLog': { en: 'Audit Log', te: 'ఆడిట్ లాగ్' },
  'admin.sidebar.documents': { en: 'Documents', te: 'పత్రాలు' },
  'admin.header.title': { en: 'Administration', te: 'నిర్వహణ' },
  'admin.sidebar.return': { en: 'Return to App', te: 'యాప్‌కి వెళ్లు' },
  'admin.sidebar.exit': { en: 'Exit Admin', te: 'నిష్క్రమించు' },

  // Admin Dashboard
  'admin.dashboard.systemOverview': { en: 'System Overview', te: 'సిస్టమ్ అవలోకనం' },
  'admin.dashboard.totalHouses': { en: 'Total Houses', te: 'మొత్తం ఇళ్లు' },
  'admin.dashboard.registeredUsers': { en: 'Registered Tenants', te: 'నమోదైన అద్దెదారులు' }, // Updated Label
  'admin.dashboard.activeFunds': { en: 'Active Funds', te: 'క్రియాశీల నిధులు' },
  'admin.dashboard.totalCollections': { en: 'Total Collections', te: 'మొత్తం వసూళ్లు' },

  // Admin Sections
  'admin.section.recentActivity': { en: 'Recent Activity', te: 'ఇటీవలి కార్యకలాపాలు' },
  'admin.section.activeNotices': { en: 'Active Notices', te: 'క్రియాశీల గమనికలు' },
  'admin.section.actionItems': { en: 'Action Items', te: 'చర్య అంశాలు' },
  'admin.section.systemStatus': { en: 'System Status', te: 'సిస్టమ్ స్థితి' },
  'admin.section.reminders': { en: 'Reminders', te: 'గుర్తింపులు' },

  // Admin Actions & Labels
  'admin.action.viewLog': { en: 'View Log', te: 'లాగ్ చూడు' },
  'admin.action.manage': { en: 'Manage', te: 'నిర్వహించు' },
  'admin.action.createNotice': { en: 'Create Notice', te: 'గమనిక సృష్టించు' },
  'admin.action.moveIn': { en: 'Move In', te: 'అద్దెకు ఇవ్వండి' },
  'admin.action.moveOut': { en: 'End Tenancy', te: 'అద్దె ముగించు' },
  'admin.label.noNotices': { en: 'No active public notices at this time.', te: 'ప్రస్తుతం ఎటువంటి క్రియాశీల గమనికలు లేవు.' },
  'admin.status.healthy': { en: 'Healthy', te: 'ఆరోగ్యకరమైన' },
  'admin.status.active': { en: 'Active', te: 'క్రియాశీల' },
  'admin.status.pending': { en: 'PENDING', te: 'పెండింగ్' },
  'admin.status.new': { en: 'NEW', te: 'కొత్త' },
  'admin.status.ownerOccupied': { en: 'Owner Occupied', te: 'యజమాని నివాసం' },
  'admin.status.rented': { en: 'Rented', te: 'అద్దెకు ఉంది' },
  'admin.status.vacant': { en: 'Vacant', te: 'ఖాళీగా ఉంది' },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Load from local storage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('app-language') as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (key: string) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry['en'];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
