// app/page.jsx
import Link from 'next/link'
export default function Home() {
  return (
    <main style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>
        Welcome
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '20px' }}>
        Choose a language pair to begin learning.
      </p>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li>
          <Link
            href="/courses"
            style={{
              textDecoration: 'none',
              color: '#0070f3',
              fontWeight: '600',
              marginBottom: '10px'
            }}
          >
            English to Spanish
          </Link>
        </li>
        <li>
          <Link
            href="/courses"
            style={{
              textDecoration: 'none',
              color: '#0070f3',
              fontWeight: '600',
              marginBottom: '10px'
            }}
          >
            Spanish to English
          </Link>
        </li>
      </ul>
    </main>
  )
}