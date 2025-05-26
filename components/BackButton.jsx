// components/BackButton.jsx
'use client'

import Link from 'next/link'

export default function BackButton({ href, label = "← Back" }) {
  return (
<Link 
  href={href} 
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    backgroundColor: '#e5e7eb', // gray-200
    color: '#1f2937',            // gray-800
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
    marginBottom: '1.5rem'
  }}
>
  {label}
</Link>
  )
}