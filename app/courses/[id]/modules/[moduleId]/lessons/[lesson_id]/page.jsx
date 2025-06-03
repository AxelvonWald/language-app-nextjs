// app/courses/[id]/modules/[moduleId]/lessons/[lesson_id]/page.jsx
'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import BackButton from '@/components/BackButton'
import AudioPlayer from '@/components/AudioPlayer'
import LessonLock from '@/components/LessonLock'

export default function LessonPage({ params }) {
  const { id: courseId, moduleId, lesson_id } = params
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 1. Get user session
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        // 2. Check if lesson is already completed
        if (user) {
          const { data: progress } = await supabase
            .from('user_lesson_progress')
            .select('completed_at')
            .eq('user_id', user.id)
            .eq('lesson_id', lesson_id)
            .single()
          setIsCompleted(!!progress?.completed_at)
        }

        // 3. Fetch lesson data
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lesson_id)
          .single()

        if (lessonError) throw lessonError
        if (!lessonData) throw new Error('Lesson not found')

        // 3. Fetch sections separately
        const { data: sections, error: sectionsError } = await supabase
          .from("lesson_sections")
          .select("*")
          .eq("lesson_id", lesson_id)
          .order("order_index", { ascending: true });

        if (sectionsError) throw sectionsError;

        // 4. Fetch all related data in parallel
        const sectionData = await Promise.all(
          sections.map(async (section) => {
            // Get sentences for this section
            const { data: sentencesData } = await supabase
              .from("section_sentences")
              .select("sentences(*)")
              .eq("lesson_section_id", section.id);

            // Get audio for this section
            const { data: audioData } = await supabase
              .from("audio_files")
              .select("file_path")
              .eq("lesson_section_id", section.id)
              .maybeSingle(); // Use maybeSingle since audio might be optional

            return {
              ...section,
              sentences: sentencesData?.map((ss) => ss.sentences) || [],
              audioPath: audioData?.file_path,
            };
          })
        );

        setLesson({
          ...lessonData,
          sections: sectionData,
        });
   } catch (err) {
        console.error('Failed to load lesson:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId, moduleId, lesson_id])

  const markLessonComplete = async () => {
    try {
      const { error } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user?.id,
          lesson_id: lesson_id,
          completed_at: new Date().toISOString(),
          status: 'completed'
        }, {
          onConflict: 'user_id,lesson_id'
        })

      if (error) throw error
      setIsCompleted(true)
      
    } catch (error) {
      console.error('Completion error:', error)
    }
  }

  if (loading) return (
    <main className="container">
      <p>Loading lesson...</p>
    </main>
  )

  if (error) return (
    <main className="container">
      <BackButton 
        href={`/courses/${courseId}/modules/${moduleId}/lessons`}
        className="back-link"
      >
        Back to Lessons
      </BackButton>
      <div className="error-message">
        <p>Lesson Failed to Load</p>
        <p>{error}</p>
      </div>
    </main>
  )

  if (!lesson) return (
    <main className="container">
      <BackButton 
        href={`/courses/${courseId}/modules/${moduleId}/lessons`}
        className="back-link"
      >
        Back to Lessons
      </BackButton>
      <p>Lesson not found</p>
    </main>
  )

  return (
    <main className="container">
      <BackButton 
        href={`/courses/${courseId}/modules/${moduleId}/lessons`}
        className="back-link"
      >
        Back to Lessons
      </BackButton>

      <LessonLock
        courseId={courseId}
        moduleId={moduleId}
        lessonId={lesson_id}
        userId={user?.id}
      />

      <div className="lesson-header">
        <h1 className="lesson-title">{lesson.title}</h1>
        {lesson.description && (
          <p className="lesson-description">{lesson.description}</p>
        )}
        {isCompleted && (
          <div className="completion-badge">
            ✓ Completed
          </div>
        )}
      </div>

      <div className="lesson-sections">
        {lesson.sections.map((section) => (
          <section key={section.id} className="lesson-section">
            <div className="section-header">
              <h2 className="section-title">{section.title}</h2>
              {section.instructions && (
                <p className="section-instructions">{section.instructions}</p>
              )}
              {section.repetitions > 0 && (
                <span className="repetition-badge">
                  {section.repetitions}x repeats
                </span>
              )}
            </div>

            {section.audioPath && (
              <AudioPlayer 
                path={section.audioPath}
                label={`${section.title} Audio`}
                className="section-audio"
              />
            )}

            {section.sentences.length > 0 && (
              <table className="sentence-table">
                <thead>
                  <tr>
                    <th>Native</th>
                    <th>Target</th>
                  </tr>
                </thead>
                <tbody>
                  {section.sentences.map((sentence) => (
                    <tr key={sentence.id}>
                      <td className="sentence-native">
                        {sentence.native_text}
                      </td>
                      <td className="sentence-target">
                        {sentence.target_text}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        ))}
      </div>

      {!isCompleted && user && (
        <button
          onClick={markLessonComplete}
          className="complete-button"
        >
          Mark Lesson Complete
        </button>
      )}
    </main>
  )
}