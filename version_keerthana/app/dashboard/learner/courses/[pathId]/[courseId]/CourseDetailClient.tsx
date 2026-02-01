"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Play,
  Lock,
  Check,
  FileText,
  Download,
  Award,
  Video,
  BookOpen,
  ClipboardList,
  HelpCircle,
} from "lucide-react";
import type { LearningPath, Course, Module } from "@/data/learningPaths";
import { useLearnerProgress } from "@/context/LearnerProgressContext";

const SAMPLE_VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

type Props = {
  path: LearningPath;
  course: Course;
};

export function CourseDetailClient({ path, course }: Props) {
  const { recordCourseAccess, recordModuleComplete } = useLearnerProgress();
  const [activeModule, setActiveModule] = useState<Module | null>(
    course.modules.find((m) => !m.locked) ?? course.modules[0] ?? null
  );
  const [modules, setModules] = useState(course.modules);
  const [completedModules, setCompletedModules] = useState<Set<string>>(
    new Set(modules.filter((m) => m.completed).map((m) => m.id))
  );
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentProgress =
    modules.length > 0
      ? Math.round((completedModules.size / modules.length) * 100)
      : 0;

  useEffect(() => {
    recordCourseAccess(
      path.slug,
      course.id,
      course.title,
      path.title,
      activeModule?.id ?? null,
      activeModule?.title ?? null,
      modules.length,
      Array.from(completedModules)
    );
  }, [path.slug, path.title, course.id, course.title, activeModule?.id, activeModule?.title, modules.length, completedModules, recordCourseAccess]);

  const markModuleComplete = (moduleId: string) => {
    const mod = modules.find((m) => m.id === moduleId);
    setCompletedModules((prev) => new Set([...prev, moduleId]));
    const modIdx = modules.findIndex((m) => m.id === moduleId);
    recordModuleComplete(
      path.slug,
      course.id,
      course.title,
      path.title,
      moduleId,
      mod?.title ?? moduleId,
      modules.length,
      course.skills ?? []
    );
    if (modIdx >= 0 && modIdx < modules.length - 1) {
      const next = modules[modIdx + 1];
      if (next?.locked) {
        setModules((prev) =>
          prev.map((m) =>
            m.id === next.id ? { ...m, locked: false } : m
          )
        );
      }
    }
  };

  const canAccessModule = (m: Module) => {
    if (!m.locked) return true;
    const idx = modules.findIndex((mod) => mod.id === m.id);
    if (idx <= 0) return true;
    const prev = modules[idx - 1];
    return prev ? completedModules.has(prev.id) : false;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-600">
          <Link
            href="/dashboard/learner/courses"
            className="hover:text-teal-600 transition"
          >
            My Courses
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <Link
            href={`/dashboard/learner/courses/${path.slug}`}
            className="hover:text-teal-600 transition"
          >
            {path.title}
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-slate-900 font-medium">{course.title}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        {/* Left: Video / Content Area */}
        <main className="flex-1 p-6 lg:p-8 order-2 lg:order-1">
          {/* Video Player */}
          {activeModule && (activeModule.type === "video" || !activeModule.type) && (
            <div className="mb-6">
              <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  controls
                  controlsList="nodownload"
                  playsInline
                  onLoadedMetadata={() => {
                    if (videoRef.current) videoRef.current.playbackRate = playbackSpeed;
                  }}
                  onEnded={() => markModuleComplete(activeModule.id)}
                  onTimeUpdate={() => {
                    if (videoRef.current) {
                      localStorage.setItem(
                        `video-progress-${course.id}-${activeModule.id}`,
                        String(videoRef.current.currentTime)
                      );
                    }
                  }}
                >
                  <source src={SAMPLE_VIDEO_URL} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* Playback speed overlay */}
                <div className="absolute bottom-16 right-4 flex gap-2">
                  <select
                    value={playbackSpeed}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setPlaybackSpeed(v);
                      if (videoRef.current) videoRef.current.playbackRate = v;
                    }}
                    className="px-2 py-1 rounded bg-black/60 text-white text-sm border-0"
                  >
                    {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((s) => (
                      <option key={s} value={s}>
                        {s}x
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900">
                  {activeModule.title}
                </h2>
                <button
                  onClick={() => markModuleComplete(activeModule.id)}
                  className="text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  Mark as complete
                </button>
              </div>
            </div>
          )}

          {/* Quiz / Assignment placeholder */}
          {activeModule &&
            (activeModule.type === "quiz" || activeModule.type === "assignment") && (
              <div className="mb-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  {activeModule.type === "quiz" ? (
                    <HelpCircle size={24} className="text-teal-600" />
                  ) : (
                    <ClipboardList size={24} className="text-teal-600" />
                  )}
                  <h2 className="text-lg font-semibold text-slate-900">
                    {activeModule.title}
                  </h2>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  {activeModule.type === "quiz"
                    ? "Complete the quiz to test your understanding."
                    : "Submit your assignment to proceed."}
                </p>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4">
                  <p className="text-sm text-slate-500">
                    {activeModule.type === "quiz"
                      ? "Quiz content would appear here. (UI only)"
                      : "Assignment instructions would appear here. (UI only)"}
                  </p>
                </div>
                <button
                  onClick={() => markModuleComplete(activeModule.id)}
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition"
                >
                  {activeModule.type === "quiz"
                    ? "Submit Quiz"
                    : "Submit Assignment"}
                </button>
              </div>
            )}

          {/* Course Overview */}
          <section className="mb-8">
            <h3 className="text-base font-semibold text-slate-800 mb-3">
              Course Overview
            </h3>
            <p className="text-slate-600 text-sm mb-4">{course.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {course.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-sm text-slate-500">Duration: {course.duration}</p>
          </section>

          {/* Instructor */}
          <section className="mb-8">
            <h3 className="text-base font-semibold text-slate-800 mb-3">
              Instructor
            </h3>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold">
                {course.instructor.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  {course.instructor.name}
                </p>
                <p className="text-sm text-slate-500">
                  {course.instructor.role}
                </p>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section>
            <h3 className="text-base font-semibold text-slate-800 mb-3">
              Resources
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <a
                href="#"
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-teal-200 hover:bg-teal-50/50 transition"
              >
                <FileText size={20} className="text-teal-600 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-700">
                  Download PPT slides
                </span>
                <Download size={16} className="text-slate-400 ml-auto" />
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-teal-200 hover:bg-teal-50/50 transition"
              >
                <FileText size={20} className="text-teal-600 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-700">
                  Download PDF notes
                </span>
                <Download size={16} className="text-slate-400 ml-auto" />
              </a>
            </div>
          </section>
        </main>

        {/* Right: Module Sidebar */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/30 p-6 order-1 lg:order-2">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">
              Course Content
            </h3>
            <div className="flex justify-between text-xs text-slate-600 mb-1.5">
              <span>Progress</span>
              <span>{currentProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-teal-600 h-2 rounded-full transition-all"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
          </div>

          <nav className="space-y-1">
            {modules.map((module, idx) => {
              const isActive = activeModule?.id === module.id;
              const isCompleted = completedModules.has(module.id);
              const canAccess = canAccessModule(module);

              return (
                <button
                  key={module.id}
                  onClick={() => canAccess && setActiveModule(module)}
                  disabled={!canAccess}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                    isActive
                      ? "bg-teal-50 border border-teal-200 text-teal-800"
                      : canAccess
                      ? "text-slate-700 hover:bg-slate-100"
                      : "text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                        <Check size={14} className="text-teal-600" />
                      </div>
                    ) : !canAccess ? (
                      <Lock size={16} className="text-slate-400" />
                    ) : module.type === "video" ? (
                      <Video size={16} className="text-slate-600" />
                    ) : module.type === "quiz" ? (
                      <HelpCircle size={16} className="text-slate-600" />
                    ) : module.type === "assignment" ? (
                      <ClipboardList size={16} className="text-slate-600" />
                    ) : (
                      <BookOpen size={16} className="text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        isActive ? "text-teal-800" : ""
                      }`}
                    >
                      {module.title}
                    </p>
                    {module.duration && (
                      <p className="text-xs text-slate-500">{module.duration}</p>
                    )}
                  </div>
                  {isActive && (
                    <Play size={14} className="text-teal-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Certificate */}
          {currentProgress === 100 && (
            <div className="mt-6 p-4 bg-teal-50 rounded-xl border border-teal-100">
              <div className="flex items-center gap-3 mb-2">
                <Award size={24} className="text-teal-600" />
                <h4 className="text-sm font-semibold text-teal-800">
                  Certificate unlocked
                </h4>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                You have completed this course. Download your certificate.
              </p>
              <button className="w-full py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition flex items-center justify-center gap-2">
                <Download size={16} />
                Download Certificate
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Restore video progress on mount */}
      <VideoProgressRestorer
        videoRef={videoRef}
        courseId={course.id}
        moduleId={activeModule?.id}
      />
    </div>
  );
}

function VideoProgressRestorer({
  videoRef,
  courseId,
  moduleId,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  courseId: string;
  moduleId?: string;
}) {
  useEffect(() => {
    if (!moduleId || !videoRef.current) return;
    const key = `video-progress-${courseId}-${moduleId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const time = parseFloat(saved);
      videoRef.current.currentTime = time;
    }
  }, [courseId, moduleId, videoRef]);

  return null;
}
