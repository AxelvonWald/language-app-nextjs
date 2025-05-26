// app/page.js
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  const modules = [
    {
      name: "Module 1: Everyday Essentials",
      lessons: [
        { id: 1, title: "Greetings & Basics" },
        { id: 2, title: "Food & Dining" },
        { id: 3, title: "Travel Directions" },
        { id: 4, title: "Shopping Phrases" },
        { id: 5, title: "Emergency Situations" }
      ]
    },
    {
      name: "Module 2: Specialized Topics",
      lessons: [
        { id: 6, title: "Time & Dates" },
        { id: 7, title: "Hobbies & Interests" },
        { id: 8, title: "Work & Business" },
        { id: 9, title: "Technology Terms" },
        { id: 10, title: "Slang & Idioms" }
      ]
    }
  ];

  return (
    <main className="container">
      

      <section>
        {modules.map((module, index) => (
          <details key={index} className="module">
            <summary className="module-header">
              {module.name}
              <span className="dropdown-icon">▾</span>
            </summary>
            <ul className="lesson-list">
              {module.lessons.map(lesson => (
                <li key={lesson.id}>
                  <Link href={`/lessons/${lesson.id}`} className="lesson-link">
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </section>
    </main>
  );
}