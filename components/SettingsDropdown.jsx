'use client'
import { useState } from 'react'
import { Moon, Sun, Settings, ChevronDown } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import { useTheme } from '@/app/context/ThemeContext'

export default function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <Settings size={20} />
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Dark Mode</span>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </div>
            <div>
              <span className="text-sm font-medium block mb-2">Language</span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}