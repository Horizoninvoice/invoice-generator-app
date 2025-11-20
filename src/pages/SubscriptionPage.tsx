import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Check, Mail, Crown } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import toast from 'react-hot-toast'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function SubscriptionPage() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [selectedPlan] = useState<'pro' | 'max'>('pro')
  const [isProcessing, setIsProcessing] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const isPro = profile?.role === 'pro' || profile?.role === 'max'
  const isMax = profile?.role === 'max'

  const handleUpgrade = async (plan: 'pro' | 'max') => {
    if (!user) {
      navigate('/auth/login')
      return
    }

    if (!razorpayLoaded || !window.Razorpay) {
      toast.error('Payment gateway not loaded. Please refresh the page.')
      return
    }

    setIsProcessing(true)
    try {
      // Get API base URL (works for both local and Vercel)
      const apiBaseUrl = import.meta.env.VITE_API_URL || window.location.origin
      const response = await fetch(`${apiBaseUrl}/api/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, user_id: user.id }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create payment order')
      }

      const { orderId, amount, currency, keyId } = await response.json()

      if (!orderId) {
        throw new Error('Failed to create payment order')
      }

      const planName = plan === 'pro' ? 'Pro Monthly' : 'Max Lifetime'
      const planDesc = plan === 'pro' ? 'Pro monthly subscription for Horizon' : 'Max lifetime subscription for Horizon'

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: `Horizon ${planName}`,
        description: planDesc,
        order_id: orderId,
        handler: async function (response: any) {
          if (response.razorpay_payment_id) {
            try {
              // Verify payment with backend
              const apiBaseUrl = import.meta.env.VITE_API_URL || window.location.origin
              const verifyResponse = await fetch(`${apiBaseUrl}/api/payment/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  user_id: user.id,
                }),
              })

              const verifyData = await verifyResponse.json()

              if (!verifyResponse.ok) {
                throw new Error(verifyData.error || 'Payment verification failed')
              }

              toast.success(verifyData.message || 'Payment successful! Your account has been upgraded.')
              refreshProfile()
              navigate('/payment/success')
            } catch (error: any) {
              toast.error(error.message || 'Payment verification failed')
              navigate('/payment/cancel')
            }
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      toast.error(error.message || 'Failed to initiate payment')
      setIsProcessing(false)
    }
  }

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: '',
      features: [
        '2 Invoice Templates',
        'Basic Features',
        'Customer Management',
        'Product Management',
        'PDF Export',
        'Ads Displayed',
      ],
      current: !isPro,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 149,
      period: '/month',
      features: [
        '5 Invoice Templates',
        'All Features',
        'No Ads',
        'Priority Support',
        'Advanced Customization',
        'Unlimited Invoices',
      ],
      current: isPro && !isMax,
      popular: true,
    },
    {
      id: 'max',
      name: 'Max',
      price: 1499,
      period: '/lifetime',
      features: [
        '5 Invoice Templates',
        'All Features',
        'No Ads',
        'Lifetime Access',
        'Priority Support',
        'All Future Updates',
      ],
      current: isMax,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Subscription Management</h1>

        {/* Current Plan */}
        {profile && (
          <Card className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Current Plan</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {isMax
                    ? 'Max (Lifetime) - You have lifetime access to all features'
                    : isPro
                    ? 'Pro (Monthly) - Active subscription'
                    : 'Free - Upgrade to unlock all features'}
                </p>
                {profile.subscription_end_date && !isMax && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Next billing date: {new Date(profile.subscription_end_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              {isMax && (
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Crown className="text-purple-600 dark:text-purple-400" size={20} />
                  <span className="text-purple-700 dark:text-purple-300 font-medium">Lifetime Access</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Plan Comparison */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${plan.popular ? 'border-2 border-primary-500 dark:border-primary-400' : ''} ${
                plan.current ? 'bg-primary-50 dark:bg-primary-900/20' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                  Popular
                </div>
              )}
              {plan.current && (
                <div className="absolute top-4 right-4 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded">
                  Current
                </div>
              )}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {plan.id === 'max' && <Crown className="text-yellow-500" size={24} />}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(plan.price, profile?.currency || 'INR')}
                  </span>
                  {plan.period && <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>}
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.id === 'free' ? (
                <Button className="w-full" variant="outline" disabled>
                  Current Plan
                </Button>
              ) : plan.current ? (
                <Button className="w-full" variant="outline" disabled>
                  Active Plan
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => handleUpgrade(plan.id as 'pro' | 'max')}
                  isLoading={isProcessing && selectedPlan === plan.id}
                  disabled={isProcessing}
                >
                  {plan.id === 'max' ? 'Get Lifetime Access' : 'Upgrade to Pro'}
                </Button>
              )}
            </Card>
          ))}
        </div>

        {/* Personalized Plan */}
        <Card>
          <div className="text-center">
            <Mail className="mx-auto text-primary-600 dark:text-primary-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Need a Custom Solution?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Contact us for personalized enterprise plans and custom features tailored to your business needs.
            </p>
            <a href="mailto:horizoninvoicegen@gmail.com">
              <Button variant="outline">
                <Mail size={18} className="mr-2" />
                Contact Us
              </Button>
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}
