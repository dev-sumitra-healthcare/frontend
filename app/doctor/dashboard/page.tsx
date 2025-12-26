"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  User, 
  Loader2,
  Activity,
  FileText,
  Users,
  Stethoscope
} from "lucide-react";
import Link from "next/link";
import { 
  getTodaysQueue,
  getDoctorActionItems,
  getDoctorStats,
  DashboardQueueItem, 
  DashboardActionItems, 
  DashboardPerformanceStats 
} from "@/lib/api";
import { toast } from "sonner";

// Helper to format time from ISO string
function formatTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return '--:--';
  }
}

// Get triage status badge color/variant
function getTriageStatusBadge(status: string) {
  switch (status) {
    case 'ready':
      return { variant: 'default' as const, label: 'Ready for Doctor', icon: CheckCircle, color: 'bg-green-100 text-green-800' };
    case 'waiting':
      return { variant: 'destructive' as const, label: 'Waiting', icon: Clock, color: 'bg-yellow-100 text-yellow-800' };
    case 'in-progress':
      return { variant: 'secondary' as const, label: 'In Consultation', icon: Stethoscope, color: 'bg-blue-100 text-blue-800' };
    case 'completed':
      return { variant: 'outline' as const, label: 'Completed', icon: CheckCircle, color: 'bg-gray-100 text-gray-600' };
    default:
      return { variant: 'outline' as const, label: 'Scheduled', icon: Clock, color: 'bg-gray-50 text-gray-500' };
  }
}

export default function DoctorDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [queue, setQueue] = useState<DashboardQueueItem[]>([]);
  const [actionItems, setActionItems] = useState<DashboardActionItems | null>(null);
  const [stats, setStats] = useState<DashboardPerformanceStats | null>(null);
  const [doctorName, setDoctorName] = useState('Doctor');

  useEffect(() => {
    loadDashboard();
    loadDoctorInfo();
  }, []);

  const loadDoctorInfo = () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setDoctorName(user.fullName || user.full_name || 'Doctor');
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  };

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      
      const [queueRes, actionItemsRes, statsRes] = await Promise.allSettled([
        getTodaysQueue(),
        getDoctorActionItems(),
        getDoctorStats()
      ]);

      // Process Queue
      if (queueRes.status === 'fulfilled' && queueRes.value.data.status === 'success') {
        setQueue(queueRes.value.data.data || []);
      } else {
        console.error('Failed to load queue:', queueRes.status === 'rejected' ? queueRes.reason : 'Invalid response');
      }

      // Process Action Items
      if (actionItemsRes.status === 'fulfilled' && actionItemsRes.value.data.status === 'success') {
        setActionItems(actionItemsRes.value.data.data);
      } else {
        console.error('Failed to load action items:', actionItemsRes.status === 'rejected' ? actionItemsRes.reason : 'Invalid response');
      }

      // Process Stats
      if (statsRes.status === 'fulfilled' && statsRes.value.data.status === 'success') {
        setStats(statsRes.value.data.data);
      } else {
        console.error('Failed to load stats:', statsRes.status === 'rejected' ? statsRes.reason : 'Invalid response');
      }

    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard', {
        description: 'Some data could not be loaded. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const readyPatients = queue.filter(q => q.triageStatus === 'ready').length;
  const waitingPatients = queue.filter(q => q.triageStatus === 'waiting').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{getGreeting()}, Dr. {doctorName.split(' ')[0]}</h1>
        <p className="text-gray-600 mt-2">
          You have {queue.length} appointment{queue.length !== 1 ? 's' : ''} today.
          {readyPatients > 0 && ` ${readyPatients} patient${readyPatients !== 1 ? 's' : ''} ready.`}
        </p>
      </div>

      {/* Performance Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">{stats.patientsSeen}/{stats.patientsScheduled}</p>
                  <p className="text-xs text-blue-700">Patients Seen Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-900">{stats.avgConsultTime} min</p>
                  <p className="text-xs text-green-700">Avg Consult Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900">{waitingPatients}</p>
                  <p className="text-xs text-purple-700">In Waiting Room</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Queue Widget */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Today's Queue</CardTitle>
              <CardDescription>
                {queue.length === 0 
                  ? 'No appointments scheduled for today' 
                  : `${queue.length} appointment${queue.length !== 1 ? 's' : ''} • ${readyPatients} ready`
                }
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">View Full Schedule</Button>
          </CardHeader>
          <CardContent>
            {queue.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No appointments today</p>
                <p className="text-sm text-gray-400 mt-1">Enjoy your free time!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {queue.map((apt) => {
                  const triageBadge = getTriageStatusBadge(apt.triageStatus);
                  const TriageIcon = triageBadge.icon;
                  
                  return (
                    <div 
                      key={apt.appointmentId} 
                      className={`flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all ${
                        apt.triageStatus === 'ready' ? 'border-green-200 bg-green-50/50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {formatTime(apt.scheduledTime).split(':')[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{apt.patient.fullName}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                            {apt.patient.mid && (
                              <Badge variant="secondary" className="text-xs">{apt.patient.mid}</Badge>
                            )}
                            <span>• {apt.appointmentType}</span>
                            <span>• {formatTime(apt.scheduledTime)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={triageBadge.color}>
                          <TriageIcon className="h-3 w-3 mr-1" />
                          {triageBadge.label}
                        </Badge>
                        <Link href={`/encounter/${apt.appointmentId}`}>
                          <Button size="sm" variant={apt.triageStatus === 'ready' ? 'default' : 'outline'}>
                            Start Encounter <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Items Widget */}
        <Card>
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
            <CardDescription>Tasks requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            {actionItems ? (
              <div className="space-y-4">
                {actionItems.pendingDocumentation > 0 && (
                  <div className="p-3 border rounded-lg bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="destructive" className="text-xs">High</Badge>
                      <span className="text-xs text-gray-500">Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <h4 className="font-medium text-sm">Pending Documentation</h4>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {actionItems.pendingDocumentation} encounter{actionItems.pendingDocumentation !== 1 ? 's' : ''} need completion
                    </p>
                    <Button variant="ghost" size="sm" className="w-full mt-2 h-8 text-xs">
                      View All
                    </Button>
                  </div>
                )}

                {actionItems.waitingPatients > 0 && (
                  <div className="p-3 border rounded-lg bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-xs">Medium</Badge>
                      <span className="text-xs text-gray-500">Now</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <h4 className="font-medium text-sm">Patients Waiting</h4>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {actionItems.waitingPatients} patient{actionItems.waitingPatients !== 1 ? 's' : ''} in waiting room
                    </p>
                  </div>
                )}

                {actionItems.pendingLabResults > 0 && (
                  <div className="p-3 border rounded-lg bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="text-xs bg-orange-100 text-orange-800">Review</Badge>
                      <span className="text-xs text-gray-500">Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <h4 className="font-medium text-sm">Lab Results Ready</h4>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {actionItems.pendingLabResults} result{actionItems.pendingLabResults !== 1 ? 's' : ''} to review
                    </p>
                    <Button variant="ghost" size="sm" className="w-full mt-2 h-8 text-xs">
                      Review Results
                    </Button>
                  </div>
                )}

                {actionItems.pendingDocumentation === 0 && 
                 actionItems.waitingPatients === 0 && 
                 actionItems.pendingLabResults === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">All caught up!</p>
                    <p className="text-sm text-gray-400">No pending tasks</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Unable to load action items</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
