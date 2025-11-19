import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { FiCheck, FiX } from 'react-icons/fi'

export default function PricingPage() {
  const features = [
    'Unlimited Invoices',
    'Customer Management',
    'Product Catalog',
    'PDF Generation',
    'Email Support',
    'Basic Templates',
    'Export to Excel',
    'Custom Logo',
    'Multiple Templates',
    'Priority Support',
    'No Ads',
    'Advanced Analytics',
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Choose the plan that's right for your business
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="relative">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">₹0</span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Perfect for getting started</p>
            </div>
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  {index < 6 ? (
                    <FiCheck className="text-green-600 dark:text-green-400 flex-shrink-0" size={20} />
                  ) : (
                    <FiX className="text-gray-400 flex-shrink-0" size={20} />
                  )}
                  <span className={`${index < 6 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/signup" className="block">
              <Button className="w-full" variant="outline">Get Started</Button>
            </Link>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-2 border-primary-600 dark:border-primary-500">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-primary-600 dark:bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <div className="text-center mb-8 pt-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pro</h3>
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">₹999</span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">For growing businesses</p>
            </div>
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <FiCheck className="text-green-600 dark:text-green-400 flex-shrink-0" size={20} />
                  <span className="text-gray-900 dark:text-white">{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/upgrade" className="block">
              <Button className="w-full">Upgrade to Pro</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Can I change plans later?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We accept all major credit cards, debit cards, and UPI through Razorpay.
            </p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Is there a free trial?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Yes! The free plan is available forever. You can upgrade to Pro anytime to unlock premium features.
            </p>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}

