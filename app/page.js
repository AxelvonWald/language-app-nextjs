// app/page.jsx
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Welcome to My Language App</h1>
      <p>This is a Next.js starter.</p>
      <Link href="/flashcards">
        <button>Click Me</button>
      </Link>
    </main>
  );
}