// app/api/modules/[id]/route.js

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(_request, context) {
  // Await params here (required for dynamic API routes)
  const { params } = context
  const { id } = await params

  try {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', id)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
