"use client";

import { useEffect, useState } from 'react';
import { Activity, Calendar, FileText, Pill, Clock, Loader2 } from 'lucide-react';
import { getPatientActivityFeed, ActivityFeedItem } from '@/lib/api';

export function RecentActivityFeed() {
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const response = await getPatientActivityFeed(5);
        setActivities(response.data?.data || []);
      } catch (error) {
        console.error('Error fetching activity:', error);
        // Set empty array on error - activity feed is non-critical
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return (
          <div className="w-10 h-10 rounded-full bg-[#f3e8ff] flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[#9810fa]" />
          </div>
        );
      case 'prescription':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Pill className="w-5 h-5 text-[#155dfc]" />
          </div>
        );
      case 'consultation':
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#008236]" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Activity className="w-5 h-5 text-gray-500" />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="patient-card p-6">
        <h3 className="patient-heading-4 font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#9810fa]" />
          Recent Activity
        </h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-[#9810fa] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="patient-card p-6">
      <h3 className="patient-heading-4 font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-[#9810fa]" />
        Recent Activity
      </h3>

      {activities.length === 0 ? (
        <div className="text-center py-6">
          <div className="patient-icon-container patient-icon-outlined mx-auto mb-3 w-12 h-12">
            <Clock className="w-6 h-6" />
          </div>
          <p className="patient-body-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-1">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="patient-list-item">
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className="patient-heading-4 font-medium truncate">{activity.title}</p>
                {activity.subtitle && (
                  <p className="patient-body-sm truncate">{activity.subtitle}</p>
                )}
                <p className="text-xs text-[#667085] mt-1">{activity.relativeTime}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activities.length > 5 && (
        <button className="w-full mt-4 text-[#9810fa] text-sm font-medium hover:underline">
          View all activity →
        </button>
      )}
    </div>
  );
}
