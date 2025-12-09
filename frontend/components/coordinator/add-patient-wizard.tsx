"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, UserPlus, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PatientRegistrationSchema } from "@/lib/schemas";
import { toast } from "sonner";
import { searchPatients, createPatient, registerExistingPatient } from "@/lib/api";

// Schema for the initial search step
const SearchSchema = z.object({
  query: z.string().min(3, "Enter at least 3 characters (Phone or MID)"),
});

export function AddPatientWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"search" | "results" | "register_new" | "enroll_existing">("search");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Search Form
  const searchForm = useForm<z.infer<typeof SearchSchema>>({
    resolver: zodResolver(SearchSchema),
    defaultValues: { query: "" },
  });

  // Registration Form
  const registerForm = useForm<z.infer<typeof PatientRegistrationSchema>>({
    resolver: zodResolver(PatientRegistrationSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      gender: "Prefer not to say",
    },
  });

  // Search Handler
  const onSearch = async (data: z.infer<typeof SearchSchema>) => {
    try {
      const response = await searchPatients(data.query);
      setSearchResults(response.data.data.results || []);
      setStep("results");
    } catch (error) {
      toast.error("Failed to search patients");
    }
  };

  // Enroll Existing Handler
  const onEnroll = async () => {
    if (!selectedPatient) return;
    try {
      await registerExistingPatient(selectedPatient.id);
      toast.success(`Enrolled ${selectedPatient.full_name} successfully!`);
      setIsOpen(false);
      resetWizard();
    } catch (error) {
      toast.error("Failed to enroll patient");
    }
  };

  // Register New Handler
  const onRegister = async (data: z.infer<typeof PatientRegistrationSchema>) => {
    try {
      const payload = {
        ...data,
        allergies: data.allergies ? data.allergies.split(",").map(s => s.trim()) : [],
      };
      await createPatient(payload);
      toast.success("Patient registered successfully!");
      setIsOpen(false);
      resetWizard();
    } catch (error) {
      toast.error("Failed to register patient");
    }
  };

  const resetWizard = () => {
    setStep("search");
    setSearchResults([]);
    setSelectedPatient(null);
    searchForm.reset();
    registerForm.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetWizard(); }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Patient</DialogTitle>
          <DialogDescription>
            Search the Global Network first to avoid duplicates.
          </DialogDescription>
        </DialogHeader>

        {step === "search" && (
          <Form {...searchForm}>
            <form onSubmit={searchForm.handleSubmit(onSearch)} className="space-y-4 py-4">
              <FormField
                control={searchForm.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search by Phone, Email, or MID</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="e.g. 9876543210 or MID-123" {...field} />
                        <Button type="submit">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center pt-4">
                 <Button variant="outline" type="button" onClick={() => setStep("register_new")}>
                    Skip Search & Register New
                 </Button>
              </div>
            </form>
          </Form>
        )}

        {step === "results" && (
          <div className="space-y-4 py-4">
            <div className="text-sm text-muted-foreground">
              Found {searchResults.length} matches for "{searchForm.getValues("query")}"
            </div>
            
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <div className="font-medium">{patient.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {patient.phone} • {patient.gender} • {patient.uhid}
                      </div>
                    </div>
                    <Button size="sm" onClick={() => { setSelectedPatient(patient); setStep("enroll_existing"); }}>
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="flex justify-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground" />
                </div>
                <p>No patients found in the network.</p>
                <Button onClick={() => setStep("register_new")}>
                  Register New Patient
                </Button>
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep("search")}>Back to Search</Button>
            </div>
          </div>
        )}

        {step === "enroll_existing" && selectedPatient && (
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Confirm Enrollment
              </h3>
              <p className="text-sm text-muted-foreground">
                You are about to enroll <strong>{selectedPatient.full_name}</strong> into your hospital's registry.
                This will grant you access to their shared clinical history.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                <div><strong>MID:</strong> {selectedPatient.uhid}</div>
                <div><strong>Phone:</strong> {selectedPatient.phone}</div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("results")}>Cancel</Button>
              <Button onClick={onEnroll}>Confirm Enrollment</Button>
            </DialogFooter>
          </div>
        )}

        {step === "register_new" && (
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={registerForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setStep("search")}>Cancel</Button>
                <Button type="submit">Register Patient</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
