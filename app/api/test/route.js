import { supabase } from '@/lib/supabase';

export async function GET() {
  // Test raw SQL query
  const { data, error } = await supabase
    .from('sentences')
    .select('*')
    .eq('lesson_id', 1);

  return Response.json({
    success: !error,
    data,
    error: error?.message,
    query: 'SELECT * FROM sentences WHERE lesson_id = 1'
  });
}