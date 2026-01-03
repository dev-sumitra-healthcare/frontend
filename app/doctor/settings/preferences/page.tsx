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
  Check,
  LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { updateDoctorPreferences, getDoctorProfile, getVitalsDefinitions, VitalDefinition } from "@/lib/api";
import { toast } from "sonner";

// Widget definitions for encounter form
const encounterWidgets = [
  { id: "vitals", name: "Vitals", icon: Activity, description: "Blood pressure, pulse, temperature" },
  { id: "symptoms", name: "Symptoms", icon: Stethoscope, description: "Chief complaint and history" },
  { id: "diagnosis", name: "Diagnosis", icon: FileText, description: "Diagnosis codes and notes" },
  { id: "medications", name: "Medications", icon: Pill, description: "Prescriptions and drugs" },
  { id: "notes", name: "Clinical Notes", icon: FileText, description: "Doctor's remarks and observations" },
];

// Icon mapping for vitals from database
const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  activity: Activity,
  thermometer: Thermometer,
  scale: Scale,
  ruler: Ruler,
  wind: Wind,
};

// Fallback vitals if API fails
const fallbackVitalsItems = [
  { id: "bp", name: "Blood Pressure", icon: Heart },
  { id: "pulse", name: "Pulse Rate", icon: Activity },
  { id: "temp", name: "Temperature", icon: Thermometer },
  { id: "weight", name: "Weight", icon: Scale },
  { id: "height", name: "Height", icon: Ruler },
  { id: "spo2", name: "SpO2", icon: Wind },
];

interface VitalItem {
  id: string;
  name: string;
  icon: LucideIcon;
  enabled: boolean;
}

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
  const [vitalsOrder, setVitalsOrder] = useState<VitalItem[]>([]);
  const [encounterOrder, setEncounterOrder] = useState(encounterWidgets);
  const [defaultView, setDefaultView] = useState<"compact" | "detailed" | "minimal">("detailed");

  // Load vitals from database and current preferences
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch vitals definitions from database
        let vitalsFromApi: VitalItem[] = [];
        try {
          const vitalsResponse = await getVitalsDefinitions();
          vitalsFromApi = vitalsResponse.data.data.vitals.map((v: VitalDefinition) => ({
            id: v.key,
            name: v.name,
            icon: iconMap[v.icon || 'activity'] || Activity,
            enabled: true // Default all enabled
          }));
        } catch (e) {
          console.warn("Failed to fetch vitals from API, using fallback:", e);
          vitalsFromApi = fallbackVitalsItems.map(v => ({ ...v, enabled: true }));
        }

        // Load doctor preferences
        const response = await getDoctorProfile();
        const doctor = response.data.data.doctor as any;
        const prefs = doctor.ui_preferences || {};
        
        // Apply saved order and enabled state
        const enabledVitals = prefs.enabledVitals || vitalsFromApi.map(v => v.id);
        const vitalsOrderIds = prefs.vitalsOrder || vitalsFromApi.map(v => v.id);
        
        // Reorder vitals based on saved order and set enabled state
        const orderedVitals = vitalsOrderIds
          .map((id: string) => {
            const vital = vitalsFromApi.find(v => v.id === id);
            if (!vital) return null;
            return { ...vital, enabled: enabledVitals.includes(id) };
          })
          .filter(Boolean) as VitalItem[];
        
        // Add any new vitals from DB that aren't in the saved order
        const missingVitals = vitalsFromApi
          .filter(v => !vitalsOrderIds.includes(v.id))
          .map(v => ({ ...v, enabled: true }));
        
        setVitalsOrder([...orderedVitals, ...missingVitals]);
        
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
        // Fallback to hardcoded vitals
        setVitalsOrder(fallbackVitalsItems.map(v => ({ ...v, enabled: true })));
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Toggle vital enabled state
  const toggleVitalEnabled = (vitalId: string) => {
    setVitalsOrder(prev => 
      prev.map(v => 
        v.id === vitalId ? { ...v, enabled: !v.enabled } : v
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateDoctorPreferences({
        vitalsOrder: vitalsOrder.map(v => v.id),
        enabledVitals: vitalsOrder.filter(v => v.enabled).map(v => v.id),
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
    setVitalsOrder(prev => prev.map(v => ({ ...v, enabled: true })));
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
              Vitals Configuration
            </CardTitle>
            <CardDescription>Toggle vitals on/off and drag to reorder. Coordinators will only see enabled vitals.</CardDescription>
          </CardHeader>
          <CardContent>
            <DraggableList
              items={vitalsOrder}
              onReorder={setVitalsOrder}
              renderItem={(item, index) => (
                <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  item.enabled 
                    ? 'bg-gray-50 border-gray-200 hover:border-blue-200 hover:bg-blue-50/50' 
                    : 'bg-gray-100/50 border-gray-200 opacity-60'
                }`}>
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <div className="flex items-center gap-2 flex-1">
                    <div className={`p-1.5 rounded border ${item.enabled ? 'bg-white' : 'bg-gray-200'}`}>
                      <item.icon className={`h-4 w-4 ${item.enabled ? 'text-gray-600' : 'text-gray-400'}`} />
                    </div>
                    <span className={`font-medium text-sm ${item.enabled ? '' : 'text-gray-400'}`}>{item.name}</span>
                  </div>
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={() => toggleVitalEnabled(item.id)}
                    aria-label={`Toggle ${item.name}`}
                  />
                  <span className="text-xs text-gray-400 font-mono w-6">#{index + 1}</span>
                </div>
              )}
            />
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
              <Check className="h-3 w-3" />
              {vitalsOrder.filter(v => v.enabled).length} vitals enabled for coordinator triage
            </p>
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
