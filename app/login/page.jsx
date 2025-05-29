// app/login/page.jsx
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Login() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleLogin = async () => {
    await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    })
    router.refresh()
  }

  return (
    <div className="grid place-items-center h-screen">
      <button 
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Sign In (Test User)
      </button>
    </div>
  )
}