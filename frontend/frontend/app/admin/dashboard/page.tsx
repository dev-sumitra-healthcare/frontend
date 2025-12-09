"use client";

import { useEffect, useState } from "react";
import {
  getDoctors,
  verifyDoctorAccount,
  suspendDoctorAccount,
  getCoordinators,
  verifyCoordinatorAccount,
  suspendCoordinatorAccount,
  logoutAdmin,
  getAdminDashboardStats
} from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Users, UserCheck, Shield, LogOut, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AxiosError } from "axios";
import { BackendErrorResponse, Doctor, Admin, Coordinator } from "@/lib/types";

interface DashboardStats {
  doctors: number;
  admins: number;
  coordinators: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [currentCoordinatorTab, setCurrentCoordinatorTab] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication and load admin profile
    const adminData = localStorage.getItem("admin");
    const adminAccessToken = localStorage.getItem("adminAccessToken");
    
    if (!adminAccessToken || !adminData) {
      router.push("/admin/login");
      return;
    }
    
    const parsedAdmin = JSON.parse(adminData);
    setAdmin(parsedAdmin);
    
    // Load initial data
    loadDashboardData();
  }, [router]);

  useEffect(() => {
    if (admin?.permissions.canManageDoctors) {
      fetchDoctors(currentTab);
    }
  }, [currentTab, admin]);

  useEffect(() => {
    if (admin?.permissions.canManageDoctors) {
      fetchCoordinators(currentCoordinatorTab);
    }
  }, [currentCoordinatorTab, admin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Only fetch stats if admin has permission
      const promises = [];
      if (admin?.permissions.canViewAnalytics) {
        promises.push(getAdminDashboardStats());
      }
      if (admin?.permissions.canManageDoctors) {
        promises.push(getDoctors({ page: 1, limit: 50 }));
      }
      
      const results = await Promise.all(promises);
      
      let resultIndex = 0;
      if (admin?.permissions.canViewAnalytics) {
        const statsRes = results[resultIndex++];
        // @ts-ignore - we know this is the stats response
        setStats(statsRes.data.data);
      }
      
      if (admin?.permissions.canManageDoctors) {
        const doctorsRes = results[resultIndex++];
        // @ts-ignore - we know this is the doctors response
        setDoctors(doctorsRes.data.data.doctors);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async (statusFilter: string) => {
    if (!admin?.permissions.canManageDoctors) {
      return;
    }

    try {
      const response = await getDoctors({ status: statusFilter === "all" ? undefined : statusFilter });
      setDoctors(response.data.data.doctors);
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error("Failed to fetch doctors", {
        description: errorMessage,
      });
    }
  };

  const fetchCoordinators = async (statusFilter: string) => {
    if (!admin?.permissions.canManageDoctors) {
      return;
    }

    try {
      const response = await getCoordinators({ status: statusFilter === "all" ? undefined : statusFilter });
      setCoordinators(response.data.data.coordinators);
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error("Failed to fetch coordinators", {
        description: errorMessage,
      });
    }
  };

  const handleAction = async (id: string, action: "verify" | "suspend") => {
    if (!admin?.permissions.canManageDoctors) {
      toast.error("You don't have permission to manage doctors");
      return;
    }

    try {
      setActionLoading(id);
      if (action === "verify") {
        await verifyDoctorAccount(id);
      } else {
        await suspendDoctorAccount(id);
      }
      fetchDoctors(currentTab); // Refresh table
      toast.success(
        `${action === "verify" ? "Doctor Verified" : "Doctor Suspended"}`,
        {
          description: `Doctor has been successfully ${
            action === "verify" ? "verified" : "suspended"
          }.`,
        }
      );
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(`Failed to ${action} doctor`, {
        description: errorMessage,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCoordinatorAction = async (id: string, action: "verify" | "suspend") => {
    if (!admin?.permissions.canManageDoctors) {
      toast.error("You don't have permission to manage coordinators");
      return;
    }

    try {
      setActionLoading(id);
      if (action === "verify") {
        await verifyCoordinatorAccount(id);
      } else {
        await suspendCoordinatorAccount(id);
      }
      fetchCoordinators(currentCoordinatorTab); // Refresh table
      toast.success(
        `${action === "verify" ? "Coordinator Verified" : "Coordinator Suspended"}`,
        {
          description: `Coordinator has been successfully ${
            action === "verify" ? "verified" : "suspended"
          }.`,
        }
      );
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(`Failed to ${action} coordinator`, {
        description: errorMessage,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("admin");
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error: unknown) {
      // Even if logout API fails, clear local storage and redirect
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("admin");
      router.push("/admin/login");
      toast.success("Logged out successfully");
    }
  };

  const getStatusBadgeVariant = (status: string | undefined) => {
    switch (status) {
      case "active":
        return "default";
      case "pending_verification":
        return "secondary";
      case "suspended":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatAccountStatus = (status: string | undefined) => {
    if (!status) return "Unknown";
    return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {admin?.fullName}
            {admin?.isSuperAdmin && (
              <Badge variant="outline" className="ml-2">
                <Shield className="w-3 h-3 mr-1" />
                Super Admin
              </Badge>
            )}
          </p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      {admin?.permissions.canViewAnalytics && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.doctors}</div>
              <p className="text-xs text-muted-foreground">
                Registered healthcare providers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Coordinators</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.coordinators}</div>
              <p className="text-xs text-muted-foreground">
                Hospital coordinators
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.admins}</div>
              <p className="text-xs text-muted-foreground">
                System administrators
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Doctors Management */}
      {admin?.permissions.canManageDoctors && (
        <Card>
          <CardHeader>
            <CardTitle>Doctor Management</CardTitle>
            <p className="text-sm text-gray-600">
              Manage doctor accounts and verification status
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending_verification">Pending</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="suspended">Suspended</TabsTrigger>
              </TabsList>
              <TabsContent value={currentTab}>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Specialty</TableHead>
                        <TableHead>Registration ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {doctors.map((doctor) => (
                        <TableRow key={doctor._id || doctor.id}>
                          <TableCell className="font-medium">
                            {doctor.full_name || doctor.fullName}
                            {(doctor.is_verified || doctor.isVerified) && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Verified
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{doctor.email}</TableCell>
                          <TableCell>{doctor.specialty}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {doctor.medical_registration_id || doctor.medicalRegistrationId}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(doctor.account_status || doctor.accountStatus)}>
                              {formatAccountStatus(doctor.account_status || doctor.accountStatus)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(doctor.created_at || doctor.createdAt || '').toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0"
                                  disabled={actionLoading === doctor._id}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {(doctor.account_status || doctor.accountStatus) === "pending_verification" && (
                                  <DropdownMenuItem
                                    onClick={() => handleAction(doctor.id || doctor._id, "verify")}
                                    disabled={actionLoading === (doctor.id || doctor._id)}
                                  >
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Verify Account
                                  </DropdownMenuItem>
                                )}
                                {(doctor.account_status || doctor.accountStatus) === "active" && (
                                  <DropdownMenuItem
                                    onClick={() => handleAction(doctor.id || doctor._id, "suspend")}
                                    disabled={actionLoading === (doctor.id || doctor._id)}
                                    className="text-red-600"
                                  >
                                    <Shield className="mr-2 h-4 w-4" />
                                    Suspend Account
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Coordinators Management */}
      {admin?.permissions.canManageDoctors && (
        <Card>
          <CardHeader>
            <CardTitle>Coordinator Management</CardTitle>
            <p className="text-sm text-gray-600">
              Manage coordinator accounts and verification status
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" onValueChange={setCurrentCoordinatorTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending_verification">Pending</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="suspended">Suspended</TabsTrigger>
              </TabsList>
              <TabsContent value={currentCoordinatorTab}>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coordinators.map((coordinator) => (
                        <TableRow key={coordinator.id}>
                          <TableCell className="font-medium">
                            {coordinator.full_name || coordinator.fullName}
                          </TableCell>
                          <TableCell>{coordinator.email}</TableCell>
                          <TableCell>{coordinator.phone_number || coordinator.phoneNumber || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(coordinator.account_status || coordinator.accountStatus)}>
                              {formatAccountStatus(coordinator.account_status || coordinator.accountStatus)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(coordinator.created_at || coordinator.createdAt || '').toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  disabled={actionLoading === coordinator.id}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {(coordinator.account_status || coordinator.accountStatus) === "pending_verification" && (
                                  <DropdownMenuItem
                                    onClick={() => handleCoordinatorAction(coordinator.id, "verify")}
                                    disabled={actionLoading === coordinator.id}
                                  >
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Verify Account
                                  </DropdownMenuItem>
                                )}
                                {(coordinator.account_status || coordinator.accountStatus) === "active" && (
                                  <DropdownMenuItem
                                    onClick={() => handleCoordinatorAction(coordinator.id, "suspend")}
                                    disabled={actionLoading === coordinator.id}
                                    className="text-red-600"
                                  >
                                    <Shield className="mr-2 h-4 w-4" />
                                    Suspend Account
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* No Permissions Message */}
      {!admin?.permissions.canManageDoctors && !admin?.permissions.canViewAnalytics && (
        <Card>
          <CardContent className="text-center py-10">
            <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Limited Access
            </h3>
            <p className="text-gray-600">
              Your account has limited permissions. Contact a super admin to request additional access.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
