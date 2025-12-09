"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Clock, FileText, AlertTriangle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getPerformanceStats } from '@/lib/api';

interface PerformanceStats {
  patientsSeen: number;
  patientsScheduled: number;
  avgConsultTimeMinutes: number;
  pendingDocumentation: number;
}

const PerformanceSnapshotWidget = () => {
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformanceStats = async () => {
      try {
        setLoading(true);
        const response = await getPerformanceStats();
        setPerformanceStats(response.data.data);
      } catch (err) {
        setError('Failed to fetch performance statistics.');
        console.error('Error fetching performance stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceStats();
  }, []);

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Performance Snapshot
          </CardTitle>
          <CardDescription>Your daily performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-16 bg-muted rounded-lg"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Performance Snapshot
          </CardTitle>
          <CardDescription>Unable to load performance data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-sm">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const completionRate = performanceStats ? 
    Math.round((performanceStats.patientsSeen / performanceStats.patientsScheduled) * 100) : 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Performance Snapshot
        </CardTitle>
        <CardDescription>Your daily performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {performanceStats && (
          <>
            {/* Patients Seen Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Patients Seen Today</span>
                </div>
                <span className="text-2xl font-bold text-foreground">
                  {performanceStats.patientsSeen} / {performanceStats.patientsScheduled}
                </span>
              </div>
              <div className="space-y-1">
                <Progress value={completionRate} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {completionRate}% of scheduled appointments completed
                </p>
              </div>
            </div>

            {/* Average Consultation Time */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm font-medium">Avg. Consultation Time</p>
                  <p className="text-xs text-muted-foreground">Per patient session</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{performanceStats.avgConsultTimeMinutes}</p>
                <p className="text-xs text-muted-foreground">minutes</p>
              </div>
            </div>

            {/* Pending Documentation */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <FileText className={`h-4 w-4 ${
                  performanceStats.pendingDocumentation > 0 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-green-600 dark:text-green-400'
                }`} />
                <div>
                  <p className="text-sm font-medium">Pending Documentation</p>
                  <p className="text-xs text-muted-foreground">Charts requiring completion</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${
                  performanceStats.pendingDocumentation > 0 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {performanceStats.pendingDocumentation}
                </p>
                <p className="text-xs text-muted-foreground">items</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceSnapshotWidget;