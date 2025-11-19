import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Navbar } from '@/components/layout/Navbar'
import { AdSense } from '@/components/layout/AdSense'
import { FiFileText, FiUsers, FiPackage, FiZap, FiShield, FiDownload, FiAward } from 'react-icons/fi'

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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-12 text-white">
            <div className="flex items-center gap-3 mb-4">
              <FiAward size={32} />
              <h2 className="text-3xl font-bold">Upgrade to Pro</h2>
            </div>
            <p className="text-xl mb-8 text-primary-100">
              Unlock advanced features and take your invoicing to the next level
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white text-primary-600 flex items-center justify-center font-bold mt-1">✓</div>
                <div>
                  <h3 className="font-semibold mb-1">No Ads</h3>
                  <p className="text-primary-100 text-sm">Ad-free experience</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white text-primary-600 flex items-center justify-center font-bold mt-1">✓</div>
                <div>
                  <h3 className="font-semibold mb-1">Unlimited Invoices</h3>
                  <p className="text-primary-100 text-sm">Create as many invoices as you need</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white text-primary-600 flex items-center justify-center font-bold mt-1">✓</div>
                <div>
                  <h3 className="font-semibold mb-1">Multiple Templates</h3>
                  <p className="text-primary-100 text-sm">Choose from professional invoice templates</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white text-primary-600 flex items-center justify-center font-bold mt-1">✓</div>
                <div>
                  <h3 className="font-semibold mb-1">Excel Export</h3>
                  <p className="text-primary-100 text-sm">Export all your data to Excel</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white text-primary-600 flex items-center justify-center font-bold mt-1">✓</div>
                <div>
                  <h3 className="font-semibold mb-1">Custom Logo</h3>
                  <p className="text-primary-100 text-sm">Upload your company logo</p>
                </div>
              </div>
            </div>
            <Link href="/upgrade">
              <Button variant="secondary" size="lg">Upgrade Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">InvoiceGen</h3>
            <p className="text-gray-400 mb-4">Free Invoice Generator for Everyone</p>
            <p className="text-gray-500 text-sm">© 2024 InvoiceGen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

