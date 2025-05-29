// app/page.jsx
'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Choose a language pair to begin learning.
      </p>

      <ul className="space-y-2">
        <li>
          <Link href="/courses/1/lessons" className="block p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">
            English to Spanish
          </Link>
        </li>
        <li>
          <Link href="/courses/2/lessons" className="block p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">
            Spanish to English
          </Link>
        </li>
      </ul>
    </main>
  )
}