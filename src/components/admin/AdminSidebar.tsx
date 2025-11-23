"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Star,
  MapPin,
  Plane,
  Settings,
  BarChart3,
  FileText,
  Package,
  Book,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Destinations", href: "/admin/destinations", icon: MapPin },
  { name: "Tours", href: "/admin/tours", icon: Plane },
  { name: "Packages", href: "/admin/packages", icon: Package },
  { name: "Travel Books", href: "/admin/travel-books", icon: Book },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="flex flex-col h-full">
        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            // Check if current path starts with item href (for nested routes)
            const isActive = pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-700 font-medium shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "text-sky-600")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Info Card */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-sky-500 to-emerald-500 text-white p-4 rounded-lg shadow-lg">
            <p className="text-sm font-semibold mb-1">Admin Panel</p>
            <p className="text-xs opacity-90">Manage your travel platform</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
