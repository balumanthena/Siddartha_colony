import React from 'react';

import { DESIGNATIONS, DesignationKey } from '@/lib/translations/designations';

export interface DocumentData {
    type: 'NOTICE' | 'RESOLUTION' | 'EVENT';
    date: string;
    refNo: string;
    title: string;
    body: string[]; // Array of paragraphs
    points: string[]; // Array of numbered points
    place: string;
}

export interface OfficeBearer {
    role: DesignationKey;
    full_name: string;
    status: 'active' | 'former';
}

export interface CommunityData {
    association_name: string;
    registration_number: string;
    road_name: string;
    bearers: OfficeBearer[];
}

export type CommunityIdentity = CommunityData;

interface DocumentTemplateProps {
    document: DocumentData;
    community: CommunityData;
}

// Helper to find bearer by role
const getBearer = (bearers: OfficeBearer[], role: string) =>
    bearers.find(b => b.role === role && b.status === 'active');

// Helper to filter executive members
const getExecutives = (bearers: OfficeBearer[]) =>
    bearers.filter(b => b.role === 'executive_member' && b.status === 'active');

export const DocumentTemplate = React.forwardRef<HTMLDivElement, DocumentTemplateProps>(
    ({ document, community }, ref) => {
        const president = getBearer(community.bearers, 'president');
        const vicePresident = getBearer(community.bearers, 'vice_president');
        const secretary = getBearer(community.bearers, 'secretary');
        const treasurer = getBearer(community.bearers, 'treasurer');
        const executives = getExecutives(community.bearers);

        return (
            <div
                ref={ref}
                className="bg-white text-black font-serif w-[210mm] min-h-[297mm] mx-auto p-12 relative shadow-lg print:shadow-none print:w-full print:h-auto"
                style={{ contentVisibility: 'auto' }}
            >
                {/* 1. Fixed Header */}
                <header className="border-b-4 border-gray-800 pb-6 mb-8 text-center">
                    <div className="flex justify-center mb-4">
                        {/* Placeholder Logo */}
                        <div className="w-16 h-16 border-2 border-gray-800 rounded-full flex items-center justify-center text-2xl font-bold">
                            SC
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold uppercase tracking-wide mb-2 text-gray-900">
                        {community.association_name || 'ASSOCIATION NAME'}
                    </h1>
                    <div className="text-sm font-bold text-gray-700 uppercase tracking-widest flex justify-center gap-6">
                        <span>Reg No: {community.registration_number}</span>
                        <span>•</span>
                        <span>{community.road_name}</span>
                    </div>
                </header>

                <div className="flex gap-8 h-full">
                    {/* 2. Fixed Left Column - Office Bearers */}
                    <aside className="w-48 flex-shrink-0 border-r-2 border-gray-200 pr-6">
                        <div className="space-y-6 text-sm">
                            {president && (
                                <div>
                                    <p className="font-bold text-gray-500 uppercase text-xs mb-1">President</p>
                                    <p className="font-bold text-gray-900">{president.full_name}</p>
                                </div>
                            )}
                            {vicePresident && (
                                <div>
                                    <p className="font-bold text-gray-500 uppercase text-xs mb-1">Vice President</p>
                                    <p className="font-bold text-gray-900">{vicePresident.full_name}</p>
                                </div>
                            )}
                            {secretary && (
                                <div>
                                    <p className="font-bold text-gray-500 uppercase text-xs mb-1">Secretary</p>
                                    <p className="font-bold text-gray-900">{secretary.full_name}</p>
                                </div>
                            )}
                            {treasurer && (
                                <div>
                                    <p className="font-bold text-gray-500 uppercase text-xs mb-1">Treasurer</p>
                                    <p className="font-bold text-gray-900">{treasurer.full_name}</p>
                                </div>
                            )}

                            {executives.length > 0 && (
                                <div className="pt-4 border-t border-gray-100">
                                    <p className="font-bold text-gray-500 uppercase text-xs mb-2">Executive Members</p>
                                    <div className="space-y-2 text-xs text-gray-700">
                                        {executives.map((member, i) => (
                                            <p key={i} className="leading-tight">{member.full_name}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* 3. Editable Main Content */}
                    <main className="flex-1">
                        {/* Meta Header */}
                        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-2">
                            <div>
                                <span className="inline-block bg-gray-900 text-white text-xs font-bold px-2 py-1 uppercase tracking-widest">
                                    {document.type}
                                </span>
                                <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-wider">Ref: {document.refNo}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-600">Date</p>
                                <p className="font-medium text-gray-900">{document.date}</p>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="mb-8 text-center">
                            <h2 className="text-xl font-bold uppercase underline decoration-2 underline-offset-4 text-gray-900 leading-relaxed">
                                {document.title || 'SUBJECT'}
                            </h2>
                        </div>

                        {/* Body - Multi paragraph */}
                        <div className="space-y-4 mb-8 text-justify leading-relaxed text-gray-900 text-[15px]">
                            {document.body.map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                        </div>

                        {/* Numbered Points */}
                        {document.points.length > 0 && (
                            <ol className="list-decimal list-outside ml-5 space-y-2 mb-12 text-[15px] text-gray-900">
                                {document.points.map((point, idx) => (
                                    <li key={idx} className="pl-2">{point}</li>
                                ))}
                            </ol>
                        )}

                        {/* 4. Footer - Signatures */}
                        <div className="mt-20 pt-8 flex justify-between items-end page-break-inside-avoid">
                            <div>
                                <p className="text-sm font-bold text-gray-600 uppercase mb-8">Place</p>
                                <p className="font-bold text-gray-900">{document.place}</p>
                            </div>

                            <div className="flex gap-16 text-center">
                                <div>
                                    <div className="h-12 mb-2"></div> {/* Space for signature */}
                                    <p className="font-bold text-gray-900 border-t border-gray-400 pt-2">
                                        {secretary?.full_name || 'Not Assigned'}
                                    </p>
                                    <p className="text-xs font-bold text-gray-500 uppercase">General Secretary</p>
                                </div>
                                <div>
                                    <div className="h-12 mb-2"></div> {/* Space for signature */}
                                    <p className="font-bold text-gray-900 border-t border-gray-400 pt-2">
                                        {president?.full_name || 'Not Assigned'}
                                    </p>
                                    <p className="text-xs font-bold text-gray-500 uppercase">President</p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                {/* Print specific styles */}
                <style jsx global>{`
                    @media print {
                        @page {
                            size: A4;
                            margin: 0;
                        }
                        body {
                            background: white;
                        }
                    }
                `}</style>
            </div>
        );
    }
);

DocumentTemplate.displayName = 'DocumentTemplate';
