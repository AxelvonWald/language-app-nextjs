'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function LessonLock({ lessonId, moduleId, userId }) {
  const [isLocked, setIsLocked] = useState(false) // Default to not locked
  const [loading, setLoading] = useState(false) // Start as not loading

  useEffect(() => {
    if (!userId) return; // No user = no lock check
    
    const checkAccess = async () => {
      setLoading(true);
      try {
        // Get current lesson's order index
        const { data: currentLesson } = await supabase
          .from('lessons')
          .select('order_index')
          .eq('id', lessonId)
          .single();

        // First lesson is always unlocked
        if (currentLesson?.order_index === 1) {
          setIsLocked(false);
          return;
        }

        // Check previous lesson completion
        const { data: progress } = await supabase
          .from('user_lesson_progress')
          .select('completed_at')
          .eq('user_id', userId)
          .eq('lesson_id', lessonId - 1) // Assuming sequential IDs
          .single();

        setIsLocked(!progress?.completed_at);
      } catch (error) {
        console.error('Access check failed:', error);
        setIsLocked(false); // Fail open
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [lessonId, moduleId, userId]);

  if (loading) return null; // Don't show loading state
  if (isLocked) return (
    <div className="p-4 mb-6 bg-yellow-50 border-l-4 border-yellow-400">
      <div className="flex">
        <div className="flex-shrink-0">🔒</div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            Complete the previous lesson to unlock this content
          </p>
        </div>
      </div>
    </div>
  );
  return null;
}