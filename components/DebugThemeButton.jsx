// components/DebugThemeButton.jsx
'use client'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function DebugThemeButton() {
  const [darkMode, setDarkMode] = useState(false)

  // Initialize theme
  useEffect(() => {
    console.log('Initializing theme...')
    const savedTheme = localStorage.getItem('theme') || 'light'
    setDarkMode(savedTheme === 'dark')
    document.documentElement.setAttribute('data-theme', savedTheme)
    console.log('Initial theme set to:', savedTheme)
  }, [])

  const handleToggle = () => {
    const newMode = !darkMode
    console.log('Toggling to:', newMode ? 'dark' : 'light')
    setDarkMode(newMode)
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light')
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      padding: '10px',
      background: 'rgba(255,0,0,0.2)',
      border: '2px solid red'
    }}>
      <button 
        onClick={handleToggle}
        style={{
          padding: '8px',
          borderRadius: '50%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer'
        }}
      >
        {darkMode ? <Moon size={24} color="white" /> : <Sun size={24} color="black" />}
      </button>
      <div style={{ color: 'black', fontSize: '12px', marginTop: '5px' }}>
        Current: {darkMode ? 'DARK' : 'LIGHT'}
      </div>
    </div>
  )
}