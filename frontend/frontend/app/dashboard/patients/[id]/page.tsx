"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getPatientById, updatePatient, createAppointment } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/dashboard/Header";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["Male","Female","Other","Prefer not to say"]).optional(),
  bloodType: z.enum(["A+","A-","B+","B-","AB+","AB-","O+","O-","Unknown"]).optional(),
  allergies: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  ecName: z.string().optional(),
  ecPhone: z.string().optional(),
  ecRelation: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id?: string };
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [patient, setPatient] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("New Visit");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const resp = await getPatientById(id);
        const p = resp.data?.data?.patient || resp.data?.data || {};
        setPatient(p);
        // Pre-fill form
        reset({
          fullName: p.fullName || p.full_name || "",
          email: p.email || "",
          phone: p.phoneNumber || p.phone || "",
          dateOfBirth: p.dateOfBirth || p.date_of_birth || "",
          gender: p.gender || undefined,
          bloodType: p.bloodType || p.blood_type || undefined,
          allergies: Array.isArray(p.allergies) ? p.allergies.join(", ") : "",
          street: p.address?.street || "",
          city: p.address?.city || "",
          state: p.address?.state || "",
          zipCode: p.address?.zipCode || "",
          country: p.address?.country || "",
          ecName: p.emergencyContact?.name || "",
          ecPhone: p.emergencyContact?.phoneNumber || "",
          ecRelation: p.emergencyContact?.relationship || "",
        });
      } catch (err: any) {
        console.error(err);
        setMessage("Failed to load patient details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!id) return;
    try {
      setSubmitting(true);
      setMessage(null);
      const payload = {
        fullName: values.fullName,
        email: values.email || undefined,
        phone: values.phone,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
        bloodType: values.bloodType === "Unknown" ? undefined : values.bloodType,
        allergies: values.allergies ? values.allergies.split(",").map(s => s.trim()).filter(Boolean) : undefined,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          country: values.country,
        },
        emergencyContact: {
          name: values.ecName,
          phone: values.ecPhone,
          relationship: values.ecRelation,
        }
      };
      const resp = await updatePatient(id, payload);
      if (resp.data?.success) {
        setMessage("Patient updated successfully");
        setEditMode(false);
        const p = resp.data?.data?.patient || {};
        setPatient(p);
      } else {
        setMessage(resp.data?.message || "Failed to update patient");
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Error updating patient");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAppointment = async () => {
    if (!id || !appointmentDate || !appointmentTime) {
      setMessage("Please fill in date and time for the appointment");
      return;
    }
    try {
      setSubmitting(true);
      setMessage(null);
      const scheduledTime = `${appointmentDate}T${appointmentTime}:00.000Z`;
      const resp = await createAppointment({ patientId: id, scheduledTime, appointmentType });
      if (resp.data?.success) {
        const appointmentId = resp.data?.data?.appointment?.id;
        setMessage(`Appointment created successfully!`);
        setShowAppointmentForm(false);
        setAppointmentDate("");
        setAppointmentTime("");
        // Navigate to encounter page
        if (appointmentId) {
          setTimeout(() => {
            router.push(`/encounter/${appointmentId}`);
          }, 1500);
        }
      } else {
        setMessage(resp.data?.message || "Failed to create appointment");
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Error creating appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="text-center">Loading patient details...</div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!patient) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="text-center text-red-600">Patient not found</div>
            <div className="text-center mt-4">
              <Button onClick={() => router.back()}>Go Back</Button>
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
        <main className="container mx-auto px-4 py-8">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Patient Details</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.back()}>Back</Button>
              {!editMode && !showAppointmentForm && (
                <>
                  <Button variant="default" onClick={() => setShowAppointmentForm(true)}>Create Appointment</Button>
                  <Button onClick={() => setEditMode(true)}>Edit</Button>
                </>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{editMode ? "Edit Patient Information" : patient.fullName || patient.full_name}</CardTitle>
            </CardHeader>
            <CardContent>
              {message && (
                <div className="mb-4 p-3 rounded bg-gray-50 text-sm">{message}</div>
              )}

              {showAppointmentForm && (
                <div className="mb-6 p-4 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold mb-3">Create Appointment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Date *</Label>
                      <Input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
                    </div>
                    <div>
                      <Label>Time *</Label>
                      <Input type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                        <option value="New Visit">New Visit</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Routine Check">Routine Check</option>
                        <option value="Emergency">Emergency</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleCreateAppointment} disabled={submitting}>
                      {submitting ? "Creating..." : "Create & Start Encounter"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowAppointmentForm(false)}>Cancel</Button>
                  </div>
                </div>
              )}

              {!editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">UHID</p>
                      <p>{patient.uhid || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Email</p>
                      <p>{patient.email || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Phone</p>
                      <p>{patient.phoneNumber || patient.phone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Date of Birth</p>
                      <p>{patient.dateOfBirth || patient.date_of_birth || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Gender</p>
                      <p>{patient.gender || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Blood Type</p>
                      <p>{patient.bloodType || patient.blood_type || "—"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-semibold text-gray-600">Allergies</p>
                      <p>{Array.isArray(patient.allergies) && patient.allergies.length > 0 ? patient.allergies.join(", ") : "None known"}</p>
                    </div>
                  </div>

                  <hr className="my-4" />
                  <h3 className="font-semibold mb-2">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Street</p>
                      <p>{patient.address?.street || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">City</p>
                      <p>{patient.address?.city || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">State</p>
                      <p>{patient.address?.state || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">ZIP</p>
                      <p>{patient.address?.zipCode || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Country</p>
                      <p>{patient.address?.country || "—"}</p>
                    </div>
                  </div>

                  <hr className="my-4" />
                  <h3 className="font-semibold mb-2">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Name</p>
                      <p>{patient.emergencyContact?.name || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Phone</p>
                      <p>{patient.emergencyContact?.phoneNumber || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Relationship</p>
                      <p>{patient.emergencyContact?.relationship || "—"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Basic Information</h3>
                    <div>
                      <Label>Full Name *</Label>
                      <Input {...register("fullName")} />
                      {errors.fullName && <p className="text-red-600 text-sm">{errors.fullName.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Email</Label>
                        <Input {...register("email")} />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input {...register("phone")} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Date of Birth</Label>
                        <Input type="date" {...register("dateOfBirth")} />
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <select {...register("gender")} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                          <option value="">Select...</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <Label>Blood Type</Label>
                        <select {...register("bloodType")} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                          <option value="">Select...</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="Unknown">Unknown</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label>Allergies (comma separated)</Label>
                      <Input {...register("allergies")} placeholder="Penicillin, Pollen" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label>Street</Label>
                        <Input {...register("street")} />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input {...register("city")} />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Input {...register("state")} />
                      </div>
                      <div>
                        <Label>ZIP</Label>
                        <Input {...register("zipCode")} />
                      </div>
                      <div>
                        <Label>Country</Label>
                        <Input {...register("country")} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input {...register("ecName")} />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input {...register("ecPhone")} />
                      </div>
                      <div>
                        <Label>Relationship</Label>
                        <Input {...register("ecRelation")} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Changes"}</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
