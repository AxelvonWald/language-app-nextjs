
// app/courses/loading.jsx
export default function Loading() {
  return (
    <div className="p-4 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-6 w-full bg-gray-100 rounded"></div>
        ))}
      </div>
    </div>
  );
}