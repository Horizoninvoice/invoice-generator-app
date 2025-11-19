'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/lib/hooks/useUser'
import { FiUser, FiLogOut, FiSettings, FiAward, FiChevronDown, FiLayout, FiUsers, FiPackage, FiFileText } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Link from 'next/link'

// Cache Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient()
  }
  return supabaseClient
}

export function UserMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = useMemo(() => getSupabaseClient(), [])
  const { user, profile, isPro } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    router.push('/login')
    setIsOpen(false)
  }, [supabase, router])

  const userInitials = useMemo(() => {
    if (!user?.email) return 'U'
    return user.email.substring(0, 2).toUpperCase()
  }, [user?.email])

  const userName = useMemo(() => {
    return user?.email?.split('@')[0] || 'User'
  }, [user?.email])

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname?.startsWith(href)
  }

  if (!user) return null

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: FiLayout },
    { href: '/customers', label: 'Customers', icon: FiUsers },
    { href: '/products', label: 'Products', icon: FiPackage },
    { href: '/invoices', label: 'Invoices', icon: FiFileText },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
          {userInitials}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {userName}
          </p>
          {isPro && (
            <p className="text-xs text-primary-600 dark:text-primary-400 flex items-center gap-1">
              <FiAward size={12} />
              Pro
            </p>
          )}
        </div>
        <FiChevronDown
          size={16}
          className={`text-gray-600 dark:text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.email}
            </p>
            {profile && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {isPro ? 'Pro Account' : 'Free Account'}
              </p>
            )}
          </div>

          <div className="py-1">
            {/* Dashboard, Customers, Products, Invoices */}
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    active
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 py-1">
            <Link
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiUser size={16} />
              Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiSettings size={16} />
              Settings
            </Link>
            {!isPro && (
              <Link
                href="/upgrade"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiAward size={16} />
                Upgrade to Pro
              </Link>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
