import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials')
}

// For client components
export const supabase = createClient(supabaseUrl, supabaseKey)

// For server components and API routes
export const createServerClient = () => createClient(supabaseUrl, supabaseKey)

// For auth helpers (compatibility layer)
export const createClientComponentClient = () => supabase