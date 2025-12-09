"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Save, 
  Sparkles, 
  History, 
  FileText, 
  AlertTriangle, 
  Check,
  Stethoscope,
  Pill
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { EncounterFormSchema } from "@/lib/schemas";
import { getClinicalSummary, getDiagnosisSuggestions, type ClinicalSummary, type DiagnosisSuggestion } from "@/lib/mock-ai";

// Mock Patient Data (In real app, fetch by ID)
const MOCK_PATIENT = {
  id: "1",
  name: "Sarah Johnson",
  age: 34,
  gender: "Female",
  mid: "MID-8832",
  allergies: ["Penicillin", "Peanuts"],
};

export default function EncounterWorkspace({ params }: { params: { id: string } }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [diagnosisSuggestions, setDiagnosisSuggestions] = useState<DiagnosisSuggestion[]>([]);
  const [clinicalSummary, setClinicalSummary] = useState<ClinicalSummary | null>(null);

  const form = useForm<z.infer<typeof EncounterFormSchema>>({
    resolver: zodResolver(EncounterFormSchema),
    defaultValues: {
      chiefComplaint: "",
      historyOfPresentIllness: "",
      diagnosis: "",
      treatmentPlan: "",
      prescription: "",
    },
  });

  // Watch symptoms to trigger AI suggestions
  const symptoms = form.watch("chiefComplaint");

  // Simulate AI Suggestions when symptoms change (debounced)
  useEffect(() => {
    if (symptoms && symptoms.length > 5) {
      const timer = setTimeout(async () => {
        setAiLoading(true);
        try {
          const suggestions = await getDiagnosisSuggestions(symptoms);
          setDiagnosisSuggestions(suggestions);
        } finally {
          setAiLoading(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [symptoms]);

  // Load Clinical Summary on mount
  useEffect(() => {
    async function loadSummary() {
      const summary = await getClinicalSummary(MOCK_PATIENT.id);
      setClinicalSummary(summary);
    }
    loadSummary();
  }, []);

  const onSubmit = async (data: z.infer<typeof EncounterFormSchema>) => {
    toast.success("Encounter saved successfully!");
    console.log("Encounter Data:", data);
    // In real app: await saveEncounter(data);
  };

  const applySuggestion = (suggestion: string) => {
    form.setValue("diagnosis", suggestion);
    toast.info("Diagnosis applied from AI suggestion");
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{MOCK_PATIENT.name}</h1>
            <Badge variant="outline">{MOCK_PATIENT.mid}</Badge>
            <Badge variant="secondary">{MOCK_PATIENT.age} yrs • {MOCK_PATIENT.gender}</Badge>
          </div>
          <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
            <AlertTriangle className="h-3 w-3" />
            <strong>Allergies:</strong> {MOCK_PATIENT.allergies.join(", ")}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={form.handleSubmit(onSubmit)}>
            <Save className="h-4 w-4 mr-2" />
            Finalize Encounter
          </Button>
        </div>
      </div>

      {/* Split Screen Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        
        {/* LEFT PANEL: Clinical Note */}
        <div className="overflow-y-auto pr-2">
          <Card className="h-full border-t-4 border-t-blue-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Clinical Note
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  <FormField
                    control={form.control}
                    name="chiefComplaint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chief Complaint (Symptoms)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Severe headache, nausea..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="historyOfPresentIllness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>History of Present Illness</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed description of the condition..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diagnosis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diagnosis</FormLabel>
                        <FormControl>
                          <Input placeholder="Primary diagnosis..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="treatmentPlan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Treatment Plan</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Plan of care..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prescription (Rx)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Medication details..." 
                            className="min-h-[80px] font-mono text-sm"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL: Clinical Intelligence (Mock AI) */}
        <div className="overflow-y-auto pl-2 space-y-6">
          
          {/* AI Suggestions Widget */}
          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Sparkles className="h-5 w-5" />
                MedMitra AI Assistant
              </CardTitle>
              <CardDescription>Real-time clinical decision support</CardDescription>
            </CardHeader>
            <CardContent>
              {aiLoading ? (
                <div className="flex items-center gap-2 text-sm text-purple-600 animate-pulse">
                  <Sparkles className="h-4 w-4" /> Analyzing symptoms...
                </div>
              ) : diagnosisSuggestions.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Suggested Diagnoses:</p>
                  <div className="flex flex-wrap gap-2">
                    {diagnosisSuggestions.map((suggestion) => (
                      <Button 
                        key={suggestion.id} 
                        variant="secondary" 
                        size="sm" 
                        className="bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200"
                        onClick={() => applySuggestion(suggestion.name)}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        {suggestion.name} ({Math.round(suggestion.confidence * 100)}%)
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Enter symptoms in "Chief Complaint" to see AI suggestions.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Patient History Widget */}
          <Tabs defaultValue="summary">
            <TabsList className="w-full">
              <TabsTrigger value="summary" className="flex-1">Clinical Summary</TabsTrigger>
              <TabsTrigger value="history" className="flex-1">Past Encounters</TabsTrigger>
              <TabsTrigger value="labs" className="flex-1">Lab Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    AI-Generated Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-gray-600">
                    {clinicalSummary ? (
                      <div className="space-y-2">
                        <p>{clinicalSummary.summary}</p>
                        <div className="mt-2">
                            <strong>Key Findings:</strong>
                            <ul className="list-disc pl-4 mt-1">
                                {clinicalSummary.keyFindings.map((f, i) => <li key={i}>{f}</li>)}
                            </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="h-20 bg-gray-100 animate-pulse rounded"></div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3 pb-4 border-b last:border-0">
                        <div className="mt-1">
                          <History className="h-4 w-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">General Checkup</p>
                          <p className="text-xs text-gray-500">Oct {10 + i}, 2023 • Dr. Smith</p>
                          <p className="text-xs text-gray-600 mt-1">Patient reported mild fatigue. Vitals normal.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="labs">
              <Card>
                <CardContent className="pt-6 text-center text-gray-500 text-sm">
                  No recent lab results found.
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  );
}
