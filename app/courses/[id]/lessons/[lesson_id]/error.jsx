// app/courses/[id]/lessons/[lessonId]/error.jsx
"use client";

export default function LessonError({ error, reset }) {
  return (
    <div className="text-center p-8">
      <h3 className="text-lg text-red-600">Lesson Failed to Load</h3>
      <p className="mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reload Lesson
      </button>
    </div>
  );
}