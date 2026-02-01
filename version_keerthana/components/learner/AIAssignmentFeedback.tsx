import type { Assignment } from "@/data/assignments";

type Props = {
  assignment?: Assignment;
};

export default function AIAssignmentFeedback({ assignment }: Props) {
  const showFeedback =
    assignment?.status === "Reviewed" || assignment?.status === "Submitted";

  if (!showFeedback) return null;

  return (
    <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
      <h3 className="font-semibold text-teal-700 mb-2">🤖 AI Feedback</h3>
      <p className="text-slate-700">
        Good structure. Improve validation and error handling.
      </p>
      <p className="mt-2 text-sm text-slate-600">
        Skill Impact: {assignment?.role ?? "Skill"} +8%
      </p>
      <p className="mt-1 text-sm text-slate-600">
        Progress: Course progress updated • Readiness score affected
      </p>
    </div>
  );
}
  