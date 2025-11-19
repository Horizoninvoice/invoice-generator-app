import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Navbar } from '@/components/layout/Navbar'
import { AdSense } from '@/components/layout/AdSense'
import { Footer } from '@/components/layout/Footer'
import { FiFileText, FiUsers, FiPackage, FiZap, FiShield, FiDownload, FiAward, FiCheck, FiStar } from 'react-icons/fi'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <AdSense />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Create Professional Invoices
            <span className="text-primary-600"> in Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
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
          </div>
        </div>
      </section>

      <AdSense />

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Manage Invoices
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FiFileText className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Invoice Creation</h3>
              <p className="text-gray-600">
                Create professional invoices with our intuitive invoice builder. 
                Add items, calculate totals automatically, and generate PDFs instantly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FiUsers className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Management</h3>
              <p className="text-gray-600">
                Keep track of all your customers in one place. Store contact information, 
                addresses, and payment history.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FiPackage className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Product Catalog</h3>
              <p className="text-gray-600">
                Build a product library with prices, descriptions, and tax rates. 
                Add products to invoices with a single click.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FiZap className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
              <p className="text-gray-600">
                Built with modern technology for speed and reliability. 
                Your data is secure and backed up automatically.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FiShield className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is encrypted and secure. We never share your information 
                with third parties.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FiDownload className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Export Options</h3>
              <p className="text-gray-600">
                Download invoices as PDF or export data to Excel. 
                Pro users get unlimited exports.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AdSense />

      {/* Pro Features Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FiAward className="text-primary-600 dark:text-primary-400" size={40} />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Upgrade to Pro</h2>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              Unlock advanced features and take your invoicing to the next level
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Join thousands of businesses using Pro features to streamline their invoicing
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                  <FiCheck className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">No Ads</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Enjoy a completely ad-free experience with no distractions</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                  <FiFileText className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Unlimited Invoices</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Create as many invoices as you need without any restrictions</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                  <FiStar className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Multiple Templates</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Choose from 4+ professional invoice templates to match your brand</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                  <FiDownload className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Excel Export</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Export all your invoices, customers, and products to Excel for analysis</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                  <FiFileText className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Custom Logo</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Upload your company logo to brand your invoices professionally</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                  <FiShield className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Priority Support</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Get priority customer support with faster response times</p>
                </div>
              </div>
            </div>

            <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">₹999</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">/month</span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Cancel anytime • No hidden fees</p>
              </div>
              <Link href="/upgrade">
                <Button size="lg" className="px-8">
                  <FiAward className="mr-2" size={20} />
                  Upgrade to Pro Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

