// components/LessonLock.jsx
'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function LessonLock({ courseId, moduleId, lessonId, userId }) {
  const [isLocked, setIsLocked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setLoading(true)
        
        // Get current lesson's order index
        const { data: currentLesson, error: lessonError } = await supabase
          .from('lessons')
          .select('order_index, module_id')
          .eq('id', lessonId)
          .single()

        if (lessonError) throw lessonError
        if (!currentLesson) {
          setIsLocked(false)
          return
        }

        // First lesson of first module is always unlocked
        if (currentLesson.order_index === 1) {
          const { data: module } = await supabase
            .from('modules')
            .select('order_index')
            .eq('id', currentLesson.module_id)
            .single()

          if (module?.order_index === 1) {
            setIsLocked(false)
            return
          }
        }

        // Find previous lesson in sequence
        const { data: previousLesson, error: prevError } = await supabase
          .from('lessons')
          .select('id, order_index')
          .eq('module_id', moduleId)
          .lt('order_index', currentLesson.order_index)
          .order('order_index', { ascending: false })
          .limit(1)
          .single()

        if (prevError) throw prevError

        if (!previousLesson) {
          setIsLocked(false)
          return
        }

        // Check if previous lesson was completed
        const { data: progress, error: progressError } = await supabase
          .from('user_lesson_progress')
          .select('completed_at')
          .eq('user_id', userId)
          .eq('lesson_id', previousLesson.id)
          .single()

        if (progressError) throw progressError

        setIsLocked(!progress?.completed_at)
        setMessage(progress?.completed_at ? '' : `Complete Lesson ${previousLesson.order_index} to unlock`)

      } catch (error) {
        console.error('LessonLock error:', error)
        setIsLocked(false) // Fail open - don't block access on error
      } finally {
        setLoading(false)
      }
    }

    if (userId) checkAccess()
  }, [courseId, moduleId, lessonId, userId])

  if (loading) return null // Don't show loading state

  if (isLocked) return (
    <div className="locked-lesson-notice p-4 mb-6 bg-yellow-50 border-l-4 border-yellow-400">
      <div className="flex">
        <div className="flex-shrink-0">🔒</div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            {message || 'Complete the previous lesson to unlock this content'}
          </p>
        </div>
      </div>
    </div>
  )

  return null
}