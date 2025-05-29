// app/error.jsx
"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body className="bg-gray-50 p-8">
        <h1 className="text-2xl font-bold text-red-600">Something went wrong!</h1>
        <p className="mb-4">{error.message}</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}