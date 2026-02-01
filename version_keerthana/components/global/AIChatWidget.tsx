"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";

const QUICK_SUGGESTIONS = [
  "How do I complete a course?",
  "Where are my assignment deadlines?",
  "How do I get certified?",
  "How does quiz grading work?",
  "Where is my progress tracked?",
];

function getRoleFromPath(pathname: string | null): string {
  if (!pathname) return "User";
  if (pathname.startsWith("/dashboard/instructor")) return "Instructor";
  if (pathname.startsWith("/dashboard/learner")) return "Learner";
  if (pathname.startsWith("/dashboard/admin")) return "Admin";
  if (pathname.startsWith("/dashboard/manager")) return "Manager";
  return "User";
}

function getContextHint(pathname: string | null): string {
  if (!pathname) return "";
  if (pathname.includes("/courses")) return "User is viewing courses.";
  if (pathname.includes("/assignments")) return "User is on the assignments page.";
  if (pathname.includes("/progress")) return "User is viewing progress.";
  if (pathname.includes("/certificates")) return "User is viewing certificates.";
  if (pathname.includes("/settings")) return "User is in settings.";
  if (pathname === "/dashboard/learner" || pathname === "/dashboard/instructor") return "User is on the dashboard.";
  return "";
}

export default function AIChatWidget() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/" || pathname?.startsWith("/auth");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const role = getRoleFromPath(pathname);
  const contextHint = getContextHint(pathname);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const reply = (userText: string): string => {
    const lower = userText.toLowerCase();
    if (lower.includes("complete") && (lower.includes("course") || lower.includes("module"))) {
      return "To complete a course, work through each module in order. Watch videos, read materials, pass any quizzes, and submit assignments. When all required items are done, the course is marked complete and you can earn a certificate.";
    }
    if (lower.includes("deadline") || lower.includes("assignment")) {
      return "Assignment deadlines are shown on the Assignments page and in your dashboard under Upcoming Tasks. You can also see due dates on each assignment card.";
    }
    if (lower.includes("certif") || lower.includes("certified")) {
      return "Certificates are earned when you complete a course: all mandatory modules, required assignments, and quizzes must be completed. Visit the Certificates page to view and download earned certificates.";
    }
    if (lower.includes("quiz") && (lower.includes("grad") || lower.includes("rule") || lower.includes("pass"))) {
      return "Quizzes are auto-graded. You must meet the pass percentage set by the instructor. Attempt limits and time limits may apply; check the quiz instructions before starting.";
    }
    if (lower.includes("progress") || lower.includes("track")) {
      return "Your progress is tracked on the Dashboard (Continue Learning, progress bars) and on the Progress page. Course completion and readiness scores update as you complete modules and assignments.";
    }
    if (lower.includes("dashboard") || lower.includes("feature")) {
      return `On the ${role} dashboard you can see your main metrics, courses, and tasks. Use the sidebar to go to Courses, Assignments, Progress, and Settings.`;
    }
    if (lower.includes("navigate") || lower.includes("course")) {
      return "Go to My Courses, choose a learning path, then select a course. Open modules from the course content list and complete them in order.";
    }
    return "I can help with course completion, assignment deadlines, quiz rules, certificate eligibility, and navigating the platform. What would you like to know?";
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const response = reply(trimmed);
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
      setLoading(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (isAuthPage) return null;

  return (
    <>
      {/* Toggle button - fixed bottom-right */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-teal-600 text-white shadow-lg hover:bg-teal-700 transition flex items-center justify-center"
        aria-label={open ? "Close chat" : "Open help chat"}
      >
        {open ? (
          <Minimize2 size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-40 w-[380px] max-w-[calc(100vw-3rem)] bg-white border border-slate-200 rounded-xl shadow-xl flex flex-col overflow-hidden"
          style={{ maxHeight: "min(500px, 70vh)" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} className="text-teal-600" />
              <span className="font-semibold text-slate-800">Help</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
            {messages.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-slate-600 mb-3">Need help? Ask about:</p>
                <ul className="text-xs text-slate-500 space-y-1">
                  <li>• Completing courses</li>
                  <li>• Assignment deadlines</li>
                  <li>• Quiz rules and grading</li>
                  <li>• Certificate eligibility</li>
                  <li>• Dashboard and navigation</li>
                </ul>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-lg px-3 py-2 text-sm text-slate-500">
                  ...
                </div>
              </div>
            )}
          </div>

          {messages.length === 0 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.slice(0, 3).map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition shrink-0"
                aria-label="Send"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
