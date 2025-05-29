// app/lessons/page.jsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function LessonsPage() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLessons() {
      const res = await fetch('/api/lessons')
      const data = await res.json()

      if (data) {
        setLessons(data)
      }

      setLoading(false)
    }

    fetchLessons()
  }, [])

  if (loading) return <div>Loading lessons...</div>

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Select a Lesson</h1>
      
      <ul className="space-y-2">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link
              href={`/lessons/${lesson.id}`}
              className="block p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <strong>{lesson.title}</strong>
              <br />
              <small className="text-gray-600 dark:text-gray-400">
                {lesson.description || 'No description'}
              </small>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}