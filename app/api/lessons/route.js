// app/api/lessons/route.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const course_id = searchParams.get('course_id');

  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', course_id)
      .order('order_index');

    if (error) throw error;
    return Response.json(data || []); // Always return an array
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}