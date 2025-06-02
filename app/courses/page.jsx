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
      setCourses(data)
      setLoading(false)
    }

    fetchCourses()
  }, [])

  if (loading) return <p>Loading courses...</p>

  return (
    <main style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
        Select Your Course
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}/lessons`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #ddd',
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              transition: 'background-color 0.2s'
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              {course.title}
            </h2>
            <p style={{ marginTop: '8px', fontSize: '0.9rem', color: '#666' }}>
              {course.description || 'Beginner level'}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}