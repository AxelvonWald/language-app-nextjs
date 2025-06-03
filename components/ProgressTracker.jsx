'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function useProgressTracker(userId) {
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true)
        
        const { data, error } = await supabase
          .from('user_lesson_progress')
          .select('lesson_id, lessons(module_id)')
          .eq('user_id', userId)

        if (error) throw error

        const progressData = {}
        data?.forEach(item => {
          const moduleId = item.lessons.module_id
          progressData[moduleId] = (progressData[moduleId] || 0) + 1
        })

        setProgress(progressData)
      } catch (error) {
        console.error('Error fetching progress:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) fetchProgress()
  }, [userId])

  const markLessonComplete = async (lessonId) => {
    try {
      const { error } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id'
        })

      if (error) throw error

      setProgress(prev => {
        const newProgress = {...prev}
        // Increment count for the module this lesson belongs to
        // You might need to fetch the module_id if not already in state
        return newProgress
      })
    } catch (error) {
      console.error('Error marking lesson complete:', error)
    }
  }

  return { progress, loading, markLessonComplete }
}