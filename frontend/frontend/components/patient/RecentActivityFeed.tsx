"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPatientActivityFeed } from "@/lib/api";
import Link from "next/link";

interface Activity {
  id: string;
  type: 'consultation' | 'prescription' | 'appointment';
  icon: string;
  title: string;
  subtitle: string;
  hospitalName: string;
  date: string;
  relativeTime: string;
  link: string;
}

// Hospital color mapping for visual distinction
const hospitalColors: Record<string, string> = {
  default: 'bg-gray-100 text-gray-800',
};

function getHospitalColor(hospitalName: string): string {
  // Generate a consistent color based on hospital name
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-purple-100 text-purple-800',
    'bg-emerald-100 text-emerald-800',
    'bg-amber-100 text-amber-800',
    'bg-pink-100 text-pink-800',
    'bg-cyan-100 text-cyan-800',
  ];
  
  let hash = 0;
  for (let i = 0; i < hospitalName.length; i++) {
    hash = hospitalName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function ActivityIcon({ type, icon }: { type: string; icon: string }) {
  const bgColor = type === 'consultation' 
    ? 'bg-blue-100' 
    : type === 'prescription' 
      ? 'bg-purple-100' 
      : 'bg-green-100';

  return (
    <div className={`h-10 w-10 rounded-full ${bgColor} flex items-center justify-center text-lg`}>
      {icon}
    </div>
  );
}

export function RecentActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await getPatientActivityFeed(5);
      if (response.data.status === 'success') {
        setActivities(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching activity feed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (activities.length === 0) {
    return (
      <Card className="bg-white border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-600 font-medium">No activity yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Your medical history will appear here after your first visit
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          Recent Activity
          <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            All Hospitals
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />
          
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <Link
                key={`${activity.type}-${activity.id}`}
                href={activity.link}
                className="block group"
              >
                <div className="relative flex gap-4 p-3 -mx-3 rounded-lg hover:bg-gray-50 transition-colors">
                  {/* Icon */}
                  <div className="relative z-10">
                    <ActivityIcon type={activity.type} icon={activity.icon} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {activity.subtitle}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {activity.relativeTime}
                      </span>
                    </div>

                    {/* Hospital Badge */}
                    <div className="mt-2">
                      <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${getHospitalColor(activity.hospitalName)}`}>
                        {activity.hospitalName}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* View All Link */}
        {activities.length >= 5 && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <Link 
              href="/patient/history" 
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View Full History →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
