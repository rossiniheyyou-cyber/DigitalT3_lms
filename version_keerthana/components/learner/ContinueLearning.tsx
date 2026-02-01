"use client";

import Link from "next/link";
import { useLearnerProgress } from "@/context/LearnerProgressContext";

export default function ContinueLearning() {
  const { getMostRecentCourse } = useLearnerProgress();
  const recent = getMostRecentCourse();

  if (!recent) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Continue Learning
        </h2>
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-slate-600 mb-4">
            Start a learning path to see your progress here.
          </p>
          <Link
            href="/dashboard/learner/courses"
            className="inline-block bg-teal-600 text-white py-3 px-6 rounded-xl text-sm font-medium hover:bg-teal-700 transition"
          >
            Browse Learning Paths
          </Link>
        </div>
      </div>
    );
  }

  const resumeUrl = `/dashboard/learner/courses/${recent.pathSlug}/${recent.courseId}`;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">
        Continue Learning
      </h2>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <p className="text-slate-900 font-semibold text-lg">
          {recent.courseTitle}
        </p>
        <p className="text-slate-600 mb-2">
          {recent.pathTitle} • Current: {recent.currentModuleTitle}
        </p>
        <div className="flex justify-between text-xs text-slate-500 mb-4">
          <span>
            {recent.completedCount} of {recent.totalModules} modules completed
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full mb-6">
          <div
            className="h-2 bg-teal-600 rounded-full transition-all"
            style={{ width: `${recent.progress}%` }}
          />
        </div>
        <Link
          href={resumeUrl}
          className="block w-full bg-teal-600 text-white py-3 rounded-xl text-center text-sm font-medium hover:bg-teal-700 transition"
        >
          Continue Learning
        </Link>
      </div>
    </div>
  );
}
