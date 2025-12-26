"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPatients } from "@/lib/api";
import { QuickAddPatientModal } from "./QuickAddPatientModal";
import { PlusCircle } from "lucide-react";

interface PatientItem {
  id: string;
  fullName?: string;
  full_name?: string;
  uhid?: string;
  email?: string;
  phoneNumber?: string;
}

export default function PatientsList() {
  const router = useRouter();
  const [items, setItems] = useState<PatientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: 1,
        limit: 20,
        scope: 'my', // Doctors can only see their own patients
        ...(query && { name: query, uhid: query }),
      };
      const resp = await getPatients(params);
      const data = resp.data?.data?.results || [];
      setItems(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePatientAdded = () => {
    // Refresh the patient list after successful addition
    fetchData(q);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Patients</CardTitle>
          <Button onClick={() => setShowAddModal(true)} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Search your patients by name or UHID"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchData(q)}
            />
            <Button variant="secondary" onClick={() => fetchData(q)}>
              Search
            </Button>
          </div>
        {loading ? (
          <div className="text-sm text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>UHID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((p, idx) => (
                  <TableRow key={p.id || idx}>
                    <TableCell>{p.fullName || p.full_name || '—'}</TableCell>
                    <TableCell>{p.uhid || '—'}</TableCell>
                    <TableCell>{(p as any).email || '—'}</TableCell>
                    <TableCell>{p.phoneNumber || (p as any).phone || '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/patients/${p.id}`)}>View</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-gray-500">No patients found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>

    <QuickAddPatientModal
      open={showAddModal}
      onOpenChange={setShowAddModal}
      onSuccess={handlePatientAdded}
    />
    </>
  );
}
