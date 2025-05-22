import Link from "next/link";

export default function Home() {
  const lessons = [
    { id: 1, title: "Greetings & Basics" },
    { id: 2, title: "Food & Dining" },
    { id: 3, title: "Travel Directions" },
    { id: 4, title: "Shopping Phrases" },
    { id: 5, title: "Emergency Situations" },
    { id: 6, title: "Time & Dates" },
    { id: 7, title: "Hobbies & Interests" },
    { id: 8, title: "Work & Business" },
    { id: 9, title: "Technology Terms" },
    { id: 10, title: "Slang & Idioms" },
  ];

  return (
    <main>
      <h1>Choose a Lesson</h1>
      <ul className="lesson-list">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link href={`/lessons/${lesson.id}`} className="lesson-link">
              {lesson.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
