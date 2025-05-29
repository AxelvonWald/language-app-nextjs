// app/courses/[id]/layout.jsx
import Link from 'next/link';

export default function CourseLayout({ children, params }) {
  return (
    <div className="course-layout">
      <h2>Course: {params.id}</h2>
      <nav>
        <Link href={`/courses/${params.id}/lessons`}>Lessons</Link>
      </nav>
      <section>{children}</section>
    </div>
  );
}