// app/courses/[id]/lessons/page.jsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function LessonListPage({ params }) {
  const { id: course_id } = params
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null) // Add error state

  useEffect(() => {
    async function fetchLessons() {
      try {
        const res = await fetch(`/api/lessons?course_id=${course_id}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setLessons(data || []) // Ensure data is always an array
      } catch (err) {
        setError(err.message) // Store error
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [course_id])

  if (loading) return <div>Loading lessons...</div>
  if (error) return <div>Error: {error}</div> // Show errors
  if (!lessons.length) return <div>No lessons found</div> // Handle empty state

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <Link href="/courses" className="text-blue-600 hover:underline mb-4 block">
        ← Back to courses
      </Link>

      <h1 className="text-2xl font-bold mb-6">Select a Lesson</h1>

      <ul className="space-y-2">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link
              href={`/courses/${course_id}/lessons/${lesson.id}`}
              className="block p-4 border rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
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