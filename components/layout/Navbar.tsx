'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '@/lib/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { FiFileText, FiUsers, FiPackage, FiLayoutDashboard, FiLogOut, FiCrown } from 'react-icons/fi'
import toast from 'react-hot-toast'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, loading, isPro } = useUser()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    router.push('/login')
  }

  if (loading) {
    return (
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </nav>
    )
  }

  if (!user) {
    return (
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold text-primary-600">
              InvoiceGen
            </Link>
            <div className="flex gap-4">
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
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-primary-600">
              InvoiceGen
            </Link>
            <div className="hidden md:flex gap-4">
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiLayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link
                href="/customers"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  pathname?.startsWith('/customers')
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiUsers size={18} />
                Customers
              </Link>
              <Link
                href="/products"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  pathname?.startsWith('/products')
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiPackage size={18} />
                Products
              </Link>
              <Link
                href="/invoices"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  pathname?.startsWith('/invoices')
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiFileText size={18} />
                Invoices
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!isPro && (
              <Link href="/upgrade">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <FiCrown size={16} />
                  Upgrade to Pro
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <FiLogOut size={18} />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

