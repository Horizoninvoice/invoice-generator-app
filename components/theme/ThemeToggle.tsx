'use client'

import { useTheme } from './ThemeProvider'
import { FiSun, FiMoon } from 'react-icons/fi'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all shadow-sm hover:shadow-md"
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <FiMoon size={20} className="text-gray-800 dark:text-yellow-400" />
      ) : (
        <FiSun size={20} className="text-gray-800 dark:text-yellow-400" />
      )}
    </button>
  )
}

