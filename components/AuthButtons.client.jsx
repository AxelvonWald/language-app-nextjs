// app/components/AuthButtons.client.jsx
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthButtons() {
  const supabase = createClientComponentClient()
  
  return (
    <div className="fixed bottom-4 right-4 z-50 space-x-2">
      <button 
        onClick={() => supabase.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'password123'
        })}
        className="px-3 py-1 bg-green-500 text-white text-sm rounded"
      >
        Test Login
      </button>
      <button 
        onClick={() => supabase.auth.signOut()}
        className="px-3 py-1 bg-red-500 text-white text-sm rounded"
      >
        Logout
      </button>
    </div>
  )
}