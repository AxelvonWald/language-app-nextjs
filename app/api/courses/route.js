// app/api/courses/route.js
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, description, level, is_active')

  if (error) {
    return new Response(JSON.stringify({ error: 'Could not load courses' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}