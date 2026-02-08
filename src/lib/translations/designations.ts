export type DesignationKey =
    | 'president'
    | 'vice_president'
    | 'secretary'
    | 'joint_secretary'
    | 'treasurer'
    | 'chief_secretary'
    | 'district_president'
    | 'district_secretary'
    | 'women_secretary'
    | 'advisor'
    | 'executive_member';

export interface DesignationDef {
    key: DesignationKey;
    en: string;
    te: string;
    order: number;
    isExecutive?: boolean; // If true, handled as a list of members rather than a single post
}

export const DESIGNATIONS: DesignationDef[] = [
    { key: 'district_president', en: 'District President', te: 'జిల్లా అధ్యక్షుడు', order: 1 },
    { key: 'district_secretary', en: 'District Secretary', te: 'జిల్లా కార్యదర్శి', order: 2 },
    { key: 'chief_secretary', en: 'Chief Secretary', te: 'ప్రధాన కార్యదర్శి', order: 3 },
    { key: 'president', en: 'President', te: 'అధ్యక్షుడు', order: 4 },
    { key: 'vice_president', en: 'Vice President', te: 'ఉపాధ్యక్షుడు', order: 5 },
    { key: 'secretary', en: 'General Secretary', te: 'ప్రధాన కార్యదర్శి', order: 6 },
    { key: 'joint_secretary', en: 'Joint Secretary', te: 'సహాయ కార్యదర్శి', order: 7 },
    { key: 'treasurer', en: 'Treasurer', te: 'కోశాధికారి', order: 8 },
    { key: 'women_secretary', en: 'Women Secretary', te: 'మహిళా కార్యదర్శి', order: 9 },
    { key: 'advisor', en: 'Advisor', te: 'సలహాదారు', order: 10 },
    { key: 'executive_member', en: 'Executive Member', te: 'కార్యవర్గ సభ్యుడు', order: 11, isExecutive: true },
];

export const getDesignationLabel = (key: string, lang: 'en' | 'te') => {
    const def = DESIGNATIONS.find(d => d.key === key);
    return def ? def[lang] : key;
};
