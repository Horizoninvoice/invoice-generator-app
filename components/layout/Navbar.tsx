'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { memo } from 'react'
import { useUser } from '@/lib/hooks/useUser'
import { Button } from '@/components/ui/Button'
import { UserMenu } from '@/components/layout/UserMenu'

export const Navbar = memo(function Navbar() {
  const pathname = usePathname()
  const { user, loading } = useUser()

  const renderBrand = (href: string) => (
    <Link href={href} className="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400 hover:opacity-80 transition-opacity">
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

  // Loading state
  if (loading) {
    return (
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {renderBrand('/')}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                {publicLinks.map((link) => (
                  <div key={link.href} className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ))}
              </div>
              <div className="flex gap-2">
                <div className="h-10 w-20 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="h-10 w-24 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Not authenticated - show public navbar
  if (!user) {
    return (
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {renderBrand('/')}

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${
                      pathname === link.href ? 'text-primary-600 dark:text-primary-400 font-semibold' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Authenticated user - show navbar with user menu
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            {renderBrand('/dashboard')}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${
                    pathname === link.href ? 'text-primary-600 dark:text-primary-400 font-semibold' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  )
})
