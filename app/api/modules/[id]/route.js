// app/api/modules/[id]/route.js

import { createServerClient } from '@/lib/supabase'

export async function GET(request, { params }) {
  const supabase = createServerClient()
  const { id } = params

  try {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', id)
      .order('order_index', { ascending: true })

    if (error) throw error

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message || 'Unexpected server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}