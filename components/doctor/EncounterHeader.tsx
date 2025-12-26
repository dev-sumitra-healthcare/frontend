"use client";

import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EncounterHeaderProps {
  patientName: string;
  uhid: string;
  onBack: () => void;
  onPreview?: () => void;
}

export default function EncounterHeader({
  patientName,
  uhid,
  onBack,
  onPreview,
}: EncounterHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 -mt-8 -mx-4 md:-mx-8 xl:-mx-[44px] px-4 md:px-8 xl:px-[44px] py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Section: Back Button and Patient Info */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Queue</span>
          </Button>
          <div className="border-l border-gray-300 pl-4">
            <h1 className="text-lg md:text-xl font-bold text-gray-900">
              Encounter - {patientName}
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">UHID: {uhid}</p>
          </div>
        </div>

        {/* Right Section: Preview Button */}
        {onPreview && (
          <Button
            variant="outline"
            onClick={onPreview}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </Button>
        )}
      </div>
    </div>
  );
}
