"use client";

import { useState, useEffect } from "react";
import { Calendar, Search, Clock, User, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { searchPatients, bookDoctorAppointment, PatientListResponse } from "@/lib/api";
import { useRouter } from "next/navigation";

// Define Patient type based on API response
interface Patient {
  id: string;
  fullName: string;
  uhid: string;
  localMrn?: string;
  phoneNumber?: string; // Changed from phone
  email?: string;
  gender?: string;
  dateOfBirth?: string;
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const response = await searchPatients(searchQuery);
      // Check for success (API returns boolean success: true)
      if (response.data.success && response.data.data) {
        // Backend returns { results: [], total: ... }
        setSearchResults(response.data.data.results || []);
      }
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedPatient || !selectedDate || !selectedTime) {
      toast.error("Please select a patient, date, and time.");
      return;
    }

    setIsBooking(true);
    try {
      // Convert 12h time to ISO 8601
      const [timeStr, period] = selectedTime.split(' ');
      let [hoursStr, minutes] = timeStr.split(':');
      let hours = parseInt(hoursStr, 10);
      
      if (period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      const formattedHours = hours.toString().padStart(2, '0');
      const scheduledTime = `${selectedDate}T${formattedHours}:${minutes}:00`;

      await bookDoctorAppointment({
        patientId: selectedPatient.id,
        scheduledTime,
        appointmentType: 'Consultation',
        reason: 'Booked by Doctor'
      });

      toast.success(`Appointment booked for ${selectedPatient.fullName}`);
      
      // Reset form
      setSelectedPatient(null);
      setSelectedDate("");
      setSelectedTime("");
      setSearchQuery("");
      router.refresh(); // Refresh dashboard data

    } catch (error: any) {
      console.error("Booking failed", error);
      toast.error(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-sm text-gray-600">
          Schedule a new appointment for your patients
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Patient Selection */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Select Patient
            </h2>
            
            {!selectedPatient ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, UHID, or phone..."
                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="border border-gray-100 rounded-lg divide-y divide-gray-100 max-h-60 overflow-y-auto">
                    {searchResults.map((patient) => (
                      <div
                        key={patient.id}
                        onClick={() => setSelectedPatient(patient)}
                        className="p-3 hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-blue-700">{patient.fullName}</p>
                          <p className="text-xs text-gray-500">{patient.uhid} • {patient.phoneNumber || 'No phone'}</p>
                        </div>
                        <User className="h-4 w-4 text-gray-300 group-hover:text-blue-400" />
                      </div>
                    ))}
                  </div>
                )}
                
                {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                  <p className="text-sm text-gray-500 text-center py-4">No patients found</p>
                )}
              </div>
            ) : (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 relative">
                <button 
                  onClick={() => setSelectedPatient(null)}
                  className="absolute top-2 right-2 p-1 hover:bg-white rounded-full transition-colors text-blue-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                    {selectedPatient.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">{selectedPatient.fullName}</h3>
                    <p className="text-sm text-blue-700">{selectedPatient.uhid}</p>
                    <p className="text-xs text-blue-600 mt-1">{selectedPatient.phoneNumber}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Date & Time */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Schedule Details
            </h2>

            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
                <Input 
                  type="date" 
                  className="bg-gray-50"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Time Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", 
                    "12:00 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"].map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={`text-xs ${selectedTime === time ? "bg-blue-600" : ""}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button 
          size="lg" 
          className="bg-blue-600 hover:bg-blue-700 min-w-[200px]"
          disabled={!selectedPatient || !selectedDate || !selectedTime || isBooking}
          onClick={handleBookAppointment}
        >
          {isBooking ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Booking...
            </div>
          ) : (
            <>
              Confirm Appointment
              <Check className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
