"use client";

import { cn } from "@/lib/utils";

type StatusVariant = 
  | "completed"
  | "follow-up"
  | "under-treatment"
  | "active"
  | "inactive"
  | "vitals-good"
  | "vitals-required"
  | "payment-completed"
  | "payment-process"
  | "payment-none"
  | "diagnosis-red"
  | "diagnosis-orange"
  | "diagnosis-blue"
  | "diagnosis-purple"
  | "symptom"
  | "permission";

interface StatusBadgeProps {
  variant: StatusVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  // Case status badges
  "completed": "bg-green-100 text-green-700 border-green-200",
  "follow-up": "bg-orange-100 text-orange-700 border-orange-200",
  "under-treatment": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "active": "bg-green-100 text-green-600 border-green-200",
  "inactive": "bg-gray-100 text-gray-600 border-gray-200",
  
  // Vitals status badges
  "vitals-good": "bg-green-50 text-green-600 border border-green-300",
  "vitals-required": "bg-red-50 text-red-600 border border-red-300",
  
  // Payment status badges
  "payment-completed": "bg-green-100 text-green-700 border-green-200",
  "payment-process": "bg-orange-100 text-orange-600 border-orange-200",
  "payment-none": "bg-gray-100 text-gray-500 border-gray-200",
  
  // Diagnosis tags
  "diagnosis-red": "bg-red-50 text-red-600 border-red-200",
  "diagnosis-orange": "bg-orange-50 text-orange-600 border-orange-200",
  "diagnosis-blue": "bg-blue-50 text-blue-600 border-blue-200",
  "diagnosis-purple": "bg-purple-50 text-purple-600 border-purple-200",
  
  // Symptom tags
  "symptom": "bg-blue-50 text-blue-600 border-blue-100",
  
  // Permission badges
  "permission": "bg-blue-100 text-blue-700 border-blue-200",
};

export default function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Convenience components for common status types
export function VitalsStatusBadge({ status }: { status: "good" | "required" }) {
  return (
    <StatusBadge variant={status === "good" ? "vitals-good" : "vitals-required"}>
      {status === "good" ? "Vitals are Good" : "Vitals Follow-up Required"}
    </StatusBadge>
  );
}

export function PaymentStatusBadge({ status }: { status: "completed" | "process" | "none" }) {
  const labels = {
    completed: "Completed",
    process: "Under Process",
    none: "Not Started",
  };
  const variants = {
    completed: "payment-completed" as const,
    process: "payment-process" as const,
    none: "payment-none" as const,
  };
  
  return (
    <StatusBadge variant={variants[status]}>
      {labels[status]}
    </StatusBadge>
  );
}

export function CaseStatusBadge({ status }: { status: "completed" | "follow-up" | "under-treatment" }) {
  const labels = {
    completed: "Completed",
    "follow-up": "Follow-up Required",
    "under-treatment": "Under Treatment",
  };
  
  return (
    <StatusBadge variant={status}>
      {labels[status]}
    </StatusBadge>
  );
}
