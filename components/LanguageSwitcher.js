// components/BackButton.jsx
import Link from 'next/link'

export default function BackButton({ href, children }) {
  return (
    <Link 
      href={href}
      className="back-link"
    >
      ← {children || 'Back'}
    </Link>
  )
}