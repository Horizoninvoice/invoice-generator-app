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
      name: 'Free Plan',
      price: '₹0',
      period: 'month',
      description: 'Perfect for getting started',
      features: [
        '2 invoice templates',
        'Customer & product management',
        '15 invoices/month',
        'Ads supported',
      ],
      cta: user ? 'Current Plan' : 'Get Started',
      highlight: false,
    },
    {
      name: 'Pro Plan',
      price: '₹249',
      period: 'month',
      description: 'For growing businesses',
      features: [
        'Ad-free experience',
        'Unlimited invoices',
        'All 5 invoice templates',
        'Excel export',
        'Priority support',
      ],
      cta: 'Upgrade to Pro',
      highlight: true,
    },
    {
      name: 'Max Plan (Lifetime)',
      price: '₹1,499',
      period: 'one-time',
      description: 'Best value for lifetime access',
      features: [
        'Everything in Pro',
        'Lifetime access',
        'No recurring charges',
        'Future premium features included',
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
              Horizon Invoice Generator – Pricing (INR)
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the plan that works best for your business. All plans include core features with transparent pricing in Indian Rupees.
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
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Includes:</p>
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
                    <Button className="w-full" variant={plan.highlight ? 'primary' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth/signup">
                    <Button className="w-full" variant={plan.highlight ? 'primary' : 'outline'}>
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
                Need a Personalized Plan?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Contact us at <a href="mailto:horizoninvoicegen@gmail.com" className="text-primary-600 dark:text-primary-400 hover:underline">horizoninvoicegen@gmail.com</a> for custom enterprise plans and personalized features.
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
