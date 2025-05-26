'use client'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    setDarkMode(savedTheme === 'dark')
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const handleToggle = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    const theme = newMode ? 'dark' : 'light'
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      className="theme-toggle"
    >
      {darkMode ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  )
}