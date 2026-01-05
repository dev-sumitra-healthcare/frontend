'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Activity, DollarSign, CheckCircle, Loader2, Heart, Thermometer, Scale, Ruler, Wind, LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { createTriageEncounter, getAppointmentVitalsConfig, VitalDefinition } from '@/lib/api';

type TabType = 'vitals' | 'payment';

interface PatientInfo {
  uhid: string;
  name: string;
  age: number;
  gender: string;
  appointmentTime: string;
}

interface VitalsData {
  [key: string]: string;
}

// Icon mapping for vitals
const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  activity: Activity,
  thermometer: Thermometer,
  scale: Scale,
  ruler: Ruler,
  wind: Wind,
};

interface PaymentData {
  consultationFee: number;
  additionalCharges: number;
  paymentMethod: string;
}

export default function PreEncounterPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.id as string;

  const [activeTab, setActiveTab] = useState<TabType>('vitals');
  const [vitalsCompleted, setVitalsCompleted] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Vitals configuration from doctor's settings
  const [enabledVitals, setEnabledVitals] = useState<VitalDefinition[]>([]);
  const [doctorName, setDoctorName] = useState('');

  // Patient info (in real app, fetch from API)
  const [patient, setPatient] = useState<PatientInfo>({
    uhid: 'UHID2024001',
    name: 'Robert Wilson',
    age: 45,
    gender: 'Male',
    appointmentTime: '09:00 AM'
  });

  // Vitals form state - dynamic based on enabled vitals
  const [vitals, setVitals] = useState<VitalsData>({});

  // Payment form state
  const [payment, setPayment] = useState<PaymentData>({
    consultationFee: 150,
    additionalCharges: 0,
    paymentMethod: ''
  });

  // Fetch vitals configuration from doctor's settings
  useEffect(() => {
    const fetchVitalsConfig = async () => {
      try {
        const response = await getAppointmentVitalsConfig(appointmentId);
        const { vitalsConfig, doctorName: name } = response.data.data;
        
        // Filter to only enabled vitals
        const enabled = vitalsConfig.filter((v: any) => v.isEnabled === true);
        setEnabledVitals(enabled);
        setDoctorName(name);
        
        // Initialize vitals state
        const initialVitals: VitalsData = {};
        enabled.forEach((v: any) => {
          initialVitals[v.key] = '';
        });
        setVitals(initialVitals);
      } catch (error) {
        console.warn('Failed to fetch vitals config, using defaults');
        // Fallback to all vitals
        setVitals({ bp: '', pulse: '', temp: '', weight: '', height: '', spo2: '' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchVitalsConfig();
  }, [appointmentId]);

  const handleSaveVitals = async () => {
    // Check if at least one vital is filled
    const hasVitals = Object.values(vitals).some(v => v && v.trim());
    if (!hasVitals) {
      toast.error('Please enter at least one vital sign');
      return;
    }

    setSaving(true);
    try {
      // Build vitals object with proper type conversion
      const vitalsPayload: any = {};
      Object.entries(vitals).forEach(([key, value]) => {
        if (value && value.trim()) {
          // bp stays as string, others convert to number
          if (key === 'bp') {
            vitalsPayload.bp = value;
          } else {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              vitalsPayload[key] = numValue;
            }
          }
        }
      });
      
      await createTriageEncounter(appointmentId, { vitals: vitalsPayload });
      
      setVitalsCompleted(true);
      setActiveTab('payment');
      toast.success('Vitals saved successfully');
    } catch (error: any) {
      console.error('Error saving vitals:', error);
      toast.error(error.response?.data?.message || 'Failed to save vitals');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkPaymentCompleted = async () => {
    if (!payment.paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setSaving(true);
    try {
      // Call the triage API to save payment (amount as decimal string)
      const totalAmount = payment.consultationFee + payment.additionalCharges;
      await createTriageEncounter(appointmentId, {
        payment: {
          amount: totalAmount.toFixed(2),
          method: payment.paymentMethod as 'Cash' | 'UPI' | 'Card' | 'Insurance',
          status: 'paid'
        }
      });
      
      setPaymentCompleted(true);
      toast.success('Payment marked as completed');
    } catch (error: any) {
      console.error('Error saving payment:', error);
      toast.error(error.response?.data?.message || 'Failed to save payment');
    } finally {
      setSaving(false);
    }
  };

  const handleSendToDoctor = async () => {
    router.push('/coordinator/dashboard');
    toast.success('Patient sent to doctor queue');
  };

  const totalAmount = payment.consultationFee + payment.additionalCharges;
  const canSendToDoctor = vitalsCompleted && paymentCompleted;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link and Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/coordinator/dashboard')}
          className="flex items-center gap-1 text-[14px] text-[#475467] hover:text-[#101828] transition-colors"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Queue
        </button>
        <div>
          <h2 className="text-[20px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Pre-Encounter - {patient.name}
          </h2>
          <p className="text-[14px] text-[#475467]" style={{ fontFamily: 'Inter, sans-serif' }}>
            UHID: {patient.uhid}
          </p>
        </div>
      </div>

      {/* Patient Information Card */}
      <div className="bg-white rounded-[16px] shadow-sm p-6">
        <h3 className="text-[16px] font-semibold text-[#101828] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Patient Information
        </h3>
        <div className="bg-[#f9fafb] rounded-lg p-4">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-[12px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>UHID</p>
              <p className="text-[14px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>{patient.uhid}</p>
            </div>
            <div>
              <p className="text-[12px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Name</p>
              <p className="text-[14px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>{patient.name}</p>
            </div>
            <div>
              <p className="text-[12px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Age / Gender</p>
              <p className="text-[14px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>{patient.age}Y / {patient.gender}</p>
            </div>
            <div>
              <p className="text-[12px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Appointment Time</p>
              <p className="text-[14px] font-medium text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>{patient.appointmentTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vitals/Payment Tabs and Forms */}
      <div className="bg-white rounded-[16px] shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('vitals')}
            className={`flex items-center gap-2 px-6 py-4 text-[14px] border-b-2 transition-colors ${
              activeTab === 'vitals'
                ? 'text-[#2563eb] border-[#2563eb] font-medium'
                : 'text-[#475467] border-transparent'
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <Activity className="w-4 h-4" />
            Vitals
            {vitalsCompleted && <CheckCircle className="w-4 h-4 text-[#10B981]" />}
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-2 px-6 py-4 text-[14px] border-b-2 transition-colors ${
              activeTab === 'payment'
                ? 'text-[#2563eb] border-[#2563eb] font-medium'
                : 'text-[#475467] border-transparent'
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <DollarSign className="w-4 h-4" />
            Payment
            {paymentCompleted && <CheckCircle className="w-4 h-4 text-[#10B981]" />}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'vitals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[16px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Record Vitals
                </h4>
                {doctorName && (
                  <span className="text-sm text-gray-500">Dr. {doctorName}'s configuration</span>
                )}
              </div>
              
              {enabledVitals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Loading vitals configuration...</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {enabledVitals.map((vital) => {
                    const IconComponent = iconMap[vital.icon || 'activity'] || Activity;
                    return (
                      <div key={vital.key}>
                        <label className="block text-[13px] text-[#475467] mb-2 flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <IconComponent className={`w-4 h-4 ${vital.color || 'text-gray-500'}`} />
                          {vital.name} {vital.unit && `(${vital.unit})`}
                        </label>
                        <input
                          type={vital.input_type === 'text' ? 'text' : 'number'}
                          step={vital.input_type === 'number' ? '0.1' : undefined}
                          value={vitals[vital.key] || ''}
                          onChange={(e) => setVitals({ ...vitals, [vital.key]: e.target.value })}
                          placeholder={vital.placeholder || ''}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                onClick={handleSaveVitals}
                disabled={saving || enabledVitals.length === 0}
                className="w-full py-3 bg-[#2563eb] text-white rounded-lg text-[14px] font-medium hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving...' : 'Save Vitals & Continue to Payment'}
              </button>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h4 className="text-[16px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Payment Details
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-[#475467] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Consultation Fee
                  </label>
                  <input
                    type="number"
                    value={payment.consultationFee}
                    onChange={(e) => setPayment({ ...payment, consultationFee: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-[#475467] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Additional Charges
                  </label>
                  <input
                    type="number"
                    value={payment.additionalCharges}
                    onChange={(e) => setPayment({ ...payment, additionalCharges: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-[#f3f4f6] rounded-lg p-4">
                <p className="text-[12px] text-[#475467] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Total Amount</p>
                <p className="text-[20px] font-bold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>₹{totalAmount}</p>
              </div>

              <div>
                <label className="block text-[13px] text-[#475467] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Payment Method
                </label>
                <select
                  value={payment.paymentMethod}
                  onChange={(e) => setPayment({ ...payment, paymentMethod: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <option value="">Select payment method</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Insurance">Insurance</option>
                </select>
              </div>

              {!paymentCompleted ? (
                <button
                  onClick={handleMarkPaymentCompleted}
                  disabled={saving}
                  className="w-full py-3 bg-[#2563eb] text-white rounded-lg text-[14px] font-medium hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Saving...' : 'Mark Payment as Completed'}
                </button>
              ) : (
                <div className="flex items-center gap-2 py-3 px-4 bg-[#d1fae5] text-[#10B981] rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-[14px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Payment Completed</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ready for Doctor Section */}
      <div className="bg-white rounded-[16px] shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-[16px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Ready for Doctor
            </h4>
            <p className="text-[13px] text-[#475467]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Ensure vitals and payment are complete before proceeding
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium ${
              vitalsCompleted ? 'bg-[#d1fae5] text-[#10B981]' : 'bg-gray-100 text-[#475467]'
            }`}>
              <Activity className="w-3 h-3" />
              Vitals
            </span>
            <span className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium ${
              paymentCompleted ? 'bg-[#d1fae5] text-[#10B981]' : 'bg-gray-100 text-[#475467]'
            }`}>
              <DollarSign className="w-3 h-3" />
              Payment
            </span>
          </div>
        </div>
        
        <button
          onClick={handleSendToDoctor}
          disabled={!canSendToDoctor}
          className={`w-full py-3 rounded-lg text-[14px] font-medium transition-colors ${
            canSendToDoctor
              ? 'bg-[#10B981] text-white hover:bg-[#059669]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Send to Doctor
        </button>
      </div>
    </div>
  );
}
