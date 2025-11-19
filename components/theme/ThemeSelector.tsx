'use client'

import { useState, useRef, useEffect } from 'react'
import { FiCheck, FiChevronDown, FiLayers } from '@/lib/icons'
import { useColorScheme } from './ColorSchemeProvider'

export type ColorScheme = 'minimalist' | 'classic' | 'earthy' | 'coastline'

const themes: { id: ColorScheme; name: string; description: string }[] = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Default Recommended - Clean, professional',
  },
  {
    id: 'classic',
    name: 'Classic Neutrals',
    description: 'Business/Firm oriented - Premium official look',
  },
  {
    id: 'earthy',
    name: 'Earthy Modern',
    description: 'Eco + Creative brands - Natural warm tones',
  },
  {
    id: 'coastline',
    name: 'Serene Coastline',
    description: 'Soft + Calm UI - Peaceful and balanced',
  },
]

export function ThemeSelector() {
  const { colorScheme, setColorScheme } = useColorScheme()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const currentTheme = themes.find((t) => t.id === colorScheme) || themes[0]

  const handleThemeChange = (themeId: ColorScheme) => {
    setColorScheme(themeId)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all shadow-sm hover:shadow-md"
        aria-label="Select color scheme"
        title="Choose color theme"
        type="button"
      >
        <FiLayers size={18} className="text-gray-700 dark:text-gray-300" />
        <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentTheme.name}
        </span>
        <FiChevronDown
          size={16}
          className={`text-gray-600 dark:text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Color Themes
            </p>
          </div>
          <div className="py-1">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  colorScheme === theme.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                }`}
                type="button"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {theme.name}
                    </p>
                    {colorScheme === theme.id && (
                      <FiCheck size={16} className="text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {theme.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
