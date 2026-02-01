"use client";

import { useState, useEffect } from "react";
import { useLearnerProgress } from "@/context/LearnerProgressContext";
import { getCurrentUser } from "@/lib/currentUser";

export default function WelcomeCard() {
  const { getReadinessScore } = useLearnerProgress();
  const { score, status } = getReadinessScore();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const syncName = () => {
      const user = getCurrentUser();
      setUserName(user?.name ?? "there");
    };
    syncName();
    window.addEventListener("storage", syncName);
    return () => window.removeEventListener("storage", syncName);
  }, []);

  const statusMessage =
    status === "On Track"
      ? "You're on track for your role"
      : status === "Needs Attention"
      ? "Focus on completing mandatory courses"
      : "Prioritize overdue courses and assignments";

  return (
    <div className="rounded-xl bg-slate-900 p-6 border border-slate-800">
      <h2 className="text-xl font-semibold text-white">
        Welcome back, {userName} 👋
      </h2>
      <p className="text-slate-400 mt-1">
        Your learning readiness is at {score}% — {statusMessage}
      </p>
      <p className="text-sm text-slate-500 mt-2">
        Keep pushing — consistency beats intensity
      </p>
    </div>
  );
}
