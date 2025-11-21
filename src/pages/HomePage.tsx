import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AdSense from '@/components/layout/AdSense'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Check, FileText, Users, Package, Zap, Shield, Globe, TrendingUp } from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-black dark:text-black mb-4 drop-shadow-sm">
            Create Professional Invoices in Minutes
          </h1>
          <p className="text-xl text-black dark:text-black mb-8 max-w-3xl mx-auto font-medium">
            Horizon Invoice Generator is a cloud-based invoicing platform designed for freelancers, small businesses, and entrepreneurs. 
            Streamline your billing process, manage customers and products, and generate beautiful professional invoices with ease.
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

      {/* What is Horizon Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              What is Horizon Invoice Generator?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Horizon is a comprehensive invoicing solution that helps you create, manage, and track invoices effortlessly. 
              Whether you're a freelancer sending invoices to clients or a small business managing multiple customers, 
              Horizon simplifies your billing workflow.
            </p>
          </div>
        </div>
      </section>

      {/* Who is it for Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              Who is Horizon For?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              Horizon is perfect for:
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <Users className="text-primary-600 dark:text-primary-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Freelancers</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Send professional invoices to clients quickly and track payments efficiently.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <TrendingUp className="text-primary-600 dark:text-primary-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Small Businesses</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Manage multiple customers, products, and invoices from one centralized platform.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Zap className="text-primary-600 dark:text-primary-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Entrepreneurs</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Focus on growing your business while Horizon handles your invoicing needs.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-12">
            Everything You Need to Manage Invoices
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="text-primary-600 dark:text-primary-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Professional Templates</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose from multiple beautiful invoice templates that make a great impression on your clients.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-600 dark:text-primary-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Customer Management</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Keep track of all your customers and their information in one organized place.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="text-primary-600 dark:text-primary-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Product Catalog</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Build and manage your product catalog for quick invoice creation and consistent pricing.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="text-primary-600 dark:text-primary-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Quick Generation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create professional invoices in minutes with our intuitive interface and live preview.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary-600 dark:text-primary-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Secure & Reliable</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your data is encrypted and stored securely. Export invoices as PDF or Excel anytime.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="text-primary-600 dark:text-primary-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Multi-Currency</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Support for multiple currencies and countries, making it perfect for global businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-12">Simple Pricing (INR)</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Free Plan</h3>
              <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4">₹0</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>2 Invoice Templates</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>Customer & Product Management</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>15 Invoices/Month</span>
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
                <h3 className="text-2xl font-bold text-black dark:text-white">Pro Plan</h3>
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded">
                  Popular
                </span>
              </div>
              <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4">₹249<span className="text-lg">/month</span></p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>All 5 Invoice Templates</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>Unlimited Invoices</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>Ad-Free Experience</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>Excel Export & Priority Support</span>
                </li>
              </ul>
              <Link to={user ? '/subscription' : '/auth/signup'}>
                <Button className="w-full">Upgrade to Pro</Button>
              </Link>
            </div>

            {/* Max Plan */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Max Plan (Lifetime)</h3>
              <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4">₹1,499<span className="text-lg"> one-time</span></p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>Lifetime Access</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>No Recurring Charges</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check size={20} className="text-green-500" />
                  <span>Future Premium Features</span>
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
          <p className="text-primary-100 mb-8">Create your first invoice in minutes. No credit card required for the free plan.</p>
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
