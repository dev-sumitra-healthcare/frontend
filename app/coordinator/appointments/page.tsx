"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getCoordinatorAppointmentsByDate,
  createCoordinatorAppointment,
  cancelCoordinatorAppointment,
  getCoordinatorDoctors,
  searchCoordinatorPatients,
  type CoordinatorAppointment,
  type CoordinatorPatientsResponse,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  Calendar as CalendarPlus,
  User,
  Stethoscope,
  Search,
  AlertCircle,
  FileText,
  UserCircle,
  Activity,
  Phone,
  Mail,
  MapPin,
  CreditCard,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TriageModal } from "@/components/coordinator/TriageModal";
import { toast } from "sonner";

export default function CoordinatorAppointments() {
  const searchParams = useSearchParams();
  const [appointments, setAppointments] = useState<CoordinatorAppointment[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [stats, setStats] = useState<any>(null);

  // View dialog state
  const [viewOpen, setViewOpen] = useState(false);
  const [viewAppt, setViewAppt] = useState<CoordinatorAppointment | null>(null);

  // Triage dialog state
  const [triageOpen, setTriageOpen] = useState(false);
  const [triageAppt, setTriageAppt] = useState<CoordinatorAppointment | null>(null);

  // Create appointment dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [apptForm, setApptForm] = useState({
    practitionerId: "",
    patientId: "",
    scheduledTime: "",
    appointmentType: "New Visit",
  });
  const [doctors, setDoctors] = useState<
    Array<{
      id: string;
      full_name?: string;
      fullName?: string;
      specialty?: string;
    }>
  >([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState("");

  // Patient search state
  type ListPatient = CoordinatorPatientsResponse["data"]["results"][number];
  const [patientQuery, setPatientQuery] = useState("");
  const [patientResults, setPatientResults] = useState<ListPatient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientsError, setPatientsError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<ListPatient | null>(
    null
  );

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  // Auto-open create dialog if ?action=create is present
  const action = useMemo(() => searchParams.get("action"), [searchParams]);
  useEffect(() => {
    if (action === "create") {
      openCreateDialog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  function getTodayDate() {
    // Use local date components to avoid UTC timezone shift
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCoordinatorAppointmentsByDate(selectedDate);

      if (response.data.success) {
        const appointmentsList = response.data.data.appointments;
        setAppointments(appointmentsList);

        // Calculate stats from appointments data
        const byStatus = appointmentsList.reduce(
          (acc: any, apt: CoordinatorAppointment) => {
            acc[apt.status] = (acc[apt.status] || 0) + 1;
            return acc;
          },
          {}
        );

        setStats({
          total: appointmentsList.length,
          byStatus,
        });
      }
    } catch (err: any) {
      console.error("Failed to load appointments:", err);
      setError(err.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Waiting: "bg-yellow-100 text-yellow-800",
      "In-Consultation": "bg-blue-100 text-blue-800",
      "Documentation-Pending": "bg-purple-100 text-purple-800",
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
      "No-Show": "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Waiting":
        return <Clock className="h-4 w-4" />;
      case "In-Consultation":
        return <Activity className="h-4 w-4" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openView = (appt: CoordinatorAppointment) => {
    setViewAppt(appt);
    setViewOpen(true);
  };

  const handleCancel = async (appointmentId: string) => {
    const ok = window.confirm("Cancel this appointment?");
    if (!ok) return;
    try {
      await cancelCoordinatorAppointment(appointmentId);
      await loadAppointments();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const openCreateDialog = () => {
    setCreateError("");
    setSelectedPatient(null);
    setPatientQuery("");
    setPatientResults([]);
    // default scheduledTime to selected date at 09:00
    const dt = new Date(selectedDate + "T09:00");
    setApptForm({
      practitionerId: "",
      patientId: "",
      scheduledTime: dt.toISOString().slice(0, 16),
      appointmentType: "New Visit",
    });
    setCreateOpen(true);
  };

  // Lazy-load doctors when create dialog opens
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setDoctorsLoading(true);
        setDoctorsError("");
        const res = await getCoordinatorDoctors({ status: "active" });
        if (res.data.success) {
          setDoctors(res.data.data.doctors || []);
        }
      } catch (e: any) {
        setDoctorsError(e?.response?.data?.message || "Failed to load doctors");
      } finally {
        setDoctorsLoading(false);
      }
    };
    if (createOpen && doctors.length === 0 && !doctorsLoading) {
      loadDoctors();
    }
  }, [createOpen, doctors.length, doctorsLoading]);

  const submitCreate = async () => {
    try {
      setCreateError("");
      const { practitionerId, patientId, scheduledTime, appointmentType } =
        apptForm;
      if (!practitionerId || !patientId || !scheduledTime) {
        setCreateError("Doctor, patient and scheduled time are required.");
        return;
      }
      let finalPatientId = patientId;

      // Check if selected patient needs enrollment (Network/Global patient)
      // Access custom property or check hospital_id if available on selectedPatient
      // Note: selectedPatient type might need casting as it comes from API specific response
      if (selectedPatient && (!(selectedPatient as any).hospital_id && !(selectedPatient as any).isLocal)) {
          try {
            const enrollRes = await coordinatorEnrollPatient(selectedPatient.id);
            if (enrollRes.data.success) {
                finalPatientId = enrollRes.data.data.patient.id;
                toast.success("Patient enrolled automatically into hospital directory");
            }
          } catch (enrollErr: any) {
            // Handle if patient was already enrolled (race condition or previous error)
            if (enrollErr.response?.status === 409 && enrollErr.response.data?.data?.patientId) {
                finalPatientId = enrollErr.response.data.data.patientId;
                toast.info("Patient was already enrolled, using existing record");
            } else {
                setCreateError("Failed to enroll network patient. Please enroll them from the Patients page first.");
                setCreating(false);
                return;
            }
          }
      }

      setCreating(true);
      await createCoordinatorAppointment({
        practitionerId,
        patientId: finalPatientId, // Use the potentially new local ID
        scheduledTime: new Date(scheduledTime).toISOString(),
        appointmentType,
      });
      setCreateOpen(false);
      await loadAppointments();
    } catch (err: any) {
      setCreateError(
        err.response?.data?.message || "Failed to create appointment"
      );
    } finally {
      setCreating(false);
    }
  };

  const performPatientSearch = async () => {
    try {
      setPatientsLoading(true);
      setPatientsError("");
      const q = patientQuery.trim();
      if (q.length < 2) {
        setPatientResults([]);
        return;
      }
      const res = await searchCoordinatorPatients(q, "all");
      if (res.data.success) {
        setPatientResults(res.data.data.results || []);
      }
    } catch (e: any) {
      setPatientsError(
        e?.response?.data?.message || "Failed to search patients"
      );
    } finally {
      setPatientsLoading(false);
    }
  };

  // Debounced search on input
  useEffect(() => {
    const q = patientQuery.trim();
    if (q.length < 2) {
      setPatientResults([]);
      return;
    }
    const t = setTimeout(() => {
      performPatientSearch();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientQuery]);

  const selectPatient = (patient: ListPatient) => {
    setSelectedPatient(patient);
    setApptForm({ ...apptForm, patientId: patient.id });
  };

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Appointments</h1>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadAppointments} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-[24px] font-semibold text-[#101828] tracking-[-0.3125px]" style={{ fontFamily: 'Inter, sans-serif' }}>Appointments</h2>
          <p className="text-[16px] text-[#475467] tracking-[-0.3125px] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Hospital-wide appointment calendar
          </p>
        </div>
        <button 
          className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-[15px] font-medium"
          onClick={openCreateDialog}
        >
          <CalendarPlus className="h-4 w-4" />
          Schedule New Appointment
        </button>
      </div>

      {/* Date Selector & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Date Selector */}
        <div className="bg-white rounded-[16px] border border-[#d1fae5] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-6">
          <p className="text-[14px] font-medium text-[#475467] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>Select Date</p>
          <div className="flex gap-2">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1"
            />
            <button
              onClick={() => setSelectedDate(getTodayDate())}
              disabled={selectedDate === getTodayDate()}
              className="px-3 py-2 border border-[#d1fae5] rounded-lg text-[14px] text-[#475467] hover:bg-[#ecfdf5] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Today
            </button>
          </div>
          <div className="mt-3 text-[14px] text-[#475467]">
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <>
            <div className="bg-white rounded-[16px] border border-[#d1fae5] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-6">
              <p className="text-[14px] font-medium text-[#475467] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>Total Appointments</p>
              <div className="flex items-center justify-between">
                <div className="text-[32px] font-bold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>{stats.total}</div>
                <div className="p-2 bg-[#d1fae5] rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-[#10B981]" />
                </div>
              </div>
              <div className="mt-3 text-[13px] text-[#475467]">
                {stats.byStatus?.Completed || 0} completed • {stats.byStatus?.Waiting || 0} waiting
              </div>
            </div>

            <div className="bg-white rounded-[16px] border border-[#d1fae5] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-6">
              <p className="text-[14px] font-medium text-[#475467] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>Completion Rate</p>
              <div className="flex items-center justify-between">
                <div className="text-[32px] font-bold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {stats.total > 0 ? Math.round(((stats.byStatus?.Completed || 0) / stats.total) * 100) : 0}%
                </div>
                <div className="p-2 bg-[#d1fae5] rounded-lg">
                  <CheckCircle className="h-6 w-6 text-[#10B981]" />
                </div>
              </div>
              <div className="mt-3 text-[13px] text-[#475467]">
                {stats.byStatus?.Cancelled || 0} cancelled • {stats.byStatus?.["No-Show"] || 0} no-shows
              </div>
            </div>
          </>
        )}
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-[16px] border border-[#d1fae5] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
        <div className="p-6 border-b border-[#d1fae5]">
          <div className="flex items-center gap-3">
            <h3 className="text-[18px] font-semibold text-[#101828] tracking-[-0.3125px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Appointments for {new Date(selectedDate).toLocaleDateString()}
            </h3>
            <span className="px-3 py-1 bg-[#d1fae5] text-[#10B981] text-[14px] font-medium rounded-full">
              {appointments.length} appointments
            </span>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No appointments scheduled for this date
              </p>
              <Button className="mt-4" onClick={openCreateDialog}>
                Schedule Appointment
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments
                    .sort(
                      (a, b) =>
                        new Date(a.scheduledTime).getTime() -
                        new Date(b.scheduledTime).getTime()
                    )
                    .map((appointment) => (
                      <TableRow key={appointment.appointmentId}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">
                              {formatTime(appointment.scheduledTime)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {appointment.patient.fullName}
                            </div>
                            <div className="text-sm text-gray-600">
                              UHID: {appointment.patient.uhid}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {appointment.doctor.fullName}
                            </div>
                            {appointment.doctor.specialty && (
                              <div className="text-sm text-gray-600">
                                {appointment.doctor.specialty}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{appointment.appointmentType}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openView(appointment)}
                            >
                              View
                            </Button>
                            {appointment.status === "Waiting" && (
                              <Button
                                variant="secondary"
                                size="sm"
                                className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                                onClick={() => {
                                  setTriageAppt(appointment);
                                  setTriageOpen(true);
                                }}
                              >
                                <Activity className="h-4 w-4 mr-1" />
                                Triage
                              </Button>
                            )}
                            {appointment.status === "Waiting" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                                onClick={() =>
                                  handleCancel(appointment.appointmentId)
                                }
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Create Appointment Dialog - Improved UI */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5 text-blue-600" />
              Schedule New Appointment
            </DialogTitle>
            <DialogDescription>
              Create a new appointment by selecting a doctor, patient, and
              preferred time.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {createError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{createError}</AlertDescription>
              </Alert>
            )}

            {/* Doctor Selection */}
            <div className="space-y-2">
              <Label htmlFor="doctor" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-gray-500" />
                Select Doctor
              </Label>
              <Select
                value={apptForm.practitionerId}
                onValueChange={(v) =>
                  setApptForm({ ...apptForm, practitionerId: v })
                }
              >
                <SelectTrigger id="doctor" className="w-full">
                  <SelectValue
                    placeholder={
                      doctorsLoading ? "Loading doctors..." : "Choose a doctor"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {doctors.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {(d.full_name || d.fullName || "D")[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {d.full_name || d.fullName || "Unknown Doctor"}
                            </div>
                            {d.specialty && (
                              <div className="text-xs text-gray-500">
                                {d.specialty}
                              </div>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              {doctorsError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {doctorsError}
                </p>
              )}
            </div>

            <Separator />

            {/* Patient Search */}
            <div className="space-y-2">
              <Label
                htmlFor="patient-search"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4 text-gray-500" />
                Search Patient
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="patient-search"
                    placeholder="Search by name or UHID..."
                    value={patientQuery}
                    onChange={(e) => setPatientQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Selected Patient Display */}
              {selectedPatient && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {selectedPatient.fullName?.[0] || "P"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {selectedPatient.fullName}
                        </p>
                        <p className="text-sm text-gray-600">
                          UHID: {selectedPatient.uhid}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedPatient(null);
                        setApptForm({ ...apptForm, patientId: "" });
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Patient Search Results */}
              {!selectedPatient && patientResults.length > 0 && (
                <ScrollArea className="h-[150px] border rounded-lg p-2">
                  <div className="space-y-2">
                    {patientResults.slice(0, 10).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => selectPatient(p)}
                        className="w-full text-left hover:bg-gray-50 rounded-lg p-2 transition-colors flex items-center gap-3"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {p.fullName?.[0] || "P"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {p.fullName || "Unknown Patient"}
                          </div>
                          <div className="text-xs text-gray-500">
                            UHID: {p.uhid}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {/* Loading/Error States */}
              {patientsLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  Searching patients...
                </div>
              )}

              {patientsError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {patientsError}
                </p>
              )}

              {!patientsLoading &&
                !selectedPatient &&
                patientQuery.trim().length > 0 &&
                patientQuery.trim().length < 2 && (
                  <p className="text-sm text-gray-500">
                    Type at least 2 characters to search
                  </p>
                )}

              {!patientsLoading &&
                !selectedPatient &&
                patientResults.length === 0 &&
                patientQuery.trim().length >= 2 && (
                  <p className="text-sm text-gray-500">No patients found</p>
                )}
            </div>

            <Separator />

            {/* Date & Time Selection */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="datetime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  Date & Time
                </Label>
                <Input
                  id="datetime"
                  type="datetime-local"
                  value={apptForm.scheduledTime}
                  onChange={(e) =>
                    setApptForm({ ...apptForm, scheduledTime: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  Appointment Type
                </Label>
                <Select
                  value={apptForm.appointmentType}
                  onValueChange={(v) =>
                    setApptForm({ ...apptForm, appointmentType: v })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New Visit">New Visit</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Check-up">Check-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={submitCreate}
              disabled={
                creating ||
                !apptForm.practitionerId ||
                !apptForm.patientId ||
                !apptForm.scheduledTime
              }
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Scheduling...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Appointment Dialog - Improved UI */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              Appointment Details
            </DialogTitle>
          </DialogHeader>

          {viewAppt && (
            <div className="space-y-6 py-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <Badge
                  className={`${getStatusColor(
                    viewAppt.status
                  )} px-3 py-1 flex items-center gap-1`}
                >
                  {getStatusIcon(viewAppt.status)}
                  {viewAppt.status}
                </Badge>
                <div className="text-sm text-gray-500">
                  ID: {viewAppt.appointmentId}
                </div>
              </div>

              {/* Patient Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {viewAppt.patient.fullName?.[0] || "P"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {viewAppt.patient.fullName}
                    </h3>
                    <p className="text-sm text-gray-600">Patient</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">UHID:</span>
                    <span className="font-medium">
                      {viewAppt.patient.uhid || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Doctor Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-200">
                      {viewAppt.doctor.fullName?.[0] || "D"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {viewAppt.doctor.fullName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {viewAppt.doctor.specialty || "Doctor"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date(viewAppt.scheduledTime).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">
                    {new Date(viewAppt.scheduledTime).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">
                    {viewAppt.appointmentType}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {viewAppt.status === "Waiting" && (
                <div className="flex justify-end gap-3 pt-2 border-t">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleCancel(viewAppt.appointmentId);
                      setViewOpen(false);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Appointment
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Triage Modal */}
      {triageAppt && (
        <TriageModal
          open={triageOpen}
          onOpenChange={setTriageOpen}
          appointmentId={triageAppt.appointmentId}
          patient={{
            id: triageAppt.patient.id,
            name: triageAppt.patient.fullName || "Unknown",
            uhid: triageAppt.patient.uhid || "N/A",
            phone: triageAppt.patient.phoneNumber,
          }}
          onSuccess={() => {
            loadAppointments();
            toast.success("Triage completed successfully!");
          }}
        />
      )}
    </div>
  );
}
