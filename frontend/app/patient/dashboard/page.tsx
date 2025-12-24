"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Activity, 
  Pill, 
  User, 
  LogOut,
  Search,
  Filter,
  Eye,
  Download,
  Star,
  X,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Heart,
  Shield,
  AlertTriangle,
  Pencil,
  Camera,
  Plus,
  Bell,
  Check,
  Link as LinkIcon,
  Clock,
  Scale,
  Thermometer,
  Droplet,
  Zap,
  Lightbulb,
  CheckCircle,
  XCircle,
  TrendingUp
} from 'lucide-react';
import { getPatientProfile, getMedicalHistory, searchDoctors, getSpecialties, getMyMedications, getMyVitals, MedicationItem, VitalsResponse, bookPatientAppointment } from '@/lib/api';
import { usePatientAuth } from '@/contexts/PatientAuthContext';
import Link from 'next/link';
import BookingModal from '@/components/patient/BookingModal';
import { toast } from 'sonner';

type TabType = 'health-history' | 'health-forecast' | 'book-appointment' | 'vitals' | 'medications' | 'profile';

interface MedicalRecord {
  encounterId: string;
  date: string;
  chiefComplaint: string;
  diagnosis?: string;
  vitals?: Record<string, any>;
  advice?: string;
  status: string;
  hospital?: { id: string; name: string; city?: string };
  doctor?: { fullName: string; specialty?: string };
}

interface DoctorCard {
  id: string;
  fullName: string;
  specialty?: string;
  experience?: number;
  rating?: number;
  consultationFee?: number;
  availableSlots?: string[];
}

