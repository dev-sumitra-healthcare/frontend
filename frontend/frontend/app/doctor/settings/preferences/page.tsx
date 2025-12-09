"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  GripVertical, 
  Save,
  RotateCcw,
  Activity,
  Stethoscope,
  Pill,
  FileText,
  Heart,
  Thermometer,
  Scale,
  Ruler,
  Wind,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateDoctorPreferences, getDoctorProfile } from "@/lib/api";
import { toast } from "sonner";

// Widget definitions for encounter form
const encounterWidgets = [
  { id: "vitals", name: "Vitals", icon: Activity, description: "Blood pressure, pulse, temperature" },
  { id: "symptoms", name: "Symptoms", icon: Stethoscope, description: "Chief complaint and history" },
  { id: "diagnosis", name: "Diagnosis", icon: FileText, description: "Diagnosis codes and notes" },
  { id: "medications", name: "Medications", icon: Pill, description: "Prescriptions and drugs" },
  { id: "notes", name: "Clinical Notes", icon: FileText, description: "Doctor's remarks and observations" },
];

// Vitals definitions
const vitalsItems = [
  { id: "bp", name: "Blood Pressure", icon: Heart },
  { id: "pulse", name: "Pulse Rate", icon: Activity },
  { id: "temp", name: "Temperature", icon: Thermometer },
  { id: "weight", name: "Weight", icon: Scale },
  { id: "height", name: "Height", icon: Ruler },
  { id: "spo2", name: "SpO2", icon: Wind },
];

// Simple drag-and-drop list using HTML5 API
function DraggableList({ 
  items, 
  onReorder, 
  renderItem 
}: { 
  items: any[]; 
  onReorder: (items: any[]) => void;
  renderItem: (item: any, index: number) => React.ReactNode;
}) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newItems = [...items];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(dragOverIndex, 0, draggedItem);
      onReorder(newItems);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`
            transition-all duration-200 cursor-move
            ${draggedIndex === index ? "opacity-50 scale-95" : ""}
            ${dragOverIndex === index ? "ring-2 ring-blue-400 ring-offset-2" : ""}
          `}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

export default function PreferencesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Preferences state
  const [vitalsOrder, setVitalsOrder] = useState(vitalsItems);
  const [encounterOrder, setEncounterOrder] = useState(encounterWidgets);
  const [defaultView, setDefaultView] = useState<"compact" | "detailed" | "minimal">("detailed");

  // Load current preferences
  useEffect(() => {
    const loadPreferences = async () => {
      setLoading(true);
      try {
        const response = await getDoctorProfile();
        const doctor = response.data.data.doctor as any;
        const prefs = doctor.ui_preferences || {};
        
        if (prefs.vitalsOrder?.length) {
          const orderedVitals = prefs.vitalsOrder
            .map((id: string) => vitalsItems.find(v => v.id === id))
            .filter(Boolean);
          // Add any missing items at the end
          const missingVitals = vitalsItems.filter(v => !prefs.vitalsOrder.includes(v.id));
          setVitalsOrder([...orderedVitals, ...missingVitals]);
        }
        
        if (prefs.encounterFormOrder?.length) {
          const orderedWidgets = prefs.encounterFormOrder
            .map((id: string) => encounterWidgets.find(w => w.id === id))
            .filter(Boolean);
          const missingWidgets = encounterWidgets.filter(w => !prefs.encounterFormOrder.includes(w.id));
          setEncounterOrder([...orderedWidgets, ...missingWidgets]);
        }
        
        if (prefs.defaultView) {
          setDefaultView(prefs.defaultView);
        }
      } catch (error) {
        console.error("Failed to load preferences:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPreferences();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateDoctorPreferences({
        vitalsOrder: vitalsOrder.map(v => v.id),
        encounterFormOrder: encounterOrder.map(w => w.id),
        defaultView
      });
      setSaved(true);
      toast.success("Preferences saved successfully!");
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setVitalsOrder(vitalsItems);
    setEncounterOrder(encounterWidgets);
    setDefaultView("detailed");
    toast.info("Preferences reset to defaults");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configure Your Pad</h1>
            <p className="text-gray-500">Customize your encounter form layout</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </span>
            ) : saved ? (
              <span className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                Saved!
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Default View Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Default View Mode</CardTitle>
          <CardDescription>Choose how your encounter form displays by default</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={defaultView} 
            onValueChange={(v: string) => setDefaultView(v as "compact" | "detailed" | "minimal")}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="compact" id="compact" className="peer sr-only" />
              <Label
                htmlFor="compact"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600 cursor-pointer"
              >
                <span className="font-medium">Compact</span>
                <span className="text-xs text-muted-foreground text-center mt-1">Minimal space, dense layout</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="detailed" id="detailed" className="peer sr-only" />
              <Label
                htmlFor="detailed"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600 cursor-pointer"
              >
                <span className="font-medium">Detailed</span>
                <span className="text-xs text-muted-foreground text-center mt-1">Full information display</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="minimal" id="minimal" className="peer sr-only" />
              <Label
                htmlFor="minimal"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600 cursor-pointer"
              >
                <span className="font-medium">Minimal</span>
                <span className="text-xs text-muted-foreground text-center mt-1">Essential fields only</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Vitals Order */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Vitals Order
            </CardTitle>
            <CardDescription>Drag to reorder how vitals appear in your form</CardDescription>
          </CardHeader>
          <CardContent>
            <DraggableList
              items={vitalsOrder}
              onReorder={setVitalsOrder}
              renderItem={(item, index) => (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <div className="flex items-center gap-2 flex-1">
                    <div className="p-1.5 bg-white rounded border">
                      <item.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">#{index + 1}</span>
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* Encounter Form Sections */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Form Sections Order
            </CardTitle>
            <CardDescription>Drag to reorder encounter form sections</CardDescription>
          </CardHeader>
          <CardContent>
            <DraggableList
              items={encounterOrder}
              onReorder={setEncounterOrder}
              renderItem={(item, index) => (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white rounded border">
                        <item.icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 ml-9 mt-0.5">{item.description}</p>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">#{index + 1}</span>
                </div>
              )}
            />
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
          <CardDescription>Your encounter form will display in this order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {encounterOrder.map((section, i) => (
              <div 
                key={section.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border shadow-sm text-sm"
              >
                <span className="text-blue-600 font-semibold">{i + 1}</span>
                <span>{section.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
