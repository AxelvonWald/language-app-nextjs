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
      <BackButton href="/modules" label="← Lessons" />
      <h1 className="text-2xl font-bold my-6">{lesson.title}</h1>

      {lesson.lesson_sections.map((section) => (
        <section key={section.id} className="mb-8 p-4 border rounded-md bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{section.instructions}</p>

          {/* Audio Player */}
          {section.audio_file_id && <AudioPlayer path={`/audio/${section.audio_file_id}`} />}

          {/* Sentences List */}
          <ul className="mt-4 space-y-2">
            {section.sentences.map(sentence => (
              <li key={sentence.id} className="border-b pb-2">
                {section.show_native && <div><strong>{sentence.native_text}</strong></div>}
                {section.show_target && <div>{sentence.target_text}</div>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}