'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { DocumentTemplate, OfficeBearer, CommunityIdentity } from './DocumentTemplate';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Save, FileText } from 'lucide-react';

type DocumentType = 'meeting_notice' | 'noc' | 'general_letter';

interface DocumentData {
    id: string;
    type: DocumentType;
    date: string;
    subject: string;
    body: string; // HTML or Text
    referenceNo?: string;
}

export default function DocumentGenerator() {
    // 1. Load Community Identity & Bearers (Simulated from "DB/Context")
    // In real app, fetch from Supabase. Here we check LocalStorage (set by Community Page) 
    // or default.
    const [community, setCommunity] = useState<CommunityIdentity | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('community_settings');
        if (stored) {
            setCommunity(JSON.parse(stored));
        }
    }, []);

    // 2. Document State
    const [docType, setDocType] = useState<DocumentType>('meeting_notice');
    const [docData, setDocData] = useState<DocumentData>({
        id: 'new',
        type: 'meeting_notice',
        date: new Date().toISOString().split('T')[0],
        subject: 'Notice for General Body Meeting',
        body: `
            <p>Dear Members,</p>
            <p>This is to inform you that a General Body Meeting will be held on [Date] at [Time] in the Community Hall.</p>
            <p><strong>Agenda:</strong></p>
            <ol>
                <li>Review of annual accounts</li>
                <li>Election of new members</li>
                <li>Maintenance issues</li>
            </ol>
            <p>All members are requested to attend.</p>
        `,
        referenceNo: `SWA/${new Date().getFullYear()}/001`
    });

    // 3. Print Handler
    const printRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Document-${docData.referenceNo}`,
    });

    if (!community) {
        return <div className="p-8 text-center text-gray-500">Loading Community Data... Please configure Community Settings first.</div>;
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-100px)]">

            {/* LEFT: Editor Console */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardContent className="p-4 space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                            <FileText size={16} /> Document Controls
                        </h2>

                        {/* Type Selection */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Document Type</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50"
                                value={docType}
                                onChange={(e) => {
                                    setDocType(e.target.value as DocumentType);
                                    // Reset defaults based on type (simplified logic here)
                                    if (e.target.value === 'noc') {
                                        setDocData(prev => ({ ...prev, subject: 'No Objection Certificate', body: '<p>To whom it may concern...</p>' }));
                                    } else {
                                        setDocData(prev => ({ ...prev, subject: 'Notice for General Body Meeting', body: '...' }));
                                    }
                                }}
                            >
                                <option value="meeting_notice">Meeting Notice</option>
                                <option value="noc">No Objection Certificate (NOC)</option>
                                <option value="general_letter">General Letterhead</option>
                            </select>
                        </div>

                        {/* Metadata Inputs */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    value={docData.date}
                                    onChange={e => setDocData({ ...docData, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Ref No.</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    value={docData.referenceNo}
                                    onChange={e => setDocData({ ...docData, referenceNo: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Subject</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded text-sm font-medium"
                                value={docData.subject}
                                onChange={e => setDocData({ ...docData, subject: e.target.value })}
                            />
                        </div>

                        {/* Body (Simple Text Area for now, can be Rich Text) */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Content Body (HTML Supported)</label>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded text-sm min-h-[200px] font-mono text-xs"
                                value={docData.body}
                                onChange={e => setDocData({ ...docData, body: e.target.value })}
                            />
                        </div>

                        {/* Actions */}
                        <div className="pt-4 flex gap-2">
                            <Button onClick={() => handlePrint()} className="flex-1 bg-blue-900 hover:bg-blue-800 gap-2">
                                <Printer size={16} /> Print / Save PDF
                            </Button>
                            {/* Save to Log Stub */}
                            <Button variant="outline" className="flex-1 gap-2">
                                <Save size={16} /> Save Record
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            </div>

            {/* RIGHT: Live Preview (A4 Scaled) */}
            <div className="w-full lg:w-2/3 bg-gray-100 rounded-lg p-8 overflow-y-auto flex justify-center items-start shadow-inner border border-gray-200">
                <div className="transform scale-[0.65] origin-top lg:scale-[0.85] xl:scale-100 transition-transform">
                    <DocumentTemplate
                        ref={printRef}
                        community={community}
                        document={{
                            type: 'NOTICE',
                            date: docData.date,
                            refNo: docData.referenceNo || '',
                            title: docData.subject,
                            body: [docData.body],
                            points: [],
                            place: 'Hyderabad'
                        }}
                    />
                </div>
            </div>

        </div>
    );
}
