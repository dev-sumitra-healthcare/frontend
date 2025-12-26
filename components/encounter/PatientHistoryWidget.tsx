
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PatientHistoryWidgetProps {
  data: Array<{
    id: string;
    date: string;
    type: string;
    title: string;
    details: string;
  }>;
}

export default function PatientHistoryWidget({ data }: PatientHistoryWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((event) => (
            <div key={event.id} className="border-l-2 border-blue-500 pl-4">
              <p className="text-sm font-semibold">{event.title} - {new Date(event.date).toLocaleDateString()}</p>
              <p className="text-xs text-gray-500">{event.type}</p>
              <p className="text-sm mt-1">{event.details}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
