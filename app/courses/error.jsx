// app/courses/error.jsx
"use client";

export default function CoursesError({ error, reset }) {
  return (
    <div className="p-4 border-l-4 border-red-500 bg-red-50">
      <h2 className="font-bold">Course Error</h2>
      <p className="mb-3">{error.message}</p>
      <button
        onClick={reset}
        className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
      >
        Retry
      </button>
    </div>
  );
}