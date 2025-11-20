import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Home, FileText, Users, Package, Settings, User, LogOut, Moon, Sun, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, profile, signOut, isPro, isMax } = useAuth()
  const { colorScheme, toggleColorScheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navLinks = user
    ? [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/invoices', label: 'Invoices', icon: FileText },
        { href: '/customers', label: 'Customers', icon: Users },
        { href: '/products', label: 'Products', icon: Package },
      ]
    : [
        { href: '/', label: 'Home', icon: Home },
        { href: '/auth/login', label: 'Login', icon: User },
        { href: '/auth/signup', label: 'Sign Up', icon: User },
      ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400">
            <img src="/letter-h.ico" alt="Horizon" className="w-8 h-8" />
            <span>Horizon</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              )
            })}

            {user && (
              <>
                <Link
                  to="/settings"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/settings')
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Settings size={18} />
                  Settings
                </Link>

                {/* Theme Toggle */}
                <button
                  onClick={toggleColorScheme}
                  className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Toggle theme"
                >
                  {colorScheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <User size={18} />
                    <span className="hidden lg:inline">{profile?.shop_name || user.email?.split('@')[0]}</span>
                    {isMax && (
                      <span className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                        Max
                      </span>
                    )}
                    {isPro && !isMax && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                        Pro
                      </span>
                    )}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/subscription"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Subscription
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium mb-2 ${
                    isActive(link.href)
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              )
            })}
            {user && (
              <>
                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  <Settings size={18} />
                  Settings
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  <User size={18} />
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

