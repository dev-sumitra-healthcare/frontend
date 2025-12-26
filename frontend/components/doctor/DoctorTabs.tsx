"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stethoscope, FileText, Calendar, Settings, Users, User } from "lucide-react";

interface TabItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const tabs: TabItem[] = [
  { name: "OPD", href: "/doctor/opd", icon: Stethoscope },
  { name: "Past Cases", href: "/doctor/past-cases", icon: FileText },
  { name: "Book Appointment", href: "/doctor/book-appointment", icon: Calendar },
  { name: "Configure Pad", href: "/doctor/configure-pad", icon: Settings },
  { name: "Coordinators", href: "/doctor/coordinators", icon: Users },
  { name: "Profile", href: "/doctor/profile", icon: User },
];

export default function DoctorTabs() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || pathname?.startsWith(tab.href + "/");
            const Icon = tab.icon;

            return (
              <Link key={tab.href} href={tab.href}>
                <div
                  className={`
                    flex items-center gap-2 px-4 py-4 border-b-2 transition-all duration-200 whitespace-nowrap
                    ${
                      isActive
                        ? "border-blue-600 text-blue-600 bg-blue-50/50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
