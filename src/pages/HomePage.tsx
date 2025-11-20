import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AdSense from '@/components/layout/AdSense'
import Button from '@/components/ui/Button'
import { Check, FileText, Users, Package } from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Create Professional Invoices in Minutes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Streamline your invoicing process with Horizon. Generate beautiful, professional invoices, manage customers and products, all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth/signup">
                  <Button size="lg">Get Started Free</Button>
                </Link>
                <Link to="/auth/login">
                  <Button size="lg" variant="outline">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* AdSense for non-authenticated users */}
      {!user && <AdSense />}

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Everything You Need to Manage Invoices
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="text-primary-600 dark:text-primary-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Professional Templates</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose from multiple beautiful invoice templates that make a great impression.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-600 dark:text-primary-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Customer Management</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Keep track of all your customers and their information in one place.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="text-primary-600 dark:text-primary-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Product Catalog</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Build and manage your product catalog for quick invoice creation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
              <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4">₹0</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>2 Invoice Templates</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>Basic Features</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>Ads Displayed</span>
                </li>
              </ul>
              {!user && (
                <Link to="/auth/signup">
                  <Button className="w-full">Get Started</Button>
                </Link>
              )}
            </div>

            {/* Pro Plan */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border-2 border-primary-500 dark:border-primary-400">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Pro</h3>
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded">
                  Popular
                </span>
              </div>
              <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4">₹149<span className="text-lg">/month</span></p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>5 Invoice Templates</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>All Features</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>No Ads</span>
                </li>
              </ul>
              <Link to={user ? '/subscription' : '/auth/signup'}>
                <Button className="w-full">Upgrade to Pro</Button>
              </Link>
            </div>

            {/* Max Plan */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Max</h3>
              <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4">₹1,499<span className="text-lg">/lifetime</span></p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>5 Invoice Templates</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>All Features</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>Lifetime Access</span>
                </li>
              </ul>
              <Link to={user ? '/subscription' : '/auth/signup'}>
                <Button className="w-full">Get Max</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 dark:bg-primary-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-primary-100 mb-8">Create your first invoice in minutes. No credit card required.</p>
          {!user && (
            <Link to="/auth/signup">
              <Button size="lg" variant="secondary">
                Get Started Free
              </Button>
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

