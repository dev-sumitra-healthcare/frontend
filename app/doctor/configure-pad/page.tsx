"use client";

import { Settings, FileText, Printer, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ConfigurePadPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configure Pad</h1>
        <p className="text-sm text-gray-600">
          Customize your prescription pad settings and templates
        </p>
      </div>

      {/* Header Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Prescription Header
          </h2>
        </div>
        
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
      </div>

      {/* Logo Upload */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Logo & Branding
          </h2>
        </div>
        
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <Upload className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">Drag and drop your logo here</p>
          <p className="text-sm text-gray-400 mb-4">PNG, JPG up to 2MB</p>
          <Button variant="outline" className="border-blue-600 text-blue-600">
            Browse Files
          </Button>
        </div>
      </div>

      {/* Print Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Printer className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Print Settings
          </h2>
        </div>
        
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
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
