'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { memo } from 'react'
import { useUser } from '@/lib/hooks/useUser'
import { Button } from '@/components/ui/Button'
import { FiFileText, FiUsers, FiPackage, FiLayout, FiAward } from 'react-icons/fi'
import { UserMenu } from '@/components/layout/UserMenu'

export const Navbar = memo(function Navbar() {
  const pathname = usePathname()
  const { user, loading, isPro } = useUser()

  const renderBrand = (href: string) => (
    <Link href={href} className="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400">
      <Image src="/letter-h.ico" alt="Horizon" width={32} height={32} className="w-8 h-8" unoptimized />
      <span>Horizon</span>
    </Link>
  )

  const publicLinks = [
    { href: '/features', label: 'Features' },
    { href: '/templates', label: 'Templates' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/upgrade', label: 'Upgrade' },
  ]

  const renderPublicNav = ({
    showAuthButtons = true,
    showSkeletonButtons = false,
  }: {
    showAuthButtons?: boolean
    showSkeletonButtons?: boolean
  }) => (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {renderBrand('/')}

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-300">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {showAuthButtons && !showSkeletonButtons && (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}

            {showSkeletonButtons && (
              <div className="flex gap-2">
                <div className="h-10 w-20 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="h-10 w-24 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )

  if (loading) {
    return renderPublicNav({ showAuthButtons: false, showSkeletonButtons: true })
  }

  if (!user) {
    return renderPublicNav({ showAuthButtons: true })
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            {renderBrand('/dashboard')}
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
})

