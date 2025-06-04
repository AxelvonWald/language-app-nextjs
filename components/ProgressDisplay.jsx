'use client'
import useProgressTracker from '@/hooks/useProgressTracker'

export default function ProgressDisplay({ userId }) {
  const { moduleProgress, loading } = useProgressTracker(userId)

  if (loading) return <div className="p-4">Loading progress...</div>

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Your Learning Progress</h3>
      <div className="space-y-6">
        {Object.entries(moduleProgress).map(([moduleId, {title, completed, total}]) => (
          <div key={moduleId} className="space-y-2">
            <div className="flex justify-between">
              <h4 className="font-medium">{title}</h4>
              <span className="text-sm text-gray-600">
                {completed}/{total} lessons
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(completed / total) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}