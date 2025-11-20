'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { FiUpload, FiX, FiImage } from '@/lib/icons'
import toast from 'react-hot-toast'
import { countries, getCurrencyByCountry } from '@/lib/currency'
import Image from 'next/image'

interface EditProfileFormProps {
  profile: {
    logo_url?: string
    shop_name?: string
    shop_address?: string
    shop_email?: string
    country?: string
    currency?: string
  }
  onUpdate?: () => void
}

export function EditProfileForm({ profile, onUpdate }: EditProfileFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    shop_name: profile.shop_name || '',
    shop_address: profile.shop_address || '',
    shop_email: profile.shop_email || '',
    country: profile.country || 'IN',
  })
  const [logoUrl, setLogoUrl] = useState(profile.logo_url || '')
  const [selectedCurrency, setSelectedCurrency] = useState(profile.currency || 'INR')

  useEffect(() => {
    // Update currency when country changes
    if (formData.country) {
      const currency = getCurrencyByCountry(formData.country)
      setSelectedCurrency(currency.code)
    }
  }, [formData.country])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Only images are allowed.')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size too large. Maximum 2MB allowed.')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/profile/upload-logo', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload logo')
      }

      setLogoUrl(data.url)
      toast.success('Logo uploaded successfully!')
      router.refresh()
      onUpdate?.()
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
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)

      if (error) throw error

      setLogoUrl('')
      toast.success('Logo removed successfully!')
      router.refresh()
      onUpdate?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove logo')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      toast.success('Profile updated successfully!')
      router.refresh()
      onUpdate?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedCountryCurrency = formData.country ? getCurrencyByCountry(formData.country) : null

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Shop Logo
        </label>
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <div className="relative">
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                <Image
                  src={logoUrl}
                  alt="Shop Logo"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <FiX size={14} />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
              <FiImage className="text-gray-400" size={32} />
            </div>
          )}
          <div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <FiUpload size={16} />
                {isUploading ? 'Uploading...' : logoUrl ? 'Change Logo' : 'Upload Logo'}
              </Button>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Max 2MB. JPG, PNG, GIF, or WebP
            </p>
          </div>
        </div>
      </div>

      {/* Shop Name */}
      <Input
        label="Shop Name"
        value={formData.shop_name}
        onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
        placeholder="Enter your shop/business name"
      />

      {/* Shop Email */}
      <Input
        label="Shop Email"
        type="email"
        value={formData.shop_email}
        onChange={(e) => setFormData({ ...formData, shop_email: e.target.value })}
        placeholder="shop@example.com"
      />

      {/* Shop Address */}
      <Textarea
        label="Shop Address"
        rows={3}
        value={formData.shop_address}
        onChange={(e) => setFormData({ ...formData, shop_address: e.target.value })}
        placeholder="Enter your shop address"
      />

      {/* Country Selection */}
      <Select
        label="Country"
        options={[
          { value: '', label: 'Select a country' },
          ...countries.map((c) => ({ value: c.code, label: c.name })),
        ]}
        value={formData.country}
        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
      />

      {/* Currency Display (Auto-selected based on country) */}
      {selectedCountryCurrency && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
            Selected Currency
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            {selectedCountryCurrency.symbol} {selectedCountryCurrency.name} ({selectedCountryCurrency.code})
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
            Currency is automatically set based on your country selection
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}

