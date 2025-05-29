// app/api/admin/lessons/route.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // Only allow admins
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    return new Response('Unauthorized', { status: 401 });
  }
  // Proceed with lesson creation/update
}