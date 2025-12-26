"use client";

import { useState } from "react";
import { 
  X, 
  Activity, 
  CreditCard, 
  Check,
  Loader2,
  Heart,
  Thermometer,
  Scale,
  Ruler,
  Wind
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
import { createTriageEncounter, TriageVitals, TriagePayment } from "@/lib/api";
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

export function TriageModal({ 
  open, 
  onOpenChange, 
  appointmentId, 
  patient,
  onSuccess 
}: TriageModalProps) {
  const [activeTab, setActiveTab] = useState("vitals");
  const [submitting, setSubmitting] = useState(false);
  
  // Vitals state
  const [vitals, setVitals] = useState<TriageVitals>({
    bp: "",
    pulse: undefined,
    temp: undefined,
    weight: undefined,
    height: undefined
  });
  
  // Payment state
  const [payment, setPayment] = useState<Partial<TriagePayment>>({
    amount: 0,
    method: "Cash",
    status: "paid"
  });

  const handleVitalsChange = (field: keyof TriageVitals, value: string) => {
    setVitals(prev => ({
      ...prev,
      [field]: field === "bp" ? value : value ? parseFloat(value) : undefined
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
      await createTriageEncounter(appointmentId, {
        vitals: Object.keys(vitals).some(k => vitals[k as keyof TriageVitals]) 
          ? vitals 
          : undefined,
        payment: payment.amount && payment.amount > 0 
          ? payment as TriagePayment 
          : undefined
      });
      
      toast.success("Triage completed! Patient is now waiting for doctor.");
      onOpenChange(false);
      onSuccess?.();
      
      // Reset form
      setVitals({ bp: "", pulse: undefined, temp: undefined, weight: undefined, height: undefined });
      setPayment({ amount: 0, method: "Cash", status: "paid" });
    } catch (error: any) {
      console.error("Triage failed:", error);
      toast.error(error.response?.data?.message || "Failed to complete triage");
    } finally {
      setSubmitting(false);
    }
  };

  const isVitalsValid = vitals.bp || vitals.pulse || vitals.temp || vitals.weight;
  const isPaymentValid = payment.amount && payment.amount > 0;

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
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vitals" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Vitals
              {isVitalsValid && <Check className="h-3 w-3 text-green-600" />}
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment
              {isPaymentValid && <Check className="h-3 w-3 text-green-600" />}
            </TabsTrigger>
          </TabsList>

          {/* Vitals Tab */}
          <TabsContent value="vitals" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bp" className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Blood Pressure
                </Label>
                <Input
                  id="bp"
                  placeholder="120/80"
                  value={vitals.bp || ""}
                  onChange={(e) => handleVitalsChange("bp", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pulse" className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-pink-500" />
                  Pulse (bpm)
                </Label>
                <Input
                  id="pulse"
                  type="number"
                  placeholder="72"
                  value={vitals.pulse || ""}
                  onChange={(e) => handleVitalsChange("pulse", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="temp" className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  Temperature (°F)
                </Label>
                <Input
                  id="temp"
                  type="number"
                  step="0.1"
                  placeholder="98.6"
                  value={vitals.temp || ""}
                  onChange={(e) => handleVitalsChange("temp", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-blue-500" />
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70"
                  value={vitals.weight || ""}
                  onChange={(e) => handleVitalsChange("weight", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height" className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-green-500" />
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={vitals.height || ""}
                  onChange={(e) => handleVitalsChange("height", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="spo2" className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-cyan-500" />
                  SpO2 (%)
                </Label>
                <Input
                  id="spo2"
                  type="number"
                  placeholder="98"
                  disabled
                />
              </div>
            </div>
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

              {payment.status === "paid" && payment.amount && payment.amount > 0 && (
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
            disabled={submitting || (!isVitalsValid && !isPaymentValid)}
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
