'use client'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({
      email: 'user@example.com',
      password: 'secure-password'
    })
  }

  return <button onClick={handleSignIn}>Sign In</button>
}