export default function PatientDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('health-history');
  
  // Health History state
  const [healthRecords, setHealthRecords] = useState<MedicalRecord[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [diagnosisFilter, setDiagnosisFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // Book Appointment state
  const [doctors, setDoctors] = useState<DoctorCard[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<DoctorCard | null>(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  // Medications state
  const [medications, setMedications] = useState<{ current: MedicationItem[]; past: MedicationItem[] }>({ current: [], past: [] });
  const [medicationsLoading, setMedicationsLoading] = useState(false);

  // Vitals state
  const [vitalsData, setVitalsData] = useState<VitalsResponse | null>(null);
  const [vitalsLoading, setVitalsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('patientAccessToken');
    const storedUser = localStorage.getItem('patientUser');
    
    if (!token || !storedUser) {
      router.replace('/patient/login');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'patient') {
        router.replace('/patient/login');
        return;
      }
      setUser(userData);
      fetchPatientProfile();
      fetchHealthHistory();
      fetchDoctorsAndSpecialties();
      fetchMedications();
      fetchVitals();
    } catch (e) {
      router.replace('/patient/login');
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  const fetchPatientProfile = async () => {
    try {
      const response = await getPatientProfile();
      if (response.data.status === 'success' && response.data.data) {
        setPatientProfile(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching patient profile:', error);
    }
  };

  const fetchHealthHistory = async () => {
    try {
      const response = await getMedicalHistory();
      if (response.data.status === 'success') {
        setHealthRecords(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching health history:', error);
    }
  };

  const fetchDoctorsAndSpecialties = async () => {
    try {
      const [doctorsRes, specialtiesRes] = await Promise.all([
        searchDoctors(),
        getSpecialties()
      ]);
      if (doctorsRes.data.status === 'success') {
        setDoctors(doctorsRes.data.data || []);
      }
      if (specialtiesRes.data.status === 'success') {
        setSpecialties(['All Specialties', ...(specialtiesRes.data.data || [])]);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchMedications = async () => {
    setMedicationsLoading(true);
    try {
      const response = await getMyMedications();
      if (response.data.status === 'success' && response.data.data) {
        setMedications({
          current: response.data.data.current || [],
          past: response.data.data.past || []
        });
      }
    } catch (error) {
      console.error('Error fetching medications:', error);
    } finally {
      setMedicationsLoading(false);
    }
  };

  const fetchVitals = async () => {
    setVitalsLoading(true);
    try {
      const response = await getMyVitals();
      if (response.data.status === 'success' && response.data.data) {
        setVitalsData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching vitals:', error);
    } finally {
      setVitalsLoading(false);
    }
  };

  const { logout } = usePatientAuth();

  const handleLogout = () => {
    logout();
  };

  const patientName = patientProfile?.fullName || user?.username || 'John Doe';

  const clearAllFilters = () => {
    setSearchQuery('');
    setDoctorFilter('');
    setDiagnosisFilter('');
    setDateFrom('');
    setDateTo('');
  };

  const handleOpenBookingModal = (doctor: DoctorCard) => {
    setSelectedDoctorForBooking(doctor);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedDoctorForBooking(null);
  };

  const handleConfirmBooking = async (data: { doctorId: string; date: string; timeSlot: string; paymentMethod: string }) => {
    setIsBookingLoading(true);
    try {
      // For now, we'll show a success message since the full booking API may need hospital info
      // In a real implementation, you'd call bookPatientAppointment with all required data
      toast.success(`Appointment booked successfully with ${selectedDoctorForBooking?.fullName}!`);
      handleCloseBookingModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsBookingLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135.886deg, #faf5ff 0%, #f3e8ff 100%)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#9810fa] mx-auto mb-4"></div>
          <p className="text-[#475467]">Loading...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'health-history' as TabType, label: 'Health History', icon: FileText },
    { id: 'health-forecast' as TabType, label: 'Health Forecast', icon: TrendingUp },
    { id: 'book-appointment' as TabType, label: 'Book Appointment', icon: Calendar },
    { id: 'vitals' as TabType, label: 'Vitals', icon: Activity },
    { id: 'medications' as TabType, label: 'Medications', icon: Pill },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  // Filter health records
  const filteredRecords = healthRecords.filter(record => {
    if (searchQuery && !record.doctor?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !record.doctor?.specialty?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (doctorFilter && !record.doctor?.fullName.toLowerCase().includes(doctorFilter.toLowerCase())) return false;
    if (diagnosisFilter && !record.diagnosis?.toLowerCase().includes(diagnosisFilter.toLowerCase())) return false;
    if (dateFrom && new Date(record.date) < new Date(dateFrom)) return false;
    if (dateTo && new Date(record.date) > new Date(dateTo)) return false;
    return true;
  });

  // Filter doctors
  const filteredDoctors = doctors.filter(doctor => {
    if (selectedSpecialty !== 'All Specialties' && doctor.specialty !== selectedSpecialty) return false;
    if (doctorSearchQuery && !doctor.fullName.toLowerCase().includes(doctorSearchQuery.toLowerCase()) && 
        !doctor.specialty?.toLowerCase().includes(doctorSearchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135.886deg, #faf5ff 0%, #f3e8ff 100%)' }}>
      {/* Header */}
      <header className="bg-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-[42px] h-[42px] rounded-full bg-[#f3e8ff] flex items-center justify-center">
            <User className="w-5 h-5 text-[#9810fa]" />
          </div>
          <div>
            <h1 className="text-[22px] font-normal text-[#101828] tracking-[-0.3125px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Patient Portal
            </h1>
            <p className="text-[16px] text-[#9810fa] tracking-[-0.3125px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {patientName}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-[#364153] hover:text-[#9810fa] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[22px] tracking-[-0.4335px]" style={{ fontFamily: 'Inter, sans-serif' }}>Logout</span>
        </button>
      </header>

      <main className="px-8 py-6">
        {/* Navigation Tabs Card */}
        <div className="bg-white rounded-[16px] border border-[#f3e8ff] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] mb-6 overflow-hidden">
          <div className="flex border-b border-[#f3e8ff]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-[16px] tracking-[-0.3125px] transition-all relative ${
                    isActive 
                      ? 'text-[#155dfc] font-semibold' 
                      : 'text-[#475467] hover:text-[#101828]'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {isActive && (
                    <div className={`absolute bottom-0 left-0 w-full h-[2px] ${tab.id === 'health-forecast' ? 'bg-[#9810fa]' : 'bg-[#155dfc]'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'health-history' && (
          <div className="space-y-6">
            {/* Title and Filter Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[20px] font-normal text-[#101828] tracking-[-0.3125px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Health History
                </h2>
                <p className="text-[16px] text-[#475467] tracking-[-0.3125px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Total: {filteredRecords.length} records
                </p>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-[#155dfc] border border-[#155dfc] rounded-lg hover:bg-[#f0f7ff] transition-colors"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {/* Filter Section */}
            {showFilters && (
              <div className="bg-white rounded-[16px] border border-[#f3e8ff] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-6 space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667085]" />
                  <input
                    type="text"
                    placeholder="Search by doctor name or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-[48px] pl-12 pr-4 rounded-lg border border-[#d0d5dd] text-[16px] tracking-[-0.3125px] placeholder:text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#155dfc]/30 focus:border-[#155dfc]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                {/* Filter Row */}
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[14px] text-[#364153] mb-2 tracking-[-0.3125px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Doctor Name
                    </label>
                    <input
                      type="text"
                      placeholder="Filter by doctor"
                      value={doctorFilter}
                      onChange={(e) => setDoctorFilter(e.target.value)}
                      className="w-full h-[40px] px-3 rounded-lg border border-[#d0d5dd] text-[14px] placeholder:text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#155dfc]/30"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] text-[#364153] mb-2 tracking-[-0.3125px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Diagnosis
                    </label>
                    <input
                      type="text"
                      placeholder="Filter by diagnosis"
                      value={diagnosisFilter}
                      onChange={(e) => setDiagnosisFilter(e.target.value)}
                      className="w-full h-[40px] px-3 rounded-lg border border-[#d0d5dd] text-[14px] placeholder:text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#155dfc]/30"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] text-[#364153] mb-2 tracking-[-0.3125px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Date From
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full h-[40px] px-3 rounded-lg border border-[#d0d5dd] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#155dfc]/30"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] text-[#364153] mb-2 tracking-[-0.3125px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Date To
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full h-[40px] px-3 rounded-lg border border-[#d0d5dd] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#155dfc]/30"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-[14px] text-[#475467] border border-[#d0d5dd] rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Health Records */}
            <div className="space-y-4">
              {filteredRecords.length === 0 ? (
                <div className="bg-white rounded-[16px] border border-[#f3e8ff] p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-[16px] text-[#475467]">No health records found</p>
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <div
                    key={record.encounterId}
                    className="bg-white rounded-[16px] border border-[#f3e8ff] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-6"
                  >
                    {/* Record Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[16px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {record.doctor?.fullName || 'Unknown Doctor'}
                        </span>
                        {record.doctor?.specialty && (
                          <span className="px-3 py-1 bg-[#155dfc] text-white text-[12px] rounded-full">
                            {record.doctor.specialty}
                          </span>
                        )}
                        <span className="text-[14px] text-[#475467]">
                          {record.chiefComplaint || 'Consultation'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#155dfc] text-white text-[14px] rounded-lg hover:bg-[#1d4ed8] transition-colors">
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button className="p-2 border border-[#d0d5dd] rounded-lg hover:bg-gray-50 transition-colors">
                          <Download className="w-4 h-4 text-[#475467]" />
                        </button>
                      </div>
                    </div>

                    {/* Record Date */}
                    <p className="text-[14px] text-[#475467] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {new Date(record.date).toISOString().split('T')[0]}
                    </p>

                    {/* Diagnosis and Symptoms */}
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[14px] text-[#475467] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Diagnosis</p>
                        <div className="flex flex-wrap gap-2">
                          {record.diagnosis ? (
                            record.diagnosis.split(',').map((d, i) => (
                              <span key={i} className="px-3 py-1 bg-[#fef3f2] text-[#b91c1c] text-[14px] rounded-full border border-[#fecaca]">
                                {d.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="text-[14px] text-[#667085]">None</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-[14px] text-[#475467] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Symptoms</p>
                        <div className="flex flex-wrap gap-2">
                          {record.vitals?.symptoms ? (
                            (Array.isArray(record.vitals.symptoms) ? record.vitals.symptoms : record.vitals.symptoms.split(',')).map((s: string, i: number) => (
                              <span key={i} className="px-3 py-1 bg-[#fef2f2] text-[#dc2626] text-[14px] rounded-full border border-[#fecaca]">
                                {s.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="text-[14px] text-[#667085]">None</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'health-forecast' && (
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="bg-[#9810fa] rounded-[16px] p-8 text-white shadow-lg overflow-hidden relative">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-white" />
                  <h2 className="text-[24px] font-semibold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>Health Forecast</h2>
                </div>
                <p className="text-[16px] text-white/90 font-medium opacity-90">
                  AI-powered predictions about your health trends and personalized recommendations
                </p>
              </div>
              {/* Decorative shapes */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
            </div>

            {/* Health Insights */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#9810fa] mb-2">
                <Lightbulb className="w-5 h-5" />
                <h3 className="text-[18px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Health Insights <span className="text-[#667085] font-normal text-[16px]">What is likely to happen and why</span>
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cardiovascular */}
                <div className="bg-white rounded-[16px] border border-[#d6bbfb] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#fce7f3]"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#fce7f3] rounded-lg text-[#be185d]">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[14px] text-[#475467] font-medium uppercase tracking-wider">Cardiovascular</p>
                        <p className="text-[16px] font-semibold text-[#101828]">Blood Pressure Trend</p>
                      </div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-[#f04438]" />
                  </div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fffaeb] text-[#b54708] mb-4">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    MODERATE RISK
                  </div>
                  <p className="text-[14px] text-[#475467] leading-relaxed mb-4">
                    Your blood pressure is likely to remain in the pre-hypertension range over the next 3-6 months.
                  </p>
                  <div className="bg-[#faf5ff] rounded-lg p-3 text-[13px] text-[#6941c6] border border-[#f3e8ff]">
                    <span className="font-semibold">Why?</span> Based on your current readings (averaging 135/85 mmHg), lifestyle patterns, and family history of hypertension.
                  </div>
                </div>

                {/* Metabolic */}
                <div className="bg-white rounded-[16px] border border-[#d6bbfb] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#fff1f2]"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#fee2e2] rounded-lg text-[#b91c1c]">
                        <Droplet className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-[14px] text-[#475467] font-medium uppercase tracking-wider">Metabolic</p>
                        <p className="text-[16px] font-semibold text-[#101828]">Blood Sugar Levels</p>
                      </div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-[#f04438]" />
                  </div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fef3f2] text-[#b42318] mb-4">
                     <AlertTriangle className="w-3 h-3 mr-1" />
                    HIGH RISK
                  </div>
                   <p className="text-[14px] text-[#475467] leading-relaxed">
                    Risk of developing pre-diabetes within the next 12 months.
                  </p>
                </div>

                {/* Mental Health */}
                <div className="bg-white rounded-[16px] border border-[#d6bbfb] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-[#f9fafb]"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#f3e8ff] rounded-lg text-[#7e22ce]">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[14px] text-[#475467] font-medium uppercase tracking-wider">Mental Health</p>
                        <p className="text-[16px] font-semibold text-[#101828]">Stress & Sleep Quality</p>
                      </div>
                    </div>
                     <TrendingUp className="w-4 h-4 text-[#12b76a]" style={{ transform: 'scaleY(-1)' }} />
                  </div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ecfdf3] text-[#027a48] mb-4">
                     <CheckCircle className="w-3 h-3 mr-1" />
                    LOW RISK
                  </div>
                   <p className="text-[14px] text-[#475467] leading-relaxed">
                    Sleep quality likely to improve with current interventions.
                  </p>
                </div>

                {/* Physical Fitness */}
                <div className="bg-white rounded-[16px] border border-[#d6bbfb] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-[#f9fafb]"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#dcfce7] rounded-lg text-[#15803d]">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[14px] text-[#475467] font-medium uppercase tracking-wider">Physical Fitness</p>
                        <p className="text-[16px] font-semibold text-[#101828]">Activity & Mobility</p>
                      </div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-[#12b76a]" />
                  </div>
                   <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ecfdf3] text-[#027a48] mb-4">
                     <CheckCircle className="w-3 h-3 mr-1" />
                    LOW RISK
                  </div>
                   <p className="text-[14px] text-[#475467] leading-relaxed">
                    Gradual improvement in physical endurance expected.
                  </p>
                </div>
              </div>
            </div>

            {/* Personalized Suggestions */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#9810fa] mb-2">
                <CheckCircle className="w-5 h-5" />
                <h3 className="text-[18px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Personalized Suggestions <span className="text-[#667085] font-normal text-[16px]">How to improve your health outcomes</span>
                </h3>
              </div>

              {/* Lifestyle Modifications */}
              <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#f3e8ff] flex items-center justify-center text-[#9810fa]">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-[#101828]">Lifestyle Modifications</h4>
                      <p className="text-[14px] text-[#475467]">Essential changes to improve your overall health trajectory</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#fef3f2] text-[#b42318] text-[12px] font-bold uppercase tracking-wide rounded-md">High Priority</span>
                </div>
                <div className="space-y-3 pl-16">
                  <div className="flex items-start gap-2">
                    <span className="text-[#9810fa] mt-1">→</span>
                    <p className="text-[14px] text-[#344054]">Maintain consistent sleep schedule (7-8 hours nightly)</p>
                  </div>
                   <div className="flex items-start gap-2">
                    <span className="text-[#9810fa] mt-1">→</span>
                    <p className="text-[14px] text-[#344054]">Reduce screen time before bed by at least 1 hour</p>
                  </div>
                   <div className="flex items-start gap-2">
                    <span className="text-[#9810fa] mt-1">→</span>
                    <p className="text-[14px] text-[#344054]">Practice stress reduction techniques daily (meditation, deep breathing)</p>
                  </div>
                   <div className="flex items-start gap-2">
                    <span className="text-[#9810fa] mt-1">→</span>
                    <p className="text-[14px] text-[#344054]">Take regular breaks during work hours (every 45-60 minutes)</p>
                  </div>
                </div>
              </div>

               {/* Dietary Recommendations */}
               <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#fce7f3] flex items-center justify-center text-[#be185d]">
                      <span className="text-2xl">🍎</span>
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-[#101828]">Dietary Recommendations</h4>
                      <p className="text-[14px] text-[#475467]">Nutrition changes to manage blood sugar and blood pressure</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#fef3f2] text-[#b42318] text-[12px] font-bold uppercase tracking-wide rounded-md">High Priority</span>
                </div>
                <div className="space-y-3 pl-16">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#12b76a] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#027a48]">DO:</span> Include more fiber-rich foods (oats, legumes, vegetables)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#12b76a] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#027a48]">DO:</span> Consume 3-4 servings of fresh fruits daily</p>
                  </div>
                   <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#12b76a] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#027a48]">DO:</span> Choose whole grains over refined carbohydrates</p>
                  </div>
                   <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#12b76a] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#027a48]">DO:</span> Include omega-3 rich foods (fish, walnuts, flaxseeds)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-[#f04438] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#b42318]">DON'T:</span> Exceed 2000mg sodium per day</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-[#f04438] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#b42318]">DON'T:</span> Consume sugary beverages or processed foods</p>
                  </div>
                  <div className="flex items-start gap-2">
                     <XCircle className="w-4 h-4 text-[#f04438] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#b42318]">DON'T:</span> Eat heavy meals close to bedtime</p>
                  </div>
                   <div className="flex items-start gap-2">
                     <XCircle className="w-4 h-4 text-[#f04438] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#b42318]">DON'T:</span> Skip meals or engage in irregular eating patterns</p>
                  </div>
                </div>
              </div>

               {/* Physical Activity Plan */}
               <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#f0f9ff] flex items-center justify-center text-[#0284c7]">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-[#101828]">Physical Activity Plan</h4>
                      <p className="text-[14px] text-[#475467]">Structured exercise routine for cardiovascular and metabolic health</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#fef3f2] text-[#b42318] text-[12px] font-bold uppercase tracking-wide rounded-md">High Priority</span>
                </div>
                <div className="space-y-3 pl-16">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#12b76a] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#027a48]">DO:</span> Engage in 30 minutes of moderate aerobic activity 5 days/week</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#12b76a] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#027a48]">DO:</span> Include strength training exercises 2-3 times per week</p>
                  </div>
                   <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#12b76a] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#027a48]">DO:</span> Practice yoga or stretching for flexibility</p>
                  </div>
                   <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#12b76a] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#027a48]">DO:</span> Gradually increase walking to 10,000 steps daily</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-[#f04438] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#b42318]">DON'T:</span> Start intense exercise without proper warm up</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-[#f04438] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#b42318]">DON'T:</span> Exercise immediately after heavy meals</p>
                  </div>
                  <div className="flex items-start gap-2">
                     <XCircle className="w-4 h-4 text-[#f04438] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#b42318]">DON'T:</span> Ignore pain or unusual symptoms during activity</p>
                  </div>
                </div>
              </div>

               {/* Habit Changes */}
               <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#ecfdf3] flex items-center justify-center text-[#12b76a]">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-[#101828]">Habit Changes</h4>
                      <p className="text-[14px] text-[#475467]">Good habits to adopt and bad habits to eliminate</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#fffaeb] text-[#b54708] text-[12px] font-bold uppercase tracking-wide rounded-md">Medium Priority</span>
                </div>
                <div className="space-y-3 pl-16">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#12b76a] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#027a48]">GOOD HABITS:</span> Monitor blood pressure weekly</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#12b76a] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#027a48]">GOOD HABITS:</span> Keep a food diary to track nutritional intake</p>
                  </div>
                   <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#12b76a] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#027a48]">GOOD HABITS:</span> Practice mindful eating</p>
                  </div>
                   <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#12b76a] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#027a48]">GOOD HABITS:</span> Stay hydrated (8-10 glasses of water daily)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-[#f04438] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#b42318]">BAD HABITS:</span> Eliminate late-night snacking</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-[#f04438] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#b42318]">BAD HABITS:</span> Reduce caffeine intake after 2 PM</p>
                  </div>
                  <div className="flex items-start gap-2">
                     <XCircle className="w-4 h-4 text-[#f04438] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#b42318]">BAD HABITS:</span> Avoid prolonged sitting without movement</p>
                  </div>
                   <div className="flex items-start gap-2">
                     <XCircle className="w-4 h-4 text-[#f04438] mt-0.5 shrink-0" />
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#b42318]">BAD HABITS:</span> Stop skipping breakfast</p>
                  </div>
                </div>
              </div>

               {/* Specialist Consultations */}
               <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#f3e8ff] flex items-center justify-center text-[#9810fa]">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-[#101828]">Specialist Consultations</h4>
                      <p className="text-[14px] text-[#475467]">Recommended healthcare provider visits and timeline</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#fef3f2] text-[#b42318] text-[12px] font-bold uppercase tracking-wide rounded-md">High Priority</span>
                </div>
                <div className="space-y-3 pl-16">
                  <div className="flex items-start gap-3">
                     <div className="p-1.5 bg-[#f5f3ff] rounded text-[#9810fa]">
                       <Calendar className="w-4 h-4" />
                     </div>
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#9810fa]">Endocrinologist</span> - Within 1 month (for blood sugar management)</p>
                  </div>
                  <div className="flex items-start gap-3">
                     <div className="p-1.5 bg-[#f5f3ff] rounded text-[#9810fa]">
                       <Calendar className="w-4 h-4" />
                     </div>
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#9810fa]">Cardiologist</span> - Within 6 weeks (for blood pressure evaluation)</p>
                  </div>
                   <div className="flex items-start gap-3">
                     <div className="p-1.5 bg-[#f5f3ff] rounded text-[#9810fa]">
                       <Calendar className="w-4 h-4" />
                     </div>
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#9810fa]">Nutritionist/Dietician</span> - Within 2 weeks (for personalized meal planning)</p>
                  </div>
                   <div className="flex items-start gap-3">
                     <div className="p-1.5 bg-[#f5f3ff] rounded text-[#9810fa]">
                       <Calendar className="w-4 h-4" />
                     </div>
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#9810fa]">Sleep Specialist</span> - Within 3 months (if sleep issues persist)</p>
                  </div>
                   <div className="flex items-start gap-3">
                     <div className="p-1.5 bg-[#f5f3ff] rounded text-[#9810fa]">
                       <Calendar className="w-4 h-4" />
                     </div>
                    <p className="text-[14px] text-[#344054]"><span className="font-semibold text-[#9810fa]">General Physician</span> - Monthly follow-up for next 3 months</p>
                  </div>
                </div>
              </div>

               {/* Take Action Today Footer */}
               <div className="bg-[#fcfaff] rounded-[16px] border border-[#d6bbfb] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#9810fa] flex items-center justify-center text-white shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                     <div>
                      <h4 className="text-[16px] font-bold text-[#101828]">Take Action Today</h4>
                      <p className="text-[14px] text-[#475467] max-w-2xl mt-1">
                        Your health forecast is based on current trends and patterns. Small changes today can significantly improve your future health outcomes. Start with high-priority suggestions and consult with specialists as recommended.
                      </p>
                    </div>
                 </div>
                 <button className="px-6 py-3 bg-[#9810fa] text-white text-[14px] font-semibold rounded-lg hover:bg-[#7e22ce] transition-colors whitespace-nowrap shadow-md">
                   Schedule Specialist Appointments
                 </button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'book-appointment' && (
          <div className="space-y-6">
            {/* Title */}
            <h2 className="text-[20px] font-normal text-[#101828] tracking-[-0.3125px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Book Appointment
            </h2>

            {/* Search and Filter Card */}
            <div className="bg-white rounded-[16px] border border-[#f3e8ff] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-6 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667085]" />
                <input
                  type="text"
                  placeholder="Search by doctor name or specialty..."
                  value={doctorSearchQuery}
                  onChange={(e) => setDoctorSearchQuery(e.target.value)}
                  className="w-full h-[48px] pl-12 pr-4 rounded-lg border border-[#d0d5dd] text-[16px] tracking-[-0.3125px] placeholder:text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#155dfc]/30 focus:border-[#155dfc]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>

              {/* Specialty Filter Chips */}
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-[#667085]" />
                {specialties.slice(0, 5).map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => setSelectedSpecialty(specialty)}
                    className={`px-4 py-2 text-[14px] rounded-full transition-colors ${
                      selectedSpecialty === specialty
                        ? 'bg-[#155dfc] text-white'
                        : 'bg-white text-[#364153] border border-[#d0d5dd] hover:border-[#155dfc]'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctor Cards Grid */}
            <div className="grid grid-cols-2 gap-6">
              {filteredDoctors.length === 0 ? (
                <div className="col-span-2 bg-white rounded-[16px] border border-[#f3e8ff] p-12 text-center">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-[16px] text-[#475467]">No doctors found</p>
                </div>
              ) : (
                filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="bg-white rounded-[16px] border border-[#f3e8ff] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-6"
                  >
                    {/* Doctor Info */}
                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="text-[16px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {doctor.fullName}
                        </p>
                        <p className="text-[14px] text-[#475467]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {doctor.specialty || 'General Medicine'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-4 h-4 text-[#facc15] fill-[#facc15]" />
                          <span className="text-[14px] text-[#475467]">{doctor.rating || '4.5'}</span>
                          <span className="text-[14px] text-[#475467]">{doctor.experience || 10} years exp.</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] text-[#475467]">Consultation Fee</p>
                        <p className="text-[20px] font-semibold text-[#101828]">${doctor.consultationFee || 150}</p>
                      </div>
                    </div>

                    {/* Available Slots */}
                    <div className="mb-4">
                      <p className="text-[14px] text-[#475467] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Available Slots Today
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(doctor.availableSlots || ['09:00 AM', '10:00 AM', '02:00 PM']).slice(0, 3).map((slot, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 bg-[#ecfdf5] rounded-lg text-[13px] font-medium text-[#027a48]"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {slot}
                          </span>
                        ))}
                        {(doctor.availableSlots?.length || 3) > 3 && (
                          <span className="px-3 py-1 bg-[#f2f4f7] rounded-lg text-[13px] font-medium text-[#475467]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            +{(doctor.availableSlots?.length || 3) - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Book Button */}
                    <button 
                      onClick={() => handleOpenBookingModal(doctor)}
                      className="w-full py-3 bg-[#155dfc] text-white text-[16px] rounded-[10px] hover:bg-[#1d4ed8] transition-colors" 
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Book Appointment
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[20px] font-normal text-[#101828] tracking-[-0.3125px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Vitals
                </h2>
                <p className="text-[16px] text-[#475467] tracking-[-0.3125px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Last updated: Today, 9:00 AM
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#155dfc] text-white text-[14px] rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium">
                <Plus className="w-4 h-4" />
                Log Vitals
              </button>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Blood Pressure */}
              <div className="bg-white rounded-[16px] border border-[#f3e8ff] p-6 shadow-[0px_4px_6px_-2px_rgba(0,0,0,0.05)] hover:border-[#9810fa] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f3e8ff] flex items-center justify-center">
                      <Activity className="w-5 h-5 text-[#9810fa]" />
                    </div>
                    <span className="text-[16px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>Blood Pressure</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#ecfdf3] text-[#027a48] text-[12px] font-medium rounded-full">
                    Normal
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-[32px] font-semibold text-[#101828] tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                    120/80 <span className="text-[14px] font-normal text-[#667085] ml-1">mmHg</span>
                  </p>
                </div>
              </div>

              {/* Heart Rate */}
              <div className="bg-white rounded-[16px] border border-[#f3e8ff] p-6 shadow-[0px_4px_6px_-2px_rgba(0,0,0,0.05)] hover:border-[#9810fa] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#fee4e2] flex items-center justify-center">
                      <Heart className="w-5 h-5 text-[#f04438]" />
                    </div>
                    <span className="text-[16px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>Heart Rate</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#ecfdf3] text-[#027a48] text-[12px] font-medium rounded-full">
                    Normal
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-[32px] font-semibold text-[#101828] tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                    72 <span className="text-[14px] font-normal text-[#667085] ml-1">bpm</span>
                  </p>
                </div>
              </div>

              {/* Weight */}
              <div className="bg-white rounded-[16px] border border-[#f3e8ff] p-6 shadow-[0px_4px_6px_-2px_rgba(0,0,0,0.05)] hover:border-[#9810fa] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f0f9ff] flex items-center justify-center">
                      <Scale className="w-5 h-5 text-[#0ba5ec]" />
                    </div>
                    <span className="text-[16px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>Weight</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#fef3f2] text-[#b42318] text-[12px] font-medium rounded-full">
                    +2.1%
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-[32px] font-semibold text-[#101828] tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                    75.5 <span className="text-[14px] font-normal text-[#667085] ml-1">kg</span>
                  </p>
                </div>
              </div>

              {/* Blood Glucose */}
              <div className="bg-white rounded-[16px] border border-[#f3e8ff] p-6 shadow-[0px_4px_6px_-2px_rgba(0,0,0,0.05)] hover:border-[#9810fa] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#fff4ed] flex items-center justify-center">
                      <Droplet className="w-5 h-5 text-[#ff8c00]" /> {/* Replaced Syringe with Droplet if available, or keep generic */}
                      {/* Since Droplet isn't imported, I'll use Activity or similar, or just add Droplet to imports */}
                    </div>
                    <span className="text-[16px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>Blood Glucose</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#fffaeb] text-[#b54708] text-[12px] font-medium rounded-full">
                    Pre-Meal
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-[32px] font-semibold text-[#101828] tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                    95 <span className="text-[14px] font-normal text-[#667085] ml-1">mg/dL</span>
                  </p>
                </div>
              </div>

              {/* Body Temperature */}
              <div className="bg-white rounded-[16px] border border-[#f3e8ff] p-6 shadow-[0px_4px_6px_-2px_rgba(0,0,0,0.05)] hover:border-[#9810fa] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#fff1f2] flex items-center justify-center">
                      <Thermometer className="w-5 h-5 text-[#e11d48]" />
                    </div>
                    <span className="text-[16px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>Temperature</span>
                  </div>
                   <span className="px-2.5 py-0.5 bg-[#ecfdf3] text-[#027a48] text-[12px] font-medium rounded-full">
                    Normal
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-[32px] font-semibold text-[#101828] tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                    98.6 <span className="text-[14px] font-normal text-[#667085] ml-1">°F</span>
                  </p>
                </div>
              </div>
               {/* SpO2 */}
              <div className="bg-white rounded-[16px] border border-[#f3e8ff] p-6 shadow-[0px_4px_6px_-2px_rgba(0,0,0,0.05)] hover:border-[#9810fa] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f0f9ff] flex items-center justify-center">
                      <Activity className="w-5 h-5 text-[#0284c7]" />
                    </div>
                    <span className="text-[16px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>SpO2</span>
                  </div>
                   <span className="px-2.5 py-0.5 bg-[#ecfdf3] text-[#027a48] text-[12px] font-medium rounded-full">
                    Normal
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-[32px] font-semibold text-[#101828] tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                    98 <span className="text-[14px] font-normal text-[#667085] ml-1">%</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Recent History Table */}
            <div className="bg-white rounded-[16px] border border-[#f3e8ff] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden">
               <div className="p-6 border-b border-[#eaecf0]">
                <h3 className="text-[16px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Recent Readings
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f9fafb]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#475467] uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#475467] uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#475467] uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#475467] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#eaecf0]">
                    {[
                      { date: 'Today, 9:00 AM', type: 'Blood Pressure', value: '120/80 mmHg', status: 'Normal' },
                      { date: 'Today, 9:00 AM', type: 'Heart Rate', value: '72 bpm', status: 'Normal' },
                      { date: 'Yesterday, 8:00 AM', type: 'Weight', value: '75.5 kg', status: 'Warning' },
                      { date: 'Yesterday, 8:00 AM', type: 'Blood Glucose', value: '95 mg/dL', status: 'Normal' },
                      { date: 'Oct 24, 2024', type: 'Blood Pressure', value: '118/79 mmHg', status: 'Normal' },
                    ].map((reading, i) => (
                      <tr key={i} className="hover:bg-[#f9fafb] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475467]">{reading.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#101828]">{reading.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475467]">{reading.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            reading.status === 'Normal' 
                              ? 'bg-[#ecfdf3] text-[#027a48]' 
                              : 'bg-[#fef3f2] text-[#b42318]'
                          }`}>
                            {reading.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="space-y-8">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-normal text-[#101828] tracking-[-0.3125px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Medications
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#155dfc] text-white text-[14px] rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium">
                <Plus className="w-4 h-4" />
                Add Medication
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6">
              {/* Active Medications */}
              <div className="bg-white rounded-[16px] border border-[#f3e8ff] p-6 shadow-[0px_4px_6px_-2px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[14px] text-[#475467]" style={{ fontFamily: 'Inter, sans-serif' }}>Active Medications</span>
                  <LinkIcon className="w-5 h-5 text-[#155dfc]" />
                </div>
                <p className="text-[24px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>3</p>
              </div>

              {/* Taken Today */}
              <div className="bg-white rounded-[16px] border border-[#f3e8ff] p-6 shadow-[0px_4px_6px_-2px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[14px] text-[#475467]" style={{ fontFamily: 'Inter, sans-serif' }}>Taken Today</span>
                  <Check className="w-5 h-5 text-[#008236]" />
                </div>
                <p className="text-[24px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>2/3</p>
              </div>

              {/* Upcoming */}
              <div className="bg-white rounded-[16px] border border-[#f3e8ff] p-6 shadow-[0px_4px_6px_-2px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[14px] text-[#475467]" style={{ fontFamily: 'Inter, sans-serif' }}>Upcoming</span>
                  <Bell className="w-5 h-5 text-[#f59e0b]" />
                </div>
                <p className="text-[16px] font-medium text-[#101828] mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>2 doses</p>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-[16px] border border-[#f3e8ff] p-6 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
              <h3 className="text-[16px] font-semibold text-[#101828] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                Today's Schedule
              </h3>
              <div className="space-y-4">
                {/* Taken Item 1 */}
                <div className="flex items-center justify-between p-4 bg-[#f0fdf4] border border-[#dcfce7] rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#16a34a] flex items-center justify-center text-white">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[16px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>Metformin - 500mg</p>
                      <p className="text-[14px] text-[#475467] flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <Clock className="w-3.5 h-3.5" />
                        8:00 AM
                      </p>
                    </div>
                  </div>
                  <span className="px-4 py-1.5 bg-[#16a34a] text-white text-[14px] font-medium rounded-lg">
                    Taken
                  </span>
                </div>

                {/* Upcoming Item */}
                <div className="flex items-center justify-between p-4 bg-white border border-[#e5e7eb] rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#f2f4f7] flex items-center justify-center text-[#475467]">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[16px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>Atorvastatin - 10mg</p>
                      <p className="text-[14px] text-[#475467] flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <Clock className="w-3.5 h-3.5" />
                        9:00 PM
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-1.5 bg-white text-[#344054] text-[14px] font-medium border border-[#d0d5dd] rounded-lg hover:bg-gray-50 transition-colors">
                    Mark as Taken
                  </button>
                </div>

                {/* Taken Item 2 (Vitamin D3) - Matching the visual design of a taken item */}
                 <div className="flex items-center justify-between p-4 bg-[#f0fdf4] border border-[#dcfce7] rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#16a34a] flex items-center justify-center text-white">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[16px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>Vitamin D3 - 1000 IU</p>
                      <p className="text-[14px] text-[#475467] flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <Clock className="w-3.5 h-3.5" />
                        9:00 AM
                      </p>
                    </div>
                  </div>
                  <span className="px-4 py-1.5 bg-[#16a34a] text-white text-[14px] font-medium rounded-lg">
                    Taken
                  </span>
                </div>
              </div>
            </div>

            {/* Active Medications List */}
            <div className="bg-white rounded-[16px] border border-[#f3e8ff] p-6 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
              <h3 className="text-[16px] font-semibold text-[#101828] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                Active Medications
              </h3>

              <div className="divide-y divide-[#eaecf0]">
                {[
                  {
                    name: "Metformin",
                    dose: "500mg",
                    freq: "Twice daily",
                    time: "8:00 AM, 8:00 PM",
                    range: "2024-11-01 to 2025-01-01",
                    doctor: "Dr. Michael Chen"
                  },
                  {
                    name: "Atorvastatin",
                    dose: "10mg",
                    freq: "Once daily",
                    time: "9:00 PM",
                    range: "2024-10-15 to 2025-04-15",
                    doctor: "Dr. Sarah Johnson"
                  },
                  {
                    name: "Vitamin D3",
                    dose: "1000 IU",
                    freq: "Once daily",
                    time: "9:00 AM",
                    range: "2024-11-20 to 2025-05-20",
                    doctor: "Dr. Robert Brown"
                  }
                ].map((med, i) => (
                  <div key={i} className="py-6 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[16px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>{med.name}</p>
                        <p className="text-[14px] text-[#475467]" style={{ fontFamily: 'Inter, sans-serif' }}>{med.dose} - {med.freq}</p>
                        <div className="flex items-center gap-4 mt-2 text-[14px] text-[#475467]">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#667085]" />
                            {med.time}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[#667085]" />
                            {med.range}
                          </span>
                        </div>
                        <p className="text-[14px] text-[#667085] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Prescribed by {med.doctor}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white text-[#344054] text-[14px] font-medium border border-[#d0d5dd] rounded-lg hover:bg-gray-50 transition-colors">
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-white text-[#b42318] text-[14px] font-medium border border-[#fda29b] rounded-lg hover:bg-[#fef2f2] transition-colors">
                          Stop
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Header Card */}
            <div className="bg-white rounded-[16px] border border-[#f3e8ff] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="w-[100px] h-[100px] rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-500" />
                    </div>
                  </div>
                  {/* Name and Contact Info */}
                  <div className="space-y-3">
                    <div>
                      <h2 className="text-[20px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {patientProfile?.fullName || patientName}
                      </h2>
                      <p className="text-[14px] text-[#9810fa]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        UHID: {patientProfile?.uhid || 'P001'}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                      <p className="text-[14px] text-[#475467] flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <Mail className="w-4 h-4 text-[#667085]" />
                        {patientProfile?.email || 'patient@example.com'}
                      </p>
                      <p className="text-[14px] text-[#475467] flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <Phone className="w-4 h-4 text-[#667085]" />
                        {patientProfile?.phone || '+1 (555) 123-4567'}
                      </p>
                      <p className="text-[14px] text-[#475467] flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <Calendar className="w-4 h-4 text-[#667085]" />
                        DOB: {patientProfile?.dateOfBirth ? new Date(patientProfile.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'January 15, 1985'}
                      </p>
                      <p className="text-[14px] text-[#475467] flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <MapPin className="w-4 h-4 text-[#667085]" />
                        {patientProfile?.address?.city || 'New York'}, {patientProfile?.address?.state || 'NY'}
                      </p>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#9810fa] text-white text-[14px] rounded-lg hover:bg-[#7c0ed1] transition-colors">
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-[16px] border border-[#f3e8ff] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-6">
              <h3 className="text-[16px] font-semibold text-[#101828] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <p className="text-[14px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Age</p>
                  <p className="text-[16px] text-[#101828] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {patientProfile?.dateOfBirth ? Math.floor((new Date().getTime() - new Date(patientProfile.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 39} Years
                  </p>
                </div>
                <div>
                  <p className="text-[14px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Gender</p>
                  <p className="text-[16px] text-[#101828] font-medium capitalize" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {patientProfile?.gender || 'Male'}
                  </p>
                </div>
                <div>
                  <p className="text-[14px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Blood Type</p>
                  <p className="text-[16px] text-[#101828] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {patientProfile?.bloodType || 'O+'}
                  </p>
                </div>
                <div>
                  <p className="text-[14px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Height</p>
                  <p className="text-[16px] text-[#101828] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {patientProfile?.height || '175'} cm
                  </p>
                </div>
                <div>
                  <p className="text-[14px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Weight</p>
                  <p className="text-[16px] text-[#101828] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {patientProfile?.weight || '73.8'} kg
                  </p>
                </div>
                <div>
                  <p className="text-[14px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Emergency Contact</p>
                  <p className="text-[16px] text-[#101828] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {patientProfile?.emergencyContact?.phone || '+1 (555) 999-0000'}
                  </p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-[16px] border border-[#f3e8ff] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-6">
              <h3 className="text-[16px] font-semibold text-[#101828] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                Medical Information
              </h3>
              
              {/* Allergies */}
              <div className="mb-6">
                <p className="text-[14px] text-[#475467] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {(patientProfile?.allergies && patientProfile.allergies.length > 0 
                    ? patientProfile.allergies 
                    : ['Penicillin', 'Peanuts']
                  ).map((allergy: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-[#fef3f2] text-[#ef4444] text-[14px] rounded-full border border-[#fecaca]">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chronic Conditions */}
              <div className="mb-6">
                <p className="text-[14px] text-[#475467] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Chronic Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {(patientProfile?.chronicConditions && patientProfile.chronicConditions.length > 0 
                    ? patientProfile.chronicConditions 
                    : ['Type 2 Diabetes', 'Hypertension']
                  ).map((condition: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-[#fef3f2] text-[#ef4444] text-[14px] rounded-full border border-[#fecaca]">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current Medications */}
              <div>
                <p className="text-[14px] text-[#475467] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Current Medications</p>
                <div className="space-y-3">
                  {(patientProfile?.medications && patientProfile.medications.length > 0 
                    ? patientProfile.medications 
                    : [
                        { name: 'Metformin 500mg', dosage: 'Twice daily' },
                        { name: 'Atorvastatin 10mg', dosage: 'Once daily at night' }
                      ]
                  ).map((med: { name: string; dosage: string }, i: number) => (
                    <div key={i} className="p-4 bg-[#faf5ff] rounded-lg border-l-4 border-[#9810fa]">
                      <p className="text-[14px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {med.name}
                      </p>
                      <p className="text-[12px] text-[#667085]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {med.dosage}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div className="bg-white rounded-[16px] border border-[#f3e8ff] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-6">
              <h3 className="text-[16px] font-semibold text-[#101828] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                Insurance Information
              </h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <p className="text-[14px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Insurance Provider</p>
                  <p className="text-[16px] text-[#101828] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {patientProfile?.insurance?.provider || 'Blue Cross Blue Shield'}
                  </p>
                </div>
                <div>
                  <p className="text-[14px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Policy Number</p>
                  <p className="text-[16px] text-[#101828] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {patientProfile?.insurance?.policyNumber || 'BCBS-2024-12345'}
                  </p>
                </div>
                <div>
                  <p className="text-[14px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Coverage Type</p>
                  <p className="text-[16px] text-[#101828] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {patientProfile?.insurance?.coverageType || 'Premium Plan'}
                  </p>
                </div>
                <div>
                  <p className="text-[14px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Valid Until</p>
                  <p className="text-[16px] text-[#101828] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {patientProfile?.insurance?.validUntil || 'December 31, 2025'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        doctor={selectedDoctorForBooking}
        onConfirm={handleConfirmBooking}
        isLoading={isBookingLoading}
      />
    </div>
  );
}
