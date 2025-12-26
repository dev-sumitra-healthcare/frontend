"use client";

import { Heart, Fingerprint, Copy, Check } from "lucide-react";
import { useState } from "react";

interface DigitalMIDCardProps {
  patientName: string;
  mid: string;
  dob?: string;
  gender?: string;
}

export function DigitalMIDCard({ patientName, mid, dob, gender }: DigitalMIDCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#9810fa] to-[#7c3aed] p-6 text-white shadow-glow-patient">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">MedMitra</p>
              <p className="text-xs text-white/60">Digital Health ID</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Fingerprint className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Patient Name */}
        <div className="mb-4">
          <p className="text-sm text-white/70 mb-1">Patient Name</p>
          <p className="text-2xl font-bold">{patientName}</p>
        </div>

        {/* MID Number */}
        <div className="mb-4">
          <p className="text-sm text-white/70 mb-1">Universal Health ID</p>
          <div className="flex items-center gap-3">
            <p className="text-xl font-mono font-bold tracking-wider">{mid}</p>
            <button 
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              title="Copy MID"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-300" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex gap-6 pt-4 border-t border-white/20">
          {dob && (
            <div>
              <p className="text-xs text-white/60">Date of Birth</p>
              <p className="text-sm font-medium">{dob}</p>
            </div>
          )}
          {gender && (
            <div>
              <p className="text-xs text-white/60">Gender</p>
              <p className="text-sm font-medium capitalize">{gender}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
