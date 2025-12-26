'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Building2, MapPin, Edit } from 'lucide-react';

export default function CoordinatorProfilePage() {
  const [coordinatorData, setCoordinatorData] = useState<any>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('coordinatorData');
    if (storedData) {
      setCoordinatorData(JSON.parse(storedData));
    }
  }, []);

  const name = coordinatorData?.fullName || coordinatorData?.username || 'Coordinator';
  const email = coordinatorData?.email || 'Not set';
  const phone = coordinatorData?.phone || 'Not set';
  const hospital = coordinatorData?.hospitalName || 'Not set';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[24px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Profile
        </h2>
        <p className="text-[14px] text-[#475467]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Manage your coordinator profile
        </p>
      </div>

      <div className="bg-white rounded-[16px] shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-[72px] h-[72px] rounded-full bg-[#d1fae5] border-2 border-[#10B981] flex items-center justify-center">
              <User className="w-8 h-8 text-[#10B981]" />
            </div>
            <div>
              <h3 className="text-[20px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {name}
              </h3>
              <p className="text-[14px] text-[#10B981]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Coordinator
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-[14px] text-[#475467] hover:bg-gray-50 transition-colors">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-start gap-3 p-4 bg-[#f9fafb] rounded-lg">
            <Mail className="w-5 h-5 text-[#475467] mt-0.5" />
            <div>
              <p className="text-[12px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Email</p>
              <p className="text-[14px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>{email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-[#f9fafb] rounded-lg">
            <Phone className="w-5 h-5 text-[#475467] mt-0.5" />
            <div>
              <p className="text-[12px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Phone</p>
              <p className="text-[14px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>{phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-[#f9fafb] rounded-lg">
            <Building2 className="w-5 h-5 text-[#475467] mt-0.5" />
            <div>
              <p className="text-[12px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Hospital</p>
              <p className="text-[14px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>{hospital}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-[#f9fafb] rounded-lg">
            <MapPin className="w-5 h-5 text-[#475467] mt-0.5" />
            <div>
              <p className="text-[12px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Role</p>
              <p className="text-[14px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>OPD Coordinator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
