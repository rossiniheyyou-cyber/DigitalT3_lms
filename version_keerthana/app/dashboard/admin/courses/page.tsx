"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, BookOpen, Eye } from "lucide-react";
import { useCanonicalStore } from "@/context/CanonicalStoreContext";

export default function AdminCoursesPage() {
  const { getCoursesForInstructor } = useCanonicalStore();
  const courses = getCoursesForInstructor();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Course & Learning Path Oversight</h1>
        <p className="text-slate-500 mt-1">
          View all courses created by instructors. Monitor structure, modules, and assign to departments or company-wide.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-slate-800"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700"
        >
          <option value="all">All status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Course</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Roles / Phase</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-700">Modules</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-700">Enrolled</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-700">Completion</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Instructor</th>
                <th className="w-12 py-4 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-800">{c.title}</p>
                    <p className="text-sm text-slate-500 line-clamp-1 max-w-[200px]">{c.description}</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {c.roles.slice(0, 2).join(", ")} • {c.phase}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        c.status === "published" ? "bg-emerald-100 text-emerald-700" : c.status === "draft" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-slate-600">{c.modules.length}</td>
                  <td className="py-4 px-4 text-center text-slate-600">{c.enrolledCount}</td>
                  <td className="py-4 px-4 text-center text-slate-600">{c.completionRate}%</td>
                  <td className="py-4 px-4 text-sm text-slate-600">{c.instructor.name}</td>
                  <td className="py-4 px-4">
                    <Link
                      href={`/dashboard/instructor/courses/${c.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-800"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          No courses match your filters.
        </div>
      )}
    </div>
  );
}
