"use client";

import { Calendar, Search, Clock, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BookAppointmentPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-sm text-gray-600">
          Schedule a new appointment for your patients
        </p>
      </div>

      {/* Search Patient */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Search Patient
        </h2>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by patient name, UHID, or phone number..."
              className="pl-10 bg-white"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Search
          </Button>
        </div>
      </div>

      {/* Available Slots Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Available Slots
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Selection */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Select Date</span>
            </div>
            <Input type="date" className="bg-white" />
          </div>

          {/* Time Slots */}
          <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Available Time Slots</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", "03:00 PM"].map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  className="text-sm border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Patients
        </h2>
        <div className="space-y-3">
          {[
            { name: "Robert Wilson", uhid: "UHID2024001", lastVisit: "Dec 5, 2024" },
            { name: "Emily Brown", uhid: "UHID2024002", lastVisit: "Dec 4, 2024" },
            { name: "Michael Davis", uhid: "UHID2024003", lastVisit: "Dec 3, 2024" },
          ].map((patient) => (
            <div
              key={patient.uhid}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{patient.name}</p>
                  <p className="text-sm text-gray-500">{patient.uhid}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last visit</p>
                <p className="text-sm text-gray-700">{patient.lastVisit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
