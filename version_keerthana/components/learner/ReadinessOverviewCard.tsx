"use client";

import { useLearnerProgress } from "@/context/LearnerProgressContext";
import { HelpCircle } from "lucide-react";

export default function ReadinessOverviewCard() {
  const { getReadinessScore } = useLearnerProgress();
  const { score, status, mandatoryComplete, mandatoryTotal, courseCompletion } =
    getReadinessScore();

  const statusColors = {
    "On Track": "text-teal-600 bg-teal-50 border-teal-200",
    "Needs Attention": "text-amber-600 bg-amber-50 border-amber-200",
    "At Risk": "text-red-600 bg-red-50 border-red-200",
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-full border-8 border-teal-200 flex items-center justify-center">
            <span className="text-teal-600 text-2xl font-bold">{score}%</span>
          </div>
          <div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center cursor-help"
            title="Readiness is calculated from: course completion (50%), pending assignments (30%), overdue mandatory courses (20%)"
          >
            <HelpCircle size={12} className="text-slate-500" />
          </div>
        </div>
        <div>
          <p className="text-slate-600 text-sm">Learning Readiness Score</p>
          <p className="text-slate-900 text-xl font-semibold mt-1">
            Skill Readiness
          </p>
          <span
            className={`inline-block mt-2 px-3 py-1 rounded-lg text-sm font-medium border ${
              statusColors[status]
            }`}
          >
            {status}
          </span>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-slate-700 mb-1">
            <span>Mandatory courses</span>
            <span>
              {mandatoryComplete}/{mandatoryTotal}
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full">
            <div
              className="h-2 bg-teal-600 rounded-full transition-all"
              style={{
                width: `${
                  mandatoryTotal > 0
                    ? (mandatoryComplete / mandatoryTotal) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm text-slate-700 mb-1">
            <span>Course completion</span>
            <span>{courseCompletion}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full">
            <div
              className="h-2 bg-teal-600 rounded-full transition-all"
              style={{ width: `${courseCompletion}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
