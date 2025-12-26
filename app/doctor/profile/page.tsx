"use client";

import { useState, useEffect } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar as CalendarIcon, 
  Pencil,
  Building2,
  Award,
  Clock,
  Users,
  Star,
  TrendingUp,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDoctorProfile, getDoctorStats, DoctorProfileResponse, DashboardPerformanceStats } from "@/lib/api";
import { toast } from "sonner";

export default function ProfilePage() {
  const [profile, setProfile] = useState<DoctorProfileResponse["data"]["doctor"] | null>(null);
  const [stats, setStats] = useState<DashboardPerformanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      
      // Load profile and stats in parallel
      const [profileResponse, statsResponse] = await Promise.allSettled([
        getDoctorProfile(),
        getDoctorStats()
      ]);

      if (profileResponse.status === "fulfilled" && profileResponse.value.data.success) {
        setProfile(profileResponse.value.data.data.doctor);
      }

      if (statsResponse.status === "fulfilled" && statsResponse.value.data.status === "success") {
        setStats(statsResponse.value.data.data);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatJoinDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      });
    } catch {
      return "N/A";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 font-medium">Unable to load profile</p>
        <Button onClick={loadProfileData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  // Build working hours (placeholder if not from API)
  const workingHours = {
    "Monday - Friday": "9:00 AM - 5:00 PM",
    "Saturday": "9:00 AM - 1:00 PM",
    "Sunday": "Closed",
  };

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Avatar Placeholder */}
          <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0"></div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dr. {profile.fullName}
                </h1>
                <p className="text-blue-600 text-sm mt-0.5">
                  Doctor ID: {profile._id?.slice(0, 8).toUpperCase() || "N/A"}
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 w-fit">
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{profile.phoneNumber || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  {profile.address ? 
                    `${profile.address.city || ""}, ${profile.address.state || ""}`.trim().replace(/^,\s*|,\s*$/g, '') || "Not provided"
                    : "Not provided"
                  }
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Joined: {formatJoinDate(profile.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Professional Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Specialization</p>
              <p className="font-medium text-gray-900">{profile.specialty || "Not specified"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Award className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">License Number</p>
              <p className="font-medium text-gray-900">{profile.medicalRegistrationId || "Not specified"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Years of Experience</p>
              <p className="font-medium text-gray-900">{profile.experience ? `${profile.experience} Years` : "Not specified"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 text-gray-400 mt-0.5 flex items-center justify-center font-bold text-sm">$</div>
            <div>
              <p className="text-sm text-gray-500">Consultation Fee</p>
              <p className="font-medium text-gray-900">Contact for fee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Qualifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Qualifications
        </h2>
        {profile.qualifications && profile.qualifications.length > 0 ? (
          <div className="space-y-4">
            {profile.qualifications.map((qual, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
              >
                <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{qual.degree}</p>
                  <p className="text-sm text-gray-500">
                    {qual.institution}, {qual.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No qualifications added yet</p>
        )}
      </div>

      {/* Working Hours */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Working Hours
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(workingHours).map(([day, hours]) => (
            <div
              key={day}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <span className="text-gray-700 font-medium">{day}</span>
              <span className={hours === "Closed" ? "text-gray-400" : "text-gray-900"}>
                {hours}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 opacity-80" />
            <span className="text-sm opacity-80">Total Patients</span>
          </div>
          <p className="text-2xl font-bold">{stats?.patientsSeen || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="h-4 w-4 opacity-80" />
            <span className="text-sm opacity-80">Scheduled</span>
          </div>
          <p className="text-2xl font-bold">{stats?.patientsScheduled || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 opacity-80" />
            <span className="text-sm opacity-80">Avg Consult</span>
          </div>
          <p className="text-2xl font-bold">{stats?.avgConsultTime || 0} min</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 opacity-80" />
            <span className="text-sm opacity-80">Status</span>
          </div>
          <p className="text-2xl font-bold capitalize">{profile.accountStatus?.replace(/_/g, " ") || "Active"}</p>
        </div>
      </div>
    </div>
  );
}
