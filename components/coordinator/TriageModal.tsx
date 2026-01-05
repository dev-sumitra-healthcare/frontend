"use client";

import { useState, useEffect } from "react";
import { 
  Activity, 
  CreditCard, 
  Check,
  Loader2,
  Heart,
  Thermometer,
  Scale,
  Ruler,
  Wind,
  LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  createTriageEncounter, 
  getAppointmentVitalsConfig, 
  TriageVitals, 
  TriagePayment,
  VitalDefinition 
} from "@/lib/api";
import { toast } from "sonner";

interface PatientInfo {
  id: string;
  name: string;
  uhid: string;
  phone?: string;
}

interface TriageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string;
  patient: PatientInfo;
  onSuccess?: () => void;
}

// Icon mapping from database key to Lucide icon
const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  activity: Activity,
  thermometer: Thermometer,
  scale: Scale,
  ruler: Ruler,
  wind: Wind,
};

// Fallback vitals configuration if API fails
const fallbackVitals: VitalDefinition[] = [
  { id: '1', key: 'bp', name: 'Blood Pressure', unit: 'mmHg', input_type: 'text', placeholder: '120/80', icon: 'heart', color: 'text-red-500', display_order: 1, is_active: true },
  { id: '2', key: 'pulse', name: 'Pulse Rate', unit: 'bpm', input_type: 'number', placeholder: '72', icon: 'activity', color: 'text-pink-500', display_order: 2, is_active: true },
  { id: '3', key: 'temp', name: 'Temperature', unit: '°F', input_type: 'number', placeholder: '98.6', icon: 'thermometer', color: 'text-orange-500', display_order: 3, is_active: true },
  { id: '4', key: 'weight', name: 'Weight', unit: 'kg', input_type: 'number', placeholder: '70', icon: 'scale', color: 'text-blue-500', display_order: 4, is_active: true },
  { id: '5', key: 'height', name: 'Height', unit: 'cm', input_type: 'number', placeholder: '170', icon: 'ruler', color: 'text-green-500', display_order: 5, is_active: true },
  { id: '6', key: 'spo2', name: 'SpO2', unit: '%', input_type: 'number', placeholder: '98', icon: 'wind', color: 'text-cyan-500', display_order: 6, is_active: true },
];

