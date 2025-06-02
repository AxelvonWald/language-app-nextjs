// app/courses/[id]/layout.jsx
export default async function CourseLayout({ children, params }) {
  const { id } = await params

  return (
    <div style={{ padding: '20px' }}>
      {/* Removed heading and nav */}
      {/* No more "Course 1" or "Back to Course" */}
      
      {/* Render page-specific content only */}
      {children}
    </div>
  )
}