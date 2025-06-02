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

  if (loading) return <div className="container p-4">Loading...</div>
  if (!course) return <div className="container p-4">Course not found</div>

  return (
    <main className="course_card">
      {/* Course Title */}
      <h1 className="page-title">{course.title}</h1>

      {/* Back Button */}
      <Link href="/courses" className="back-link">
        ← Back to courses
      </Link>

      {/* Lesson List */}
      <h2 className="section-title">Select a Lesson</h2>
      <div className="modules-grid">
        {course.lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/courses/${id}/lessons/${lesson.id}`}
            className="course-card"
          >
            <h3 className="lesson-title">{lesson.title}</h3>
            <p className="lesson-description">
              {lesson.description || `Lesson ${lesson.order_index}`}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
