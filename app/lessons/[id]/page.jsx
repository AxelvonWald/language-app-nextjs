// app/lessons/[id]/page.jsx
'use client'

import { useEffect, useState } from 'react'
import BackButton from '@/components/BackButton'
import AudioPlayer from '@/components/AudioPlayer'

export default function LessonPage({ params }) {
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLesson() {
      const res = await fetch(`/api/lessons/${params.id}`)
      const data = await res.json()

      console.log('API Response:', data) // 👈 Debugging

      if (data && data.lesson_sections) {
        setLesson(data)
        setLoading(false)
      } else {
        setLoading(false)
        console.error('No lesson sections found:', data)
      }
    }

    fetchLesson()
  }, [params.id])

  if (loading) return <div>Loading...</div>
  if (!lesson) return <div>Lesson not found</div>

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <BackButton href="/lessons" label="← Lessons" />
      <h1 className="text-2xl font-bold my-6">{lesson.title}</h1>

      {lesson.lesson_sections.map((section) => (
        <section key={section.id} className="mb-8 p-4 border rounded-md bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{section.instructions}</p>

          {/* Audio Player */}
          {section.audio_file_id && <AudioPlayer path={`/audio/${section.audio_file_id}`} />}

          {/* Sentences Table */}
          {section.sentences.length > 0 && (
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
    </main>
  )
}