"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Calendar,
  Edit,
  Save,
  X,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getDoctorProfile, updateDoctorProfile } from "@/lib/api";

interface Qualification {
  degree: string;
  institution: string;
  year: number;
}

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface DoctorProfile {
  _id: string;
  fullName: string;
  email: string;
  medicalRegistrationId: string;
  specialty: string;
  phoneNumber?: string;
  address?: Address;
  qualifications?: Qualification[];
  experience?: number;
  roles: string[];
  accountStatus: string;
  isVerified?: boolean;
  verificationDate?: string;
  lastLogin?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    specialty: "",
    phoneNumber: "",
    experience: 0,
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India"
    },
    qualifications: [] as Qualification[]
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getDoctorProfile();
      
      if (response.data?.data?.doctor) {
        const doctorData = response.data.data.doctor;
        setProfile(doctorData);
        
        // Initialize form data
        setFormData({
          fullName: doctorData.fullName || "",
          specialty: doctorData.specialty || "",
          phoneNumber: doctorData.phoneNumber || "",
          experience: doctorData.experience || 0,
          address: {
            street: doctorData.address?.street || "",
            city: doctorData.address?.city || "",
            state: doctorData.address?.state || "",
            zipCode: doctorData.address?.zipCode || "",
            country: doctorData.address?.country || "India"
          },
          qualifications: doctorData.qualifications || []
        });
      }
    } catch (error: any) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const response = await updateDoctorProfile(formData);
      
      if (response.data?.success) {
        toast.success("Profile updated successfully");
        setProfile(response.data.data.doctor);
        setIsEditing(false);
        
        // Refresh user context
        await refreshUser();
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        specialty: profile.specialty || "",
        phoneNumber: profile.phoneNumber || "",
        experience: profile.experience || 0,
        address: {
          street: profile.address?.street || "",
          city: profile.address?.city || "",
          state: profile.address?.state || "",
          zipCode: profile.address?.zipCode || "",
          country: profile.address?.country || "India"
        },
        qualifications: profile.qualifications || []
      });
    }
    setIsEditing(false);
  };

  const addQualification = () => {
    setFormData({
      ...formData,
      qualifications: [
        ...formData.qualifications,
        { degree: "", institution: "", year: new Date().getFullYear() }
      ]
    });
  };

  const updateQualification = (index: number, field: keyof Qualification, value: string | number) => {
    const updatedQualifications = [...formData.qualifications];
    updatedQualifications[index] = {
      ...updatedQualifications[index],
      [field]: value
    };
    setFormData({ ...formData, qualifications: updatedQualifications });
  };

  const removeQualification = (index: number) => {
    const updatedQualifications = formData.qualifications.filter((_, i) => i !== index);
    setFormData({ ...formData, qualifications: updatedQualifications });
  };

  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") return "?";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    const initials = parts
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return initials || "?";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case "pending_verification":
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Pending Verification</Badge>;
      case "suspended":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading profile...</p>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-muted-foreground">Profile not found</p>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Doctor Profile</h1>
                <p className="text-muted-foreground">Manage your professional information</p>
              </div>
            </div>
            
            <div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                        {getInitials(profile.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold">Dr. {profile.fullName}</h2>
                      <p className="text-muted-foreground">{profile.specialty}</p>
                    </div>
                    
                    {getStatusBadge(profile.accountStatus)}
                    
                    <Separator />
                    
                    <div className="w-full space-y-3 text-left">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{profile.email}</span>
                      </div>
                      
                      {profile.phoneNumber && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{profile.phoneNumber}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Reg. ID: {profile.medicalRegistrationId}
                        </span>
                      </div>
                      
                      {profile.experience && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {profile.experience} years experience
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Your basic professional details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm p-2 bg-muted rounded-md">{profile.fullName}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      {isEditing ? (
                        <Input
                          id="specialty"
                          value={formData.specialty}
                          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm p-2 bg-muted rounded-md">{profile.specialty}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                        />
                      ) : (
                        <p className="text-sm p-2 bg-muted rounded-md">
                          {profile.phoneNumber || "Not provided"}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      {isEditing ? (
                        <Input
                          id="experience"
                          type="number"
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                          min="0"
                        />
                      ) : (
                        <p className="text-sm p-2 bg-muted rounded-md">
                          {profile.experience ? `${profile.experience} years` : "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Address
                  </CardTitle>
                  <CardDescription>Your contact address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      {isEditing ? (
                        <Input
                          id="street"
                          value={formData.address.street}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            address: { ...formData.address, street: e.target.value }
                          })}
                          placeholder="Enter street address"
                        />
                      ) : (
                        <p className="text-sm p-2 bg-muted rounded-md">
                          {profile.address?.street || "Not provided"}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        {isEditing ? (
                          <Input
                            id="city"
                            value={formData.address.city}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              address: { ...formData.address, city: e.target.value }
                            })}
                            placeholder="City"
                          />
                        ) : (
                          <p className="text-sm p-2 bg-muted rounded-md">
                            {profile.address?.city || "Not provided"}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        {isEditing ? (
                          <Input
                            id="state"
                            value={formData.address.state}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              address: { ...formData.address, state: e.target.value }
                            })}
                            placeholder="State"
                          />
                        ) : (
                          <p className="text-sm p-2 bg-muted rounded-md">
                            {profile.address?.state || "Not provided"}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        {isEditing ? (
                          <Input
                            id="zipCode"
                            value={formData.address.zipCode}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              address: { ...formData.address, zipCode: e.target.value }
                            })}
                            placeholder="ZIP"
                          />
                        ) : (
                          <p className="text-sm p-2 bg-muted rounded-md">
                            {profile.address?.zipCode || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Qualifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Qualifications
                    </div>
                    {isEditing && (
                      <Button size="sm" onClick={addQualification} variant="outline">
                        Add Qualification
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription>Your educational background and certifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.qualifications.length > 0 ? (
                    formData.qualifications.map((qual, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        {isEditing ? (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor={`degree-${index}`}>Degree</Label>
                                <Input
                                  id={`degree-${index}`}
                                  value={qual.degree}
                                  onChange={(e) => updateQualification(index, "degree", e.target.value)}
                                  placeholder="e.g., MBBS"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`institution-${index}`}>Institution</Label>
                                <Input
                                  id={`institution-${index}`}
                                  value={qual.institution}
                                  onChange={(e) => updateQualification(index, "institution", e.target.value)}
                                  placeholder="University/College"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`year-${index}`}>Year</Label>
                                <Input
                                  id={`year-${index}`}
                                  type="number"
                                  value={qual.year}
                                  onChange={(e) => updateQualification(index, "year", parseInt(e.target.value))}
                                  min="1950"
                                  max={new Date().getFullYear()}
                                />
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => removeQualification(index)}
                            >
                              Remove
                            </Button>
                          </>
                        ) : (
                          <div>
                            <h4 className="font-semibold">{qual.degree}</h4>
                            <p className="text-sm text-muted-foreground">{qual.institution}</p>
                            <p className="text-xs text-muted-foreground mt-1">Graduated: {qual.year}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No qualifications added yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
