"use client";

import { useEffect, useState } from 'react';
import { Calendar, Clock, User, Loader2, ArrowRight } from 'lucide-react';
import { getPatientNextAppointment, NextAppointmentData } from '@/lib/api';
import Link from 'next/link';

export function NextAppointmentWidget() {
  const [nextAppointment, setNextAppointment] = useState<NextAppointmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNextAppointment = async () => {
      try {
        setLoading(true);
        const response = await getPatientNextAppointment();
        if (response.data?.status === 'success' && response.data?.data) {
          setNextAppointment(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching next appointment:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNextAppointment();
  }, []);

  if (loading) {
    return (
      <div className="patient-card p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-[#9810fa] animate-spin" />
        </div>
      </div>
    );
  }

  if (!nextAppointment) {
    return (
      <div className="patient-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="patient-heading-4 font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#9810fa]" />
            Next Appointment
          </h3>
        </div>
        <div className="text-center py-6">
          <div className="patient-icon-container patient-icon-outlined mx-auto mb-4 w-14 h-14">
            <Calendar className="w-7 h-7" />
          </div>
          <p className="patient-body-sm mb-4">No upcoming appointments scheduled</p>
          <Link href="/patient/book">
            <button className="patient-btn-secondary">
              Book Appointment
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const appointmentDate = new Date(nextAppointment.scheduledTime);
  const dateStr = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = appointmentDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Calculate days until appointment
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const appointmentDay = new Date(appointmentDate);
  appointmentDay.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((appointmentDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const daysLabel = diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : `In ${diffDays} days`;

  return (
    <div className="patient-card-elevated p-6 bg-gradient-to-br from-white to-[#faf5ff]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="patient-heading-4 font-semibold flex items-center gap-2">
          <div className="patient-icon-container patient-icon-primary w-8 h-8">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          Next Appointment
        </h3>
        <span className="patient-badge patient-badge-success">
          {daysLabel}
        </span>
      </div>

      <div className="space-y-4">
        {/* Date & Time */}
        <div className="flex items-start gap-4">
          <div className="p-4 rounded-xl bg-[#9810fa] text-white text-center min-w-[80px]">
            <p className="text-2xl font-bold">{appointmentDate.getDate()}</p>
            <p className="text-sm opacity-90">
              {appointmentDate.toLocaleDateString('en-US', { month: 'short' })}
            </p>
          </div>
          <div className="flex-1">
            <p className="patient-heading-3">{dateStr}</p>
            <p className="text-[#008236] font-semibold text-lg flex items-center gap-2 mt-1">
              <Clock className="w-5 h-5" />
              {timeStr}
            </p>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[#f3e8ff]">
          <div className="w-12 h-12 rounded-full bg-[#f3e8ff] flex items-center justify-center">
            <User className="w-6 h-6 text-[#9810fa]" />
          </div>
          <div className="flex-1">
            <p className="patient-heading-4 font-semibold">{nextAppointment.doctor.fullName}</p>
            {nextAppointment.doctor.specialty && (
              <p className="patient-body-sm">{nextAppointment.doctor.specialty}</p>
            )}
          </div>
        </div>

        {/* Hospital */}
        {nextAppointment.hospital && (
          <div className="flex items-center gap-2 text-[#475467]">
            <span className="patient-body">At: </span>
            <span className="patient-heading-4 font-medium">
              {nextAppointment.hospital.name}
              {nextAppointment.hospital.city && `, ${nextAppointment.hospital.city}`}
            </span>
          </div>
        )}

        {/* Appointment Type */}
        {nextAppointment.appointmentType && (
          <div className="flex items-center gap-2 text-[#475467]">
            <span className="patient-body">Type: </span>
            <span className="patient-badge bg-[#f3e8ff] text-[#9810fa]">
              {nextAppointment.appointmentType}
            </span>
          </div>
        )}

        {/* Action Button */}
        <Link href="/patient/book" className="block">
          <button className="patient-btn-secondary w-full flex items-center justify-center gap-2">
            Manage Appointment
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </div>
  );
}
