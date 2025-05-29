// app/progress/page.jsx
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link' // This was missing!

export default function ProgressPage() {
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true)
        
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/login')
          return
        }

        const { data, error } = await supabase
          .from('user_lesson_progress')
          .select(`
            *,
            lessons:lesson_id (
              title,
              course_id
            )
          `)
          .eq('user_id', session.user.id)

        if (error) throw error
        setProgress(data || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [router, supabase.auth])

  if (loading) return <div className="p-4">Loading progress...</div>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Progress</h1>
      
      {progress.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p>No lessons started yet</p>
          <Link href="/courses" className="text-blue-600 hover:underline mt-2 inline-block">
            Browse courses →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {progress.map(item => (
            <div key={item.id} className="p-3 border rounded">
              <h3 className="font-medium">
                {item.lessons?.title || `Lesson ${item.lesson_id}`}
              </h3>
              <p className={`text-sm ${
                item.status === 'completed' ? 'text-green-600' : 'text-blue-600'
              }`}>
                Status: {item.status}
              </p>
              {item.lessons?.course_id && (
                <Link 
                  href={`/courses/${item.lessons.course_id}/lessons/${item.lesson_id}`}
                  className="text-sm text-gray-500 hover:underline mt-1 inline-block"
                >
                  Continue lesson
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={async () => {
          await supabase.auth.signOut()
          router.push('/login')
        }}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  )
}