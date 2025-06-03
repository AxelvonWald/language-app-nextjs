// app/courses/[id]/modules/page.jsx
'use client'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ModulesPage({ params }) {
  const { id: courseId } = params
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [completedLessons, setCompletedLessons] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 1. Get user session
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        // 2. Fetch modules
        const { data: modulesData } = await supabase
          .from('modules')
          .select('*')
          .eq('course_id', courseId)
          .order('order_index', { ascending: true })

        // 3. Fetch progress if user exists
        if (user) {
          const { data } = await supabase
            .from('user_lesson_progress')
            .select('lesson_id, lessons(module_id)')
            .eq('user_id', user.id)
          
          const moduleProgress = {}
          data?.forEach(item => {
            const moduleId = item.lessons.module_id
            moduleProgress[moduleId] = (moduleProgress[moduleId] || 0) + 1
          })
          setCompletedLessons(moduleProgress)
        }

        setModules(modulesData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId])

  const isModuleLocked = (module) => {
    // First module is never locked
    if (module.order_index === 1) return false
    
    // Module is locked if not enough lessons completed in previous module
    const prevModuleCompleted = completedLessons[module.order_index - 1] || 0
    return prevModuleCompleted < (module.required_lessons_to_unlock || 3)
  }

  if (loading) return (
    <main className="container">
      <p>Loading modules...</p>
    </main>
  )

  if (!modules || modules.length === 0) return (
    <main className="container">
      <p>No modules found</p>
    </main>
  )

  return (
    <main className="container">
      <Link href="/courses" className="back-link">
        ← Back to Courses
      </Link>

      <h1 className="page-title">Course Modules</h1>

      <div className="course-list">
        {modules.map((module) => {
          const locked = isModuleLocked(module)
          const completedCount = completedLessons[module.id] || 0
          
          return (
            <div 
              key={module.id} 
              className={`course-card ${locked ? 'locked' : ''}`}
            >
              {locked && (
                <div className="lock-icon">🔒</div>
              )}
              <Link
                href={locked ? '#' : `/courses/${courseId}/modules/${module.id}/lessons`}
                className="course-content"
              >
                <h2 className="course-title">{module.title}</h2>
                <p className="course-description">
                  {module.description || 'No description available'}
                </p>
                
                {completedCount > 0 && (
                  <div className="progress-info">
                    Completed {completedCount} of {module.lesson_count || 'all'} lessons
                  </div>
                )}
              </Link>
              {locked && (
                <p className="lock-message">
                  Complete {module.required_lessons_to_unlock || 3} lessons in previous module
                </p>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}