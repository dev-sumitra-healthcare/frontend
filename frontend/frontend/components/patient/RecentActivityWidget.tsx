"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ClipboardList, FlaskConical, ChevronRight } from 'lucide-react';
import { getMyRecentActivity, PatientActivityItem } from '@/lib/api';

function iconFor(type: string) {
  if (type.toLowerCase().includes('lab')) return <FlaskConical className="h-4 w-4" />;
  return <ClipboardList className="h-4 w-4" />;
}

function formatLongDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function RecentActivityWidget() {
  const [items, setItems] = useState<PatientActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const resp = await getMyRecentActivity();
        setItems(resp.data.data || []);
        setError(null);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load activity');
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
          <CardTitle>Your Recent Health Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse h-14 rounded-md bg-muted" />
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
          <CardTitle>Your Recent Health Activity</CardTitle>
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
        <CardTitle>Your Recent Health Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity found</p>
        ) : (
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.activityId}>
                <Link href={item.link} className="flex items-center justify-between py-3 hover:bg-muted/50 px-2 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="text-primary">{iconFor(item.type)}</div>
                    <div>
                      <div className="font-medium">{item.type}</div>
                      <div className="text-sm text-muted-foreground">{formatLongDate(item.date)} • {item.summary}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
