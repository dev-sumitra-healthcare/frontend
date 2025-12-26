"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import StatusBadge from "@/components/doctor/StatusBadge";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Pencil,
  Key,
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

// Permissions for display
const defaultPermissions = ["View Cases", "Book Appts", "Manage OPD"];

export default function CoordinatorsPage() {
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
      toast.error("Failed to load coordinators");
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
    } catch (error: unknown) {
      console.error("Error creating coordinator:", error);
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : undefined;
      toast.error(errorMessage || "Failed to create coordinator");
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

  // Generate mock IDs for display
  const getDisplayId = (index: number) => `C00${index + 1}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coordinator Management</h1>
          <p className="text-sm text-gray-600">
            Manage coordinator accounts and permissions
          </p>
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Coordinator
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Coordinator</DialogTitle>
              <DialogDescription>
                Create a new coordinator account. They&apos;ll receive login credentials.
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
                  placeholder="+1 555-0201"
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
                <Button onClick={handleCreate} disabled={creating} className="bg-blue-600 hover:bg-blue-700">
                  {creating ? "Creating..." : "Create Coordinator"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Coordinators Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
            <div className="col-span-1">ID</div>
            <div className="col-span-2">Name</div>
            <div className="col-span-2">Email</div>
            <div className="col-span-2">Phone</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Permissions</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>
        </div>

        {/* Table Body */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : coordinators.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-medium">No coordinators yet</p>
            <p className="text-sm text-gray-400 mt-1">Add coordinators to help manage appointments</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {coordinators.map((coordinator, index) => (
              <div
                key={coordinator.id}
                className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                {/* ID */}
                <div className="col-span-1 text-sm text-gray-600">
                  {getDisplayId(index)}
                </div>

                {/* Name */}
                <div className="col-span-2 font-medium text-gray-900">
                  {coordinator.fullName}
                </div>

                {/* Email */}
                <div className="col-span-2 text-sm text-gray-600">
                  {coordinator.email}
                </div>

                {/* Phone */}
                <div className="col-span-2 text-sm text-gray-600">
                  {coordinator.phoneNumber || "-"}
                </div>

                {/* Status */}
                <div className="col-span-1">
                  <StatusBadge variant={coordinator.isActive ? "active" : "inactive"}>
                    {coordinator.isActive ? "active" : "inactive"}
                  </StatusBadge>
                </div>

                {/* Permissions */}
                <div className="col-span-2 flex flex-wrap gap-1">
                  {defaultPermissions.map((perm) => (
                    <StatusBadge key={perm} variant="permission" className="text-xs">
                      {perm}
                    </StatusBadge>
                  ))}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-center gap-1">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleToggleAccess(coordinator.id, coordinator.isActive)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Key className="h-4 w-4" />
                  </button>

                  <Dialog open={deleteConfirmId === coordinator.id} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
                    <DialogTrigger asChild>
                      <button
                        onClick={() => setDeleteConfirmId(coordinator.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
