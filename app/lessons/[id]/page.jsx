import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // ✅ make sure this exists

export default async function Lesson({ params }) {
  const { id } = params; // ✅ correct way for app router
  const lessonId = parseInt(id, 10); // convert to number if needed

  const { data: sentences = [] } = await supabase
    .from('sentences')
    .select('*')
    .eq('lesson_id', lessonId); // ✅ provide the value

  return (
    <main>
      <Link href="/" className="back-link">← Back to Modules</Link>
      <h1>Lesson {lessonId}</h1>
      <ul className="sentence-list">
        {sentences.map((sentence) => (
          <li key={sentence.id}>
            <p>{sentence.text} → {sentence.translation}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
