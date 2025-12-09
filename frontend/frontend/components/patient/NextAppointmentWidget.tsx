"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Stethoscope, ArrowRight } from "lucide-react";
import { getPatientNextAppointment } from "@/lib/api";
import Link from "next/link";

interface NextAppointment {
  appointmentId: string;
  scheduledTime: string;
  appointmentType: string;
  status: string;
  doctor: {
    id?: string;
    fullName: string;
    specialty?: string;
  };
  hospital: {
    id?: string;
    name: string;
    address?: string;
    city?: string;
  };
}

export function NextAppointmentWidget() {
  const [appointment, setAppointment] = useState<NextAppointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNextAppointment();
  }, []);

  const fetchNextAppointment = async () => {
    try {
      const response = await getPatientNextAppointment();
      if (response.data.status === 'success') {
        setAppointment(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching next appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-IN', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-200 animate-pulse">
        <CardContent className="p-6">
          <div className="h-24 bg-gray-100 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  // No appointment - Show "Book Now" CTA
  if (!appointment) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Stethoscope className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Feeling unwell?
                </h3>
                <p className="text-sm text-gray-600">
                  Book a consultation with top doctors near you
                </p>
              </div>
            </div>
            <Link href="/patient/book">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25">
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Has upcoming appointment
  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-emerald-600" />
          <h3 className="font-semibold text-emerald-800">Upcoming Visit</h3>
          <span className="ml-auto text-sm font-medium text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
            {appointment.status}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Date & Time */}
          <div className="flex items-center gap-4 bg-white/60 rounded-xl p-4 flex-1">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-700">
                {formatDate(appointment.scheduledTime)}
              </div>
              <div className="flex items-center gap-1 text-gray-600 mt-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{formatTime(appointment.scheduledTime)}</span>
              </div>
            </div>
          </div>

          {/* Doctor Info */}
          <div className="flex items-center gap-4 flex-1">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <User className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{appointment.doctor.fullName}</p>
              <p className="text-sm text-gray-600">
                {appointment.doctor.specialty || appointment.appointmentType}
              </p>
            </div>
          </div>

          {/* Hospital Info */}
          <div className="flex items-center gap-4 flex-1">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{appointment.hospital.name}</p>
              <p className="text-sm text-gray-600">
                {appointment.hospital.city || 'Location'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-emerald-200">
          <Button variant="outline" className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
            <MapPin className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
          <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">
            <Calendar className="h-4 w-4 mr-2" />
            Reschedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
