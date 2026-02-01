"use client";

import { Users, BookOpen, ClipboardList, Award, TrendingUp, Activity } from "lucide-react";
import { useCanonicalStore } from "@/context/CanonicalStoreContext";
import {
  platformUsers,
  systemActivity,
  getUsersByRole,
} from "@/data/adminData";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { state } = useCanonicalStore();
  const courses = state.courses;
  const assignments = state.assignments;
  const published = courses.filter((c) => c.status === "published");
  const draft = courses.filter((c) => c.status === "draft");
  const archived = courses.filter((c) => c.status === "archived");
  const learners = getUsersByRole("learner");
  const instructors = getUsersByRole("instructor");
  const managers = getUsersByRole("manager");
  const admins = getUsersByRole("admin");
  const completionRate = published.length > 0 ? Math.round(published.reduce((a, c) => a + c.completionRate, 0) / published.length) : 0;
  const recentActivity = systemActivity.slice(0, 8);

  const kpiCards = [
    { label: "Total Learners", value: learners.length, icon: Users, href: "/dashboard/admin/users?role=learner" },
    { label: "Instructors", value: instructors.length, icon: Users, href: "/dashboard/admin/users?role=instructor" },
    { label: "Managers", value: managers.length, icon: Users, href: "/dashboard/admin/users?role=manager" },
    { label: "Admins", value: admins.length, icon: Users, href: "/dashboard/admin/users?role=admin" },
    { label: "Published Courses", value: published.length, icon: BookOpen, href: "/dashboard/admin/courses" },
    { label: "Draft / Archived", value: draft.length + archived.length, icon: BookOpen, href: "/dashboard/admin/courses" },
    { label: "Assignments & Quizzes", value: assignments.length, icon: ClipboardList, href: "/dashboard/admin/assessments" },
    { label: "Org Completion Rate", value: `${completionRate}%`, icon: TrendingUp, href: "/dashboard/admin/reports" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">
          System-wide visibility over users, courses, assignments, certificates, and activity.
        </p>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {kpiCards.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition"
          >
            <Icon className="w-6 h-6 text-slate-600 mb-2" />
            <p className="text-2xl font-semibold text-slate-800">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Widgets row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course progress overview */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-800">Course Progress Overview</h2>
            <p className="text-sm text-slate-500 mt-0.5">Published courses and completion rates</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {published.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-slate-800 truncate flex-1">{c.title}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${c.completionRate}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-600 w-8">{c.completionRate}%</span>
                  </div>
                </div>
              ))}
              {published.length === 0 && (
                <p className="text-sm text-slate-500">No published courses yet.</p>
              )}
            </div>
            <Link
              href="/dashboard/admin/courses"
              className="inline-block mt-4 text-sm font-medium text-slate-600 hover:text-slate-800"
            >
              View all courses →
            </Link>
          </div>
        </div>

        {/* Learner engagement (simplified) */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-800">Learner Engagement</h2>
            <p className="text-sm text-slate-500 mt-0.5">Active learners and enrollment</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-2xl font-semibold text-slate-800">{learners.length}</p>
                <p className="text-xs text-slate-500">Total learners</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-2xl font-semibold text-slate-800">
                  {learners.filter((l) => l.enrolledCourseIds.length > 0).length}
                </p>
                <p className="text-xs text-slate-500">Enrolled in courses</p>
              </div>
            </div>
            <Link
              href="/dashboard/admin/users?role=learner"
              className="inline-block mt-4 text-sm font-medium text-slate-600 hover:text-slate-800"
            >
              Manage learners →
            </Link>
          </div>
        </div>

        {/* Instructor activity summary */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-800">Instructor Activity</h2>
            <p className="text-sm text-slate-500 mt-0.5">Courses assigned to instructors</p>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {instructors.slice(0, 5).map((u) => (
                <li key={u.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-800">{u.name}</span>
                  <span className="text-slate-500">{u.assignedCourseIds.length} courses</span>
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard/admin/users?role=instructor"
              className="inline-block mt-4 text-sm font-medium text-slate-600 hover:text-slate-800"
            >
              View instructors →
            </Link>
          </div>
        </div>

        {/* Recent system activity */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-800">Recent System Activity</h2>
            <p className="text-sm text-slate-500 mt-0.5">Platform events and actions</p>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex gap-3 text-sm">
                  <Activity className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-800">{a.description}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(a.timestamp).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
