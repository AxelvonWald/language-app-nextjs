import './globals.css'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export const metadata = {
  title: 'Language Learner',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        fontFamily: '-apple-system, sans-serif',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
        minHeight: '100vh'
      }}>
        <header style={{
          backgroundColor: 'var(--header-bg)',
          padding: '1rem',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0
        }}>
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h1>Language Learner</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </header>
        
        <main style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '1rem'
        }}>
          {children}
        </main>
      </body>
    </html>
  )
}