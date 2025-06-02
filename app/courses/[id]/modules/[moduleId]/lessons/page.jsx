// app/courses/[id]/modules/[moduleId]/lessons/page.jsx
import Link from 'next/link'

export default async function LessonListPage({ params }) {
  const { id: course_id, moduleId } = params

  const res = await fetch(
    `http://localhost:3000/api/lessons?course_id=${course_id}&module_id=${moduleId}`,
    { cache: 'no-store' }
  )
  const lessons = await res.json()

  return (
    <main className="container">
      <Link 
        href={`/courses/${course_id}/modules`} 
        className="back-link"
      >
        ← Back to modules
      </Link>

      <h1 className="page-title">Lessons in Module {moduleId}</h1>

      <div className="course-list">
        {lessons.length === 0 && (
          <div className="course-card">
            <p>No lessons found.</p>
          </div>
        )}
        
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/courses/${course_id}/modules/${moduleId}/lessons/${lesson.id}`}
            className="course-card"
          >
            <h2 className="course-title">{lesson.title}</h2>
            {lesson.description && (
              <p className="course-description">{lesson.description}</p>
            )}
          </Link>
        ))}
      </div>
    </main>
  )
}