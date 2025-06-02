// app/courses/[id]/modules/[moduleId]/lessons/[lesson_id]/page.jsx
'use client'

import React, { useEffect, useState } from 'react'
import BackButton from '@/components/BackButton' // Changed from Link import

export default function LessonPage({ params }) {
  const { id, moduleId, lesson_id } = params
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLesson() {
      const res = await fetch(`/api/lessons/${lesson_id}?course_id=${id}&module_id=${moduleId}`)
      const data = await res.json()

      if (!res.ok) {
        setLesson(null)
      } else {
        setLesson(data)
      }

      setLoading(false)
    }

    fetchLesson()
  }, [id, moduleId, lesson_id])

  if (loading) return <div className="container">Loading lesson...</div>
  if (!lesson) return <div className="container">Lesson not found</div>

  return (
    <main className="container">
      {/* Replaced Link with BackButton */}
      <BackButton 
        href={`/courses/${id}/modules/${moduleId}/lessons`}
      >
        Back to Lessons
      </BackButton>

      {/* Rest of your code remains exactly the same */}
      <h1 className="page-title">{lesson.title}</h1>
      {lesson.description && <p className="lesson-description">{lesson.description}</p>}

      {lesson.lesson_sections && lesson.lesson_sections.map(section => (
        <section key={section.id} className="lesson-section">
          <h2 className="section-title">{section.title}</h2>
          {section.instructions && <p className="section-instructions">{section.instructions}</p>}

          {section.audio_file_id && (
            <audio 
              controls 
              src={`/audio/${section.audio_file_id}.wav`} 
              className="audio-player" 
            />
          )}

          {section.sentences && section.sentences.length > 0 && (
            <table className="sentence-table">
              <thead>
                <tr>
                  {section.show_native && <th>Native</th>}
                  {section.show_target && <th>Target</th>}
                </tr>
              </thead>
              <tbody>
                {section.sentences.map((sentence, i) => (
                  <tr key={i}>
                    {section.show_native && (
                      <td>{sentence.native_text}</td>
                    )}
                    {section.show_target && (
                      <td>{sentence.target_text}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      ))}
    </main>
  )
}