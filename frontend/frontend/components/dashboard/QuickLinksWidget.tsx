"use client";

import React from 'react';
import { Search, Calendar, BookOpen, ChevronRight, Zap } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickLink {
  name: string;
  href: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
}

const quickLinks: QuickLink[] = [
  { 
    name: 'Search for a Patient',
    href: '/patients/search',
    description: 'Find and access patient records',
    icon: Search,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  { 
    name: 'View Full Weekly Schedule',
    href: '/schedule',
    description: 'See your complete appointment calendar',
    icon: Calendar,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  { 
    name: 'Access Clinical Guidelines',
    href: '/guidelines',
    description: 'Review treatment protocols and guidelines',
    icon: BookOpen,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
];

const QuickLinksWidget = () => {
  const handleLinkClick = (href: string) => {
    console.log('Navigating to:', href);
    // In a real scenario, you would use Next.js router here:
    // router.push(href);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
        <CardDescription>Frequently used features and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Button
              key={link.name}
              variant="ghost"
              className="w-full justify-start h-auto p-4 hover:bg-muted/50 transition-colors"
              onClick={() => handleLinkClick(link.href)}
            >
              <div className="flex items-center w-full">
                <div className={`rounded-lg p-2 ${link.bgColor} mr-3`}>
                  <Icon className={`h-4 w-4 ${link.color}`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-foreground">{link.name}</div>
                  <div className="text-sm text-muted-foreground">{link.description}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default QuickLinksWidget;
