"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Building2,
  Search,
  User,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import {
  getHospitals,
  getDoctorsByHospital,
  searchDoctors,
  getSpecialties,
  getDoctorAvailability,
  bookPatientAppointment,
  Hospital,
  DoctorCard,
  AvailableDate,
  AvailableSlot,
  BookingConfirmation,
} from "@/lib/api";

type BookingStep = "choose-flow" | "hospital" | "doctor" | "slot" | "confirm" | "success";

export default function BookAppointmentPage() {
  const router = useRouter();
  
  // Flow state
  const [step, setStep] = useState<BookingStep>("choose-flow");
  const [bookingFlow, setBookingFlow] = useState<"hospital-first" | "doctor-first" | null>(null);
  
  // Data state
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<DoctorCard[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  
  // Selection state
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorCard | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  
  // Result state
  const [bookingResult, setBookingResult] = useState<BookingConfirmation | null>(null);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("patientAccessToken");
    if (!token) {
      router.replace("/patient/login");
    }
  }, [router]);

  // Load initial data
  useEffect(() => {
    loadSpecialties();
  }, []);

  const loadSpecialties = async () => {
    try {
      const response = await getSpecialties();
      if (response.data.status === "success") {
        setSpecialties(response.data.data);
      }
    } catch (error) {
      console.error("Error loading specialties:", error);
    }
  };

  const loadHospitals = async () => {
    setIsLoading(true);
    try {
      const response = await getHospitals();
      if (response.data.status === "success") {
        setHospitals(response.data.data);
      }
    } catch (error) {
      console.error("Error loading hospitals:", error);
      toast.error("Failed to load hospitals");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDoctorsByHospital = async (hospitalId: string) => {
    setIsLoading(true);
    try {
      const response = await getDoctorsByHospital(hospitalId, selectedSpecialty || undefined);
      if (response.data.status === "success") {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.error("Error loading doctors:", error);
      toast.error("Failed to load doctors");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDoctorsSearch = async () => {
    setIsLoading(true);
    try {
      const response = await searchDoctors(searchQuery || undefined, selectedSpecialty || undefined);
      if (response.data.status === "success") {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.error("Error searching doctors:", error);
      toast.error("Failed to search doctors");
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailability = async (doctorId: string, hospitalId: string, date?: string) => {
    setIsLoading(true);
    try {
      const response = await getDoctorAvailability(doctorId, hospitalId, date);
      if (response.data.status === "success") {
        setAvailableDates(response.data.data.dates);
        if (date) {
          setAvailableSlots(response.data.data.slots);
        }
      }
    } catch (error) {
      console.error("Error loading availability:", error);
      toast.error("Failed to load availability");
    } finally {
      setIsLoading(false);
    }
  };

  // Flow handlers
  const handleFlowSelect = (flow: "hospital-first" | "doctor-first") => {
    setBookingFlow(flow);
    if (flow === "hospital-first") {
      setStep("hospital");
      loadHospitals();
    } else {
      setStep("doctor");
      loadDoctorsSearch();
    }
  };

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setStep("doctor");
    loadDoctorsByHospital(hospital.id);
  };

  const handleDoctorSelect = (doctor: DoctorCard) => {
    setSelectedDoctor(doctor);
    if (!selectedHospital) {
      setSelectedHospital(doctor.hospital as Hospital);
    }
    setStep("slot");
    loadAvailability(doctor.id, doctor.hospital.id);
  };

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    if (selectedDoctor && selectedHospital) {
      await loadAvailability(selectedDoctor.id, selectedHospital.id, date);
    }
  };

  const handleSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    setStep("confirm");
  };

  const handleBooking = async () => {
    if (!selectedDoctor || !selectedHospital || !selectedSlot) return;
    setIsBooking(true);
    try {
      const response = await bookPatientAppointment({
        doctorId: selectedDoctor.id,
        hospitalId: selectedHospital.id,
        scheduledTime: selectedSlot.time,
        appointmentType: "Consultation",
      });
      if (response.data.status === "success") {
        setBookingResult(response.data.data);
        setStep("success");
        toast.success("Appointment booked successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setIsBooking(false);
    }
  };

  const handleBack = () => {
    switch (step) {
      case "hospital":
        setStep("choose-flow");
        setBookingFlow(null);
        break;
      case "doctor":
        if (bookingFlow === "hospital-first") {
          setStep("hospital");
          setSelectedHospital(null);
        } else {
          setStep("choose-flow");
          setBookingFlow(null);
        }
        break;
      case "slot":
        setStep("doctor");
        setSelectedDoctor(null);
        break;
      case "confirm":
        setStep("slot");
        setSelectedSlot(null);
        break;
    }
  };

  const handleStartOver = () => {
    setStep("choose-flow");
    setBookingFlow(null);
    setSelectedHospital(null);
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedSlot(null);
    setBookingResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Book Appointment</h1>
              <p className="text-xs text-gray-500">Step: {step}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => router.push("/patient/dashboard")}>Cancel</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-lg">
          <CardContent className="p-6 md:p-8">
            {step === "choose-flow" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">How would you like to book?</h2>
                  <p className="text-gray-600">Choose your preferred booking flow</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="cursor-pointer hover:border-purple-500 hover:shadow-lg transition-all" onClick={() => handleFlowSelect("hospital-first")}>
                    <CardContent className="p-6 text-center">
                      <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                        <Building2 className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Hospital First</h3>
                      <p className="text-sm text-gray-600">Browse hospitals, then find available doctors</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all" onClick={() => handleFlowSelect("doctor-first")}>
                    <CardContent className="p-6 text-center">
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <Stethoscope className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Find a Doctor</h3>
                      <p className="text-sm text-gray-600">Search doctors by specialty or name</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {step === "hospital" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <Button variant="ghost" size="icon" onClick={handleBack}><ArrowLeft className="h-5 w-5" /></Button>
                  <div><h2 className="text-xl font-bold text-gray-900">Select Hospital</h2></div>
                </div>
                {isLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-purple-600" /></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hospitals.map((hospital) => (
                      <Card key={hospital.id} className="cursor-pointer hover:border-purple-500 transition-all" onClick={() => handleHospitalSelect(hospital)}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center"><Building2 className="h-6 w-6 text-purple-600" /></div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                              <p className="text-sm text-gray-600 flex items-center gap-1"><MapPin className="h-3 w-3" />{hospital.city || "Location"}</p>
                              <p className="text-xs text-purple-600 mt-1">{hospital.doctorCount || 0} doctors</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === "doctor" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <Button variant="ghost" size="icon" onClick={handleBack}><ArrowLeft className="h-5 w-5" /></Button>
                  <div><h2 className="text-xl font-bold text-gray-900">{selectedHospital ? `Doctors at ${selectedHospital.name}` : "Find a Doctor"}</h2></div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  {bookingFlow === "doctor-first" && (
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search by doctor name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadDoctorsSearch()} className="pl-10" />
                    </div>
                  )}
                  <Select value={selectedSpecialty || "all"} onValueChange={(v) => setSelectedSpecialty(v === "all" ? "" : v)}>
                    <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All Specialties" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      {specialties.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  {bookingFlow === "doctor-first" && <Button onClick={loadDoctorsSearch}>Search</Button>}
                </div>
                {isLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-purple-600" /></div>
                ) : doctors.length === 0 ? (
                  <div className="text-center py-12"><Stethoscope className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-600">No doctors found</p></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctors.map((doctor) => (
                      <Card key={doctor.id} className="cursor-pointer hover:border-blue-500 transition-all" onClick={() => handleDoctorSelect(doctor)}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center"><User className="h-7 w-7 text-blue-600" /></div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{doctor.fullName}</h3>
                              <p className="text-sm text-gray-600">{doctor.specialty}</p>
                              {bookingFlow === "doctor-first" && <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Building2 className="h-3 w-3" />{doctor.hospital.name}</p>}
                              {doctor.nextAvailable && <p className="text-xs text-green-600 flex items-center gap-1 mt-2"><Clock className="h-3 w-3" />Next: {new Date(doctor.nextAvailable).toLocaleDateString()}</p>}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === "slot" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <Button variant="ghost" size="icon" onClick={handleBack}><ArrowLeft className="h-5 w-5" /></Button>
                  <div><h2 className="text-xl font-bold text-gray-900">Select Date & Time</h2><p className="text-sm text-gray-600">Booking with {selectedDoctor?.fullName}</p></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Select a Date</h3>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {availableDates.slice(0, 14).map((d) => (
                      <button key={d.date} onClick={() => handleDateSelect(d.date)} className={`flex-shrink-0 w-16 p-3 rounded-lg border text-center transition-all ${selectedDate === d.date ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 hover:border-purple-300"}`}>
                        <div className="text-xs text-gray-500">{d.dayName}</div>
                        <div className="text-lg font-bold">{d.dayNumber}</div>
                        <div className="text-xs text-gray-500">{d.month}</div>
                      </button>
                    ))}
                  </div>
                </div>
                {selectedDate && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Available Times</h3>
                    {isLoading ? (
                      <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-purple-600" /></div>
                    ) : availableSlots.length === 0 ? (
                      <p className="text-gray-600 text-center py-6">No slots available for this date</p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {availableSlots.map((slot) => (
                          <button key={slot.time} onClick={() => handleSlotSelect(slot)} className={`p-3 rounded-lg border text-center transition-all ${selectedSlot?.time === slot.time ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"}`}>
                            <Clock className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                            <div className="text-sm font-medium">{slot.display}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === "confirm" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <Button variant="ghost" size="icon" onClick={handleBack}><ArrowLeft className="h-5 w-5" /></Button>
                  <div><h2 className="text-xl font-bold text-gray-900">Confirm Booking</h2></div>
                </div>
                <Card className="border-purple-200 bg-purple-50/50">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center"><User className="h-7 w-7 text-blue-600" /></div>
                      <div><h3 className="font-semibold text-gray-900">{selectedDoctor?.fullName}</h3><p className="text-sm text-gray-600">{selectedDoctor?.specialty}</p></div>
                    </div>
                    <div className="border-t border-purple-200 pt-4 space-y-3">
                      <div className="flex items-center gap-3 text-gray-700"><Building2 className="h-5 w-5 text-purple-600" /><span>{selectedHospital?.name}</span></div>
                      <div className="flex items-center gap-3 text-gray-700"><Calendar className="h-5 w-5 text-purple-600" /><span>{selectedDate && new Date(selectedDate).toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}</span></div>
                      <div className="flex items-center gap-3 text-gray-700"><Clock className="h-5 w-5 text-purple-600" /><span>{selectedSlot?.display}</span></div>
                    </div>
                  </CardContent>
                </Card>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600" size="lg" onClick={handleBooking} disabled={isBooking}>
                  {isBooking ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Booking...</> : <><CheckCircle2 className="h-5 w-5 mr-2" />Confirm Booking</>}
                </Button>
              </div>
            )}

            {step === "success" && (
              <div className="text-center py-12">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="h-10 w-10 text-green-600" /></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h2>
                <p className="text-gray-600 mb-8">Your appointment has been successfully booked.</p>
                {bookingResult && (
                  <Card className="border-green-200 bg-green-50/50 text-left mb-8">
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-center gap-3"><User className="h-5 w-5 text-green-600" /><span className="font-medium">{bookingResult.doctor.fullName}</span></div>
                      <div className="flex items-center gap-3"><Building2 className="h-5 w-5 text-green-600" /><span>{bookingResult.hospital.name}</span></div>
                      <div className="flex items-center gap-3"><Calendar className="h-5 w-5 text-green-600" /><span>{new Date(bookingResult.scheduledTime).toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}</span></div>
                      <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-green-600" /><span>{new Date(bookingResult.scheduledTime).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })}</span></div>
                    </CardContent>
                  </Card>
                )}
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={handleStartOver}>Book Another</Button>
                  <Button onClick={() => router.push("/patient/dashboard")}>Go to Dashboard</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
