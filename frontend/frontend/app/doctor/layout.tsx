"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  Stethoscope 
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Pages that should NOT have the sidebar (public/auth pages)
const PUBLIC_ROUTES = ['/doctor/login', '/doctor/register'];

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if current route is a public route (no sidebar needed)
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));

  // For public routes (login/register), render children without sidebar
  if (isPublicRoute) {
    return <>{children}</>;
  }

  const navigation = [
    { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
    { name: "My Patients", href: "/doctor/patients", icon: Users },
    { name: "Schedule", href: "/doctor/schedule", icon: Calendar },
    { name: "Settings", href: "/doctor/settings", icon: Settings },
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/doctor/login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">MedMitra MD</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-600"}`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

