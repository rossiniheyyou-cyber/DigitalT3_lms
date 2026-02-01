"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ROLES, PHASES } from "@/data/canonicalCourses";
import { useCanonicalStore } from "@/context/CanonicalStoreContext";
import { getCurrentUser } from "@/lib/currentUser";

const ROLE_TO_PATH_SLUG: Record<string, string> = {
  "Full Stack Developer": "fullstack",
  "UI / UX Designer": "uiux",
  "Data Analyst / Engineer": "data-analyst",
  "Cloud & DevOps Engineer": "cloud-devops",
  "QA Engineer": "qa",
  "Digital Marketing": "digital-marketing",
};

export default function NewCoursePage() {
  const router = useRouter();
  const { addCourse, getCoursesForInstructor } = useCanonicalStore();
  const existingCourses = getCoursesForInstructor();
  const allCourseIds = [...new Set(existingCourses.map((c) => c.id))];

  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    estimatedDuration: "2 weeks",
    status: "draft" as const,
    roles: [] as string[],
    phase: "Foundation",
    courseOrder: 1,
    isMandatory: false,
    prerequisiteCourseIds: [] as string[],
  });

  const toggleRole = (role: string) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  const togglePrerequisite = (id: string) => {
    setForm((prev) => ({
      ...prev,
      prerequisiteCourseIds: prev.prerequisiteCourseIds.includes(id)
        ? prev.prerequisiteCourseIds.filter((c) => c !== id)
        : [...prev.prerequisiteCourseIds, id],
    }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const user = getCurrentUser();
    const pathSlug = form.roles[0] ? ROLE_TO_PATH_SLUG[form.roles[0]] ?? "fullstack" : "fullstack";
    const id = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || `course-${Date.now()}`;
    const uniqueId = allCourseIds.includes(id) ? `${id}-${Date.now()}` : id;
    const today = new Date().toISOString().slice(0, 10);
    addCourse({
      id: uniqueId,
      title: form.title.trim(),
      description: form.description.trim(),
      thumbnail: form.thumbnail.trim() || undefined,
      estimatedDuration: form.estimatedDuration.trim(),
      status: "draft",
      roles: form.roles,
      phase: form.phase,
      courseOrder: form.courseOrder,
      isMandatory: form.isMandatory,
      prerequisiteCourseIds: form.prerequisiteCourseIds,
      modules: [],
      instructor: { name: user?.name ?? "Instructor", role: "Tech Lead" },
      skills: [],
      pathSlug,
      lastUpdated: today,
      enrolledCount: 0,
      completionRate: 0,
      createdAt: today,
    });
    router.push("/dashboard/instructor/courses");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        href="/dashboard/instructor/courses"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Create Course</h1>
        <p className="text-slate-500 mt-1">
          One canonical course. Same content appears in Learner → My Courses when published.
        </p>
      </div>

      <form className="space-y-6 bg-white border border-slate-200 rounded-xl p-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="font-semibold text-slate-800">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., REST API Development"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Course description..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail URL</label>
              <input
                type="text"
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                placeholder="/image.png"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Duration</label>
              <input
                type="text"
                value={form.estimatedDuration}
                onChange={(e) => setForm({ ...form, estimatedDuration: e.target.value })}
                placeholder="e.g., 2 weeks"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Role & Phase */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="font-semibold text-slate-800">Learning Path</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Assign to Role(s)</label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    form.roles.includes(role)
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Learning Phase</label>
              <select
                value={form.phase}
                onChange={(e) => setForm({ ...form, phase: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {PHASES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Course Order (within path)</label>
              <input
                type="number"
                min={1}
                value={form.courseOrder}
                onChange={(e) => setForm({ ...form, courseOrder: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isMandatory}
                onChange={(e) => setForm({ ...form, isMandatory: e.target.checked })}
                className="rounded border-slate-300 text-teal-600"
              />
              <span className="text-sm font-medium text-slate-700">Mandatory course</span>
            </label>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="font-semibold text-slate-800">Prerequisite Courses</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select prerequisites (optional)</label>
            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1">
              {existingCourses.slice(0, 20).map((c) => (
                <label key={c.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.prerequisiteCourseIds.includes(c.id)}
                    onChange={() => togglePrerequisite(c.id)}
                    className="rounded border-slate-300 text-teal-600"
                  />
                  <span className="text-sm text-slate-700">{c.title}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Link
            href="/dashboard/instructor/courses"
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Create Course (Draft)
          </button>
        </div>
      </form>
    </div>
  );
}
