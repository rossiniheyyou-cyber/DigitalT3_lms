"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  GripVertical,
  Plus,
  Trash2,
  Video,
  FileText,
  Link as LinkIcon,
  Eye,
  EyeOff,
  Users,
  BarChart3,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  toLearnerModules,
  CONTENT_TYPES,
  type CanonicalModule,
  type ContentItem,
  type ContentType,
} from "@/data/canonicalCourses";
import { useCanonicalStore } from "@/context/CanonicalStoreContext";

function getContentIcon(type: ContentType) {
  switch (type) {
    case "video":
      return Video;
    case "pdf":
    case "ppt":
      return FileText;
    case "link":
      return LinkIcon;
    default:
      return FileText;
  }
}

export default function InstructorCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const { getCourseById, updateCourse, setCourseModules, publishCourse, getAvailableAssessments } = useCanonicalStore();
  const course = getCourseById(courseId);
  const [modules, setModules] = useState<CanonicalModule[]>(course?.modules ?? []);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(modules[0]?.id ?? null);
  const [draggedModuleId, setDraggedModuleId] = useState<string | null>(null);
  const [draggedContentId, setDraggedContentId] = useState<string | null>(null);

  useEffect(() => {
    if (course) setModules([...course.modules]);
  }, [courseId]);

  if (!course) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/instructor/courses" className="text-teal-600 hover:underline">
          ← Back to Courses
        </Link>
        <p className="text-slate-600">Course not found</p>
      </div>
    );
  }

  const handleModuleReorder = (fromIndex: number, toIndex: number) => {
    const next = [...modules];
    const [removed] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, { ...removed, order: toIndex });
    setModules(next.map((m, i) => ({ ...m, order: i })));
  };

  const handleContentReorder = (moduleId: string, fromIndex: number, toIndex: number) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;
        const ch = [...mod.chapters];
        const [removed] = ch.splice(fromIndex, 1);
        ch.splice(toIndex, 0, { ...removed, order: toIndex });
        return { ...mod, chapters: ch.map((c, i) => ({ ...c, order: i })) };
      })
    );
  };

  const addModule = () => {
    const newMod: CanonicalModule = {
      id: `m${Date.now()}`,
      title: "New Module",
      order: modules.length,
      chapters: [],
      completionRules: [{ type: "watch_videos" }],
    };
    setModules([...modules, newMod]);
    setExpandedModuleId(newMod.id);
  };

  const addChapter = (moduleId: string) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;
        const newCh: ContentItem = {
          id: `c${Date.now()}`,
          type: "video",
          title: "New content",
          url: "",
          published: false,
          order: mod.chapters.length,
        };
        return { ...mod, chapters: [...mod.chapters, newCh] };
      })
    );
  };

  const updateModuleTitle = (moduleId: string, title: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, title } : m))
    );
  };

  const updateChapter = (
    moduleId: string,
    chapterId: string,
    updates: Partial<ContentItem>
  ) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;
        return {
          ...mod,
          chapters: mod.chapters.map((c) =>
            c.id === chapterId ? { ...c, ...updates } : c
          ),
        };
      })
    );
  };

  const deleteChapter = (moduleId: string, chapterId: string) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;
        return {
          ...mod,
          chapters: mod.chapters.filter((c) => c.id !== chapterId),
        };
      })
    );
  };

  const toggleChapterPublished = (moduleId: string, chapterId: string) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;
        return {
          ...mod,
          chapters: mod.chapters.map((c) =>
            c.id === chapterId ? { ...c, published: !c.published } : c
          ),
        };
      })
    );
  };

  const assessments = getAvailableAssessments();
  const learnerModules = toLearnerModules(modules);

  const handleSave = () => {
    setCourseModules(courseId, modules);
    updateCourse(courseId, {});
  };

  const handlePublish = () => {
    setCourseModules(courseId, modules);
    publishCourse(courseId);
  };

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/instructor/courses"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </Link>

      {/* Course Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400">
                  {course.title.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">{course.title}</h1>
              <p className="text-slate-500 mt-1">{course.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    course.status === "published"
                      ? "bg-emerald-100 text-emerald-700"
                      : course.status === "draft"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {course.status}
                </span>
                <span className="text-sm text-slate-500">
                  {course.roles.join(", ")} • {course.phase}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/learner/courses/${course.pathSlug}/${course.id}`}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium"
            >
              Preview as Learner
            </Link>
            <button
              onClick={course.status === "draft" ? handlePublish : handleSave}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium"
            >
              {course.status === "draft" ? "Publish" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Instructor Insights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <Users className="w-5 h-5 text-teal-600" />
            <div>
              <p className="text-2xl font-bold text-slate-800">{course.enrolledCount}</p>
              <p className="text-xs text-slate-500">Enrolled Learners</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <BarChart3 className="w-5 h-5 text-teal-600" />
            <div>
              <p className="text-2xl font-bold text-slate-800">{course.completionRate}%</p>
              <p className="text-xs text-slate-500">Completion Rate</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <div className="w-5 h-5 rounded bg-teal-100 flex items-center justify-center">
              <span className="text-xs font-bold text-teal-700">{modules.length}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{modules.length}</p>
              <p className="text-xs text-slate-500">Modules</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <div className="w-5 h-5 rounded bg-teal-100 flex items-center justify-center">
              <span className="text-xs font-bold text-teal-700">{learnerModules.length}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{learnerModules.length}</p>
              <p className="text-xs text-slate-500">Chapters for Learner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Module & Chapter Management */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-800">Modules & Chapters</h2>
            <p className="text-sm text-slate-500 mt-1">
              Drag to reorder. Add content per module. Control publish/unpublish per item.
            </p>
          </div>
          <button
            onClick={addModule}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Module
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {modules
            .sort((a, b) => a.order - b.order)
            .map((mod, modIndex) => {
              const isExpanded = expandedModuleId === mod.id;

              return (
                <div key={mod.id} className="group">
                  {/* Module Header - Draggable */}
                  <div
                    draggable
                    onDragStart={() => setDraggedModuleId(mod.id)}
                    onDragEnd={() => setDraggedModuleId(null)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (draggedModuleId && draggedModuleId !== mod.id) {
                        const fromIdx = modules.findIndex((m) => m.id === draggedModuleId);
                        if (fromIdx >= 0) handleModuleReorder(fromIdx, modIndex);
                      }
                    }}
                    className={`flex items-center gap-2 p-4 hover:bg-slate-50 transition cursor-grab ${
                      draggedModuleId === mod.id ? "opacity-50" : ""
                    }`}
                  >
                    <GripVertical className="w-5 h-5 text-slate-400 shrink-0" />
                    <button
                      onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                      className="flex-1 flex items-center gap-2 text-left"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                      <input
                        type="text"
                        value={mod.title}
                        onChange={(e) => updateModuleTitle(mod.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="font-medium text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-teal-500 focus:outline-none px-1 -mx-1"
                      />
                      <span className="text-sm text-slate-500">
                        {mod.chapters.length} content items
                      </span>
                    </button>
                  </div>

                  {/* Module Content - Chapters */}
                  {isExpanded && (
                    <div className="bg-slate-50 p-4 pb-6">
                      <div className="space-y-2 mb-4">
                        {mod.chapters
                          .sort((a, b) => a.order - b.order)
                          .map((ch, chIndex) => {
                            const Icon = getContentIcon(ch.type);
                            return (
                              <div
                                key={ch.id}
                                draggable
                                onDragStart={() => setDraggedContentId(ch.id)}
                                onDragEnd={() => setDraggedContentId(null)}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  if (draggedContentId && draggedContentId !== ch.id) {
                                    const fromIdx = mod.chapters.findIndex((c) => c.id === draggedContentId);
                                    if (fromIdx >= 0) handleContentReorder(mod.id, fromIdx, chIndex);
                                  }
                                }}
                                className={`flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 ${
                                  draggedContentId === ch.id ? "opacity-50" : ""
                                }`}
                              >
                                <GripVertical className="w-4 h-4 text-slate-400 shrink-0 cursor-grab" />
                                <select
                                  value={ch.type}
                                  onChange={(e) =>
                                    updateChapter(mod.id, ch.id, { type: e.target.value as ContentType })
                                  }
                                  className="px-2 py-1 border border-slate-200 rounded text-sm"
                                >
                                  {CONTENT_TYPES.map((t) => (
                                    <option key={t} value={t}>{t.toUpperCase()}</option>
                                  ))}
                                </select>
                                <input
                                  type="text"
                                  value={ch.title}
                                  onChange={(e) =>
                                    updateChapter(mod.id, ch.id, { title: e.target.value })
                                  }
                                  placeholder="Title"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm"
                                />
                                <input
                                  type="text"
                                  value={ch.url}
                                  onChange={(e) =>
                                    updateChapter(mod.id, ch.id, { url: e.target.value })
                                  }
                                  placeholder="URL or upload path"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm"
                                />
                                <button
                                  onClick={() => toggleChapterPublished(mod.id, ch.id)}
                                  className={`p-2 rounded ${
                                    ch.published ? "text-emerald-600 bg-emerald-50" : "text-slate-400 bg-slate-100"
                                  }`}
                                  title={ch.published ? "Published (visible to learners)" : "Unpublished (hidden)"}
                                >
                                  {ch.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => deleteChapter(mod.id, ch.id)}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })}
                      </div>

                      <button
                        onClick={() => addChapter(mod.id)}
                        className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Add content (Video, PDF, PPT, Link)
                      </button>

                      {/* Module completion rules & Assessments */}
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Module Completion & Assessments</h4>
                        <div className="flex flex-wrap gap-2">
                          <select className="px-3 py-1.5 border border-slate-200 rounded text-sm">
                            <option>Watch videos</option>
                            <option>Pass quiz</option>
                            <option>Submit assignment</option>
                          </select>
                          <select className="px-3 py-1.5 border border-slate-200 rounded text-sm">
                            <option value="">Attach assessment...</option>
                            {assessments.map((a) => (
                              <option key={a.id} value={a.id}>{a.title} ({a.type})</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            placeholder="Pass score %"
                            className="w-24 px-2 py-1.5 border border-slate-200 rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
