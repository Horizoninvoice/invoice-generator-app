'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { BackButton } from '@/components/ui/BackButton'
import { ThemeSelector } from '@/components/theme/ThemeSelector'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { useUser } from '@/lib/hooks/useUser'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <BackButton href="/dashboard" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>

        {/* Appearance Settings */}
        <Card title="Appearance" className="mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color Theme
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Choose a color scheme that matches your brand and preferences
              </p>
              <ThemeSelector />
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dark Mode
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Toggle between light and dark mode
              </p>
              <ThemeToggle />
            </div>
          </div>
        </Card>

        {/* Account Settings */}
        <Card title="Account" className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                User ID
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{user.id}</p>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card title="Preferences">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive email updates about your account</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Marketing Emails</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive tips and product updates</p>
              </div>
              <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" />
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  )
}

