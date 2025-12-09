"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, MessageCircle, ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getActionItemsSummary } from '@/lib/api';

interface ActionItems {
  newResults: number;
  consultationRequests: number;
  unreadMessages: number;
}

const ActionItemsWidget = () => {
  const [actionItems, setActionItems] = useState<ActionItems | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActionItems = async () => {
      try {
        setLoading(true);
        const response = await getActionItemsSummary();
        setActionItems(response.data.data);
      } catch (err) {
        setError('Failed to fetch action items.');
      } finally {
        setLoading(false);
      }
    };

    fetchActionItems();
  }, []);

  const handleItemClick = (itemType: keyof ActionItems) => {
    console.log(`Navigate to ${itemType} details.`);
    // In a real scenario, you would use Next.js router here:
    // router.push(`/${itemType}`);
  };

  const actionItemsData = [
    {
      key: 'newResults' as keyof ActionItems,
      title: 'New Lab Results',
      description: 'Review pending lab results',
      icon: CheckCircle,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      key: 'consultationRequests' as keyof ActionItems,
      title: 'Consultation Requests',
      description: 'Pending specialist referrals',
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      key: 'unreadMessages' as keyof ActionItems,
      title: 'Patient Messages',
      description: 'Unread patient communications',
      icon: MessageCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
  ];

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Action Items
          </CardTitle>
          <CardDescription>Review workbench and pending tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-10 w-10 bg-muted rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
              <div className="h-6 w-8 bg-muted rounded-full"></div>
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
            Action Items
          </CardTitle>
          <CardDescription>Unable to load action items</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-sm">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const totalItems = actionItems ? 
    actionItems.newResults + actionItems.consultationRequests + actionItems.unreadMessages : 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          Action Items
        </CardTitle>
        <CardDescription>
          {totalItems} item{totalItems !== 1 ? 's' : ''} requiring attention
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actionItems && actionItemsData.map((item) => {
          const Icon = item.icon;
          const count = actionItems[item.key];
          return (
            <Button
              key={item.key}
              variant="ghost"
              className="w-full justify-start h-auto p-4 hover:bg-muted/50 transition-colors"
              onClick={() => handleItemClick(item.key)}
            >
              <div className="flex items-center w-full">
                <div className={`rounded-lg p-2 ${item.bgColor} mr-3`}>
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-foreground">{item.title}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  {count > 0 && (
                    <Badge variant="secondary" className="font-semibold">
                      {count}
                    </Badge>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Button>
          );
        })}
        
        {totalItems === 0 && (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground font-medium">All caught up!</p>
            <p className="text-sm text-muted-foreground">No pending action items</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionItemsWidget;