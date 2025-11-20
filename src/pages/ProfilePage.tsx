import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { countries, getCurrencyByCountry } from '@/lib/currency'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import { User, Mail, Award, Calendar, MapPin, Building, Globe, Upload, X, Image as ImageIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    shop_name: '',
    shop_address: '',
    shop_email: '',
    country: 'IN',
  })
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    if (profile) {
      setFormData({
        shop_name: profile.shop_name || '',
        shop_address: profile.shop_address || '',
        shop_email: profile.shop_email || '',
        country: profile.country || 'IN',
      })
      setLogoUrl(profile.logo_url || '')
    }
  }, [profile])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const currency = getCurrencyByCountry(formData.country)
      const { error } = await supabase
        .from('user_profiles')
        .update({
          shop_name: formData.shop_name,
          shop_address: formData.shop_address,
          shop_email: formData.shop_email,
          country: formData.country,
          currency: currency.code,
        })
        .eq('user_id', user!.id)

      if (error) throw error
      toast.success('Profile updated successfully!')
      refreshProfile()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const displayName = profile?.shop_name || user?.email?.split('@')[0] || 'User'
  const initials = user?.email?.slice(0, 2)?.toUpperCase() || 'U'
  const selectedCurrency = formData.country ? getCurrencyByCountry(formData.country) : null

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Profile</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <div className="text-center">
              {logoUrl ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-200 dark:border-primary-800 mx-auto mb-4">
                  <img
                    src={logoUrl}
                    alt="Shop Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {initials}
                </div>
              )}

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{displayName}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{user?.email}</p>

              {profile && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium">
                  <Award size={14} />
                  {profile.role === 'max'
                    ? 'Max Account'
                    : profile.role === 'pro'
                    ? 'Pro Account'
                    : 'Free Account'}
                </div>
              )}
            </div>
          </Card>

          {/* Account Details */}
          <Card className="md:col-span-2" title="Account Information">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <User className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">User ID</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{user?.id}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email Address</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>

              {profile && (
                <>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <Award className="text-primary-600 dark:text-primary-400" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Account Type</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {profile.role === 'max'
                          ? 'Max (Lifetime)'
                          : profile.role === 'pro'
                          ? 'Pro (Monthly)'
                          : 'Free'}
                      </p>
                      {profile.subscription_type && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {profile.subscription_type === 'max_lifetime'
                            ? 'Lifetime Access'
                            : profile.subscription_type === 'pro_monthly'
                            ? 'Monthly Subscription'
                            : 'Free Plan'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <Calendar className="text-primary-600 dark:text-primary-400" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Member Since</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(profile.created_at)}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Shop Settings */}
        <Card title="Shop Settings">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shop Logo</label>
              <div className="flex items-center gap-4">
                {logoUrl ? (
                  <div className="relative">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                      <img
                        src={logoUrl}
                        alt="Shop Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                    <ImageIcon className="text-gray-400" size={32} />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={isUploading}
                    ref={fileInputRef}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={16} className="mr-2" />
                    {isUploading ? 'Uploading...' : logoUrl ? 'Change Logo' : 'Upload Logo'}
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Max 2MB. JPG, PNG, GIF, or WebP</p>
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
              placeholder="Enter your shop's contact email"
            />

            {/* Shop Address */}
            <Textarea
              label="Shop Address"
              rows={3}
              value={formData.shop_address}
              onChange={(e) => setFormData({ ...formData, shop_address: e.target.value })}
              placeholder="Enter your shop's full address"
            />

            {/* Country & Currency */}
            <div className="grid md:grid-cols-2 gap-6">
              <Select
                label="Country"
                options={[{ value: '', label: 'Select country' }, ...countryOptions]}
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
              <Input
                label="Currency"
                value={selectedCurrency ? `${selectedCurrency.symbol} ${selectedCurrency.code}` : 'N/A'}
                readOnly
                disabled
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" isLoading={isLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
