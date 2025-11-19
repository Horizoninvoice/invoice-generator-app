import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'
import { Navbar } from '@/components/layout/Navbar'
import { FiFileText, FiUsers, FiPackage, FiZap, FiShield, FiDownload, FiAward, FiCheck, FiStar } from '@/lib/icons'

// Dynamic imports for heavy components
const AdSense = dynamic(() => import('@/components/layout/AdSense').then(mod => ({ default: mod.AdSense })), {
  ssr: false,
})

const Footer = dynamic(() => import('@/components/layout/Footer').then(mod => ({ default: mod.Footer })), {
  ssr: true,
})

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <AdSense />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Create Professional Invoices
            <span className="text-primary-600 dark:text-primary-400"> in Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Free invoice generator to create, manage, and send professional invoices. 
            Perfect for freelancers, small businesses, and entrepreneurs.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg">Get Started Free</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="lg">View Features</Button>
            </Link>
          </div>
        </div>
      </section>

      <AdSense />

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Everything You Need</h2>
            <p className="text-gray-600 dark:text-gray-300">Powerful features to manage your invoicing workflow</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
              <FiFileText className="text-primary-600 dark:text-primary-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy Invoice Creation</h3>
              <p className="text-gray-600 dark:text-gray-300">Create professional invoices in minutes with our intuitive builder.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
              <FiUsers className="text-primary-600 dark:text-primary-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Customer Management</h3>
              <p className="text-gray-600 dark:text-gray-300">Keep track of all your customers and their information.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
              <FiPackage className="text-primary-600 dark:text-primary-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Product Catalog</h3>
              <p className="text-gray-600 dark:text-gray-300">Build a library of products for quick invoice creation.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
              <FiZap className="text-primary-600 dark:text-primary-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fast & Reliable</h3>
              <p className="text-gray-600 dark:text-gray-300">Built with modern technology for speed and reliability.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
              <FiShield className="text-primary-600 dark:text-primary-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure & Private</h3>
              <p className="text-gray-600 dark:text-gray-300">Your data is encrypted and secure. We never share your information.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
              <FiDownload className="text-primary-600 dark:text-primary-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Export Options</h3>
              <p className="text-gray-600 dark:text-gray-300">Download invoices as PDF or export data to Excel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 dark:bg-primary-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-primary-100 mb-8">Create your first invoice in minutes. No credit card required.</p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">Get Started Free</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
