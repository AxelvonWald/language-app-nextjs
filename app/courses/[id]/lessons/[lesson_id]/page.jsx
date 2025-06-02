'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function LessonPage({ params }) {
  const { id, lesson_id } = params
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/lessons/${lesson_id}?course_id=${id}`)
      const data = await res.json()

      if (data.lesson_sections) {
        setLesson(data)
      }

      setLoading(false)
    }

    fetchData()
  }, [id, lesson_id])

  if (loading) return <div>Loading lesson...</div>
  if (!lesson) return <div>Lesson not found</div>

  return (
    <main className="container">
      <Link href={`/courses/${id}/lessons`} className="back-link">
        ← Back to Lessons
      </Link>

      <h1 className="page-title">{lesson.title}</h1>

      {lesson.lesson_sections.map((section) => (
        <section key={section.id} className="lesson-section">
          <h2 className="section-title">{section.title}</h2>
          <p className="section-instructions">{section.instructions}</p>

          {section.audio_file && (
            <div className="audio-player">
              <audio controls src={`/audio/${section.audio_file}.wav`} />
            </div>
          )}

          {section.sentences.length > 0 && (
            <table className="sentence-table">
              <thead>
                <tr>
                  {section.show_native && <th>Native</th>}
                  {section.show_target && <th>Target</th>}
                </tr>
              </thead>
              <tbody>
                {section.sentences.map((sentence) => (
                  <tr key={sentence.id}>
                    {section.show_native && (
                      <td>
                        <strong>{sentence.native_text}</strong>
                      </td>
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
