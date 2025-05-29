// app/courses/page.jsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      const res = await fetch('/api/courses')
      const data = await res.json()

      if (data) {
        setCourses(data)
      }

      setLoading(false)
    }

    fetchCourses()
  }, [])

  if (loading) return <div>Loading courses...</div>

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Select a Language Pair</h1>

      <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {courses.map((course) => (
          <li key={course.id}>
            <Link
              href={`/courses/${course.id}/lessons`}
              className="block p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <strong>{course.title}</strong>
              <br />
              <small className="text-gray-600">{course.description || 'Beginner level'}</small>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}