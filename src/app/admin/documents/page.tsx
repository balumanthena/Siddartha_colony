'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { Printer, RefreshCw, Plus, X } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { DocumentTemplate, DocumentData, CommunityData, OfficeBearer } from '@/components/admin/DocumentTemplate';

// Default Community Data (Fallback)
const DEFAULT_COMMUNITY: CommunityData = {
    association_name: 'Siddhartha Welfare Association',
    registration_number: '123/2010',
    road_name: 'Road No. 6, Kisan Nagar',
    bearers: [
        { role: 'president', full_name: 'Ramesh Gupta', status: 'active' },
        { role: 'vice_president', full_name: 'K. Venkatesh', status: 'active' },
        { role: 'secretary', full_name: 'Lakshmi Narayana', status: 'active' },
        { role: 'treasurer', full_name: 'Rajesh Kumar', status: 'active' },
        { role: 'executive_member', full_name: 'P. Suresh', status: 'active' },
        { role: 'executive_member', full_name: 'M. Reddy', status: 'active' },
        { role: 'executive_member', full_name: 'S. Rao', status: 'active' },
    ]
};

export default function DocumentGenerator() {
    const { t } = useLanguage();
    const [community, setCommunity] = useState<CommunityData>(DEFAULT_COMMUNITY);

    // Load community settings from local storage if available (simulating DB fetch)
    useEffect(() => {
        const saved = localStorage.getItem('community_settings');
        if (saved) {
            setCommunity(JSON.parse(saved));
        }
    }, []);

    const [doc, setDoc] = useState<DocumentData>({
        type: 'NOTICE',
        date: new Date().toISOString().split('T')[0],
        refNo: '',
        title: 'GENERAL BODY MEETING',
        body: [
            'This is to inform all the members of the Siddhartha Welfare Association that a General Body Meeting is scheduled to be held this Sunday.',
            'The agenda includes discussion on upcoming maintenance works and the election of new committee members.'
        ],
        points: [
            'Review of annual accounts.',
            'Approval of security budget.',
            'Any other matter with the permission of the chair.'
        ],
        place: 'Hyderabad'
    });

    const [bodyInput, setBodyInput] = useState(doc.body.join('\n\n'));
    const [pointsInput, setPointsInput] = useState(doc.points.join('\n'));

    // Sync Textareas to State
    useEffect(() => {
        setDoc(prev => ({
            ...prev,
            body: bodyInput.split('\n\n').filter(p => p.trim() !== ''),
            points: pointsInput.split('\n').filter(p => p.trim() !== '')
        }));
    }, [bodyInput, pointsInput]);

    // Print Handler
    const componentRef = useRef<HTMLDivElement>(null);
    const handlePrintSafe = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Notice_${doc.date}`,
    });

    return (
        <div className="w-full max-w-[1600px] mx-auto h-[calc(100vh-100px)] flex gap-6">

            {/* LEFT PANEL - CONTROLS */}
            <div className="w-[400px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto pb-12">
                <Card className="border-gray-200">
                    <CardHeader className="py-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <RefreshCw size={16} /> Document Controls
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        {/* Type & Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Type</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-sm text-sm"
                                    value={doc.type}
                                    onChange={(e) => setDoc({ ...doc, type: e.target.value as any })}
                                >
                                    <option value="NOTICE">Notice</option>
                                    <option value="RESOLUTION">Resolution</option>
                                    <option value="EVENT">Event</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-gray-300 rounded-sm text-sm"
                                    value={doc.date}
                                    onChange={(e) => setDoc({ ...doc, date: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Subject / Title</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-sm text-sm font-medium"
                                value={doc.title}
                                onChange={(e) => setDoc({ ...doc, title: e.target.value.toUpperCase() })}
                            />
                        </div>

                        {/* Body */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                Content Body <span className="text-gray-400 normal-case">(Double enter for new paragraph)</span>
                            </label>
                            <textarea
                                className="w-full h-48 p-2 border border-gray-300 rounded-sm text-sm leading-relaxed"
                                value={bodyInput}
                                onChange={(e) => setBodyInput(e.target.value)}
                            ></textarea>
                        </div>

                        {/* Points */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                Numbered Points <span className="text-gray-400 normal-case">(One per line)</span>
                            </label>
                            <textarea
                                className="w-full h-32 p-2 border border-gray-300 rounded-sm text-sm leading-relaxed"
                                value={pointsInput}
                                onChange={(e) => setPointsInput(e.target.value)}
                                placeholder="1. ..."
                            ></textarea>
                        </div>

                        {/* Place */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Place</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-sm text-sm"
                                value={doc.place}
                                onChange={(e) => setDoc({ ...doc, place: e.target.value })}
                            />
                        </div>

                        <Button
                            className="w-full bg-gray-900 hover:bg-black text-white gap-2 mt-4"
                            onClick={handlePrintSafe}
                        >
                            <Printer size={16} /> Generate Official PDF
                        </Button>

                    </CardContent>
                </Card>
            </div>

            {/* RIGHT PANEL - PREVIEW */}
            <div className="flex-1 bg-gray-100 rounded-lg p-8 overflow-y-auto flex justify-center items-start border border-gray-300 shadow-inner">
                <div className="transform scale-90 origin-top">
                    <DocumentTemplate
                        ref={componentRef}
                        document={doc}
                        community={community}
                    />
                </div>
            </div>

        </div>
    );
}
