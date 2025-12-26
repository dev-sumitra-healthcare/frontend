'use client';

import { FileText } from 'lucide-react';

export default function PastCasesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[24px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Past Cases
        </h2>
        <p className="text-[14px] text-[#475467]" style={{ fontFamily: 'Inter, sans-serif' }}>
          View completed patient encounters
        </p>
      </div>

      <div className="bg-white rounded-[16px] shadow-sm p-12">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#e5e7eb] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-[#9ca3af]" />
          </div>
          <h3 className="text-[18px] font-semibold text-[#101828] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Past Cases
          </h3>
          <p className="text-[14px] text-[#475467] max-w-md mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            View history of all completed patient encounters and consultations.
          </p>
        </div>
      </div>
    </div>
  );
}
