"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, X } from "lucide-react";
import { createTemplate, CreateTemplateRequest } from "@/lib/api";
import { toast } from "sonner";

type SectionType = "medications" | "advice" | "tests" | "custom";

interface TemplateSection {
  type: SectionType;
  title: string;
  content?: string;
}

export default function NewTemplatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState<TemplateSection[]>([
    { type: "medications", title: "Medications", content: "" },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string; header: string; footer: string }>();

  const addSection = () => {
    setSections([...sections, { type: "custom", title: "", content: "" }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (
    index: number,
    field: keyof TemplateSection,
    value: string
  ) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  const onSubmit = async (data: {
    name: string;
    header: string;
    footer: string;
  }) => {
    try {
      setSaving(true);

      const payload: CreateTemplateRequest = {
        name: data.name,
        header: data.header || undefined,
        footer: data.footer || undefined,
        elements: {
          sections: sections.filter((s) => s.title.trim() !== ""),
        },
      };

      await createTemplate(payload);
      toast.success("Template created successfully");
      router.push("/dashboard/templates");
    } catch (error: any) {
      console.error("Failed to create template:", error);
      toast.error(
        error.response?.data?.message || "Failed to create template"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/templates")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Templates
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              New Prescription Template
            </h1>
            <p className="text-muted-foreground">
              Create a reusable template for prescriptions
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-card rounded-lg border shadow-sm p-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Template Name *
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", { required: "Template name is required" })}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Standard Antibiotic Prescription"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="header"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Header (Optional)
                </label>
                <textarea
                  id="header"
                  {...register("header")}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Custom header text for the prescription"
                />
              </div>

              <div>
                <label
                  htmlFor="footer"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Footer (Optional)
                </label>
                <textarea
                  id="footer"
                  {...register("footer")}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Custom footer text for the prescription"
                />
              </div>
            </div>

            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Template Sections
                </h2>
                <Button type="button" size="sm" onClick={addSection}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              </div>

              <div className="space-y-4">
                {sections.map((section, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Section Type
                            </label>
                            <select
                              value={section.type}
                              onChange={(e) =>
                                updateSection(
                                  index,
                                  "type",
                                  e.target.value as SectionType
                                )
                              }
                              className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                              <option value="medications">Medications</option>
                              <option value="advice">Advice</option>
                              <option value="tests">Tests</option>
                              <option value="custom">Custom</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Section Title
                            </label>
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) =>
                                updateSection(index, "title", e.target.value)
                              }
                              className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                              placeholder="Section title"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Default Content (Optional)
                          </label>
                          <textarea
                            value={section.content || ""}
                            onChange={(e) =>
                              updateSection(index, "content", e.target.value)
                            }
                            rows={2}
                            className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Default content for this section"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSection(index)}
                        className="ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/templates")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Creating..." : "Create Template"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}
