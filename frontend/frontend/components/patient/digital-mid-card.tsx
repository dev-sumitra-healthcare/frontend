"use client";

import { QrCode, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

interface DigitalMIDCardProps {
  patientName: string;
  mid: string;
  dob?: string;
  gender?: string;
}

export function DigitalMIDCard({ patientName, mid, dob, gender }: DigitalMIDCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mid);
    setCopied(true);
    toast.success("MID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white overflow-hidden relative shadow-lg border-0">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Left Side: ID Info */}
          <div className="space-y-4 text-center md:text-left">
            <div>
              <h3 className="text-sm font-medium text-purple-100 uppercase tracking-wider">MedMitra Universal ID</h3>
              <div className="flex items-center gap-2 justify-center md:justify-start mt-1">
                <span className="text-3xl font-bold tracking-tight font-mono">{mid}</span>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/20"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="font-semibold text-lg">{patientName}</p>
              <div className="flex gap-3 text-sm text-purple-100 justify-center md:justify-start">
                {dob && <span>DOB: {dob}</span>}
                {gender && <span>• {gender}</span>}
              </div>
            </div>
          </div>

          {/* Right Side: QR Code */}
          <div className="bg-white p-3 rounded-xl shadow-inner">
            {/* Placeholder for real QR Code */}
            <div className="h-32 w-32 bg-gray-900 flex items-center justify-center rounded-lg">
              <QrCode className="h-20 w-20 text-white" />
            </div>
            <p className="text-[10px] text-center text-gray-500 mt-1 font-medium">Scan at Hospital</p>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
