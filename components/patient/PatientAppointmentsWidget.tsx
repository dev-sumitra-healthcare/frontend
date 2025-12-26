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
        className: 'patient-badge patient-badge-pending',
        label: 'Scheduled'
      },
      confirmed: {
        icon: <CheckCircle className="w-3 h-3" />,
        className: 'patient-badge patient-badge-success',
        label: 'Confirmed'
      },
      completed: {
        icon: <CheckCircle className="w-3 h-3" />,
        className: 'patient-badge bg-gray-100 text-gray-700',
        label: 'Completed'
      },
      cancelled: {
        icon: <XCircle className="w-3 h-3" />,
        className: 'patient-badge patient-badge-danger',
        label: 'Cancelled'
      },
      'no-show': {
        icon: <AlertCircle className="w-3 h-3" />,
        className: 'patient-badge patient-badge-warning',
        label: 'No Show'
      }
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.scheduled;
    
    return (
      <span className={config.className}>
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
      <div className="patient-appointment-card">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="patient-icon-container patient-icon-outlined w-10 h-10">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="patient-heading-4 font-medium">{dateStr}</p>
                <p className="text-[#008236] font-medium text-sm">{timeStr}</p>
              </div>
            </div>
          </div>
          {getStatusBadge(appointment.status)}
        </div>

        <div className="space-y-3 pt-3 border-t border-[#f3e8ff]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#f3e8ff] flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-[#9810fa]" />
            </div>
            <div>
              <p className="patient-heading-4 font-medium">{appointment.practitioner.fullName}</p>
              {appointment.practitioner.specialty && (
                <p className="patient-body-sm">{appointment.practitioner.specialty}</p>
              )}
            </div>
          </div>

          {appointment.appointmentType && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#f3e8ff] flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-[#9810fa]" />
              </div>
              <p className="patient-body">{appointment.appointmentType}</p>
            </div>
          )}

          {appointment.notes && (
            <div className="mt-3 p-3 bg-[#faf5ff] rounded-lg">
              <p className="patient-body-sm">
                <span className="font-medium text-[#101828]">Notes:</span> {appointment.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#9810fa] animate-spin mx-auto mb-3" />
          <p className="patient-body-sm">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 patient-card p-6">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <p className="patient-heading-4 font-medium text-red-800 mb-2">Error Loading Appointments</p>
        <p className="patient-body-sm text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchAppointments}
          className="patient-btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="patient-icon-container patient-icon-outlined mx-auto mb-4 w-16 h-16">
          <Calendar className="w-8 h-8" />
        </div>
        <p className="patient-heading-4 font-medium mb-2">No Appointments Yet</p>
        <p className="patient-body-sm max-w-sm mx-auto">
          Your appointments will appear here once scheduled by your doctor
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="patient-icon-container patient-icon-outlined w-8 h-8">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="patient-heading-4 font-semibold">
              Upcoming ({upcomingAppointments.length})
            </h3>
          </div>
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
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
            <h3 className="patient-heading-4 font-semibold text-gray-600">
              Past ({pastAppointments.length})
            </h3>
          </div>
          <div className="grid gap-4 opacity-75">
            {pastAppointments.slice(0, 5).map((appointment) => (
              <AppointmentCard key={appointment.appointmentId} appointment={appointment} />
            ))}
          </div>
          {pastAppointments.length > 5 && (
            <p className="patient-body-sm text-center mt-4">
              Showing 5 of {pastAppointments.length} past appointments
            </p>
          )}
        </div>
      )}
    </div>
  );
}
