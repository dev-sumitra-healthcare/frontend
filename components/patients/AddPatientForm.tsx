"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createPatient } from "@/lib/api";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email().optional().or(z.literal("")).transform(v => v || undefined),
  phone: z.string().min(10, "Valid phone required").optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["Male","Female","Other","Prefer not to say"]).optional(),
  bloodType: z.enum(["A+","A-","B+","B-","AB+","AB-","O+","O-","Unknown"]).optional(),
  allergies: z.string().optional(), // comma-separated
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

export default function AddPatientForm() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);
      setMessage(null);
      const payload = {
        fullName: values.fullName,
        email: values.email,
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
      const resp = await createPatient(payload);
      if (resp.data?.success) {
        setMessage("Patient created successfully");
        reset();
      } else {
        setMessage(resp.data?.message || "Failed to create patient");
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Error creating patient");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Patient</CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <div className="mb-4 p-3 rounded bg-gray-50 text-sm">{message}</div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>
            <div>
              <Label>Full Name *</Label>
              <Input {...register("fullName")} placeholder="John Doe" />
              {errors.fullName && <p className="text-red-600 text-sm">{errors.fullName.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input {...register("email")} placeholder="john@example.com" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input {...register("phone")} placeholder="+91-...." />
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

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Address</h3>
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
                <Input {...register("country")} defaultValue="India" />
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Emergency Contact</h3>
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

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Add Patient"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
