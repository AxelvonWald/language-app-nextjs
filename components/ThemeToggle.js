'use client'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  // 1. Load saved theme on startup
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light'
    setDarkMode(saved === 'dark')
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  // 2. Toggle between themes
  const handleClick = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light')
  }

  return (
    <button 
      onClick={handleClick}
      style={{
        padding: '8px',
        background: 'transparent',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      {darkMode ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}