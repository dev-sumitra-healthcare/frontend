"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getCoordinatorPatients,
  createCoordinatorPatient,
  getCoordinatorPatientById,
  updateCoordinatorPatient,
  deleteCoordinatorPatient,
  type CoordinatorPatientsResponse,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building2,
  Droplet,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Users,
  Hash,
  Home,
  Map,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Derive Patient type from API response
type Patient = CoordinatorPatientsResponse["data"]["results"][number];

export default function CoordinatorPatients() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  // Create patient dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "" as "Male" | "Female" | "Other" | "Prefer not to say" | "",
    city: "",
    state: "",
    pincode: "",
    bloodGroup: "" as
      | ""
      | "A+"
      | "A-"
      | "B+"
      | "B-"
      | "AB+"
      | "AB-"
      | "O+"
      | "O-",
  });

  // Auto-open create dialog when ?action=create is present
  const action = useMemo(() => searchParams.get("action"), [searchParams]);
  useEffect(() => {
    if (action === "create") setCreateOpen(true);
  }, [action]);

  useEffect(() => {
    loadPatients();
  }, [page]);

  const loadPatients = async (search = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await getCoordinatorPatients({
        page,
        limit,
        ...(search && { name: search, uhid: search }),
      });

      if (response.data.success) {
        setPatients(response.data.data.results);
        setTotal(response.data.data.total);
      }
    } catch (err: any) {
      console.error("Failed to load patients:", err);
      setError(err.response?.data?.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadPatients(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(1);
    loadPatients();
  };

  const totalPages = Math.ceil(total / limit);

  const openCreateDialog = () => {
    setCreateError("");
    setForm({
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      city: "",
      state: "",
      pincode: "",
      bloodGroup: "",
    });
    setCreateOpen(true);
  };

  const submitCreate = async () => {
    try {
      setCreateError("");
      // Require fullName and at least one of email/phone
      if (!form.fullName || (!form.email && !form.phone)) {
        setCreateError("Full name and either email or phone are required.");
        return;
      }
      setCreating(true);
      const payload: any = {
        fullName: form.fullName,
        ...(form.email ? { email: form.email } : {}),
        ...(form.phone ? { phone: form.phone } : {}),
        ...(form.dateOfBirth ? { dateOfBirth: form.dateOfBirth } : {}),
        ...(form.gender ? { gender: form.gender } : {}),
        ...(form.city ? { city: form.city } : {}),
        ...(form.state ? { state: form.state } : {}),
        ...(form.pincode ? { pincode: form.pincode } : {}),
        ...(form.bloodGroup ? { bloodGroup: form.bloodGroup } : {}),
      };
      await createCoordinatorPatient(payload);
      setCreateOpen(false);
      // Remove action param if present
      if (action === "create") {
        const sp = new URLSearchParams(searchParams as any);
        sp.delete("action");
        router.replace(
          `/coordinator/patients${sp.toString() ? `?${sp.toString()}` : ""}`
        );
      }
      await loadPatients();
    } catch (err: any) {
      setCreateError(err.response?.data?.message || "Failed to create patient");
    } finally {
      setCreating(false);
    }
  };

  // View patient dialog state
  const [viewOpen, setViewOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");
  const [viewPatient, setViewPatient] = useState<any | null>(null);

  const openView = async (patientId: string) => {
    try {
      setViewError("");
      setViewLoading(true);
      setViewPatient(null);
      setViewOpen(true);
      const res = await getCoordinatorPatientById(patientId);
      if (res.data.success) {
        setViewPatient(res.data.data.patient);
      }
    } catch (e: any) {
      setViewError(e?.response?.data?.message || "Failed to load patient");
    } finally {
      setViewLoading(false);
    }
  };

  // Edit patient dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState("");
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "" as "Male" | "Female" | "Other" | "Prefer not to say" | "",
    city: "",
    state: "",
    pincode: "",
    bloodGroup: "" as
      | ""
      | "A+"
      | "A-"
      | "B+"
      | "B-"
      | "AB+"
      | "AB-"
      | "O+"
      | "O-",
  });

  const openEdit = (p: Patient) => {
    setEditError("");
    setEditTargetId(p.id);
    setEditForm({
      fullName: p.fullName || "",
      email: (p as any).email || "",
      phone: (p as any).phoneNumber || "",
      dateOfBirth: p.dateOfBirth
        ? new Date(p.dateOfBirth).toISOString().slice(0, 10)
        : "",
      gender: (p as any).gender || "",
      city: (p as any).city || "",
      state: (p as any).state || "",
      pincode: "",
      bloodGroup: (p as any).bloodGroup || "",
    });
    setEditOpen(true);
  };

  const submitEdit = async () => {
    if (!editTargetId) return;
    try {
      setEditing(true);
      setEditError("");
      const payload: any = {
        fullName: editForm.fullName,
        ...(editForm.email ? { email: editForm.email } : {}),
        ...(editForm.phone ? { phone: editForm.phone } : {}),
        ...(editForm.dateOfBirth ? { dateOfBirth: editForm.dateOfBirth } : {}),
        ...(editForm.gender ? { gender: editForm.gender } : {}),
        ...(editForm.city ? { city: editForm.city } : {}),
        ...(editForm.state ? { state: editForm.state } : {}),
        ...(editForm.pincode ? { pincode: editForm.pincode } : {}),
        ...(editForm.bloodGroup ? { bloodGroup: editForm.bloodGroup } : {}),
      };
      await updateCoordinatorPatient(editTargetId, payload);
      setEditOpen(false);
      await loadPatients();
    } catch (e: any) {
      setEditError(e?.response?.data?.message || "Failed to update patient");
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async (patientId: string) => {
    const ok = window.confirm("Delete this patient?");
    if (!ok) return;
    try {
      await deleteCoordinatorPatient(patientId);
      await loadPatients();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to delete patient");
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">All Patients</h1>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => loadPatients()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Patients</h1>
          <p className="text-gray-600 mt-2">
            Hospital-wide patient roster • {total} total patients
          </p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={openCreateDialog}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or UHID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading}>
              Search
            </Button>
            {searchQuery && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearSearch}
              >
                Clear
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Patient List
            <Badge variant="secondary" className="ml-2">
              {total} patients
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No patients found</p>
              {searchQuery && (
                <Button
                  variant="link"
                  onClick={handleClearSearch}
                  className="mt-2"
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>UHID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">
                          {patient.uhid}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {patient.fullName}
                            </div>
                            {patient.dateOfBirth && (
                              <div className="text-sm text-gray-600">
                                {new Date(
                                  patient.dateOfBirth
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {patient.email && <div>{patient.email}</div>}
                            {patient.phoneNumber && (
                              <div className="text-gray-600">
                                {patient.phoneNumber}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{patient.gender || "-"}</TableCell>
                        <TableCell>
                          {patient.bloodGroup ? (
                            <Badge variant="outline">
                              {patient.bloodGroup}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{patient.city || "-"}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View details"
                              onClick={() => openView(patient.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Edit patient"
                              onClick={() => openEdit(patient)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete patient"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(patient.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, total)} of {total} patients
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || loading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }

                        return (
                          <Button
                            key={i}
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                            disabled={loading}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages || loading}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Patient Dialog - Improved UI */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              Add New Patient
            </DialogTitle>
            <DialogDescription>
              Enter patient information to create a new medical record.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-4">
              {createError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{createError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Date of Birth
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) =>
                      setForm({ ...form, dateOfBirth: e.target.value })
                    }
                  />
                  {form.dateOfBirth && (
                    <p className="text-xs text-gray-500">
                      Age: {calculateAge(form.dateOfBirth)} years
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    Gender
                  </Label>
                  <Select
                    value={form.gender}
                    onValueChange={(v: any) => setForm({ ...form, gender: v })}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="john@example.com"
                  />
                  <p className="text-xs text-gray-500">
                    * Either email or phone is required
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Home className="h-4 w-4 text-gray-500" />
                    Address Information
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        City
                      </Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={(e) =>
                          setForm({ ...form, city: e.target.value })
                        }
                        placeholder="Mumbai"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="state"
                        className="flex items-center gap-2"
                      >
                        <Map className="h-4 w-4 text-gray-500" />
                        State
                      </Label>
                      <Input
                        id="state"
                        value={form.state}
                        onChange={(e) =>
                          setForm({ ...form, state: e.target.value })
                        }
                        placeholder="Maharashtra"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="pincode"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4 text-gray-500" />
                      Pincode
                    </Label>
                    <Input
                      id="pincode"
                      value={form.pincode}
                      onChange={(e) =>
                        setForm({ ...form, pincode: e.target.value })
                      }
                      placeholder="400001"
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup" className="flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-gray-500" />
                  Blood Group
                </Label>
                <Select
                  value={form.bloodGroup}
                  onValueChange={(v: any) =>
                    setForm({ ...form, bloodGroup: v })
                  }
                >
                  <SelectTrigger id="bloodGroup">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Medical Information</AlertTitle>
                <AlertDescription>
                  Additional medical history and conditions can be added after
                  creating the patient record.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

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
                creating || !form.fullName || (!form.email && !form.phone)
              }
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Patient
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Patient Dialog - Improved UI */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Patient Details
            </DialogTitle>
          </DialogHeader>

          {viewLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">
                  Loading patient information...
                </p>
              </div>
            </div>
          ) : viewError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{viewError}</AlertDescription>
            </Alert>
          ) : viewPatient ? (
            <div className="space-y-6 py-4">
              {/* Patient Header */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl bg-blue-200">
                    {(viewPatient.fullName || viewPatient.full_name || "P")[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {viewPatient.fullName || viewPatient.full_name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <CreditCard className="h-3 w-3" />
                      {viewPatient.uhid}
                    </Badge>
                    {viewPatient.dateOfBirth && (
                      <span className="text-sm text-gray-600">
                        Age: {calculateAge(viewPatient.dateOfBirth)} years
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid gap-4">
                {/* Personal Information */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-sm text-gray-600 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {viewPatient.gender && (
                      <div>
                        <span className="text-gray-500">Gender:</span>
                        <span className="ml-2 font-medium">
                          {viewPatient.gender}
                        </span>
                      </div>
                    )}
                    {viewPatient.dateOfBirth && (
                      <div>
                        <span className="text-gray-500">Date of Birth:</span>
                        <span className="ml-2 font-medium">
                          {new Date(
                            viewPatient.dateOfBirth
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {(viewPatient.bloodType ||
                      viewPatient.blood_group ||
                      viewPatient.bloodGroup) && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Blood Group:</span>
                        <Badge variant="secondary" className="ml-2">
                          {viewPatient.bloodType ||
                            viewPatient.blood_group ||
                            viewPatient.bloodGroup}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                {(viewPatient.email ||
                  viewPatient.phone ||
                  viewPatient.phoneNumber) && (
                  <div className="border rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-sm text-gray-600 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      {viewPatient.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">
                            {viewPatient.email}
                          </span>
                        </div>
                      )}
                      {(viewPatient.phone || viewPatient.phoneNumber) && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">
                            {viewPatient.phone || viewPatient.phoneNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Address Information */}
                {(viewPatient.address_city ||
                  viewPatient.address?.city ||
                  viewPatient.city) && (
                  <div className="border rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-sm text-gray-600 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </h4>
                    <div className="text-sm">
                      <span className="font-medium">
                        {viewPatient.address_city ||
                          viewPatient.address?.city ||
                          viewPatient.city}
                        {(viewPatient.address_state ||
                          viewPatient.address?.state ||
                          viewPatient.state) &&
                          `, ${
                            viewPatient.address_state ||
                            viewPatient.address?.state ||
                            viewPatient.state
                          }`}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2 border-t">
                <Button variant="outline" onClick={() => setViewOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    const p = patients.find((pat) => pat.id === viewPatient.id);
                    if (p) {
                      setViewOpen(false);
                      openEdit(p);
                    }
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Patient
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog - Improved UI */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Patient Information
            </DialogTitle>
            <DialogDescription>
              Update patient details and medical information.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-4">
              {editError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{editError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="edit-fullName"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-gray-500" />
                  Full Name
                </Label>
                <Input
                  id="edit-fullName"
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fullName: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-dob" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Date of Birth
                  </Label>
                  <Input
                    id="edit-dob"
                    type="date"
                    value={editForm.dateOfBirth}
                    onChange={(e) =>
                      setEditForm({ ...editForm, dateOfBirth: e.target.value })
                    }
                  />
                  {editForm.dateOfBirth && (
                    <p className="text-xs text-gray-500">
                      Age: {calculateAge(editForm.dateOfBirth)} years
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit-gender"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4 text-gray-500" />
                    Gender
                  </Label>
                  <Select
                    value={editForm.gender}
                    onValueChange={(v: any) =>
                      setEditForm({ ...editForm, gender: v })
                    }
                  >
                    <SelectTrigger id="edit-gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-email"
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4 text-gray-500" />
                    Email Address
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit-phone"
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4 text-gray-500" />
                    Phone Number
                  </Label>
                  <Input
                    id="edit-phone"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Home className="h-4 w-4 text-gray-500" />
                    Address Information
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-city"
                        className="flex items-center gap-2"
                      >
                        <Building2 className="h-4 w-4 text-gray-500" />
                        City
                      </Label>
                      <Input
                        id="edit-city"
                        value={editForm.city}
                        onChange={(e) =>
                          setEditForm({ ...editForm, city: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-state"
                        className="flex items-center gap-2"
                      >
                        <Map className="h-4 w-4 text-gray-500" />
                        State
                      </Label>
                      <Input
                        id="edit-state"
                        value={editForm.state}
                        onChange={(e) =>
                          setEditForm({ ...editForm, state: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-pincode"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4 text-gray-500" />
                      Pincode
                    </Label>
                    <Input
                      id="edit-pincode"
                      value={editForm.pincode}
                      onChange={(e) =>
                        setEditForm({ ...editForm, pincode: e.target.value })
                      }
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label
                  htmlFor="edit-bloodGroup"
                  className="flex items-center gap-2"
                >
                  <Droplet className="h-4 w-4 text-gray-500" />
                  Blood Group
                </Label>
                <Select
                  value={editForm.bloodGroup}
                  onValueChange={(v: any) =>
                    setEditForm({ ...editForm, bloodGroup: v })
                  }
                >
                  <SelectTrigger id="edit-bloodGroup">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              disabled={editing}
            >
              Cancel
            </Button>
            <Button onClick={submitEdit} disabled={editing}>
              {editing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
