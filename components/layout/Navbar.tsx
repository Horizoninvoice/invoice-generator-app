'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '@/lib/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { FiFileText, FiUsers, FiPackage, FiLayout, FiAward } from 'react-icons/fi'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { UserMenu } from '@/components/layout/UserMenu'

export function Navbar() {
  const pathname = usePathname()
  const { user, loading, isPro } = useUser()

  if (loading) {
    return (
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          </div>
        </div>
      </nav>
    )
  }

  if (!user) {
    return (
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
              InvoiceGen
            </Link>
            <div className="flex gap-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-primary-600 dark:text-primary-400">
              InvoiceGen
            </Link>
            <div className="hidden md:flex gap-4">
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <FiLayout size={18} />
                Dashboard
              </Link>
              <Link
                href="/customers"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  pathname?.startsWith('/customers')
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <FiUsers size={18} />
                Customers
              </Link>
              <Link
                href="/products"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  pathname?.startsWith('/products')
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <FiPackage size={18} />
                Products
              </Link>
              <Link
                href="/invoices"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  pathname?.startsWith('/invoices')
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <FiFileText size={18} />
                Invoices
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {!isPro && (
              <Link href="/upgrade">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <FiAward size={16} />
                  Upgrade to Pro
                </Button>
              </Link>
            )}
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}

