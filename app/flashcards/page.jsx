// app/flashcards/page.jsx
import Link from 'next/link';

export default function Flashcards() {
  return (
    <main>
      <h1>Flashcards Page</h1>
      <p>This is where your flashcards will go!</p>
      <Link href="/">
        <button>← Back to Home</button>
      </Link>
    </main>
  );
}