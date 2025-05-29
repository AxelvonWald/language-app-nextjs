// app/api/lessons/[id]/route.js
import { supabase } from '@/lib/supabase'

export async function GET(request, { params }) {
  const { id } = params

  const { data: lessonData, error } = await supabase
    .from('lessons')
    .select(`
      id,
      title,
      description,
      course_id,
      lesson_sections (
        id,
        lesson_id,
        section_type,
        title,
        instructions,
        audio_file_id,
        repetitions,
        show_native,
        show_target,
        order_index,
        section_sentences (
          order_index,
          sentences (
            id,
            target_text,
            native_text
          )
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error || !lessonData) {
    console.error('Supabase Error:', error)
    return new Response(JSON.stringify({ error: 'Lesson not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Flatten sentence list into each section, preserving order
  const lessonWithSentences = {
    ...lessonData,
    lesson_sections: lessonData.lesson_sections.map(sec => ({
      ...sec,
      sentences: (sec.section_sentences ?? [])
        .sort((a, b) => a.order_index - b.order_index)
        .map(ss => ss.sentences), // ss.sentences is a single object
    }))
  }

  return new Response(JSON.stringify(lessonWithSentences), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
