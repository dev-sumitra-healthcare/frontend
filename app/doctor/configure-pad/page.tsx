"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  FileText, 
  Printer, 
  Upload, 
  Activity, 
  GripVertical,
  Heart,
  Thermometer,
  Scale,
  Ruler,
  Wind,
  Stethoscope,
  Pill,
  Save,
  Check,
  Loader2,
  LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  updateDoctorPreferences, 
  getDoctorProfile, 
  getVitalsDefinitions, 
  VitalDefinition 
} from "@/lib/api";
import { toast } from "sonner";

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
const fallbackVitals = [
  { id: "bp", name: "Blood Pressure", icon: Heart },
  { id: "pulse", name: "Pulse Rate", icon: Activity },
  { id: "temp", name: "Temperature", icon: Thermometer },
  { id: "weight", name: "Weight", icon: Scale },
  { id: "height", name: "Height", icon: Ruler },
  { id: "spo2", name: "SpO2", icon: Wind },
];

// Encounter form widgets
const encounterWidgets = [
  { id: "vitals", name: "Vitals", icon: Activity, description: "Blood pressure, pulse, temperature" },
  { id: "symptoms", name: "Symptoms", icon: Stethoscope, description: "Chief complaint and history" },
  { id: "diagnosis", name: "Diagnosis", icon: FileText, description: "Diagnosis codes and notes" },
  { id: "medications", name: "Medications", icon: Pill, description: "Prescriptions and drugs" },
  { id: "notes", name: "Clinical Notes", icon: FileText, description: "Doctor's remarks and observations" },
];

interface VitalItem {
  id: string;
  name: string;
  icon: LucideIcon;
  enabled: boolean;
}

// Draggable list component
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

export default function ConfigurePadPage() {
  const [activeTab, setActiveTab] = useState("prescription");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Vitals state
  const [vitalsOrder, setVitalsOrder] = useState<VitalItem[]>([]);
  
  // Encounter form state
  const [encounterOrder, setEncounterOrder] = useState(encounterWidgets);

  // Load vitals from API and preferences
  useEffect(() => {
    loadData();
  }, []);

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
          enabled: true
        }));
      } catch (e) {
        console.warn("Failed to fetch vitals from API, using fallback:", e);
        vitalsFromApi = fallbackVitals.map(v => ({ ...v, enabled: true }));
      }

      // Load doctor preferences
      const response = await getDoctorProfile();
      const doctor = response.data.data.doctor as any;
      const prefs = doctor.ui_preferences || {};
      
      // Apply saved order and enabled state for vitals
      const enabledVitals = prefs.enabledVitals || vitalsFromApi.map(v => v.id);
      const vitalsOrderIds = prefs.vitalsOrder || vitalsFromApi.map(v => v.id);
      
      const orderedVitals = vitalsOrderIds
        .map((id: string) => {
          const vital = vitalsFromApi.find(v => v.id === id);
          if (!vital) return null;
          return { ...vital, enabled: enabledVitals.includes(id) };
        })
        .filter(Boolean) as VitalItem[];
      
      const missingVitals = vitalsFromApi
        .filter(v => !vitalsOrderIds.includes(v.id))
        .map(v => ({ ...v, enabled: true }));
      
      setVitalsOrder([...orderedVitals, ...missingVitals]);
      
      // Apply saved order for encounter form
      if (prefs.encounterFormOrder?.length) {
        const orderedWidgets = prefs.encounterFormOrder
          .map((id: string) => encounterWidgets.find(w => w.id === id))
          .filter(Boolean);
        const missingWidgets = encounterWidgets.filter(w => !prefs.encounterFormOrder.includes(w.id));
        setEncounterOrder([...orderedWidgets, ...missingWidgets]);
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
      setVitalsOrder(fallbackVitals.map(v => ({ ...v, enabled: true })));
    } finally {
      setLoading(false);
    }
  };

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
      const prefsToSave = {
        vitalsOrder: vitalsOrder.map(v => v.id),
        enabledVitals: vitalsOrder.filter(v => v.enabled).map(v => v.id),
        encounterFormOrder: encounterOrder.map(w => w.id),
      };
      console.log('[ConfigurePad] Saving preferences:', prefsToSave);
      
      const response = await updateDoctorPreferences(prefsToSave);
      console.log('[ConfigurePad] Save response:', response.data);
      
      setSaved(true);
      toast.success("Settings saved successfully!");
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configure Pad</h1>
          <p className="text-sm text-gray-600">
            Customize your prescription pad, vitals, and encounter form settings
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {saving ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : saved ? (
            <><Check className="mr-2 h-4 w-4" /> Saved!</>
          ) : (
            <><Save className="mr-2 h-4 w-4" /> Save Settings</>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="prescription" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Prescription
          </TabsTrigger>
          <TabsTrigger value="vitals" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Vitals
            <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">
              {vitalsOrder.filter(v => v.enabled).length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="encounter" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Encounter
          </TabsTrigger>
        </TabsList>

        {/* Prescription Tab */}
        <TabsContent value="prescription" className="space-y-6 mt-6">
          {/* Header Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-blue-600" />
                Prescription Header
              </CardTitle>
              <CardDescription>Customize the header of your prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Clinic/Hospital Name
                  </label>
                  <Input placeholder="Enter clinic name" className="bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Address
                  </label>
                  <Input placeholder="Enter address" className="bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <Input placeholder="Enter phone number" className="bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <Input placeholder="Enter email" className="bg-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Upload className="h-5 w-5 text-blue-600" />
                Logo & Branding
              </CardTitle>
              <CardDescription>Upload your clinic logo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <Upload className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Drag and drop your logo here</p>
                <p className="text-sm text-gray-400 mb-4">PNG, JPG up to 2MB</p>
                <Button variant="outline" className="border-blue-600 text-blue-600">
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Print Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Printer className="h-5 w-5 text-blue-600" />
                Print Settings
              </CardTitle>
              <CardDescription>Configure print output</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Paper Size
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white">
                    <option>A4</option>
                    <option>A5</option>
                    <option>Letter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Orientation
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white">
                    <option>Portrait</option>
                    <option>Landscape</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Margins
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white">
                    <option>Normal</option>
                    <option>Narrow</option>
                    <option>Wide</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vitals Tab */}
        <TabsContent value="vitals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-5 w-5 text-blue-600" />
                Vitals Configuration
              </CardTitle>
              <CardDescription>
                Choose which vitals your coordinators should collect during triage. 
                Toggle vitals on/off and drag to reorder.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-500">Loading vitals...</span>
                </div>
              ) : (
                <>
                  <DraggableList
                    items={vitalsOrder}
                    onReorder={setVitalsOrder}
                    renderItem={(item, index) => (
                      <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        item.enabled 
                          ? 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50/50' 
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}>
                        <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                        <div className="flex items-center gap-2 flex-1">
                          <div className={`p-2 rounded-lg ${item.enabled ? 'bg-blue-50' : 'bg-gray-100'}`}>
                            <item.icon className={`h-4 w-4 ${item.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                          </div>
                          <span className={`font-medium ${item.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                            {item.name}
                          </span>
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
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-sm text-blue-700 flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      <strong>{vitalsOrder.filter(v => v.enabled).length}</strong> vitals enabled. 
                      Coordinators will only see these vitals during patient triage.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Encounter Tab */}
        <TabsContent value="encounter" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                Encounter Form Layout
              </CardTitle>
              <CardDescription>
                Reorder how sections appear in your encounter form. Drag items to change the order.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DraggableList
                items={encounterOrder}
                onReorder={setEncounterOrder}
                renderItem={(item, index) => (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <item.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">#{index + 1}</span>
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
