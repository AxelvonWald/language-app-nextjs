// app/courses/layout.jsx
import Link from 'next/link';

export default function CoursesLayout({ children }) {
  return (
    <div className="courses-layout">
      <h1>Language Learning App</h1>
      <nav>
        <Link href="/courses">All Courses</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}