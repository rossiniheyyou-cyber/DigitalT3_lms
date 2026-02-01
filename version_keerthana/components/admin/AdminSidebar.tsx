"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  Award,
  BarChart3,
  Settings,
  Shield,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "User Management", href: "/dashboard/admin/users", icon: Users },
  { label: "Course Oversight", href: "/dashboard/admin/courses", icon: BookOpen },
  { label: "Assignments & Quizzes", href: "/dashboard/admin/assessments", icon: ClipboardList },
  { label: "Certificates", href: "/dashboard/admin/certificates", icon: Award },
  { label: "Reports & Analytics", href: "/dashboard/admin/reports", icon: BarChart3 },
  { label: "System Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 p-4 hidden md:block shrink-0">
      <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
        <Shield className="w-6 h-6" />
        Admin
      </h2>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition ${
                isActive
                  ? "bg-slate-600 text-white"
                  : "text-slate-200 hover:bg-slate-700"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
