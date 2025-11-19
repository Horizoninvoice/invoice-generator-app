'use client'

import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/lib/hooks/useUser'
import { FiUser, FiLogOut, FiSettings, FiAward, FiChevronDown, FiLayout, FiUsers, FiPackage, FiFileText } from '@/lib/icons'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

// Cache Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient()
  }
  return supabaseClient
}

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: FiLayout },
  { href: '/customers', label: 'Customers', icon: FiUsers },
  { href: '/products', label: 'Products', icon: FiPackage },
  { href: '/invoices', label: 'Invoices', icon: FiFileText },
]

export const UserMenu = memo(function UserMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = useMemo(() => getSupabaseClient(), [])
  const { user, profile, isPro, isMax } = useUser()
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

  const isActive = useCallback((href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname?.startsWith(href)
  }, [pathname])

  const accountType = useMemo(() => {
    return profile?.role === 'max' ? 'Max' : profile?.role === 'pro' ? 'Pro' : 'Free'
  }, [profile?.role])

  if (!user) return null

  return (
    <div className="flex items-center gap-3">
      {/* Upgrade Button - Show prominently if not Pro/Max */}
      {!isPro && !isMax && (
        <Link href="/upgrade" className="hidden sm:block">
          <Button size="sm" className="flex items-center gap-2">
            <FiAward size={16} />
            <span className="hidden md:inline">Upgrade</span>
          </Button>
        </Link>
      )}

      {/* User Menu Dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all shadow-sm hover:shadow-md"
          aria-label="User menu"
          aria-expanded={isOpen}
        >
          <div className="w-9 h-9 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {userInitials}
          </div>
          <div className="hidden md:block text-left min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
              {userName}
            </p>
            {isPro && (
              <p className="text-xs text-primary-600 dark:text-primary-400 flex items-center gap-1">
                <FiAward size={12} />
                {accountType}
              </p>
            )}
          </div>
          <FiChevronDown
            size={16}
            className={`text-gray-600 dark:text-gray-400 transition-transform flex-shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user.email}
              </p>
              {profile && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {accountType} Account
                </p>
              )}
            </div>

            {/* Upgrade CTA - Show inside menu if not Pro/Max */}
            {!isPro && !isMax && (
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <Link href="/upgrade" onClick={() => setIsOpen(false)} className="block">
                  <Button className="w-full flex items-center justify-center gap-2" size="sm">
                    <FiAward size={16} />
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            )}

            {/* Navigation Links */}
            <div className="py-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      active
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* Account Settings */}
            <div className="border-t border-gray-200 dark:border-gray-700 py-1">
              <Link
                href="/dashboard/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiUser size={18} />
                Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiSettings size={18} />
                Settings
              </Link>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})
