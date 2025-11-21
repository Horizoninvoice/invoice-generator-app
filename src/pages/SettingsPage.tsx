import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { Moon, Sun, Download, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth()
  const { theme, colorScheme, setTheme, toggleColorScheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    defaultCurrency: profile?.currency || 'INR',
    defaultTerms: '',
    defaultNotes: '',
    shop_name: '',
    shop_address: '',
    shop_email: '',
  })
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    // Load saved invoice defaults if available
    const savedTerms = localStorage.getItem('invoice_default_terms')
    const savedNotes = localStorage.getItem('invoice_default_notes')
    if (savedTerms) setFormData((prev) => ({ ...prev, defaultTerms: savedTerms }))
    if (savedNotes) setFormData((prev) => ({ ...prev, defaultNotes: savedNotes }))
    
    // Load shop settings from profile
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        shop_name: profile.shop_name || '',
        shop_address: profile.shop_address || '',
        shop_email: profile.shop_email || '',
      }))
      setLogoUrl(profile.logo_url || '')
    }
  }, [profile])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPG, PNG, GIF, or WebP are allowed.')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size too large. Maximum 2MB allowed.')
      return
    }

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user!.id}-${Date.now()}.${fileExt}`
      const filePath = `logos/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from('user-uploads').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage.from('user-uploads').getPublicUrl(filePath)

      // Update user profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ logo_url: publicUrl })
        .eq('user_id', user!.id)

      if (updateError) throw updateError

      setLogoUrl(publicUrl)
      toast.success('Logo uploaded successfully!')
      refreshProfile()
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload logo')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveLogo = async () => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ logo_url: null })
        .eq('user_id', user!.id)

      if (error) throw error

      setLogoUrl('')
      toast.success('Logo removed successfully!')
      refreshProfile()
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove logo')
    }
  }

  const handleSaveShopSettings = async () => {
    if (!user) return
    
    setIsUploading(true)
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          shop_name: formData.shop_name,
          shop_address: formData.shop_address,
          shop_email: formData.shop_email,
        })
        .eq('user_id', user.id)

      if (error) throw error

      toast.success('Shop settings saved successfully!')
      refreshProfile()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save shop settings')
    } finally {
      setIsUploading(false)
    }
  }

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

        {/* Shop Settings */}
        <Card title="Shop Settings" className="mb-6">
          <div className="space-y-6">
            {/* Shop Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shop Logo
              </label>
              <div className="flex items-start gap-4">
                <div className="relative">
                  {logoUrl ? (
                    <div className="relative w-24 h-24 rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={logoUrl}
                        alt="Shop Logo"
                        className="w-full h-full object-contain"
                      />
                      <button
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        aria-label="Remove logo"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                      <span className="text-gray-400 text-xs text-center px-2">No logo</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="mb-2"
                  >
                    <Upload size={18} className="mr-2" />
                    {isUploading ? 'Uploading...' : 'Change Logo'}
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Max 2MB. JPG, PNG, GIF, or WebP
                  </p>
                </div>
              </div>
            </div>

            {/* Shop Name */}
            <div>
              <Input
                label="Shop Name"
                value={formData.shop_name}
                onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                placeholder="Enter your shop name"
              />
            </div>

            {/* Shop Email */}
            <div>
              <Input
                label="Shop Email"
                type="email"
                value={formData.shop_email}
                onChange={(e) => setFormData({ ...formData, shop_email: e.target.value })}
                placeholder="Enter your shop email"
              />
            </div>

            {/* Shop Address */}
            <div>
              <Textarea
                label="Shop Address"
                rows={3}
                value={formData.shop_address}
                onChange={(e) => setFormData({ ...formData, shop_address: e.target.value })}
                placeholder="Enter your shop address"
              />
            </div>

            <Button onClick={handleSaveShopSettings} disabled={isUploading}>
              Save Shop Settings
            </Button>
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
