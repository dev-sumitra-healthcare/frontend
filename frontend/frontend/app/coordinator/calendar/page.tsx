"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";

// Mock data for demonstration
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Dr. Smith - General Checkup",
    start: new Date().toISOString().split("T")[0] + "T09:00:00",
    end: new Date().toISOString().split("T")[0] + "T09:30:00",
    backgroundColor: "#3b82f6", // blue-500
    borderColor: "#3b82f6",
  },
  {
    id: "2",
    title: "Dr. Jones - Cardiology Consult",
    start: new Date().toISOString().split("T")[0] + "T10:00:00",
    end: new Date().toISOString().split("T")[0] + "T11:00:00",
    backgroundColor: "#ef4444", // red-500
    borderColor: "#ef4444",
  },
  {
    id: "3",
    title: "Dr. Smith - Follow-up",
    start: new Date().toISOString().split("T")[0] + "T14:00:00",
    end: new Date().toISOString().split("T")[0] + "T14:30:00",
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
];

export default function CoordinatorCalendar() {
  const [events, setEvents] = useState(MOCK_EVENTS);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Master Schedule</h1>
          <p className="text-gray-600 mt-2">
            Manage appointments across all departments and doctors.
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter View
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hospital Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[700px] [&_.fc-toolbar-title]:text-xl [&_.fc-button]:bg-primary [&_.fc-button]:border-primary [&_.fc-button:hover]:bg-primary/90">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={events}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              height="100%"
              slotMinTime="08:00:00"
              slotMaxTime="20:00:00"
              allDaySlot={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
