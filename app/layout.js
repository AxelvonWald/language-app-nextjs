import './globals.css'
import { Inter } from 'next/font/google'
import ThemeToggle from '@/components/ThemeToggle' // Make sure this path is correct

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Language Learner',
  description: 'Learn languages effectively',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Add ThemeToggle inside your header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem'
        }}>
          <h1>Language Learner</h1>
          <ThemeToggle /> {/* This line was missing */}
        </header>
        {children}
      </body>
    </html>
  )
}