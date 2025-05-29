// app/courses/[id]/page.jsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CourseDetailPage({ params }) {
  const { id } = params
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourseData() {
      const courseRes = await fetch(`/api/courses/${id}`)
      const lessonsRes = await fetch(`/api/lessons?course_id=${id}`)

      const courseData = await courseRes.json()
      const lessonsData = await lessonsRes.json()

      setCourse(courseData)
      setLessons(lessonsData)
      setLoading(false)
    }

    fetchCourseData()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!course) return <div>Course not found</div>

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <Link href="/courses" className="text-blue-600 hover:underline mb-4 block">
        ← Back to courses
      </Link>

      <h1 className="text-2xl font-bold mb-6">Lessons in "{course.title}"</h1>

      <ul className="space-y-2">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link
              href={`/courses/${id}/lessons/${lesson.id}`}
              className="block p-4 border rounded bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <strong>{lesson.title}</strong>
              <br />
              <small className="text-gray-600">{lesson.description || `Lesson ${lesson.order_index}`}</small>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}