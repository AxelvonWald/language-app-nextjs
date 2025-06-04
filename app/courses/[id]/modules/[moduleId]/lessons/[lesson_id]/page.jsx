// app/courses/[id]/modules/[moduleId]/lessons/[lesson_id]/page.jsx
'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import BackButton from '@/components/BackButton'
import AudioPlayer from '@/components/AudioPlayer'
import LessonLock from '@/components/LessonLock'
import useProgressTracker from '@/hooks/useProgressTracker'

export default function LessonPage({ params }) {
  const { id: courseId, moduleId, lesson_id } = params
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  // Progress tracking
  const { 
    lessonProgress, 
    markLessonComplete,
    loading: progressLoading 
  } = useProgressTracker(user?.id)

  const isCompleted = user ? lessonProgress[lesson_id]?.status === 'completed' : false

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get user session
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        // Fetch lesson with module info
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*, modules!inner(title)')
          .eq('id', lesson_id)
          .single()

        if (lessonError) throw lessonError
        if (!lessonData) throw new Error('Lesson not found')

        // Fetch sections and related data
        const { data: sections, error: sectionsError } = await supabase
          .from("lesson_sections")
          .select("*")
          .eq("lesson_id", lesson_id)
          .order("order_index", { ascending: true })

        if (sectionsError) throw sectionsError

        // Parallel fetch for efficiency
        const sectionPromises = sections.map(async (section) => {
          const [sentences, audio] = await Promise.all([
            supabase
              .from("section_sentences")
              .select("sentences(*)")
              .eq("lesson_section_id", section.id),
            supabase
              .from("audio_files")
              .select("file_path")
              .eq("lesson_section_id", section.id)
              .maybeSingle()
          ])

          return {
            ...section,
            sentences: sentences.data?.map(ss => ss.sentences) || [],
            audioPath: audio.data?.file_path
          }
        })

        const sectionData = await Promise.all(sectionPromises)

        setLesson({
          ...lessonData,
          sections: sectionData,
        })
      } catch (err) {
        console.error('Failed to load lesson:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId, moduleId, lesson_id])

  const handleCompleteToggle = async () => {
    if (!user) {
      alert('Please sign in to track your progress')
      return
    }

    setIsSaving(true)
    const newState = !isCompleted
    
    try {
      const { error } = await markLessonComplete(lesson_id, newState)
      if (error) throw error
    } catch (error) {
      console.error('Failed to update progress:', error)
      alert('Failed to save your progress. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) return (
    <main className="container mx-auto p-4">
      <p>Loading lesson...</p>
    </main>
  )

  if (error) return (
    <main className="container mx-auto p-4">
      <BackButton 
        href={`/courses/${courseId}/modules/${moduleId}/lessons`}
        className="mb-4 inline-block"
      >
        Back to Lessons
      </BackButton>
      <div className="text-red-500">
        <p>Error loading lesson:</p>
        <p>{error}</p>
      </div>
    </main>
  )

  if (!lesson) return (
    <main className="container mx-auto p-4">
      <BackButton 
        href={`/courses/${courseId}/modules/${moduleId}/lessons`}
        className="mb-4 inline-block"
      >
        Back to Lessons
      </BackButton>
      <p>Lesson not found</p>
    </main>
  )

  return (
    <main className="container mx-auto p-4">
      <BackButton 
        href={`/courses/${courseId}/modules/${moduleId}/lessons`}
        className="mb-4 inline-block"
      >
        Back to Lessons
      </BackButton>

      <LessonLock
        courseId={courseId}
        moduleId={moduleId}
        lessonId={lesson_id}
        userId={user?.id}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
            <h2 className="text-lg text-gray-600 mb-4">{lesson.modules.title}</h2>
            {lesson.description && (
              <p className="text-gray-700 mb-4">{lesson.description}</p>
            )}

            <div className="space-y-8">
              {lesson.sections.map((section) => (
                <section key={section.id} className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                  
                  {section.audioPath && (
                    <AudioPlayer 
                      path={section.audioPath}
                      className="my-3"
                    />
                  )}

                  {section.sentences.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">English</th>
                            <th className="px-4 py-2 text-left">Spanish</th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.sentences.map((sentence) => (
                            <tr key={sentence.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">{sentence.native_text}</td>
                              <td className="px-4 py-3">{sentence.target_text}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-8 pt-4 border-t">
              <input
                type="checkbox"
                id="lesson-complete"
                checked={isCompleted}
                onChange={handleCompleteToggle}
                disabled={!user || isSaving}
                className={`w-5 h-5 rounded ${!user ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              />
              <label htmlFor="lesson-complete" className="text-lg flex items-center gap-2">
                {isCompleted ? '✓ Completed' : 'Mark as Complete'}
                {isSaving && (
                  <span className="text-sm text-gray-500">Saving...</span>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          {user && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-3">Your Progress</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Current Lesson:</span>
                  <span className="font-medium">
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                {isCompleted && lessonProgress[lesson_id]?.completed_at && (
                  <div className="text-sm text-gray-500">
                    Completed on: {new Date(lessonProgress[lesson_id].completed_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}