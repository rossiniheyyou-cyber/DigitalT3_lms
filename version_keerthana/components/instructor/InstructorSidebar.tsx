"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Users,
  BarChart3,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/dashboard/instructor", icon: LayoutDashboard },
  { label: "Courses", href: "/dashboard/instructor/courses", icon: BookOpen },
  { label: "Assessments", href: "/dashboard/instructor/assessments", icon: ClipboardList },
  { label: "Learners", href: "/dashboard/instructor/learners", icon: Users },
  { label: "Reports", href: "/dashboard/instructor/reports", icon: BarChart3 },
];

export default function InstructorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-teal-900 border-r border-teal-800 p-4 hidden md:block shrink-0">
      <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
        <BookOpen className="w-6 h-6" />
        Instructor
      </h2>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard/instructor" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "text-teal-100 hover:bg-teal-800"
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
