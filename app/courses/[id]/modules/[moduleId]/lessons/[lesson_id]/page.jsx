// app/courses/[id]/modules/[moduleId]/lessons/[lesson_id]/page.jsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import BackButton from '@/components/BackButton'
import AudioPlayer from '@/components/AudioPlayer'

export default function LessonPage({ params }) {
  const supabase = createClient()
  const { id: courseId, moduleId, lesson_id } = params
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        // Fetch lesson basic info
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lesson_id)
          .single()

        if (lessonError) throw lessonError
        if (!lessonData) throw new Error('Lesson not found')

        // Fetch sections separately
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('lesson_sections')
          .select('*')
          .eq('lesson_id', lesson_id)

        if (sectionsError) throw sectionsError

        // Fetch all related data in parallel
        const [sentencesData, audioData] = await Promise.all([
          // Get all sentences for these sections
          supabase
            .from('section_sentences')
            .select(`
              *,
              sentences(
                target_text,
                native_text
              )
            `)
            .in('lesson_section_id', sectionsData.map(s => s.id)),
          
          // Get all audio files
          supabase
            .from('audio_files')
            .select('*')
            .in('lesson_section_id', sectionsData.map(s => s.id))
        ])

        if (sentencesData.error) throw sentencesData.error
        if (audioData.error) throw audioData.error

        // Combine all data
        const combinedData = {
          ...lessonData,
          lesson_sections: sectionsData.map(section => ({
            ...section,
            sentences: sentencesData.data
              .filter(ss => ss.lesson_section_id === section.id)
              .sort((a, b) => a.order_index - b.order_index)
              .map(ss => ss.sentences),
            audio_files: audioData.data.find(a => a.lesson_section_id === section.id)
          }))
          .sort((a, b) => a.order_index - b.order_index)
        }

        setLesson(combinedData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLessonData()
  }, [lesson_id, supabase])

  if (loading) return (
    <main className="container">
      <p>Loading lesson...</p>
    </main>
  )

  if (error || !lesson) return (
    <main className="container">
      <p className="text-red-500">{error || 'Lesson not found'}</p>
    </main>
  )

  return (
    <main className="container">
      <BackButton 
        href={`/courses/${courseId}/modules/${moduleId}/lessons`}
        className="mb-6"
      >
        Back to Lessons
      </BackButton>

      <h1 className="page-title">{lesson.title}</h1>
      {lesson.description && (
        <p className="lesson-description mb-8">{lesson.description}</p>
      )}

      <div className="space-y-8">
        {lesson.lesson_sections?.map((section) => (
          <section 
            key={section.id} 
            className="lesson-section p-6 bg-card-bg rounded-lg border border-border-color"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="section-title text-xl font-semibold mb-2">
                  {section.title}
                </h2>
                {section.instructions && (
                  <p className="section-instructions text-gray-600 mb-4">
                    {section.instructions}
                  </p>
                )}
              </div>
              {section.repetitions > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {section.repetitions}x repeats
                </span>
              )}
            </div>

            {/* Audio Player */}
            {section.audio_files?.file_path && (
              <div className="my-4">
                <AudioPlayer 
                  path={section.audio_files.file_path}
                  label={`${section.title} Audio`}
                />
              </div>
            )}

            {/* Sentences Table */}
            {section.sentences?.length > 0 && (
              <table className="sentence-table w-full mt-4">
                <thead>
                  <tr className="border-b-2 border-border-color">
                    {section.show_native && (
                      <th className="text-left pb-2">Native</th>
                    )}
                    {section.show_target && (
                      <th className="text-left pb-2">Target</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {section.sentences.map((sentence, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-border-color hover:bg-hover-bg"
                    >
                      {section.show_native && (
                        <td className="py-3 font-medium">
                          {sentence.native_text}
                        </td>
                      )}
                      {section.show_target && (
                        <td className="py-3">
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
      </div>
    </main>
  )
}