// app/courses/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data);
      setLoading(false);
    }

    fetchCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;

  return (
    <main className="container">
      <h1 className="page-title">Select Your Course</h1>

      <div className="course-list">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}/modules`}
            className="course-card"
          >
            <h2 className="course-title">{course.title}</h2>
            <p className="course-description">
              {course.description || "Beginner level"}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
