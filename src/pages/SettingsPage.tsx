import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { Moon, Sun, Download } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { profile } = useAuth()
  const { theme, colorScheme, setTheme, toggleColorScheme } = useTheme()
  const [formData, setFormData] = useState({
    defaultCurrency: profile?.currency || 'INR',
    defaultTerms: '',
    defaultNotes: '',
  })

  useEffect(() => {
    // Load saved invoice defaults if available
    const savedTerms = localStorage.getItem('invoice_default_terms')
    const savedNotes = localStorage.getItem('invoice_default_notes')
    if (savedTerms) setFormData((prev) => ({ ...prev, defaultTerms: savedTerms }))
    if (savedNotes) setFormData((prev) => ({ ...prev, defaultNotes: savedNotes }))
  }, [])

  const handleSaveDefaults = () => {
    localStorage.setItem('invoice_default_terms', formData.defaultTerms)
    localStorage.setItem('invoice_default_notes', formData.defaultNotes)
    toast.success('Invoice defaults saved successfully!')
  }

  const handleExportData = async () => {
    // TODO: Implement data export
    toast('Data export feature coming soon', { icon: 'ℹ️' })
  }

  const themeOptions = [
    { value: 'minimalist', label: 'Minimalist (Default)' },
    { value: 'classic-neutrals', label: 'Classic Neutrals' },
    { value: 'earthy-modern', label: 'Earthy Modern' },
    { value: 'serene-coastline', label: 'Serene Coastline' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-8">Settings</h1>

        {/* Logo & Branding - First Row */}
        <Card title="Branding" className="mb-6">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="/letter-h.ico" 
                  alt="Horizon Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-black dark:text-gray-100 mb-1">Horizon Invoice Generator</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Professional invoice generation made simple
              </p>
            </div>
          </div>
        </Card>

        {/* Theme Customization */}
        <Card title="Theme Customization" className="mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color Theme
              </label>
              <Select
                label="Color Theme"
                options={themeOptions}
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Choose your preferred color theme for the application
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color Scheme
              </label>
              <Button onClick={toggleColorScheme} variant="outline" className="w-full md:w-auto">
                {colorScheme === 'dark' ? <Sun size={18} className="mr-2" /> : <Moon size={18} className="mr-2" />}
                {colorScheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Toggle between light and dark mode
              </p>
            </div>
          </div>
        </Card>

        {/* Invoice Defaults */}
        <Card title="Invoice Default Settings" className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Currency
              </label>
              <Input
                value={formData.defaultCurrency}
                onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                placeholder="INR"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Default currency for new invoices (can be changed per invoice)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Terms & Conditions
              </label>
              <Textarea
                rows={4}
                value={formData.defaultTerms}
                onChange={(e) => setFormData({ ...formData, defaultTerms: e.target.value })}
                placeholder="Enter default terms and conditions that will be pre-filled in new invoices"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Notes
              </label>
              <Textarea
                rows={3}
                value={formData.defaultNotes}
                onChange={(e) => setFormData({ ...formData, defaultNotes: e.target.value })}
                placeholder="Enter default notes that will be pre-filled in new invoices"
              />
            </div>
            <Button onClick={handleSaveDefaults} variant="outline">
              Save Invoice Defaults
            </Button>
          </div>
        </Card>

        {/* Data Management */}
        <Card title="Data Management">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Export Your Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Download all your invoices, customers, and products data in a single file.
              </p>
              <Button variant="outline" onClick={handleExportData}>
                <Download size={18} className="mr-2" />
                Export All Data
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
