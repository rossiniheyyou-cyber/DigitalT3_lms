"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  BarChart3,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/dashboard/manager", icon: LayoutDashboard },
  { label: "Team Learners", href: "/dashboard/manager/learners", icon: Users },
  { label: "Course Monitoring", href: "/dashboard/manager/courses", icon: BookOpen },
  { label: "Assignments & Quizzes", href: "/dashboard/manager/assessments", icon: ClipboardList },
  { label: "Reports", href: "/dashboard/manager/reports", icon: BarChart3 },
];

export default function ManagerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-blue-900 border-r border-blue-800 p-4 hidden md:block shrink-0">
      <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
        Manager
      </h2>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard/manager" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-blue-100 hover:bg-blue-800"
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
