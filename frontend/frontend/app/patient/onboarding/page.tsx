"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Stethoscope, Heart, MapPin, Users, Loader2, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getPatientProfile, updatePatientProfile } from "@/lib/api";

export default function PatientOnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Health Info
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    // Step 2: Emergency Contact
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
  });

  // Store existing name/phone from registration
  const [existingData, setExistingData] = useState({ fullName: "", phone: "" });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("patientAccessToken");
    if (!token) {
      router.replace("/patient/login");
      return;
    }

    try {
      const response = await getPatientProfile();
      if (response.data.status === "success") {
        const profile = response.data.data;
        setExistingData({
          fullName: profile.fullName || "",
          phone: profile.phone || "",
        });
        setFormData({
          dateOfBirth: profile.dateOfBirth || "",
          gender: profile.gender || "",
          bloodType: profile.bloodType || "",
          emergencyName: "",
          emergencyPhone: "",
          emergencyRelation: "",
        });
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.dateOfBirth) {
      toast.error("Please enter your date of birth");
      return false;
    }
    if (!formData.gender) {
      toast.error("Please select your gender");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    // Emergency contact is optional but if name is provided, phone should be too
    if (formData.emergencyName && !formData.emergencyPhone) {
      toast.error("Please enter emergency contact phone number");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setIsSubmitting(true);
    try {
      const response = await updatePatientProfile({
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodType: formData.bloodType || undefined,
      });

      if (response.data.status === "success") {
        toast.success("Profile completed successfully!");
        router.push("/patient/dashboard");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    router.push("/patient/dashboard");
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f5f3ff, #fff, #eff6ff)" }}>
        <Loader2 style={{ height: 32, width: 32, color: "#9333ea" }} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff, #fff, #eff6ff)" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #e5e7eb", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ height: 40, width: 40, borderRadius: 12, background: "linear-gradient(135deg, #9333ea, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Stethoscope style={{ height: 20, width: 20, color: "#fff" }} />
            </div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>MedMitra</h1>
              <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Complete Your Profile</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleSkip} style={{ color: "#6b7280" }}>
            Skip for now
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 480, margin: "0 auto", padding: "48px 24px" }}>
        {/* Welcome Message */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
            Welcome, {existingData.fullName || "Patient"}! 👋
          </h2>
          <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
            Let's complete your health profile for better care
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ height: 36, width: 36, borderRadius: "50%", background: step >= 1 ? "#9333ea" : "#e5e7eb", color: step >= 1 ? "#fff" : "#6b7280", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart style={{ height: 18, width: 18 }} />
            </div>
            <span style={{ fontSize: 11, color: step >= 1 ? "#9333ea" : "#6b7280" }}>Health</span>
          </div>
          <div style={{ height: 2, width: 40, borderRadius: 4, background: step >= 2 ? "#9333ea" : "#e5e7eb" }}></div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ height: 36, width: 36, borderRadius: "50%", background: step >= 2 ? "#9333ea" : "#e5e7eb", color: step >= 2 ? "#fff" : "#6b7280", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users style={{ height: 18, width: 18 }} />
            </div>
            <span style={{ fontSize: 11, color: step >= 2 ? "#9333ea" : "#6b7280" }}>Emergency</span>
          </div>
        </div>

        {/* Form Card */}
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 10px 40px rgba(0,0,0,0.1)", padding: 32 }}>
          {/* Step 1: Health Info */}
          {step === 1 && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 4px" }}>Health Information</h3>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>This helps us provide better care</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Label htmlFor="dob" style={{ fontSize: 14, fontWeight: 500 }}>Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    style={{ width: "100%", padding: "12px 16px", fontSize: 16 }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Label style={{ fontSize: 14, fontWeight: 500 }}>Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger style={{ width: "100%", padding: "12px 16px" }}>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Label style={{ fontSize: 14, fontWeight: 500 }}>Blood Type</Label>
                  <Select value={formData.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)}>
                    <SelectTrigger style={{ width: "100%", padding: "12px 16px" }}>
                      <SelectValue placeholder="Select blood type (if known)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleNext}
                  size="lg"
                  style={{ width: "100%", background: "linear-gradient(135deg, #9333ea, #3b82f6)", marginTop: 8 }}
                >
                  Continue
                  <ArrowRight style={{ marginLeft: 8, height: 16, width: 16 }} />
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Emergency Contact */}
          {step === 2 && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 4px" }}>Emergency Contact</h3>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Someone we can reach in case of emergency (optional)</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Label htmlFor="emergencyName" style={{ fontSize: 14, fontWeight: 500 }}>Contact Name</Label>
                  <Input
                    id="emergencyName"
                    placeholder="e.g., John Doe"
                    value={formData.emergencyName}
                    onChange={(e) => handleInputChange("emergencyName", e.target.value)}
                    style={{ width: "100%", padding: "12px 16px", fontSize: 16 }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Label htmlFor="emergencyPhone" style={{ fontSize: 14, fontWeight: 500 }}>Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    placeholder="Phone number"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                    style={{ width: "100%", padding: "12px 16px", fontSize: 16 }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Label style={{ fontSize: 14, fontWeight: 500 }}>Relationship</Label>
                  <Select value={formData.emergencyRelation} onValueChange={(value) => handleInputChange("emergencyRelation", value)}>
                    <SelectTrigger style={{ width: "100%", padding: "12px 16px" }}>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Sibling">Sibling</SelectItem>
                      <SelectItem value="Friend">Friend</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <Button variant="outline" size="lg" onClick={handleBack} style={{ flex: 1 }}>
                    <ArrowLeft style={{ marginRight: 8, height: 16, width: 16 }} />
                    Back
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    style={{ flex: 1, background: "linear-gradient(135deg, #9333ea, #3b82f6)" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 style={{ marginRight: 8, height: 16, width: 16 }} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 style={{ marginRight: 8, height: 16, width: 16 }} />
                        Complete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#6b7280", marginTop: 24 }}>
          Your information is secure and will only be shared with your healthcare providers.
        </p>
      </main>
    </div>
  );
}
