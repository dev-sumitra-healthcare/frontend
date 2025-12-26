"use client";

import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Heart, Shield, Calendar, AlertCircle } from 'lucide-react';
import { getMyProfile, PatientProfile } from '@/lib/api';

export default function PatientProfileWidget() {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const resp = await getMyProfile();
        setProfile(resp.data.data);
        setError(null);
      } catch (e: any) {
        if (e?.response?.status === 404) {
          setError('No profile found. Please contact your healthcare provider to create your profile.');
        } else {
          setError(e?.response?.data?.message || 'Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse h-16 rounded-xl bg-[#f3e8ff]/50" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <p className="patient-heading-4 font-medium text-amber-800">{error}</p>
          <p className="patient-body-sm text-amber-700 mt-1">
            Your healthcare provider needs to add your profile to the system before you can access your information.
          </p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const ProfileItem = ({ 
    icon: Icon, 
    label, 
    value, 
    highlight = false 
  }: { 
    icon: React.ElementType; 
    label: string; 
    value: string | React.ReactNode; 
    highlight?: boolean;
  }) => (
    <div className="patient-list-item">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${highlight ? 'bg-[#9810fa] text-white' : 'bg-[#f3e8ff] text-[#9810fa]'}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="patient-body-sm">{label}</p>
        <div className="patient-heading-4 font-medium truncate">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Basic Info Section */}
      <div>
        <h3 className="patient-heading-4 font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-[#9810fa]" />
          Personal Information
        </h3>
        <div className="space-y-1">
          <ProfileItem icon={User} label="Full Name" value={profile.fullName} highlight />
          
          {profile.mid && (
            <ProfileItem 
              icon={Shield} 
              label="MedMitra ID" 
              value={
                <span className="patient-badge patient-badge-success font-mono">
                  {profile.mid}
                </span>
              } 
            />
          )}
          
          <ProfileItem 
            icon={Shield} 
            label="UHID" 
            value={
              <span className="inline-block px-2 py-1 bg-[#f3e8ff] text-[#9810fa] rounded-lg font-mono text-sm">
                {profile.uhid}
              </span>
            } 
          />
          
          {profile.email && (
            <ProfileItem icon={Mail} label="Email" value={profile.email} />
          )}
          
          {profile.phone && (
            <ProfileItem icon={Phone} label="Phone" value={profile.phone} />
          )}
        </div>
      </div>

      {/* Personal Details */}
      <div className="patient-divider" />
      <div>
        <h3 className="patient-heading-4 font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#9810fa]" />
          Health Details
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.dateOfBirth && (
            <div className="p-4 rounded-xl bg-[#faf5ff] border border-[#f3e8ff]">
              <p className="patient-body-sm mb-1">Date of Birth</p>
              <p className="patient-heading-4 font-medium">
                {new Date(profile.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          )}
          {profile.gender && (
            <div className="p-4 rounded-xl bg-[#faf5ff] border border-[#f3e8ff]">
              <p className="patient-body-sm mb-1">Gender</p>
              <p className="patient-heading-4 font-medium capitalize">{profile.gender}</p>
            </div>
          )}
          {profile.bloodType && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100">
              <p className="patient-body-sm mb-1">Blood Type</p>
              <p className="patient-heading-4 font-medium text-red-600 flex items-center gap-2">
                <Heart className="w-4 h-4 fill-red-500" />
                {profile.bloodType}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Allergies */}
      {profile.allergies && profile.allergies.length > 0 && (
        <>
          <div className="patient-divider" />
          <div>
            <h3 className="patient-heading-4 font-semibold mb-4 text-red-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Allergies
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((allergy, idx) => (
                <span 
                  key={idx} 
                  className="patient-badge patient-badge-danger"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Address */}
      {(profile.address?.street || profile.address?.city) && (
        <>
          <div className="patient-divider" />
          <div>
            <h3 className="patient-heading-4 font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#9810fa]" />
              Address
            </h3>
            <div className="p-4 rounded-xl bg-[#faf5ff] border border-[#f3e8ff]">
              {profile.address.street && <p className="patient-body">{profile.address.street}</p>}
              <p className="patient-body">
                {[profile.address.city, profile.address.state, profile.address.zip]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              {profile.address.country && <p className="patient-body-sm mt-1">{profile.address.country}</p>}
            </div>
          </div>
        </>
      )}

      {/* Emergency Contact */}
      {profile.emergencyContact?.name && (
        <>
          <div className="patient-divider" />
          <div>
            <h3 className="patient-heading-4 font-semibold mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#9810fa]" />
              Emergency Contact
            </h3>
            <div className="p-4 rounded-xl bg-[#faf5ff] border border-[#f3e8ff]">
              <p className="patient-heading-4 font-medium">{profile.emergencyContact.name}</p>
              {profile.emergencyContact.phone && (
                <p className="patient-body flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-[#9810fa]" />
                  {profile.emergencyContact.phone}
                </p>
              )}
              {profile.emergencyContact.relation && (
                <p className="patient-body-sm mt-1">
                  Relation: {profile.emergencyContact.relation}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Insurance */}
      {profile.insurance?.provider && (
        <>
          <div className="patient-divider" />
          <div>
            <h3 className="patient-heading-4 font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#9810fa]" />
              Insurance
            </h3>
            <div className="p-4 rounded-xl bg-[#faf5ff] border border-[#f3e8ff]">
              <p className="patient-heading-4 font-medium">{profile.insurance.provider}</p>
              {profile.insurance.policyNumber && (
                <p className="patient-body mt-1">
                  Policy: <span className="font-mono">{profile.insurance.policyNumber}</span>
                </p>
              )}
              {profile.insurance.groupNumber && (
                <p className="patient-body-sm">
                  Group: <span className="font-mono">{profile.insurance.groupNumber}</span>
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
