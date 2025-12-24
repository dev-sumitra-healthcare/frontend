'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCoordinatorAppointmentsByDate,
  type CoordinatorAppointment
} from '@/lib/api';
import { User, Clock, ArrowRight } from 'lucide-react';

// Status types for independent tracking
type StatusLevel = 'not-started' | 'under-process' | 'done';
type PatientStatus = 'waiting' | 'in-progress' | 'completed';

interface QueuePatient {
  appointmentId: string;
  patientId: string;
  patientName: string;
  uhid: string;
  age: number;
  gender: string;
  appointmentTime: string;
  // Independent status tracking
  paymentStatus: StatusLevel;
  vitalsStatus: StatusLevel;
  status: PatientStatus;
}

// Status colors: White (not started), Orange (under process), Green (done)
const getStatusColor = (status: StatusLevel): string => {
  switch (status) {
    case 'not-started':
      return 'bg-white border-2 border-gray-300'; // White with border
    case 'under-process':
      return 'bg-orange-400'; // Orange
    case 'done':
      return 'bg-green-500'; // Green
    default:
      return 'bg-white border-2 border-gray-300';
  }
};

const getStatusLabel = (status: StatusLevel): string => {
  switch (status) {
    case 'not-started':
      return 'Not Started';
    case 'under-process':
      return 'Under Process';
    case 'done':
      return 'Done';
    default:
      return 'Unknown';
  }
};

// Status indicator component
const StatusIndicator = ({ label, status }: { label: string; status: StatusLevel }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded-full ${getStatusColor(status)}`} title={getStatusLabel(status)} />
    <span className="text-[13px] text-[#475467]">{label}</span>
  </div>
);

export default function CoordinatorDashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<QueuePatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const today = new Date();

  useEffect(() => {
    loadTodayAppointments();
  }, []);

  const loadTodayAppointments = async () => {
    try {
      setLoading(true);
      setError('');

      // Format today's date
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const response = await getCoordinatorAppointmentsByDate(dateStr);

      if (response.data.success) {
        const appointments = response.data.data.appointments || [];
        
        // Transform appointments to queue patients
        const queuePatients: QueuePatient[] = appointments.map((apt: CoordinatorAppointment) => {
          // Determine overall status based on appointment status
          let status: PatientStatus = 'waiting';
          if (apt.status === 'In-Consultation' || apt.status === 'Documentation-Pending') {
            status = 'in-progress';
          } else if (apt.status === 'Completed') {
            status = 'completed';
          }

          // Determine Payment and Vitals status independently
          // For now, derive from appointment status (can be enhanced with actual API data)
          let paymentStatus: StatusLevel = 'not-started';
          let vitalsStatus: StatusLevel = 'not-started';

          if (apt.status === 'In-Consultation') {
            // Both should be at least under process
            paymentStatus = 'under-process';
            vitalsStatus = 'under-process';
          } else if (apt.status === 'Documentation-Pending' || apt.status === 'Completed') {
            // Both done
            paymentStatus = 'done';
            vitalsStatus = 'done';
          }

          return {
            appointmentId: apt.appointmentId,
            patientId: apt.patient.id,
            patientName: apt.patient.fullName,
            uhid: apt.patient.uhid,
            age: 0,
            gender: 'Unknown',
            appointmentTime: new Date(apt.scheduledTime).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }),
            paymentStatus,
            vitalsStatus,
            status
          };
        });

        setPatients(queuePatients);
      }
    } catch (err: any) {
      console.error('Failed to load appointments:', err);
      setError(err.response?.data?.message || 'Failed to load patient queue');
    } finally {
      setLoading(false);
    }
  };

  const waitingPatients = patients.filter(p => p.status === 'waiting');
  const inProgressPatients = patients.filter(p => p.status === 'in-progress');
  const completedPatients = patients.filter(p => p.status === 'completed');

  const handleGoToPatient = (patient: QueuePatient) => {
    router.push(`/coordinator/dashboard/pre-encounter/${patient.appointmentId}`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Render a patient card
  const PatientCard = ({ patient, showGoButton = true }: { patient: QueuePatient; showGoButton?: boolean }) => (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-[48px] h-[48px] rounded-full bg-[#e5e7eb] flex items-center justify-center">
          <User className="w-6 h-6 text-[#9ca3af]" />
        </div>
        
        {/* Patient Info */}
        <div>
          <h4 className="text-[16px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {patient.patientName}
          </h4>
          <p className="text-[14px] text-[#475467]" style={{ fontFamily: 'Inter, sans-serif' }}>
            UHID: {patient.uhid}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-[13px] text-[#475467]">
              <Clock className="w-4 h-4" />
              {patient.appointmentTime}
            </span>
            {/* Payment Status Indicator */}
            <StatusIndicator label="Payment" status={patient.paymentStatus} />
            {/* Vitals Status Indicator */}
            <StatusIndicator label="Vitals" status={patient.vitalsStatus} />
          </div>
        </div>
      </div>
      
      {/* Go Button */}
      {showGoButton && (
        <button
          onClick={() => handleGoToPatient(patient)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-[14px] font-medium"
        >
          Go
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-5 w-32 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white rounded-[16px] p-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg mb-4 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-[16px] border border-red-200 p-8 text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={loadTodayAppointments}
          className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Status Counts */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[24px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
            OPD - Patient Queue
          </h2>
          <p className="text-[14px] text-[#475467]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Today: {formatDate(today)}
          </p>
        </div>
        
        {/* Status Legend */}
        <div className="flex flex-col gap-2 text-[12px] text-[#475467]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-300" />
            <span>Not Started</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-400" />
            <span>Under Process</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Done</span>
          </div>
        </div>
        
        {/* Status Counts */}
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-[14px] text-[#475467]" style={{ fontFamily: 'Inter, sans-serif' }}>Waiting</p>
            <p className="text-[24px] font-bold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {waitingPatients.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[14px] text-[#475467]" style={{ fontFamily: 'Inter, sans-serif' }}>In Progress</p>
            <p className="text-[24px] font-bold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {inProgressPatients.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[14px] text-[#475467]" style={{ fontFamily: 'Inter, sans-serif' }}>Completed</p>
            <p className="text-[24px] font-bold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {completedPatients.length}
            </p>
          </div>
        </div>
      </div>

      {/* Waiting Queue Section */}
      <div className="bg-white rounded-[16px] shadow-sm overflow-hidden">
        <div className="bg-[#fef9e7] px-6 py-3">
          <h3 className="text-[16px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Waiting Queue ({waitingPatients.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {waitingPatients.length === 0 ? (
            <div className="px-6 py-8 text-center text-[#475467]">
              No patients currently waiting
            </div>
          ) : (
            waitingPatients.map((patient) => (
              <PatientCard key={patient.appointmentId} patient={patient} />
            ))
          )}
        </div>
      </div>

      {/* In Progress Section */}
      {inProgressPatients.length > 0 && (
        <div className="bg-white rounded-[16px] shadow-sm overflow-hidden">
          <div className="bg-[#e8f4fd] px-6 py-3">
            <h3 className="text-[16px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
              In Progress ({inProgressPatients.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {inProgressPatients.map((patient) => (
              <PatientCard key={patient.appointmentId} patient={patient} showGoButton={false} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Section */}
      {completedPatients.length > 0 && (
        <div className="bg-white rounded-[16px] shadow-sm overflow-hidden">
          <div className="bg-[#e8fdf5] px-6 py-3">
            <h3 className="text-[16px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Completed ({completedPatients.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {completedPatients.map((patient) => (
              <PatientCard key={patient.appointmentId} patient={patient} showGoButton={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
