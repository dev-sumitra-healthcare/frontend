"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Building2, 
  User, 
  FileText, 
  Clock,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Loader2
} from "lucide-react";
import { getMedicalHistory, MedicalHistoryItem } from "@/lib/api";
import { toast } from "sonner";

// Hospital color mapping for multi-hospital timeline
const HOSPITAL_COLORS: Record<string, string> = {
  default: "bg-blue-100 text-blue-800 border-blue-200",
};

function getHospitalColor(hospitalId: string): string {
  // Generate a consistent color based on hospital ID
  const colors = [
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-purple-100 text-purple-800 border-purple-200",
    "bg-green-100 text-green-800 border-green-200",
    "bg-orange-100 text-orange-800 border-orange-200",
    "bg-pink-100 text-pink-800 border-pink-200",
    "bg-cyan-100 text-cyan-800 border-cyan-200",
  ];
  
  // Simple hash to get consistent color for same hospital
  let hash = 0;
  for (let i = 0; i < hospitalId.length; i++) {
    hash = hospitalId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export default function MedicalHistoryWidget() {
  const [history, setHistory] = useState<MedicalHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const response = await getMedicalHistory();
      if (response.data.status === 'success') {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error('Error loading medical history:', error);
      toast.error('Failed to load medical history');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Medical History
          </CardTitle>
          <CardDescription>Your health journey across all hospitals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Medical History
          </CardTitle>
          <CardDescription>Your health journey across all hospitals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No medical history yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Your visits and consultations will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Medical History
        </CardTitle>
        <CardDescription>
          {history.length} encounter{history.length !== 1 ? 's' : ''} across your healthcare journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
          
          <div className="space-y-4">
            {history.map((item, index) => {
              const isExpanded = expandedId === item.encounterId;
              const hospitalColor = item.hospital?.id 
                ? getHospitalColor(item.hospital.id) 
                : HOSPITAL_COLORS.default;
              
              return (
                <div key={item.encounterId} className="relative pl-10">
                  {/* Timeline dot */}
                  <div className={`absolute left-2 top-4 w-4 h-4 rounded-full border-2 ${
                    index === 0 
                      ? 'bg-purple-600 border-purple-600' 
                      : 'bg-white border-gray-300'
                  }`} />
                  
                  {/* Card */}
                  <div 
                    className={`border rounded-lg p-4 transition-all hover:shadow-md cursor-pointer ${
                      isExpanded ? 'border-purple-300 bg-purple-50/50' : 'bg-white'
                    }`}
                    onClick={() => toggleExpand(item.encounterId)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {item.chiefComplaint}
                          </span>
                          {item.hospital && (
                            <Badge variant="outline" className={hospitalColor}>
                              {item.hospital.name}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(item.date)}
                          </span>
                          {item.doctor && (
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              {item.doctor.fullName}
                              {item.doctor.specialty && ` • ${item.doctor.specialty}`}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-2">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                        {item.diagnosis && (
                          <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                              Diagnosis
                            </div>
                            <p className="text-sm text-gray-700">{item.diagnosis}</p>
                          </div>
                        )}
                        
                        {item.vitals && Object.keys(item.vitals).length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                              Vitals
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(item.vitals).map(([key, value]) => (
                                <Badge key={key} variant="secondary" className="text-xs">
                                  {key}: {String(value)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.advice && (
                          <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                              Doctor's Advice
                            </div>
                            <p className="text-sm text-gray-700">{item.advice}</p>
                          </div>
                        )}
                        
                        {item.hospital && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
                            <Building2 className="h-4 w-4" />
                            <span>{item.hospital.name}</span>
                            {item.hospital.city && (
                              <span className="text-gray-400">• {item.hospital.city}</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
