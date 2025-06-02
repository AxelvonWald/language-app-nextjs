// app/courses/[id]/page.jsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CourseLessonsPage({ params }) {
  const { id } = params
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourse() {
      const res = await fetch(`/api/courses/${id}`)
      const data = await res.json()

      if (data) {
        setCourse(data)
      }

      setLoading(false)
    }

    fetchCourse()
  }, [id])

  if (loading) return <div className="p-4">Loading...</div>
  if (!course) return <div className="p-4">Course not found</div>

  return (
    <main className="p-6 max-w-3xl mx-auto">
      {/* Course Title */}
      <h1 className="text-3xl font-bold mb-6">{course.title}</h1>

      {/* Back Button */}
      <Link
        href="/courses"
        className="text-blue-600 hover:underline mb-4 block"
      >
        ← Back to courses
      </Link>

      {/* Lesson List */}
      <h2 className="text-2xl font-semibold mb-4">Select a Lesson</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {course.lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white dark:bg-gray-800 p-4 border rounded-md shadow-sm hover:shadow-lg transition-shadow"
          >
            <Link
              href={`/courses/${id}/lessons/${lesson.id}`}
              className="block text-lg font-semibold"
            >
              {lesson.title}
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {lesson.description || `Lesson ${lesson.order_index}`}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}