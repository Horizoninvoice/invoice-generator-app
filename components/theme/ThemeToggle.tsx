'use client'

import { useTheme } from './ThemeProvider'
import { FiSun, FiMoon } from 'react-icons/fi'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <FiMoon size={20} className="text-gray-700 dark:text-gray-300" />
      ) : (
        <FiSun size={20} className="text-gray-700 dark:text-gray-300" />
      )}
    </button>
  )
}

