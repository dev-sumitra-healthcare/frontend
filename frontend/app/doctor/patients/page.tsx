"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, User, ArrowRight, Globe, Building, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { searchGlobalPatients, enrollGlobalPatient, GlobalPatientResult } from "@/lib/api";
import { useRouter } from "next/navigation";

const SearchSchema = z.object({
  query: z.string().min(2, "Enter at least 2 characters"),
});

export default function DoctorPatientSearch() {
  const router = useRouter();
  const [results, setResults] = useState<GlobalPatientResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof SearchSchema>>({
    resolver: zodResolver(SearchSchema),
    defaultValues: { query: "" },
  });

  const onSearch = async (data: z.infer<typeof SearchSchema>) => {
    try {
      setIsSearching(true);
      const response = await searchGlobalPatients(data.query);
      setResults(response.data.data.results || []);
      setHasSearched(true);
    } catch (error) {
      toast.error("Failed to search patients");
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleEnrollAndStart = async (patient: GlobalPatientResult) => {
    try {
      setEnrollingId(patient.id);
      const response = await enrollGlobalPatient(patient.id);
      
      if (response.data.success) {
        toast.success(response.data.data.alreadyEnrolled 
          ? "Patient already enrolled at your hospital" 
          : "Patient enrolled successfully"
        );
        // Navigate to create appointment or encounter
        router.push(`/doctor/schedule?action=new&patientId=${response.data.data.patientId}`);
      }
    } catch (error) {
      toast.error("Failed to enroll patient");
      console.error("Enroll error:", error);
    } finally {
      setEnrollingId(null);
    }
  };

  const handleStartVisit = (patientId: string) => {
    // For local patients, go directly to schedule/appointment creation
    router.push(`/doctor/schedule?action=new&patientId=${patientId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patient Search</h1>
        <p className="text-gray-600 mt-2">
          Find patients across the MedMitra Global Network. Access shared clinical history instantly.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Global Network Search
          </CardTitle>
          <CardDescription>Search by Name, Phone Number, or MedMitra ID (MID)</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSearch)} className="flex gap-4">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          className="pl-10" 
                          placeholder="e.g. John Doe, 9876543210, or MID-UP2900" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSearching}>
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Network
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {hasSearched && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Search Results ({results.length})
          </h2>
          
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((patient) => (
                <Card key={patient.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          patient.isLocal 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{patient.full_name}</h3>
                            <Badge 
                              variant={patient.isLocal ? "default" : "secondary"}
                              className={patient.isLocal 
                                ? "bg-green-100 text-green-800 hover:bg-green-200" 
                                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              }
                            >
                              {patient.isLocal ? (
                                <><Building className="h-3 w-3 mr-1" /> My Patient</>
                              ) : (
                                <><Globe className="h-3 w-3 mr-1" /> Network</>
                              )}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500 space-y-1 mt-1">
                            <p className="font-mono text-blue-600">{patient.mid}</p>
                            <p>{patient.gender} • {patient.age ? `${patient.age} years` : "Age N/A"}</p>
                            {patient.phone && <p>{patient.phone}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {patient.isLocal ? (
                        <Button 
                          className="w-full" 
                          onClick={() => handleStartVisit(patient.id)}
                        >
                          Start Visit <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700" 
                          onClick={() => handleEnrollAndStart(patient)}
                          disabled={enrollingId === patient.id}
                        >
                          {enrollingId === patient.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Enrolling...
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Enroll & Start Visit
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No patients found matching your query.</p>
              <p className="text-sm text-gray-400 mt-2">
                Try searching with a different name, phone number, or MID
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
