import Link from 'next/link';

export default function Lesson({ params }) {
  // Temporary mock data - we'll replace with Supabase later
  const sentences = [
    { text: "Hello", translation: "Hola" },
    { text: "Goodbye", translation: "Adiós" }
  ];

  return (
    <main>
      <Link href="/" className="back-link">
        ← Back to Lessons
      </Link>
      
      <h1>Lesson {params.id}</h1>
      
      <ul className="sentence-list">
        {sentences.map((sentence, index) => (
          <li key={index} className="sentence-item">
            <p>
              <span className="original">{sentence.text}</span> → 
              <span className="translation">{sentence.translation}</span>
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}