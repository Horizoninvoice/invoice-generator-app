'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { ColorScheme } from './ThemeSelector'

interface ColorSchemeContextType {
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined)

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('minimalist')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedScheme = localStorage.getItem('colorScheme') as ColorScheme
    if (savedScheme && ['minimalist', 'classic', 'earthy', 'coastline'].includes(savedScheme)) {
      setColorSchemeState(savedScheme)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      // Remove all color scheme classes
      document.documentElement.classList.remove(
        'theme-minimalist',
        'theme-classic',
        'theme-earthy',
        'theme-coastline'
      )
      // Add current color scheme class
      document.documentElement.classList.add(`theme-${colorScheme}`)
      localStorage.setItem('colorScheme', colorScheme)
    }
  }, [colorScheme, mounted])

  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme)
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  )
}

export function useColorScheme() {
  const context = useContext(ColorSchemeContext)
  if (context === undefined) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider')
  }
  return context
}

