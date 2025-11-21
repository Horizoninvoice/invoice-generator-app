import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Check } from 'lucide-react'

export default function PricingPage() {
  const { user } = useAuth()

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'Forever',
      description: 'Perfect for getting started',
      features: [
        '2 Invoice Templates',
        'Basic Features',
        'Unlimited Invoices',
        'Customer Management',
        'Product Catalog',
        'PDF Export',
        'Email Support',
        'Ads Displayed',
      ],
      cta: user ? 'Current Plan' : 'Get Started',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '₹149',
      period: 'per month',
      description: 'For growing businesses',
      features: [
        '5 Invoice Templates',
        'All Features',
        'Unlimited Invoices',
        'Advanced Reports',
        'Priority Support',
        'No Ads',
        'Custom Branding',
        'Email Integration',
      ],
      cta: 'Upgrade to Pro',
      highlight: true,
    },
    {
      name: 'Max',
      price: '₹1,499',
      period: 'one-time',
      description: 'Best value for lifetime access',
      features: [
        '5 Invoice Templates',
        'All Features',
        'Lifetime Access',
        'Advanced Reports',
        'Priority Support',
        'No Ads',
        'Custom Branding',
        'Email Integration',
      ],
      cta: 'Get Max',
      highlight: false,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the plan that works best for your business. All plans include core features with no hidden fees.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`p-8 relative ${plan.highlight ? 'border-2 border-primary-500 shadow-lg' : ''}`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-600 dark:text-gray-400 ml-2">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                {user ? (
                  <Link to="/subscription">
                    <Button className="w-full" variant={plan.highlight ? 'default' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth/signup">
                    <Button className="w-full" variant={plan.highlight ? 'default' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </Link>
                )}
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Card className="p-8 bg-primary-50 dark:bg-primary-900/20">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Need a Custom Plan?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Contact us for personalized enterprise plans and custom features tailored to your business needs.
              </p>
              <Link to="/contact">
                <Button>Contact Us</Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

