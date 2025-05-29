// app/api/lessons/route.js
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('lessons')
    .select('id, title, description, order_index')
    .order('order_index')

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