import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'minimalist' | 'classic-neutrals' | 'earthy-modern' | 'serene-coastline'
type ColorScheme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  colorScheme: ColorScheme
  setTheme: (theme: Theme) => void
  setColorScheme: (scheme: ColorScheme) => void
  toggleColorScheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    return (saved as Theme) || 'minimalist'
  })
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    const saved = localStorage.getItem('colorScheme')
    if (saved) return saved as ColorScheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    if (colorScheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('colorScheme', colorScheme)
  }, [colorScheme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme)
  }

  const toggleColorScheme = () => {
    setColorSchemeState(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme, setColorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

