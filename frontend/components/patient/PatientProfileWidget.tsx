"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse h-16 rounded-md bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-md border-amber-200">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">{error}</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                Your healthcare provider needs to add your profile to the system before you can access your information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) return null;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-purple-600" />
          My Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Full Name</div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{profile.fullName}</span>
            </div>
          </div>
          
          {/* MedMitra ID - Prominent Display */}
          {profile.mid && (
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">MedMitra ID</div>
              <Badge variant="default" className="font-mono bg-purple-600 hover:bg-purple-700 text-white">
                {profile.mid}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                Your universal health ID across all hospitals
              </p>
            </div>
          )}
          
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">UHID</div>
            <Badge variant="outline" className="font-mono">{profile.uhid}</Badge>
          </div>
          {profile.email && (
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.email}</span>
              </div>
            </div>
          )}
          {profile.phone && (
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Phone</div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.phone}</span>
              </div>
            </div>
          )}
        </div>

        {/* Personal Details */}
        <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
          {profile.dateOfBirth && (
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Date of Birth</div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
              </div>
            </div>
          )}
          {profile.gender && (
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Gender</div>
              <span className="text-sm">{profile.gender}</span>
            </div>
          )}
          {profile.bloodType && (
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Blood Type</div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">{profile.bloodType}</span>
              </div>
            </div>
          )}
        </div>

        {/* Allergies */}
        {profile.allergies && profile.allergies.length > 0 && (
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-muted-foreground mb-2">Allergies</div>
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((allergy, idx) => (
                <Badge key={idx} variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Address */}
        {(profile.address?.street || profile.address?.city) && (
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </div>
            <div className="text-sm space-y-1">
              {profile.address.street && <div>{profile.address.street}</div>}
              <div>
                {[profile.address.city, profile.address.state, profile.address.zip]
                  .filter(Boolean)
                  .join(', ')}
              </div>
              {profile.address.country && <div>{profile.address.country}</div>}
            </div>
          </div>
        )}

        {/* Emergency Contact */}
        {profile.emergencyContact?.name && (
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-muted-foreground mb-2">Emergency Contact</div>
            <div className="text-sm space-y-1">
              <div className="font-medium">{profile.emergencyContact.name}</div>
              {profile.emergencyContact.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {profile.emergencyContact.phone}
                </div>
              )}
              {profile.emergencyContact.relation && (
                <div className="text-muted-foreground">
                  Relation: {profile.emergencyContact.relation}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Insurance */}
        {profile.insurance?.provider && (
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Insurance
            </div>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">Provider:</span> {profile.insurance.provider}</div>
              {profile.insurance.policyNumber && (
                <div><span className="font-medium">Policy #:</span> {profile.insurance.policyNumber}</div>
              )}
              {profile.insurance.groupNumber && (
                <div><span className="font-medium">Group #:</span> {profile.insurance.groupNumber}</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
