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
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingPlan, setProcessingPlan] = useState<'pro' | 'max' | null>(null)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  useEffect(() => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setRazorpayLoaded(true)
      return
    }

    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => {
      setRazorpayLoaded(true)
      console.log('Razorpay script loaded successfully')
    }
    script.onerror = () => {
      console.error('Failed to load Razorpay script')
      toast.error('Failed to load payment gateway. Please refresh the page.')
    }
    document.body.appendChild(script)

    return () => {
      // Only remove if we added it
      if (script.parentNode) {
        document.body.removeChild(script)
      }
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
      toast.error('Payment gateway not loaded. Please wait a moment and try again.')
      return
    }

    setIsProcessing(true)
    setProcessingPlan(plan)
    
    try {
      console.log('Initiating payment for plan:', plan)
      // Get API base URL - use Netlify Functions path
      const apiBaseUrl = import.meta.env.VITE_API_URL || window.location.origin
      const response = await fetch(`${apiBaseUrl}/.netlify/functions/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, user_id: user.id }),
      })

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        // Try to get error message from response
        try {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const error = await response.json()
            errorMessage = error.error || error.message || errorMessage
          } else {
            const text = await response.text()
            errorMessage = text || errorMessage
          }
        } catch (e) {
          // If we can't parse the response, use the status
          console.error('Error parsing error response:', e)
        }
        
        if (response.status === 404) {
          toast.error('Payment service not available. Please use "npm run dev:netlify" for local development or deploy to Netlify.')
        } else if (response.status === 503) {
          toast.error('Payment gateway is not configured yet. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your environment variables.')
        } else {
          toast.error(errorMessage || 'Failed to create payment order')
        }
        setIsProcessing(false)
        setProcessingPlan(null)
        return
      }

      const data = await response.json()
      const { orderId, amount, currency, keyId } = data

      if (!orderId || !keyId) {
        throw new Error('Failed to create payment order. Missing order ID or key.')
      }

      console.log('Payment order created:', { orderId, amount, currency })

      const planDesc = plan === 'pro' ? 'Pro monthly subscription for Horizon Invoice Generator' : 'Max lifetime subscription for Horizon Invoice Generator'

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'Horizon Invoice Generator',
        description: planDesc,
        order_id: orderId,
        image: '/letter-h.ico', // Add your logo
        handler: async function (response: any) {
          console.log('Payment response:', response)
          if (response.razorpay_payment_id) {
            try {
              // Verify payment with backend - use Netlify Functions path
              const apiBaseUrl = import.meta.env.VITE_API_URL || window.location.origin
              const verifyResponse = await fetch(`${apiBaseUrl}/.netlify/functions/payment/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  user_id: user.id,
                }),
              })

              if (!verifyResponse.ok) {
                let errorMessage = `HTTP ${verifyResponse.status}: ${verifyResponse.statusText}`
                
                try {
                  const contentType = verifyResponse.headers.get('content-type')
                  if (contentType && contentType.includes('application/json')) {
                    const error = await verifyResponse.json()
                    errorMessage = error.error || error.message || errorMessage
                  } else {
                    const text = await verifyResponse.text()
                    errorMessage = text || errorMessage
                  }
                } catch (e) {
                  console.error('Error parsing verification error response:', e)
                }
                
                throw new Error(errorMessage || 'Payment verification failed')
              }

              const verifyData = await verifyResponse.json()

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
            console.log('Payment modal dismissed')
            setIsProcessing(false)
            setProcessingPlan(null)
          },
        },
        notes: {
          plan: plan,
          user_id: user.id,
        },
      }

      console.log('Opening Razorpay checkout...')
      const razorpay = new window.Razorpay(options)
      
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response)
        toast.error(`Payment failed: ${response.error.description || 'Please try again'}`)
        setIsProcessing(false)
        setProcessingPlan(null)
      })

      razorpay.open()
    } catch (error: any) {
      console.error('Payment initiation error:', error)
      toast.error(error.message || 'Failed to initiate payment. Please try again.')
      setIsProcessing(false)
      setProcessingPlan(null)
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
      price: 249,
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
                  isLoading={isProcessing && processingPlan === plan.id}
                  disabled={isProcessing || !razorpayLoaded}
                  title={!razorpayLoaded ? 'Payment gateway loading...' : undefined}
                >
                  {plan.id === 'max' ? 'Get Lifetime Access' : 'Upgrade to Pro'}
                </Button>
              )}
            </Card>
          ))}
        </div>

        {/* Payment Configuration Notice */}
        {!razorpayLoaded && (
          <Card className="mb-8 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <span className="text-yellow-600 dark:text-yellow-400 text-sm">ℹ️</span>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Payment Gateway Setup
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Payment processing is being configured. Once your Razorpay API keys are added to the environment variables, 
                  you'll be able to upgrade your subscription. For now, you can use the free plan features.
                </p>
              </div>
            </div>
          </Card>
        )}

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
