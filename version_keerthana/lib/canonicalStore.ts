/**
 * Single source of truth for Courses, Modules, Assignments, Quizzes.
 * Instructor creates/edits here; Learner consumes published data only.
 * Persists to localStorage so changes reflect across Instructor and Learner views.
 */

import { getInitialCanonicalCourses } from "@/data/canonicalCourses";
import type { CanonicalCourse, CanonicalModule } from "@/data/canonicalCourses";
import { assignments as initialAssignments } from "@/data/assignments";
import type { Assignment } from "@/data/assignments";
import { quizConfigs as initialQuizConfigs } from "@/data/quizData";
import type { QuizConfig } from "@/data/quizData";

const STORAGE_KEY = "digitalt3-canonical-store";

export type CanonicalStoreState = {
  courses: CanonicalCourse[];
  assignments: Assignment[];
  quizConfigs: Record<string, QuizConfig>;
};

function loadInitial(): CanonicalStoreState {
  return {
    courses: getInitialCanonicalCourses(),
    assignments: [...initialAssignments],
    quizConfigs: { ...initialQuizConfigs },
  };
}

function loadState(): CanonicalStoreState {
  if (typeof window === "undefined") return loadInitial();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CanonicalStoreState;
      return {
        courses: parsed.courses ?? loadInitial().courses,
        assignments: parsed.assignments ?? loadInitial().assignments,
        quizConfigs: parsed.quizConfigs ?? loadInitial().quizConfigs,
      };
    }
  } catch (_) {}
  return loadInitial();
}

function saveState(state: CanonicalStoreState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) {}
}

let state = loadInitial();
let hydrated = false;
const listeners = new Set<() => void>();

export function getCanonicalState(): CanonicalStoreState {
  if (typeof window !== "undefined" && !hydrated) {
    hydrated = true;
    state = loadState();
  }
  return state;
}

export function subscribeCanonical(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setState(updater: (prev: CanonicalStoreState) => CanonicalStoreState) {
  state = updater(getCanonicalState());
  saveState(state);
  listeners.forEach((l) => l());
}

// ——— Courses ———
export function getCoursesForInstructor(): CanonicalCourse[] {
  return [...getCanonicalState().courses].sort(
    (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  );
}

export function getPublishedCoursesForPath(pathSlug: string): CanonicalCourse[] {
  return getCanonicalState().courses.filter(
    (c) => c.pathSlug === pathSlug && c.status === "published"
  );
}

export function getCourseById(id: string): CanonicalCourse | undefined {
  return getCanonicalState().courses.find((c) => c.id === id);
}

export function addCourse(course: CanonicalCourse) {
  setState((prev) => ({
    ...prev,
    courses: [...prev.courses, course],
  }));
}

export function updateCourse(id: string, updates: Partial<CanonicalCourse>) {
  setState((prev) => ({
    ...prev,
    courses: prev.courses.map((c) =>
      c.id === id ? { ...c, ...updates, lastUpdated: new Date().toISOString().slice(0, 10) } : c
    ),
  }));
}

export function setCourseModules(id: string, modules: CanonicalModule[]) {
  setState((prev) => ({
    ...prev,
    courses: prev.courses.map((c) =>
      c.id === id
        ? {
            ...c,
            modules,
            lastUpdated: new Date().toISOString().slice(0, 10),
          }
        : c
    ),
  }));
}

export function archiveCourse(id: string) {
  updateCourse(id, { status: "archived" });
}

export function publishCourse(id: string) {
  updateCourse(id, { status: "published" });
}

export function deleteCourse(id: string) {
  setState((prev) => ({
    ...prev,
    courses: prev.courses.filter((c) => c.id !== id),
  }));
}

// ——— Assignments ———
export function getAssignments(): Assignment[] {
  return getCanonicalState().assignments;
}

export function getAssignmentById(id: string): Assignment | undefined {
  return getCanonicalState().assignments.find((a) => a.id === id);
}

export function addAssignment(assignment: Assignment) {
  setState((prev) => ({
    ...prev,
    assignments: [...prev.assignments, assignment],
  }));
}

export function updateAssignment(id: string, updates: Partial<Assignment>) {
  setState((prev) => ({
    ...prev,
    assignments: prev.assignments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
  }));
}

// ——— Quizzes ———
export function getQuizConfigs(): Record<string, QuizConfig> {
  return getCanonicalState().quizConfigs;
}

export function getQuizConfig(id: string): QuizConfig | undefined {
  return getCanonicalState().quizConfigs[id];
}

export function addOrUpdateQuizConfig(config: QuizConfig) {
  setState((prev) => ({
    ...prev,
    quizConfigs: { ...prev.quizConfigs, [config.id]: config },
  }));
}

export function getAvailableAssessments(): { id: string; title: string; type: string }[] {
  const s = getCanonicalState();
  const items: { id: string; title: string; type: string }[] = [];
  Object.entries(s.quizConfigs).forEach(([id, q]) => {
    items.push({ id, title: q.title, type: "quiz" });
  });
  s.assignments.filter((a) => a.type !== "Quiz").forEach((a) => {
    items.push({ id: a.id, title: a.title, type: "assignment" });
  });
  return items;
}
