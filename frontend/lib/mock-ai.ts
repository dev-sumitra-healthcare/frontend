import { z } from "zod";

// Mock Types
export interface ClinicalSummary {
  summary: string;
  keyFindings: string[];
  riskFactors: string[];
}

export interface DiagnosisSuggestion {
  id: string;
  name: string;
  confidence: number;
  reasoning: string;
}

// Mock Data Generators
export const getClinicalSummary = async (patientId: string): Promise<ClinicalSummary> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    summary: "Patient presents with a history of recurring migraines and seasonal allergies. Recent vitals show slightly elevated blood pressure. No major surgical history.",
    keyFindings: [
      "Recurring migraines (2-3x/month)",
      "Seasonal allergies (Spring/Fall)",
      "BP: 135/85 (Elevated)",
    ],
    riskFactors: ["Hypertension", "Family history of diabetes"],
  };
};

export const getDiagnosisSuggestions = async (symptoms: string): Promise<DiagnosisSuggestion[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (symptoms.toLowerCase().includes("headache")) {
    return [
      {
        id: "d1",
        name: "Migraine without aura",
        confidence: 0.85,
        reasoning: "Matches pattern of recurring unilateral headaches.",
      },
      {
        id: "d2",
        name: "Tension-type headache",
        confidence: 0.6,
        reasoning: "Possible due to stress factors, but less likely given severity.",
      },
    ];
  }

  if (symptoms.toLowerCase().includes("fever")) {
    return [
      {
        id: "d3",
        name: "Viral URI",
        confidence: 0.9,
        reasoning: "Common presentation with fever and cough.",
      },
      {
        id: "d4",
        name: "Influenza",
        confidence: 0.75,
        reasoning: "Seasonal correlation and high fever.",
      },
    ];
  }

  return [
    {
      id: "d_gen",
      name: "General Consultation",
      confidence: 0.5,
      reasoning: "Symptoms are non-specific.",
    },
  ];
};
