"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getAllMyAppointments } from '@/lib/api';

interface Appointment {
  appointmentId: string;
  scheduledTime: string;
  appointmentType: string;
  status: string;
  notes?: string;
  isPast: boolean;
  practitioner: {
    fullName: string;
    specialty: string | null;
  };
}

export default function PatientAppointmentsWidget() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllMyAppointments();
      console.log('Appointments API response:', response);
      // Handle API response wrapper
      if (response.data && response.data.status === 'success') {
        setAppointments(response.data.data || []);
      } else if (response.data && Array.isArray(response.data)) {
        // Direct data array
        setAppointments(response.data);
      } else {
        setAppointments([]);
      }
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments.filter(a => !a.isPast);
  const pastAppointments = appointments.filter(a => a.isPast);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { icon: React.ReactNode; className: string; label: string }> = {
      scheduled: {
        icon: <Clock className="w-3 h-3" />,
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Scheduled'
      },
      confirmed: {
        icon: <CheckCircle className="w-3 h-3" />,
        className: 'bg-green-100 text-green-800 border-green-200',
        label: 'Confirmed'
      },
      completed: {
        icon: <CheckCircle className="w-3 h-3" />,
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        label: 'Completed'
      },
      cancelled: {
        icon: <XCircle className="w-3 h-3" />,
        className: 'bg-red-100 text-red-800 border-red-200',
        label: 'Cancelled'
      },
      'no-show': {
        icon: <AlertCircle className="w-3 h-3" />,
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        label: 'No Show'
      }
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.scheduled;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const dateStr = date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    return { dateStr, timeStr };
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const { dateStr, timeStr } = formatDateTime(appointment.scheduledTime);

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">{dateStr}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{timeStr}</span>
            </div>
          </div>
          {getStatusBadge(appointment.status)}
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">{appointment.practitioner.fullName}</p>
              {appointment.practitioner.specialty && (
                <p className="text-xs text-gray-500">{appointment.practitioner.specialty}</p>
              )}
            </div>
          </div>

          {appointment.appointmentType && (
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{appointment.appointmentType}</span>
            </div>
          )}

          {appointment.notes && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
              <span className="font-medium">Notes:</span> {appointment.notes}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
        <p className="text-sm text-red-800">{error}</p>
        <button
          onClick={fetchAppointments}
          className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 font-medium mb-1">No Appointments Yet</p>
        <p className="text-sm text-gray-500">Your appointments will appear here once scheduled by your doctor</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Upcoming Appointments ({upcomingAppointments.length})
          </h3>
          <div className="grid gap-4">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.appointmentId} appointment={appointment} />
            ))}
          </div>
        </div>
      )}

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            Past Appointments ({pastAppointments.length})
          </h3>
          <div className="grid gap-4">
            {pastAppointments.slice(0, 5).map((appointment) => (
              <AppointmentCard key={appointment.appointmentId} appointment={appointment} />
            ))}
          </div>
          {pastAppointments.length > 5 && (
            <p className="text-sm text-gray-500 text-center mt-4">
              Showing 5 of {pastAppointments.length} past appointments
            </p>
          )}
        </div>
      )}
    </div>
  );
}

