'use client';

import { useEffect, useState } from 'react';
import {
  getCoordinatorTopStats,
  getCoordinatorAppointmentTrends,
  type CoordinatorDashboardStats,
  type CoordinatorAppointmentTrend
} from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Calendar, CheckCircle, Clock, TrendingUp, UserPlus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CoordinatorDashboard() {
  const [stats, setStats] = useState<CoordinatorDashboardStats | null>(null);
  const [trends, setTrends] = useState<CoordinatorAppointmentTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load stats and trends in parallel
      const [statsResponse, trendsResponse] = await Promise.all([
        getCoordinatorTopStats(),
        getCoordinatorAppointmentTrends(),
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      if (trendsResponse.data.success) {
        setTrends(trendsResponse.data.data.trends);
      }
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Patients',
      value: stats?.totalPatients || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'New Patients (This Month)',
      value: stats?.newPatientsThisMonth || 0,
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Doctors',
      value: stats?.totalDoctors || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Today\'s Appointments',
      value: stats?.todayAppointments || 0,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Completed Today',
      value: stats?.todayCompleted || 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Upcoming Today',
      value: stats?.upcomingToday || 0,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your hospital overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Appointment Trends Chart */}
      {trends.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Appointment Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trends.map((trend) => (
                <div key={trend.date} className="flex items-center">
                  <div className="w-24 text-sm text-gray-600">
                    {new Date(trend.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {/* Total bar */}
                      <div
                        className="h-8 bg-blue-500 rounded flex items-center justify-center text-white text-sm font-medium"
                        style={{ width: `${Math.max((trend.total / 50) * 100, 5)}%` }}
                      >
                        {trend.total}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({trend.completed} completed, {trend.cancelled} cancelled)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/coordinator/patients"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Users className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-semibold">Manage Patients</h3>
              <p className="text-sm text-gray-600">View and manage all hospital patients</p>
            </a>
            <a
              href="/coordinator/appointments"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Calendar className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-semibold">Manage Appointments</h3>
              <p className="text-sm text-gray-600">Schedule and track appointments</p>
            </a>
            <a
              href="/coordinator/patients?action=create"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <UserPlus className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-semibold">Add New Patient</h3>
              <p className="text-sm text-gray-600">Register a new patient</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
