// app/api/lessons/route.js
import { supabase } from '@/lib/supabase'

export async function GET(request) {
  const url = new URL(request.url)
  const course_id = url.searchParams.get('course_id')

  let query = supabase.from('lessons').select('id, title, description, order_index')

  if (course_id) {
    query = query.eq('course_id', course_id)
  }

  const { data, error } = await query.order('order_index')

  if (error) {
    return new Response(JSON.stringify({ error: 'Could not load lessons' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}