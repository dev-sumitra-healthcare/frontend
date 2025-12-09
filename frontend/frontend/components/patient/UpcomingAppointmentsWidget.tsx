"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, User, Stethoscope } from 'lucide-react';
import { getMyUpcomingAppointments, PatientUpcomingAppointment } from '@/lib/api';

function formatDateTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit'
    });
  } catch {
    return iso;
  }
}

export default function UpcomingAppointmentsWidget() {
  const [items, setItems] = useState<PatientUpcomingAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const resp = await getMyUpcomingAppointments({ status: 'scheduled' });
        setItems(resp.data.data || []);
        setError(null);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Your Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse h-20 rounded-md bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Your Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Your Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">You have no upcoming appointments</p>
        ) : (
          <div className="space-y-3">
            {items.slice(0, 3).map((a) => (
              <div key={a.appointmentId} className="flex items-center justify-between border rounded-md p-4">
                <div className="flex items-center gap-3">
                  <CalendarClock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">{formatDateTime(a.scheduledTime)}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="flex items-center gap-1"><Stethoscope className="h-4 w-4" />{a.practitioner.fullName || '—'}</span>
                      <span>•</span>
                      <span>{a.practitioner.specialty || '—'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>Reschedule</Button>
                  <Button variant="ghost" size="sm" disabled>Cancel</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
