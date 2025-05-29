// app/courses/[id]/lessons/[lesson_id]/page.jsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AudioPlayer from '@components/AudioPlayer'
import BackButton from '@/components/BackButton'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function LessonPage({ params }) {
  const { id, lesson_id } = params
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [progressStatus, setProgressStatus] = useState(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchData() {
      // Fetch lesson data
      const res = await fetch(`/api/lessons/${lesson_id}?course_id=${id}`)
      const data = await res.json()

      if (data.lesson_sections) {
        setLesson(data)
      }

      // Fetch progress status
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: progress } = await supabase
          .from('user_lesson_progress')
          .select('status')
          .eq('user_id', user.id)
          .eq('lesson_id', lesson_id)
          .single()

        setProgressStatus(progress?.status || 'not_started')
      }

      setLoading(false)
    }

    fetchData()
  }, [id, lesson_id])

  const updateProgress = async (status) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('user_lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: Number(lesson_id),
        status: status,
        updated_at: new Date().toISOString()
      })

    if (!error) {
      setProgressStatus(status)
    }
  }

  if (loading) return <div>Loading lesson...</div>
  if (!lesson) return <div>Lesson not found</div>

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <BackButton href={`/courses/${id}/lessons`} label="← Lessons" />
      
      {/* Progress Status Badge */}
      {progressStatus && (
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-sm ${
            progressStatus === 'completed' ? 'bg-green-100 text-green-800' :
            progressStatus === 'started' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {progressStatus.replace('_', ' ')}
          </span>
        </div>
      )}

      <h1 className="text-2xl font-bold my-6">{lesson.title}</h1>

      {lesson.lesson_sections.map((section) => (
        <section key={section.id} className="mb-8 p-4 border rounded-md bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{section.instructions}</p>

          {/* Audio Player */}
          {section.audio_file_id && <AudioPlayer path={`/audio/${section.audio_file_id}.wav`} />}

          {/* Sentences Table */}
          {section.sentences?.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    {section.show_native && <th className="px-4 py-2 text-left">Native</th>}
                    {section.show_target && <th className="px-4 py-2 text-left">Target</th>}
                  </tr>
                </thead>
                <tbody>
                  {section.sentences.map(sentence => (
                    <tr key={sentence.id} className="border-b dark:border-gray-600">
                      {section.show_native && (
                        <td className="px-4 py-2">
                          <strong>{sentence.native_text}</strong>
                        </td>
                      )}
                      {section.show_target && (
                        <td className="px-4 py-2">
                          {sentence.target_text}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}

      {/* Progress Controls */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={() => updateProgress('started')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Mark as Started
        </button>
        <button
          onClick={() => updateProgress('completed')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Mark as Completed
        </button>
      </div>
    </main>
  )
}