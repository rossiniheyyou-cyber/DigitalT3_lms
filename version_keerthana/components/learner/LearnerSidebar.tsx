"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Dashboard", href: "/dashboard/learner" },
  { label: "My Courses", href: "/dashboard/learner/courses" },
  { label: "Progress", href: "/dashboard/learner/progress" },
  { label: "Assignments", href: "/dashboard/learner/assignments" },
  { label: "Certificates", href: "/dashboard/learner/certificates" },
];

export default function LearnerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-teal-900 border-r border-teal-800 p-4 hidden md:block">
      <h2 className="text-xl font-semibold mb-6 text-white">Learner</h2>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-lg px-4 py-2 transition ${
              pathname === item.href
                ? "bg-teal-600 text-white"
                : "text-teal-100 hover:bg-teal-800"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
