import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { FiCheck, FiX, FiMail } from 'react-icons/fi'

export default function PricingPage() {
  const features = [
    { name: 'Invoice Templates', free: '1 Template', pro: '4 Templates', max: '4 Templates' },
    { name: 'Unlimited Invoices', free: true, pro: true, max: true },
    { name: 'Customer Management', free: true, pro: true, max: true },
    { name: 'Product Catalog', free: true, pro: true, max: true },
    { name: 'PDF Generation', free: true, pro: true, max: true },
    { name: 'Export to Excel', free: false, pro: true, max: true },
    { name: 'Custom Logo', free: false, pro: true, max: true },
    { name: 'Email Support', free: true, pro: true, max: true },
    { name: 'Priority Support', free: false, pro: true, max: true },
    { name: 'No Ads', free: false, pro: true, max: true },
    { name: 'Advanced Analytics', free: false, pro: true, max: true },
    { name: 'API Access', free: false, pro: false, max: true },
    { name: 'White Label', free: false, pro: false, max: true },
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
        <div className="grid md:grid-cols-3 gap-8">
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
            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  {feature.free === true ? (
                    <FiCheck className="text-green-600 dark:text-green-400 flex-shrink-0" size={18} />
                  ) : feature.free === false ? (
                    <FiX className="text-gray-400 flex-shrink-0" size={18} />
                  ) : (
                    <span className="text-xs text-primary-600 dark:text-primary-400 font-medium w-5 text-center">
                      {feature.free}
                    </span>
                  )}
                  <span className={`text-sm ${feature.free === false ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">Includes Ads</p>
            </div>
            <Link href="/signup" className="block">
              <Button className="w-full" variant="outline">Get Started Free</Button>
            </Link>
          </Card>

          {/* Pro Plan - Monthly */}
          <Card className="relative border-2 border-primary-600 dark:border-primary-500">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-primary-600 dark:bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <div className="text-center mb-8 pt-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pro</h3>
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">₹149</span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Monthly subscription</p>
            </div>
            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  {feature.pro === true ? (
                    <FiCheck className="text-green-600 dark:text-green-400 flex-shrink-0" size={18} />
                  ) : feature.pro === false ? (
                    <FiX className="text-gray-400 flex-shrink-0" size={18} />
                  ) : (
                    <span className="text-xs text-primary-600 dark:text-primary-400 font-medium w-5 text-center">
                      {feature.pro}
                    </span>
                  )}
                  <span className={`text-sm ${feature.pro === false ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/upgrade?plan=pro" className="block">
              <Button className="w-full">Upgrade to Pro</Button>
            </Link>
          </Card>

          {/* Max Plan - Lifetime */}
          <Card className="relative border-2 border-yellow-500 dark:border-yellow-400">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-yellow-500 dark:bg-yellow-400 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Best Value
              </span>
            </div>
            <div className="text-center mb-8 pt-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Max</h3>
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">₹1,499</span>
                <span className="text-gray-600 dark:text-gray-400"> one-time</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Lifetime access</p>
            </div>
            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  {feature.max === true ? (
                    <FiCheck className="text-green-600 dark:text-green-400 flex-shrink-0" size={18} />
                  ) : feature.max === false ? (
                    <FiX className="text-gray-400 flex-shrink-0" size={18} />
                  ) : (
                    <span className="text-xs text-primary-600 dark:text-primary-400 font-medium w-5 text-center">
                      {feature.max}
                    </span>
                  )}
                  <span className={`text-sm ${feature.max === false ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/upgrade?plan=max" className="block">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600">
                Get Max Plan
              </Button>
            </Link>
          </Card>
        </div>

        {/* Personalized Plan */}
        <Card className="mt-12 max-w-2xl mx-auto border-2 border-purple-500 dark:border-purple-400">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMail className="text-purple-600 dark:text-purple-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Personalized Plan</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Need a custom solution? Contact us for personalized pricing and features tailored to your business needs.
            </p>
            <a
              href="mailto:horizoninvoicegen@gmail.com?subject=Personalized Plan Inquiry"
              className="inline-block"
            >
              <Button variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/20">
                <FiMail className="mr-2" size={18} />
                Contact Us
              </Button>
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Email: <a href="mailto:horizoninvoicegen@gmail.com" className="text-primary-600 dark:text-primary-400 hover:underline">horizoninvoicegen@gmail.com</a>
            </p>
          </div>
        </Card>
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
              Yes, you can upgrade from Free to Pro or Max at any time. Pro monthly subscriptions can be cancelled anytime.
            </p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              What's the difference between Pro and Max?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Pro is a monthly subscription at ₹149/month. Max is a one-time payment of ₹1,499 for lifetime access with additional features like API access and white-label options.
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
              Yes! The free plan is available forever with 1 template. You can upgrade anytime to unlock premium features.
            </p>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
