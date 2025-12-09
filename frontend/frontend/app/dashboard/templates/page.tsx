"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import { getTemplates, deleteTemplate, PrescriptionTemplate } from "@/lib/api";
import { toast } from "sonner";

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await getTemplates({ page: 1, limit: 50 });
      setTemplates(response.data.data.results);
    } catch (error: any) {
      console.error("Failed to fetch templates:", error);
      toast.error(error.response?.data?.message || "Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      setDeleting(id);
      await deleteTemplate(id);
      toast.success("Template deleted successfully");
      fetchTemplates();
    } catch (error: any) {
      console.error("Failed to delete template:", error);
      toast.error(error.response?.data?.message || "Failed to delete template");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Prescription Templates
              </h1>
              <p className="text-muted-foreground">
                Create and manage reusable prescription templates
              </p>
            </div>
            <Button onClick={() => router.push("/dashboard/templates/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </div>

          {loading ? (
            <div className="bg-card rounded-lg border shadow-sm p-8">
              <div className="text-center text-muted-foreground">
                Loading templates...
              </div>
            </div>
          ) : templates.length === 0 ? (
            <div className="bg-card rounded-lg border shadow-sm p-12">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No templates yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first prescription template
                </p>
                <Button onClick={() => router.push("/dashboard/templates/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Template Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Sections
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {templates.map((template) => (
                      <tr
                        key={template.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-foreground">
                            {template.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-muted-foreground">
                            {template.elements?.sections?.length || 0} sections
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-muted-foreground">
                            {new Date(template.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(`/dashboard/templates/${template.id}/edit`)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(template.id)}
                            disabled={deleting === template.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
