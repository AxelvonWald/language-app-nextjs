// app/courses/[id]/modules/page.jsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ModulesPage({ params }) {
  const { id } = params
  const [modules, setModules] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/modules/${id}`)
      const data = await res.json()

      if (Array.isArray(data)) {
        setModules(data)
      }

      setLoading(false)
    }

    fetchData()
  }, [id])

  if (loading)
    return (
      <main className="container">
        <p>Loading modules...</p>
      </main>
    )

  if (!modules || modules.length === 0)
    return (
      <main className="container">
        <p>No modules found</p>
      </main>
    )

  return (
    <main className="container">
      <Link href="/courses" className="back-link">
        ← Back to Courses
      </Link>

      <h1 className="page-title">Modules for Course {id}</h1>

      <div className="modules-grid">
        {modules.map((mod) => (
          <Link
            key={mod.id}
            href={`/courses/${id}/modules/${mod.id}/lessons`}
            className="module-box"
          >
            <h2>{mod.title}</h2>
            <p>{mod.description || 'No description available'}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}

