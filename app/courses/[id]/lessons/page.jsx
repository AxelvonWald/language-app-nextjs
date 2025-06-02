'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function LessonListPage({ params }) {
  const { id: course_id } = params
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLessons() {
      const res = await fetch(`/api/lessons?course_id=${course_id}`)
      const data = await res.json()
      setLessons(data)
      setLoading(false)
    }

    fetchLessons()
  }, [course_id])

  if (loading) return <div>Loading lessons...</div>
  if (!lessons.length) return <div>No lessons found</div>

  return (
    <main className="container">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
        Lessons in Course {course_id}
      </h1>

      <div className="module-list">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/courses/${course_id}/lessons/${lesson.id}`}
            className="module-card"
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{lesson.title}</h2>
            <p style={{ marginTop: '8px', fontSize: '0.9rem', color: '#666' }}>
              {lesson.description || `Lesson ${lesson.order_index}`}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
