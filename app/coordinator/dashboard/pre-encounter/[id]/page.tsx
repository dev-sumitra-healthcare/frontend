'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Activity, DollarSign, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createTriageEncounter } from '@/lib/api';

type TabType = 'vitals' | 'payment';

interface PatientInfo {
  uhid: string;
  name: string;
  age: number;
  gender: string;
  appointmentTime: string;
}

interface VitalsData {
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  height: string;
  spO2: string;
}

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

  // Patient info (in real app, fetch from API)
  const [patient, setPatient] = useState<PatientInfo>({
    uhid: 'UHID2024001',
    name: 'Robert Wilson',
    age: 45,
    gender: 'Male',
    appointmentTime: '09:00 AM'
  });

  // Vitals form state
  const [vitals, setVitals] = useState<VitalsData>({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
    spO2: ''
  });

  // Payment form state
  const [payment, setPayment] = useState<PaymentData>({
    consultationFee: 150,
    additionalCharges: 0,
    paymentMethod: ''
  });

  useEffect(() => {
    // Simulate loading patient data
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [appointmentId]);

  const handleSaveVitals = async () => {
    if (!vitals.bloodPressure && !vitals.heartRate && !vitals.temperature) {
      toast.error('Please enter at least one vital sign');
      return;
    }

    setSaving(true);
    try {
      // Call the triage API to save vitals (convert to numbers where needed)
      await createTriageEncounter(appointmentId, {
        vitals: {
          bp: vitals.bloodPressure || undefined,
          pulse: vitals.heartRate ? parseFloat(vitals.heartRate) : undefined,
          temp: vitals.temperature ? parseFloat(vitals.temperature) : undefined,
          weight: vitals.weight ? parseFloat(vitals.weight) : undefined,
          height: vitals.height ? parseFloat(vitals.height) : undefined,
          spo2: vitals.spO2 ? parseFloat(vitals.spO2) : undefined
        }
      });
      
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
              <h4 className="text-[16px] font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Record Vitals
              </h4>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[13px] text-[#475467] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Blood Pressure (mmHg)
                  </label>
                  <input
                    type="text"
                    value={vitals.bloodPressure}
                    onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                    placeholder="120/80"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-[#475467] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="text"
                    value={vitals.heartRate}
                    onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                    placeholder="72"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-[#475467] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Temperature (°F)
                  </label>
                  <input
                    type="text"
                    value={vitals.temperature}
                    onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                    placeholder="98.6"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-[#475467] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Weight (kg)
                  </label>
                  <input
                    type="text"
                    value={vitals.weight}
                    onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                    placeholder="70"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-[#475467] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Height (cm)
                  </label>
                  <input
                    type="text"
                    value={vitals.height}
                    onChange={(e) => setVitals({ ...vitals, height: e.target.value })}
                    placeholder="170"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-[#475467] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    SpO2 (%)
                  </label>
                  <input
                    type="text"
                    value={vitals.spO2}
                    onChange={(e) => setVitals({ ...vitals, spO2: e.target.value })}
                    placeholder="98"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
              </div>

              <button
                onClick={handleSaveVitals}
                disabled={saving}
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
