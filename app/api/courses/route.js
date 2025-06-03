// app/api/courses/route.js
import { createServerClient } from '@/lib/supabase'

export async function GET() {
  const supabase = createServerClient()
  
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, description, level, is_active')
      .order('id', { ascending: true })

    if (error) throw error

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}