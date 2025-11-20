import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import { useTheme } from '@/contexts/ThemeContext'
import Button from '@/components/ui/Button'
import { Moon, Sun } from 'lucide-react'

export default function SettingsPage() {
  const { theme, colorScheme, setTheme, toggleColorScheme } = useTheme()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>
        
        <Card title="Theme Settings" className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="minimalist">Minimalist</option>
                <option value="classic-neutrals">Classic Neutrals</option>
                <option value="earthy-modern">Earthy Modern</option>
                <option value="serene-coastline">Serene Coastline</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color Scheme
              </label>
              <Button onClick={toggleColorScheme} variant="outline">
                {colorScheme === 'dark' ? <Sun size={18} className="mr-2" /> : <Moon size={18} className="mr-2" />}
                {colorScheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

