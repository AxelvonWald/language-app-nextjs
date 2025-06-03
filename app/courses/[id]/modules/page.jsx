'use client'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ProgressTracker from '@/components/ProgressTracker'

export default function ModulesPage({ params }) {
  const { id: courseId } = params
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  const { progress, loading: progressLoading } = ProgressTracker({ userId: user?.id })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Get user session using your existing client
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        // Fetch modules
        const { data: modulesData } = await supabase
          .from('modules')
          .select('*')
          .eq('course_id', courseId)
          .order('order_index', { ascending: true })

        setModules(modulesData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId])

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

      <div className="modules-grid">
        {modules.map((module) => {
          const completedLessons = progress[module.id] || 0
          const isLocked = module.order_index > 1 && 
                          (!progress[module.id - 1] || 
                           progress[module.id - 1] < (module.required_lessons_to_unlock || 3))

          return (
            <div 
              key={module.id} 
              className={`module-box ${isLocked ? 'locked' : ''} ${completedLessons ? 'has-progress' : ''}`}
            >
              {isLocked ? (
                <div className="module-locked">
                  <div className="lock-icon">🔒</div>
                  <p>Complete {module.required_lessons_to_unlock || 3} lessons in previous module to unlock</p>
                </div>
              ) : (
                <Link
                  href={`/courses/${courseId}/modules/${module.id}/lessons`}
                  className="module-content"
                >
                  <h2>{module.title}</h2>
                  <p>{module.description || 'No description available'}</p>
                  
                  {completedLessons > 0 && (
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(completedLessons / (module.lesson_count || 5)) * 100}%` }}
                      />
                      <span className="progress-text">
                        {completedLessons} of {module.lesson_count || 5} lessons
                      </span>
                    </div>
                  )}
                </Link>
              )}
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .module-box {
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          padding: 1.5rem;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .module-box.locked {
          background-color: #f8fafc;
          color: #64748b;
        }
        .module-box.has-progress {
          border-left: 4px solid #3b82f6;
        }
        .module-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .module-locked {
          text-align: center;
          padding: 1rem;
        }
        .lock-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .progress-bar {
          margin-top: 1rem;
          background-color: #e2e8f0;
          border-radius: 9999px;
          height: 0.5rem;
          overflow: hidden;
        }
        .progress-fill {
          background-color: #3b82f6;
          height: 100%;
        }
        .progress-text {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #64748b;
        }
      `}</style>
    </main>
  )
}