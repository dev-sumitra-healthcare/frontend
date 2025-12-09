"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Thermometer, 
  Activity, 
  Wind, 
  Scale, 
  Ruler,
  Clock,
  User,
  Edit2
} from "lucide-react";

export interface VitalsData {
  bloodPressure?: string;
  heartRate?: string | number;
  temperature?: string | number;
  respiratoryRate?: string | number;
  oxygenSaturation?: string | number;
  weight?: string | number;
  height?: string | number;
  recordedAt?: string;
  recordedBy?: string;
}

interface VitalsDisplayProps {
  vitals: VitalsData | null;
  onEdit?: () => void;
  isEditable?: boolean;
}

// Vital card configuration
const vitalConfig = [
  { key: 'bloodPressure', label: 'Blood Pressure', icon: Heart, unit: 'mmHg', color: 'text-red-600', bgColor: 'bg-red-50' },
  { key: 'heartRate', label: 'Pulse Rate', icon: Activity, unit: 'bpm', color: 'text-pink-600', bgColor: 'bg-pink-50' },
  { key: 'temperature', label: 'Temperature', icon: Thermometer, unit: '°F', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { key: 'oxygenSaturation', label: 'SpO2', icon: Wind, unit: '%', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { key: 'respiratoryRate', label: 'Resp. Rate', icon: Wind, unit: '/min', color: 'text-teal-600', bgColor: 'bg-teal-50' },
  { key: 'weight', label: 'Weight', icon: Scale, unit: 'kg', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { key: 'height', label: 'Height', icon: Ruler, unit: 'cm', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
];

export default function VitalsDisplay({ vitals, onEdit, isEditable = true }: VitalsDisplayProps) {
  const hasVitals = vitals && Object.values(vitals).some(v => v !== undefined && v !== null && v !== '');
  
  const formatTime = (isoString?: string) => {
    if (!isoString) return null;
    try {
      return new Date(isoString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-blue-600" />
            Vital Signs
          </CardTitle>
          <div className="flex items-center gap-2">
            {vitals?.recordedAt && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(vitals.recordedAt)}
              </Badge>
            )}
            {vitals?.recordedBy && (
              <Badge variant="secondary" className="text-xs">
                <User className="h-3 w-3 mr-1" />
                {vitals.recordedBy}
              </Badge>
            )}
            {isEditable && onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {hasVitals ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {vitalConfig.map(({ key, label, icon: Icon, unit, color, bgColor }) => {
              const value = vitals[key as keyof VitalsData];
              if (value === undefined || value === null || value === '') return null;
              
              return (
                <div 
                  key={key}
                  className={`${bgColor} rounded-lg p-3 text-center`}
                >
                  <Icon className={`h-5 w-5 ${color} mx-auto mb-1`} />
                  <div className={`text-lg font-bold ${color}`}>
                    {value}
                  </div>
                  <div className="text-xs text-gray-600">{label}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No vitals recorded yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Vitals will appear here once recorded during triage
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