export function TriageModal({ 
  open, 
  onOpenChange, 
  appointmentId, 
  patient,
  onSuccess 
}: TriageModalProps) {
  const [activeTab, setActiveTab] = useState("vitals");
  const [submitting, setSubmitting] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [enabledVitals, setEnabledVitals] = useState<VitalDefinition[]>([]);
  const [doctorName, setDoctorName] = useState<string>("");
  
  // Dynamic vitals state (key -> value)
  const [vitals, setVitals] = useState<Record<string, string | number | undefined>>({});
  
  // Payment state
  const [payment, setPayment] = useState<Partial<TriagePayment>>({
    amount: 0,
    method: "Cash",
    status: "paid"
  });

  // Fetch vitals configuration when modal opens
  useEffect(() => {
    if (open && appointmentId) {
      fetchVitalsConfig();
    }
  }, [open, appointmentId]);

  const fetchVitalsConfig = async () => {
    setLoadingConfig(true);
    try {
      const response = await getAppointmentVitalsConfig(appointmentId);
      console.log('[TriageModal] Raw API response:', response.data);
      
      const { vitalsConfig, doctorName: name } = response.data.data;
      console.log('[TriageModal] vitalsConfig:',  vitalsConfig);
      console.log('[TriageModal] Each vital isEnabled:', vitalsConfig.map((v: any) => ({ key: v.key, isEnabled: v.isEnabled })));
      
      // Filter to only enabled vitals
      const enabled = vitalsConfig.filter((v: any) => v.isEnabled === true);
      console.log('[TriageModal] Filtered enabled vitals:', enabled.length, enabled.map((v: any) => v.key));
      
      setEnabledVitals(enabled);
      setDoctorName(name);
      
      // Initialize vitals state based on config
      const initialVitals: Record<string, string | number | undefined> = {};
      enabled.forEach((v: any) => {
        initialVitals[v.key] = v.input_type === 'text' ? '' : undefined;
      });
      setVitals(initialVitals);
    } catch (error) {
      console.warn("Failed to fetch vitals config, using fallback:", error);
      setEnabledVitals(fallbackVitals);
      const initialVitals: Record<string, string | number | undefined> = {};
      fallbackVitals.forEach(v => {
        initialVitals[v.key] = v.input_type === 'text' ? '' : undefined;
      });
      setVitals(initialVitals);
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleVitalsChange = (key: string, value: string, inputType: string) => {
    setVitals(prev => ({
      ...prev,
      [key]: inputType === 'text' ? value : value ? parseFloat(value) : undefined
    }));
  };

  const handlePaymentChange = (field: keyof TriagePayment, value: any) => {
    setPayment(prev => ({
      ...prev,
      [field]: field === "amount" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Convert dynamic vitals to TriageVitals format
      const triageVitals: TriageVitals = {
        bp: vitals.bp as string || undefined,
        pulse: vitals.pulse as number || undefined,
        temp: vitals.temp as number || undefined,
        weight: vitals.weight as number || undefined,
        height: vitals.height as number || undefined,
        spo2: vitals.spo2 as number || undefined,
      };

      const hasVitals = Object.values(vitals).some(v => v !== undefined && v !== '');
      
      await createTriageEncounter(appointmentId, {
        vitals: hasVitals ? triageVitals : undefined,
        payment: payment.amount && Number(payment.amount) > 0 
          ? payment as TriagePayment 
          : undefined
      });
      
      toast.success("Triage completed! Patient is now waiting for doctor.");
      onOpenChange(false);
      onSuccess?.();
      
      // Reset form
      const resetVitals: Record<string, string | number | undefined> = {};
      enabledVitals.forEach(v => {
        resetVitals[v.key] = v.input_type === 'text' ? '' : undefined;
      });
      setVitals(resetVitals);
      setPayment({ amount: 0, method: "Cash", status: "paid" });
    } catch (error: any) {
      console.error("Triage failed:", error);
      toast.error(error.response?.data?.message || "Failed to complete triage");
    } finally {
      setSubmitting(false);
    }
  };

  const hasVitals = Object.values(vitals).some(v => v !== undefined && v !== '');
  const isPaymentValid = payment.amount && Number(payment.amount) > 0;

  const getIcon = (iconName: string | null): LucideIcon => {
    return iconMap[iconName || 'activity'] || Activity;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Pre-Visit Triage
          </DialogTitle>
          <DialogDescription>
            Record vitals and collect payment for <span className="font-medium text-gray-900">{patient.name}</span> 
            <span className="text-gray-500 ml-1">({patient.uhid})</span>
            {doctorName && <span className="text-gray-500"> • Dr. {doctorName}</span>}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vitals" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Vitals
              {hasVitals && <Check className="h-3 w-3 text-green-600" />}
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment
              {isPaymentValid && <Check className="h-3 w-3 text-green-600" />}
            </TabsTrigger>
          </TabsList>

          {/* Vitals Tab */}
          <TabsContent value="vitals" className="space-y-4 mt-4">
            {loadingConfig ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-500">Loading vitals configuration...</span>
              </div>
            ) : enabledVitals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No vitals configured by the doctor</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {enabledVitals.map((vital) => {
                  const IconComponent = getIcon(vital.icon);
                  return (
                    <div key={vital.key} className="space-y-2">
                      <Label htmlFor={vital.key} className="flex items-center gap-2">
                        <IconComponent className={`h-4 w-4 ${vital.color || 'text-gray-500'}`} />
                        {vital.name} {vital.unit && `(${vital.unit})`}
                      </Label>
                      <Input
                        id={vital.key}
                        type={vital.input_type === 'text' ? 'text' : 'number'}
                        step={vital.input_type === 'number' ? '0.1' : undefined}
                        placeholder={vital.placeholder || ''}
                        value={vitals[vital.key] || ''}
                        onChange={(e) => handleVitalsChange(vital.key, e.target.value, vital.input_type)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Consultation Fee (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="500"
                  value={payment.amount || ""}
                  onChange={(e) => handlePaymentChange("amount", e.target.value)}
                  className="text-lg font-medium"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="method">Payment Method</Label>
                  <Select 
                    value={payment.method} 
                    onValueChange={(v) => handlePaymentChange("method", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="Insurance">Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Payment Status</Label>
                  <Select 
                    value={payment.status} 
                    onValueChange={(v) => handlePaymentChange("status", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {payment.status === "paid" && payment.amount && Number(payment.amount) > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 font-medium">Amount Received</span>
                    <span className="text-green-700 font-bold text-xl">₹{payment.amount}</span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">via {payment.method}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting || loadingConfig || (!hasVitals && !isPaymentValid)}
            className="min-w-[140px]"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Complete Triage
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
