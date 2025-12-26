'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Stethoscope, 
  FileText, 
  Calendar,
  Search,
  User, 
  LogOut
} from 'lucide-react';
import { logoutCoordinator } from '@/lib/api';

type TabType = 'opd' | 'past-cases' | 'appointments' | 'patient-search' | 'profile';

export default function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [coordinatorData, setCoordinatorData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('opd');

  // Don't show layout on public pages (login, register, landing page)
  const isPublicPage = pathname === '/coordinator/login' || 
    pathname === '/coordinator/register' || 
    pathname === '/coordinator';

  useEffect(() => {
    // Load coordinator data from localStorage
    const storedData = localStorage.getItem('coordinatorData');
    if (storedData) {
      setCoordinatorData(JSON.parse(storedData));
    }

    // Check if user is authenticated (not on public page)
    if (!isPublicPage) {
      const token = localStorage.getItem('coordinatorAccessToken');
      if (!token) {
        router.push('/coordinator/login');
        return;
      }
    }
    setIsLoading(false);
  }, [isPublicPage, router]);

  // Set active tab based on pathname
  useEffect(() => {
    if (pathname.includes('/coordinator/dashboard') || pathname.includes('/coordinator/opd')) {
      setActiveTab('opd');
    } else if (pathname.includes('/coordinator/past-cases')) {
      setActiveTab('past-cases');
    } else if (pathname.includes('/coordinator/appointments')) {
      setActiveTab('appointments');
    } else if (pathname.includes('/coordinator/patient-search') || pathname.includes('/coordinator/patients')) {
      setActiveTab('patient-search');
    } else if (pathname.includes('/coordinator/profile')) {
      setActiveTab('profile');
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logoutCoordinator();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('coordinatorAccessToken');
      localStorage.removeItem('coordinatorRefreshToken');
      localStorage.removeItem('coordinatorData');
      router.push('/coordinator/login');
    }
  };

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);
    switch (tabId) {
      case 'opd':
        router.push('/coordinator/dashboard');
        break;
      case 'past-cases':
        router.push('/coordinator/past-cases');
        break;
      case 'appointments':
        router.push('/coordinator/appointments');
        break;
      case 'patient-search':
        router.push('/coordinator/patients');
        break;
      case 'profile':
        router.push('/coordinator/profile');
        break;
    }
  };

  // If it's a public page, render children without layout
  if (isPublicPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#10B981] mx-auto mb-4"></div>
          <p className="text-[#475467]">Loading...</p>
        </div>
      </div>
    );
  }

  const coordinatorName = coordinatorData?.fullName || coordinatorData?.username || 'Coordinator';

  const tabs = [
    { id: 'opd' as TabType, label: 'OPD', icon: Stethoscope },
    { id: 'past-cases' as TabType, label: 'Past Cases', icon: FileText },
    { id: 'appointments' as TabType, label: 'Appointment', icon: Calendar },
    { id: 'patient-search' as TabType, label: 'Patient Search', icon: Search },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)' }}>
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Green User Icon */}
          <div className="w-[48px] h-[48px] rounded-full bg-[#d1fae5] border-2 border-[#10B981] flex items-center justify-center">
            <User className="w-6 h-6 text-[#10B981]" />
          </div>
          <div>
            <h1 className="text-[24px] font-semibold text-[#101828] tracking-[-0.3px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Coordinator Portal
            </h1>
            <p className="text-[16px] text-[#10B981] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              {coordinatorName}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-[#475467] hover:text-[#101828] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[16px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Logout</span>
        </button>
      </header>

      <main className="px-8 pb-8">
        {/* Navigation Tabs Card */}
        <div className="bg-white rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] mb-6 overflow-hidden">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-[16px] transition-all relative border-b-2 ${
                    isActive 
                      ? 'text-[#10B981] font-medium border-[#10B981]' 
                      : 'text-[#475467] border-transparent hover:text-[#101828]'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
