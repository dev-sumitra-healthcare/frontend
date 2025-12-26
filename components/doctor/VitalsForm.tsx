"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export interface VitalsData {
  bp?: string;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
}

interface VitalsFormProps {
  initialValues?: VitalsData;
  mode: "prefilled" | "manual";
  onSubmit: (vitals: VitalsData) => void;
  readOnly?: boolean;
}

const vitalsSchema = z.object({
  bp: z.string().optional(),
  heartRate: z.preprocess((val) => val ? Number(val) : undefined, z.number().optional()),
  temperature: z.preprocess((val) => val ? Number(val) : undefined, z.number().optional()),
  weight: z.preprocess((val) => val ? Number(val) : undefined, z.number().optional()),
  height: z.preprocess((val) => val ? Number(val) : undefined, z.number().optional()),
});

export default function VitalsForm({
  initialValues,
  mode,
  onSubmit,
  readOnly = false,
}: VitalsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VitalsData>({
    resolver: zodResolver(vitalsSchema) as any, // Type assertion due to zod coerce inference
    defaultValues: initialValues || {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Blood Pressure */}
        <div className="space-y-2">
          <Label htmlFor="bp" className="text-sm font-medium text-gray-700">
            Blood Pressure (mmHg)
          </Label>
          <Input
            id="bp"
            type="text"
            placeholder="120/80"
            {...register("bp")}
            disabled={readOnly}
            className="h-12 md:h-14"
          />
          {errors.bp && (
            <p className="text-sm text-red-600">{errors.bp.message}</p>
          )}
        </div>

        {/* Heart Rate */}
        <div className="space-y-2">
          <Label htmlFor="heartRate" className="text-sm font-medium text-gray-700">
            Heart Rate (bpm)
          </Label>
          <Input
            id="heartRate"
            type="number"
            placeholder="72"
            {...register("heartRate")}
            disabled={readOnly}
            className="h-12 md:h-14"
          />
          {errors.heartRate && (
            <p className="text-sm text-red-600">{errors.heartRate.message}</p>
          )}
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <Label htmlFor="temperature" className="text-sm font-medium text-gray-700">
            Temperature (°F)
          </Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            placeholder="98.6"
            {...register("temperature")}
            disabled={readOnly}
            className="h-12 md:h-14"
          />
          {errors.temperature && (
            <p className="text-sm text-red-600">{errors.temperature.message}</p>
          )}
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
            Weight (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            placeholder="70"
            {...register("weight")}
            disabled={readOnly}
            className="h-12 md:h-14"
          />
          {errors.weight && (
            <p className="text-sm text-red-600">{errors.weight.message}</p>
          )}
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-medium text-gray-700">
            Height (cm)
          </Label>
          <Input
            id="height"
            type="number"
            step="0.1"
            placeholder="170"
            {...register("height")}
            disabled={readOnly}
            className="h-12 md:h-14"
          />
          {errors.height && (
            <p className="text-sm text-red-600">{errors.height.message}</p>
          )}
        </div>
      </div>

      {mode === "prefilled" && initialValues && (
        <div className="text-sm text-gray-500 bg-blue-50 border border-blue-200 rounded-lg p-3">
          Vitals were recorded during triage. You can edit them if needed.
        </div>
      )}
    </form>
  );
}
