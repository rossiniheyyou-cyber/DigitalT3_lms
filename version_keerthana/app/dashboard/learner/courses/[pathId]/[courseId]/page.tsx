"use client";

import { useParams } from "next/navigation";
import { getPathBySlug } from "@/data/learningPaths";
import { toLearnerModules } from "@/data/canonicalCourses";
import { CourseDetailClient } from "./CourseDetailClient";
import type { Module } from "@/data/learningPaths";
import { useCanonicalStore } from "@/context/CanonicalStoreContext";

function getDefaultModules(courseTitle: string): Module[] {
  return [
    { id: "m1", title: "Introduction", type: "video", duration: "15 min", completed: false },
    { id: "m2", title: "Core Concepts", type: "video", duration: "25 min", completed: false, locked: true },
    { id: "m3", title: "Deep Dive", type: "video", duration: "30 min", completed: false, locked: true },
    { id: "m4", title: "Practice Assignment", type: "assignment", duration: "45 min", completed: false, locked: true },
    { id: "m5", title: "Module Quiz", type: "quiz", duration: "10 min", completed: false, locked: true },
  ];
}

export default function CourseDetailPage() {
  const params = useParams();
  const pathId = params.pathId as string;
  const courseId = params.courseId as string;
  const { getCourseById } = useCanonicalStore();
  const canonicalCourse = getCourseById(courseId);
  const path = pathId ? getPathBySlug(pathId) : canonicalCourse ? getPathBySlug(canonicalCourse.pathSlug) : null;

  if (!path) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-600">Path not found</p>
      </div>
    );
  }

  if (!canonicalCourse) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-600">Course not found</p>
      </div>
    );
  }

  if (canonicalCourse.status !== "published" && canonicalCourse.status !== "archived") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-600">This course is not yet published.</p>
      </div>
    );
  }

  const modules = toLearnerModules(canonicalCourse.modules);
  const course = {
    id: canonicalCourse.id,
    title: canonicalCourse.title,
    description: canonicalCourse.description,
    duration: canonicalCourse.estimatedDuration,
    instructor: canonicalCourse.instructor,
    skills: canonicalCourse.skills,
    modules: modules.length > 0 ? modules : getDefaultModules(canonicalCourse.title),
  };

  return <CourseDetailClient path={path} course={course} />;
}
