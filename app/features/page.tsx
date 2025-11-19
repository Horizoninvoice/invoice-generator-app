import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { FiFileText, FiUsers, FiPackage, FiZap, FiShield, FiDownload, FiDollarSign, FiTrendingUp, FiCheck } from 'react-icons/fi'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function FeaturesPage() {
  const features = [
    {
      icon: FiFileText,
      title: 'Easy Invoice Creation',
      description: 'Create professional invoices with our intuitive invoice builder. Add items, calculate totals automatically, and generate PDFs instantly.',
      color: 'primary',
    },
    {
      icon: FiUsers,
      title: 'Customer Management',
      description: 'Keep track of all your customers in one place. Store contact information, addresses, and payment history.',
      color: 'green',
    },
    {
      icon: FiPackage,
      title: 'Product Catalog',
      description: 'Build a product library with prices, descriptions, and tax rates. Add products to invoices with a single click.',
      color: 'blue',
    },
    {
      icon: FiZap,
      title: 'Fast & Reliable',
      description: 'Built with modern technology for speed and reliability. Your data is secure and backed up automatically.',
      color: 'yellow',
    },
    {
      icon: FiShield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. We never share your information with third parties.',
      color: 'purple',
    },
    {
      icon: FiDownload,
      title: 'Export Options',
      description: 'Download invoices as PDF or export data to Excel. Pro users get unlimited exports.',
      color: 'indigo',
    },
    {
      icon: FiDollarSign,
      title: 'Payment Tracking',
      description: 'Track payments, manage invoices, and monitor your revenue all in one dashboard.',
      color: 'green',
    },
    {
      icon: FiTrendingUp,
      title: 'Analytics & Reports',
      description: 'Get insights into your business with detailed reports and analytics. Understand your revenue trends.',
      color: 'blue',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Powerful Features</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Everything you need to create, manage, and track professional invoices
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`text-${feature.color}-600 dark:text-${feature.color}-400`} size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 dark:bg-primary-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-primary-100 mb-8">Join thousands of businesses using Horizon to manage their invoices</p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary">Get Started Free</Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

