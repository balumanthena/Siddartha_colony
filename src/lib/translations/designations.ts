export type DesignationKey =
    | 'president'
    | 'vice_president'
    | 'secretary'
    | 'joint_secretary'
    | 'treasurer'
    | 'executive_member'
    | 'chief_secretary'
    | 'district_president'
    | 'district_secretary'
    | 'women_secretary'
    | 'advisor';

export interface Designation {
    key: DesignationKey;
    en: string;
    te: string;
    level: number; // 1 = Top, 5 = Member
    isExecutive: boolean; // True if it allows multiple holders (like Executive Member)
}

export const DESIGNATIONS: Designation[] = [
    { key: 'president', en: 'President', te: 'అధ్యక్షుడు', level: 1, isExecutive: false },
    { key: 'vice_president', en: 'Vice President', te: 'ఉపాధ్యక్షుడు', level: 2, isExecutive: false },
    { key: 'secretary', en: 'General Secretary', te: 'ప్రధాన కార్యదర్శి', level: 2, isExecutive: false },
    { key: 'joint_secretary', en: 'Joint Secretary', te: 'సంయుక్త కార్యదర్శి', level: 3, isExecutive: false },
    { key: 'treasurer', en: 'Treasurer', te: 'కోశాధికారి', level: 3, isExecutive: false },
    { key: 'chief_secretary', en: 'Chief Secretary', te: 'ముఖ్య కార్యదర్శి', level: 1, isExecutive: false },
    { key: 'district_president', en: 'District President', te: 'జిల్లా అధ్యక్షుడు', level: 0, isExecutive: false },
    { key: 'district_secretary', en: 'District Secretary', te: 'జిల్లా కార్యదర్శి', level: 0, isExecutive: false },
    { key: 'women_secretary', en: 'Women Secretary', te: 'మహిళా కార్యదర్శి', level: 3, isExecutive: false },
    { key: 'advisor', en: 'Advisor', te: 'సలహాదారు', level: 4, isExecutive: true }, // Can have multiple advisors
    { key: 'executive_member', en: 'Executive Member', te: 'కార్యవర్గ సభ్యుడు', level: 5, isExecutive: true },
];
