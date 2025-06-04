import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function useProgressTracker(userId) {
  const [lessonProgress, setLessonProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all progress data when userId changes
  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('user_lesson_progress')
          .select('lesson_id, status, completed_at')
          .eq('user_id', userId);

        if (error) throw error;

        const progressMap = {};
        data.forEach(item => {
          progressMap[item.lesson_id] = {
            status: item.status,
            completed_at: item.completed_at
          };
        });

        setLessonProgress(progressMap);
      } catch (error) {
        console.error('Progress fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  const markLessonComplete = async (lessonId, shouldComplete) => {
    try {
      const { error } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          status: shouldComplete ? 'completed' : 'in_progress',
          completed_at: shouldComplete ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) throw error;

      // Optimistically update local state
      setLessonProgress(prev => ({
        ...prev,
        [lessonId]: {
          status: shouldComplete ? 'completed' : 'in_progress',
          completed_at: shouldComplete ? new Date().toISOString() : null
        }
      }));

      return { error: null };
    } catch (error) {
      console.error('Progress update error:', error);
      return { error };
    }
  };

  return { 
    lessonProgress, 
    markLessonComplete,
    loading: isLoading
  };
}