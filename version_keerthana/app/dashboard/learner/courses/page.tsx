"use client";

import { learningPaths } from "@/data/learningPaths";
import Link from "next/link";
import { ChevronRight, BookOpen, Clock } from "lucide-react";
import { useLearnerProgress } from "@/context/LearnerProgressContext";

export default function MyCoursesPage() {
  const { state, enrollInPath, refresh } = useLearnerProgress();

  const getPathProgress = (slug: string) => {
    const entries = Object.values(state.courseProgress).filter(
      (e) => e.pathSlug === slug
    );
    if (entries.length === 0) return 0;
    const total = entries.reduce((acc, e) => acc + e.totalModules, 0);
    const completed = entries.reduce(
      (acc, e) => acc + e.completedModuleIds.length,
      0
    );
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            My Courses
          </h1>
          <p className="text-slate-600 text-sm">
            Role-based learning paths for corporate training. Choose a path and
            progress toward job-ready skills.
          </p>
        </div>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Learning Paths
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => {
              const progress = getPathProgress(path.slug);
              return (
              <Link
                key={path.id}
                href={`/dashboard/learner/courses/${path.slug}`}
                onClick={() => {
                  if (!state.enrolledPathSlugs.includes(path.slug)) {
                    enrollInPath(path.slug);
                    refresh();
                  }
                }}
                className="group bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-teal-200 hover:shadow-md transition block"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={24} className="text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-teal-700 transition">
                      {path.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                      {path.description}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {path.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {path.duration}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-teal-600 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 group-hover:text-teal-700">
                  {progress > 0 ? "Continue Learning" : "View Path"}
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition" />
                </span>
              </Link>
            );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
