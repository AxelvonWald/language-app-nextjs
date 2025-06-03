// components/ModuleLock.jsx
'use client'
import { supabase } from '@/lib/supabase'

export default function ModuleLock({ moduleId, userId }) {
  const [isLocked, setIsLocked] = useState(true)

  useEffect(() => {
    const checkModuleAccess = async () => {
      // 1. Get previous module
      const { data: prevModule } = await supabase
        .from('modules')
        .select('id')
        .eq('course_id', courseId)
        .lt('order_index', moduleId)
        .order('order_index', { ascending: false })
        .limit(1)
        .single()

      if (!prevModule) {
        setIsLocked(false)
        return
      }

      // 2. Check if user completed required lessons
      const { count } = await supabase
        .from('user_lesson_progress')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('module_id', prevModule.id)

      setIsLocked(count < REQUIRED_LESSONS) // Define your threshold
    }

    checkModuleAccess()
  }, [moduleId, userId])

  if (isLocked) return (
    <div className="locked-module">
      <h3>Complete {REQUIRED_LESSONS} lessons in Module {moduleId - 1} to unlock</h3>
    </div>
  )

  return null
}