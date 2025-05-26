import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import AudioPlayer from '@/components/AudioPlayer';

export default async function Lesson({ params }) {
  // Fetch lesson with phrases
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*, phrases(*)')
    .eq('id', params.id)
    .single();

  if (!lesson) return <div>Lesson not found</div>;

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <Link href="/" className="text-blue-500 hover:underline">← All Lessons</Link>
      <h1 className="text-2xl font-bold my-6">{lesson.title}</h1>
      
      <div className="space-y-4">
        {lesson.phrases?.map((phrase) => (
          <div key={phrase.id} className="p-4 border rounded-lg bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold">{phrase.target_text}</h2>
                <p className="text-gray-600">{phrase.native_translation}</p>
              </div>
              {phrase.audio_path && (
                <AudioPlayer path={phrase.audio_path} />
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}