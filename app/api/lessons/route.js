// app/api/lessons/route.js
import { createServerClient } from '@/lib/supabase'

export async function GET(request) {
  const supabase = createServerClient()
  const url = new URL(request.url)
  const course_id = url.searchParams.get('course_id')
  const module_id = url.searchParams.get('module_id')

  try {
    let query = supabase
      .from('lessons')
      .select('id, title, description, order_index')

    if (course_id) {
      query = query.eq('course_id', course_id)
    }

    if (module_id) {
      query = query.eq('module_id', module_id)
    }

    const { data, error } = await query.order('order_index')

    if (error) throw error

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || 'Could not load lessons'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}