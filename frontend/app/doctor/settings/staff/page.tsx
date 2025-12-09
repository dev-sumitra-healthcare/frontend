"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Users, 
  Plus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Copy
} from "lucide-react";
import { 
  getDoctorCoordinators, 
  createDoctorCoordinator, 
  toggleDoctorCoordinatorAccess, 
  deleteDoctorCoordinator,
  type DoctorCoordinator 
} from "@/lib/api";

export default function StaffManagementPage() {
  const router = useRouter();
  const [coordinators, setCoordinators] = useState<DoctorCoordinator[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newCoordinator, setNewCoordinator] = useState({
    fullName: "",
    email: "",
    phoneNumber: ""
  });
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  useEffect(() => {
    loadCoordinators();
  }, []);

  const loadCoordinators = async () => {
    try {
      setLoading(true);
      const response = await getDoctorCoordinators();
      if (response.data.success) {
        setCoordinators(response.data.data.coordinators);
      }
    } catch (error) {
      console.error("Error loading coordinators:", error);
      toast.error("Failed to load staff members");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newCoordinator.fullName || !newCoordinator.email) {
      toast.error("Name and email are required");
      return;
    }

    try {
      setCreating(true);
      const response = await createDoctorCoordinator(newCoordinator);
      if (response.data.success) {
        setCoordinators(prev => [response.data.data.coordinator, ...prev]);
        setTempPassword(response.data.data.tempPassword);
        setNewCoordinator({ fullName: "", email: "", phoneNumber: "" });
        toast.success("Coordinator added successfully");
      }
    } catch (error: any) {
      console.error("Error creating coordinator:", error);
      const msg = error.response?.data?.message || "Failed to create coordinator";
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleAccess = async (id: string, currentStatus: boolean) => {
    try {
      const response = await toggleDoctorCoordinatorAccess(id, !currentStatus);
      if (response.data.success) {
        setCoordinators(prev => 
          prev.map(c => c.id === id ? { ...c, isActive: !currentStatus } : c)
        );
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error toggling access:", error);
      toast.error("Failed to update access");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteDoctorCoordinator(id);
      if (response.data.success) {
        setCoordinators(prev => prev.filter(c => c.id !== id));
        toast.success("Coordinator removed");
      }
    } catch (error) {
      console.error("Error deleting coordinator:", error);
      toast.error("Failed to remove coordinator");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              Staff Management
            </h1>
            <p className="text-gray-500">Manage coordinators in your hospital</p>
          </div>
        </div>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Coordinator
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Coordinator</DialogTitle>
              <DialogDescription>
                Create a new coordinator account for your hospital. They'll receive login credentials.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  placeholder="John Doe"
                  value={newCoordinator.fullName}
                  onChange={(e) => setNewCoordinator(prev => ({ ...prev, fullName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  placeholder="john@hospital.com"
                  value={newCoordinator.email}
                  onChange={(e) => setNewCoordinator(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={newCoordinator.phoneNumber}
                  onChange={(e) => setNewCoordinator(prev => ({ ...prev, phoneNumber: e.target.value }))}
                />
              </div>
            </div>
            
            {tempPassword && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Temporary Password</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Share this password with the coordinator. They should change it after first login.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="px-2 py-1 bg-yellow-100 rounded text-sm font-mono">{tempPassword}</code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard(tempPassword)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setAddDialogOpen(false);
                  setTempPassword(null);
                }}
              >
                {tempPassword ? "Done" : "Cancel"}
              </Button>
              {!tempPassword && (
                <Button onClick={handleCreate} disabled={creating}>
                  {creating ? "Creating..." : "Create Coordinator"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Staff</p>
                <p className="text-2xl font-bold">{coordinators.length}</p>
              </div>
              <Users className="h-10 w-10 text-blue-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {coordinators.filter(c => c.isActive).length}
                </p>
              </div>
              <ToggleRight className="h-10 w-10 text-green-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Inactive</p>
                <p className="text-2xl font-bold text-gray-400">
                  {coordinators.filter(c => !c.isActive).length}
                </p>
              </div>
              <ToggleLeft className="h-10 w-10 text-gray-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coordinators Table */}
      <Card>
        <CardHeader>
          <CardTitle>Coordinators</CardTitle>
          <CardDescription>All coordinators in your hospital</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : coordinators.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No coordinators yet</h3>
              <p className="text-gray-500 mb-4">Add coordinators to help manage appointments</p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Coordinator
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coordinators.map((coordinator) => (
                  <TableRow key={coordinator.id}>
                    <TableCell className="font-medium">{coordinator.fullName}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          {coordinator.email}
                        </div>
                        {coordinator.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {coordinator.phoneNumber}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={coordinator.isActive ? "default" : "secondary"}>
                        {coordinator.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(coordinator.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleAccess(coordinator.id, coordinator.isActive)}
                        >
                          {coordinator.isActive ? (
                            <ToggleRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                        
                        <Dialog open={deleteConfirmId === coordinator.id} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirmId(coordinator.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Remove Coordinator?</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to remove {coordinator.fullName}? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={() => handleDelete(coordinator.id)}>
                                Remove
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
