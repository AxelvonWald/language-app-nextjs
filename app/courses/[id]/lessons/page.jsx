// app/courses/[id]/lessons/page.jsx
'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function LessonListPage({ params }) {
  const { id: course_id } = React.use(params)
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
    <main style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      {/* Removed redundant "Back to Course" link */}

      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
        Lessons in Course {course_id}
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/courses/${course_id}/lessons/${lesson.id}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #ccc',
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: '#fff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              transition: 'box-shadow 0.2s'
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{lesson.title}</h2>
            <p style={{ marginTop: '8px', fontSize: '0.9rem', color: '#555' }}>
              {lesson.description || `Lesson ${lesson.order_index}`}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}