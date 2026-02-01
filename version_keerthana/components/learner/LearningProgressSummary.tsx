"use client";

import { useLearnerProgress } from "@/context/LearnerProgressContext";
import { BookOpen, CheckCircle, Clock, Award } from "lucide-react";

export default function LearningProgressSummary() {
  const { state } = useLearnerProgress();

  const completedCount = Object.values(state.courseProgress).filter(
    (c) => c.courseCompleted
  ).length;
  const inProgressCount = Object.values(state.courseProgress).filter(
    (c) => !c.courseCompleted
  ).length;
  const totalHours = Math.round(state.totalLearningHours * 10) / 10;
  const skillsCount = state.skillsGained?.length ?? 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
            <CheckCircle size={20} className="text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{completedCount}</p>
        </div>
        <p className="text-sm text-slate-600">Courses completed</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
            <BookOpen size={20} className="text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{inProgressCount}</p>
        </div>
        <p className="text-sm text-slate-600">Courses in progress</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
            <Clock size={20} className="text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalHours}h</p>
        </div>
        <p className="text-sm text-slate-600">Total learning hours</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
            <Award size={20} className="text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{skillsCount}</p>
        </div>
        <p className="text-sm text-slate-600">Skills acquired</p>
      </div>
    </div>
  );
}
