import Link from 'next/link';

export default function Home() {
  const lessons = [
    { id: 1, title: "Greetings" },
    { id: 2, title: "Food" }
  ];

  return (
    <main>
      <h1>Choose a Lesson</h1>
      <ul className="lesson-list">
        {lessons.map(lesson => (
          <li key={lesson.id}>
            <Link 
              href={`/lessons/${lesson.id}`}
              className="lesson-link"
            >
              {lesson.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}