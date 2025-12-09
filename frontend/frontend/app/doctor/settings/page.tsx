"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Settings, 
  User, 
  Palette, 
  Bell, 
  Shield,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const settingsSections = [
    {
      title: "Configure Your Pad",
      description: "Customize your encounter form layout and vitals order",
      icon: Palette,
      href: "/doctor/settings/preferences",
      badge: "New"
    },
    {
      title: "Profile Settings",
      description: "Update your personal and professional information",
      icon: User,
      href: "/doctor/profile"
    },
    {
      title: "Notifications",
      description: "Manage your notification preferences",
      icon: Bell,
      href: "/doctor/settings/notifications",
      disabled: true
    },
    {
      title: "Security",
      description: "Password and security settings",
      icon: Shield,
      href: "/doctor/settings/security",
      disabled: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your account and preferences</p>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {settingsSections.map((section) => (
          <Link 
            key={section.title} 
            href={section.disabled ? "#" : section.href}
            className={section.disabled ? "cursor-not-allowed" : ""}
          >
            <Card className={`h-full transition-all hover:shadow-md ${
              section.disabled 
                ? "opacity-50" 
                : "hover:border-blue-200 cursor-pointer"
            }`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    section.badge ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <section.icon className={`h-5 w-5 ${
                      section.badge ? "text-blue-600" : "text-gray-600"
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-semibold">
                        {section.title}
                      </CardTitle>
                      {section.badge && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                          {section.badge}
                        </span>
                      )}
                    </div>
                    <CardDescription className="text-sm">
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Account Info */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium">{user.fullName || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Specialty</span>
              <span className="font-medium">{user.specialty || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Account Status</span>
              <span className="font-medium capitalize">{user.accountStatus || "Active"}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
