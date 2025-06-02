// components/BackButton.jsx
'use client'

import Link from 'next/link'

export default function BackButton({ 
  href, 
  children = 'Back',
  className = '' 
}) {
  return (
    <Link 
      href={href}
      className={`back-link ${className}`}
    >
      ← {children}
    </Link>
  )
}