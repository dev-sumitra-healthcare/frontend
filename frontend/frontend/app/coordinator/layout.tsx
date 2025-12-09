'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, Calendar, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logoutCoordinator } from '@/lib/api';

export default function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [coordinatorData, setCoordinatorData] = useState<any>(null);

  // Don't show layout on login page
  const isLoginPage = pathname === '/coordinator/login' || pathname === '/coordinator/register';

  useEffect(() => {
    // Load coordinator data from localStorage
    const storedData = localStorage.getItem('coordinatorData');
    if (storedData) {
      setCoordinatorData(JSON.parse(storedData));
    }

    // Check if user is authenticated (not on login page)
    if (!isLoginPage) {
      const token = localStorage.getItem('coordinatorAccessToken');
      if (!token) {
        router.push('/coordinator/login');
      }
    }
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await logoutCoordinator();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      router.push('/coordinator/login');
    }
  };

  // If it's a login page, render children without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    {
      name: 'Dashboard',
      href: '/coordinator/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'All Patients',
      href: '/coordinator/patients',
      icon: Users,
    },
    {
      name: 'Appointments',
      href: '/coordinator/appointments',
      icon: Calendar,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Coordinator Portal</h1>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">MedMitra</h1>
            <p className="text-sm text-gray-600 mt-1">Coordinator Portal</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info & Logout */}
          <div className="p-4 border-t border-gray-200">
            {coordinatorData && (
              <div className="mb-3 px-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {coordinatorData.fullName}
                </p>
                <p className="text-xs text-gray-600 truncate">{coordinatorData.email}</p>
              </div>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
