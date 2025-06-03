// app/courses/[id]/modules/[moduleId]/lessons/page.jsx
'use client'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function LessonListPage({ params }) {
  const { id: course_id, moduleId } = params
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [completedLessons, setCompletedLessons] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 1. Get user session
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        // 2. Fetch lessons
        const res = await fetch(
          `http://localhost:3000/api/lessons?course_id=${course_id}&module_id=${moduleId}`,
          { cache: 'no-store' }
        )
        const lessonsData = await res.json()
        setLessons(lessonsData)

        // 3. Fetch completed lessons if user exists
        if (user) {
          const { data } = await supabase
            .from('user_lesson_progress')
            .select('lesson_id')
            .eq('user_id', user.id)
          setCompletedLessons(data?.map(item => item.lesson_id) || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [course_id, moduleId])

  const isLessonLocked = (lesson, index) => {
    // First lesson is never locked
    if (index === 0) return false
    
    // Lesson is locked if previous lesson isn't completed
    const previousLesson = lessons[index - 1]
    return !completedLessons.includes(previousLesson.id)
  }

  if (loading) return (
    <main className="container">
      <p>Loading lessons...</p>
    </main>
  )

  return (
    <main className="container">
      <Link 
        href={`/courses/${course_id}/modules`} 
        className="back-link"
      >
        ← Back to modules
      </Link>

      <h1 className="page-title">Lessons in Module {moduleId}</h1>

      <div className="course-list">
        {lessons.length === 0 && (
          <div className="course-card">
            <p>No lessons found.</p>
          </div>
        )}
        
        {lessons.map((lesson, index) => {
          const locked = isLessonLocked(lesson, index)
          return (
            <div 
              key={lesson.id} 
              className={`course-card ${locked ? 'locked' : ''}`}
            >
              {locked && (
                <div className="lock-icon">🔒</div>
              )}
              <Link
                href={locked ? '#' : `/courses/${course_id}/modules/${moduleId}/lessons/${lesson.id}`}
                className="course-content"
              >
                <h2 className="course-title">{lesson.title}</h2>
                {lesson.description && (
                  <p className="course-description">{lesson.description}</p>
                )}
              </Link>
              {locked && (
                <p className="lock-message">Complete previous lesson to unlock</p>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}