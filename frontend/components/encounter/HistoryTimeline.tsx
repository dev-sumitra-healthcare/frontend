"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  History, 
  Building2, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  Stethoscope,
  Pill,
  FileText
} from "lucide-react";

export interface HistoryItem {
  id: string;
  date: string;
  hospitalName?: string;
  hospitalId?: string;
  doctorName?: string;
  diagnosis?: string;
  chiefComplaint?: string;
  type?: string;
  status?: string;
  notes?: string;
  medications?: Array<{ name: string; dosage: string }>;
}

interface HistoryTimelineProps {
  history: HistoryItem[];
  onViewDetails?: (encounterId: string) => void;
  isLoading?: boolean;
}

// Generate consistent color for hospital based on ID
const getHospitalColor = (hospitalId?: string) => {
  if (!hospitalId) return { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700' };
  
  const colors = [
    { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700' },
    { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700' },
    { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-700' },
    { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-700' },
    { bg: 'bg-pink-100', border: 'border-pink-500', text: 'text-pink-700' },
  ];
  
  const index = hospitalId.charCodeAt(0) % colors.length;
  return colors[index];
};

export default function HistoryTimeline({ history, onViewDetails, isLoading }: HistoryTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-blue-600" />
            Medical History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="w-1 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5 text-blue-600" />
          Medical History
          {history.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {history.length} visits
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-4">
              {history.map((item, index) => {
                const colors = getHospitalColor(item.hospitalId);
                const isExpanded = expandedId === item.id;
                
                return (
                  <div key={item.id} className="relative pl-10">
                    {/* Timeline dot */}
                    <div className={`absolute left-2 w-5 h-5 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center`}>
                      <Building2 className={`h-3 w-3 ${colors.text}`} />
                    </div>
                    
                    {/* Content card */}
                    <div 
                      className={`p-4 rounded-lg border ${colors.bg} ${colors.border} border-l-4 cursor-pointer hover:shadow-sm transition-shadow`}
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-900">
                              {item.diagnosis || item.chiefComplaint || item.type || 'Visit'}
                            </span>
                            {item.hospitalName && (
                              <Badge variant="outline" className={`text-xs ${colors.text}`}>
                                <Building2 className="h-3 w-3 mr-1" />
                                {item.hospitalName}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(item.date)}
                            </span>
                            {item.doctorName && (
                              <span className="flex items-center gap-1">
                                <Stethoscope className="h-3 w-3" />
                                Dr. {item.doctorName}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                          {item.notes && (
                            <div className="flex items-start gap-2 text-sm">
                              <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                              <p className="text-gray-700">{item.notes}</p>
                            </div>
                          )}
                          {item.medications && item.medications.length > 0 && (
                            <div className="flex items-start gap-2 text-sm">
                              <Pill className="h-4 w-4 text-gray-400 mt-0.5" />
                              <div className="flex flex-wrap gap-1">
                                {item.medications.map((med, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {med.name} {med.dosage}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {onViewDetails && (
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="p-0 h-auto text-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewDetails(item.id);
                              }}
                            >
                              View Full Details →
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <History className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No previous visits</p>
            <p className="text-sm text-gray-400 mt-1">
              Patient's medical history will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
