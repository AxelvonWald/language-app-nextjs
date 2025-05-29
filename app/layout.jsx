import './globals.css'

export const metadata = {
  title: 'Language App',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[var(--bg-color)] text-[var(--text-color)]">
        {children}
      </body>
    </html>
  )
}