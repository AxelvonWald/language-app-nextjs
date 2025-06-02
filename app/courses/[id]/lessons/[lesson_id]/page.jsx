// app/courses/[id]/lessons/[lesson_id]/page.jsx
'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function LessonPage({ params }) {
  const { id, lesson_id } = React.use(params)
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
    <main style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Link
        href={`/courses/${id}/lessons`}
        style={{
          display: 'inline-block',
          marginBottom: '20px',
          textDecoration: 'none',
          color: '#0070f3',
          fontWeight: '600'
        }}
      >
        ← Back to Lessons
      </Link>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
        {lesson.title}
      </h1>

      {lesson.lesson_sections.map((section) => (
        <section key={section.id} style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '10px' }}>
            {section.title}
          </h2>
          <p style={{ marginBottom: '16px', color: '#333' }}>
            {section.instructions}
          </p>

          {/* Audio Player */}
          {section.audio_file && (
            <div style={{ marginBottom: '20px' }}>
              <audio
                controls
                style={{ width: '100%', maxWidth: '600px' }}
                src={`/audio/${section.audio_file}.wav`}
              />
            </div>
          )}

          {/* Sentences Table */}
          {section.sentences.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  {section.show_native && <th style={{ textAlign: 'left', padding: '8px' }}>Native</th>}
                  {section.show_target && <th style={{ textAlign: 'left', padding: '8px' }}>Target</th>}
                </tr>
              </thead>
              <tbody>
                {section.sentences.map((sentence) => (
                  <tr key={sentence.id} style={{ borderBottom: '1px solid #eee' }}>
                    {section.show_native && (
                      <td style={{ padding: '8px' }}>
                        <strong>{sentence.native_text}</strong>
                      </td>
                    )}
                    {section.show_target && (
                      <td style={{ padding: '8px' }}>
                        {sentence.target_text}
                      </td>
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