'use client';

import { Calendar } from 'lucide-react';

export default function CoordinatorCalendar() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[24px] font-semibold text-[#101828] tracking-[-0.3125px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Calendar
        </h2>
        <p className="text-[16px] text-[#475467] tracking-[-0.3125px] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          View and manage appointments calendar
        </p>
      </div>

      <div className="bg-white rounded-[16px] border border-[#d1fae5] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-12">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#d1fae5] flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-[#10B981]" />
          </div>
          <h3 className="text-[18px] font-semibold text-[#101828] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Calendar View Coming Soon
          </h3>
          <p className="text-[14px] text-[#475467] max-w-md mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            The calendar feature is being enhanced. Please use the Appointments tab to view and manage your appointments.
          </p>
        </div>
      </div>
    </div>
  );
}
