'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useUser } from '@/lib/hooks/useUser'
import { FiAward, FiZap, FiShield, FiDownload, FiFileText, FiMail, FiInfinity, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'

declare global {
  interface Window {
    Razorpay: any
  }
}

function UpgradeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, profile, loading } = useUser()
  const [isProcessing, setIsProcessing] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'max'>('pro')

  useEffect(() => {
    const plan = searchParams.get('plan')
    if (plan === 'max') {
      setSelectedPlan('max')
    }
  }, [searchParams])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Payment successful! Your account has been upgraded.')
      router.refresh()
    } else if (searchParams.get('failed') === 'true') {
      toast.error('Payment failed. Please try again.')
    }
  }, [searchParams, router])

  const isPro = profile?.role === 'pro' || profile?.role === 'max'
  const isMax = profile?.role === 'max'

  const handleUpgrade = async (plan: 'pro' | 'max') => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!razorpayLoaded || !window.Razorpay) {
      toast.error('Payment gateway not loaded. Please refresh the page.')
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
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
        handler: function (response: any) {
          if (response.razorpay_payment_id) {
            router.push('/upgrade?success=true')
          }
        },
        prefill: {
          email: user.email || '',
        },
        theme: {
          color: plan === 'max' ? '#eab308' : '#0ea5e9',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false)
            toast.error('Payment cancelled')
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', function (response: any) {
        setIsProcessing(false)
        toast.error('Payment failed. Please try again.')
        router.push('/upgrade?failed=true')
      })

      razorpay.open()
    } catch (error: any) {
      toast.error(error.message || 'Failed to start payment')
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (isMax) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <div className="text-center py-12">
              <FiInfinity className="mx-auto text-yellow-600 dark:text-yellow-400 mb-4" size={64} />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">You're on Max Plan!</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                You have lifetime access to all features. Thank you for your support!
              </p>
              <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (isPro) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <div className="text-center py-12">
              <FiAward className="mx-auto text-primary-600 dark:text-primary-400 mb-4" size={64} />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">You're Already Pro!</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                You have access to all Pro features. Upgrade to Max for lifetime access!
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
                <Button variant="outline" onClick={() => handleUpgrade('max')} isLoading={isProcessing} disabled={!razorpayLoaded}>
                  Upgrade to Max
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => toast.error('Failed to load payment gateway')}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <FiAward className="mx-auto text-primary-600 dark:text-primary-400 mb-4" size={64} />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Upgrade Your Plan</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Choose the perfect plan for your business needs
            </p>
          </div>

          {/* Plan Selection */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
            {/* Pro Plan */}
            <Card className={`relative transition-all ${selectedPlan === 'pro' ? 'border-2 border-primary-600 dark:border-primary-500 shadow-lg' : ''}`}>
              <div className="absolute top-4 right-4">
                {selectedPlan === 'pro' && (
                  <span className="bg-primary-600 dark:bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Selected
                  </span>
                )}
              </div>
              <div className="text-center mb-8 pt-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pro</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">₹149</span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Monthly subscription</p>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <FiCheck className="text-green-600 dark:text-green-400" size={16} />
                  <span className="text-gray-900 dark:text-white">4 Invoice Templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheck className="text-green-600 dark:text-green-400" size={16} />
                  <span className="text-gray-900 dark:text-white">Unlimited Invoices</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheck className="text-green-600 dark:text-green-400" size={16} />
                  <span className="text-gray-900 dark:text-white">No Ads</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheck className="text-green-600 dark:text-green-400" size={16} />
                  <span className="text-gray-900 dark:text-white">Excel Export</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheck className="text-green-600 dark:text-green-400" size={16} />
                  <span className="text-gray-900 dark:text-white">Custom Logo</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheck className="text-green-600 dark:text-green-400" size={16} />
                  <span className="text-gray-900 dark:text-white">Priority Support</span>
                </li>
              </ul>
              <Button
                className="w-full"
                variant={selectedPlan === 'pro' ? 'default' : 'outline'}
                onClick={() => setSelectedPlan('pro')}
              >
                Select Pro
              </Button>
            </Card>

            {/* Max Plan */}
            <Card className={`relative transition-all border-2 ${selectedPlan === 'max' ? 'border-yellow-500 dark:border-yellow-400 shadow-lg' : 'border-yellow-200 dark:border-yellow-800'}`}>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-yellow-500 dark:bg-yellow-400 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Best Value
                </span>
              </div>
              <div className="absolute top-4 right-4">
                {selectedPlan === 'max' && (
                  <span className="bg-yellow-500 dark:bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Selected
                  </span>
                )}
              </div>
              <div className="text-center mb-8 pt-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Max</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">₹1,499</span>
                  <span className="text-gray-600 dark:text-gray-400"> one-time</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Lifetime access</p>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <FiCheck className="text-green-600 dark:text-green-400" size={16} />
                  <span className="text-gray-900 dark:text-white">Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheck className="text-green-600 dark:text-green-400" size={16} />
                  <span className="text-gray-900 dark:text-white">Lifetime Access</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheck className="text-green-600 dark:text-green-400" size={16} />
                  <span className="text-gray-900 dark:text-white">API Access</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheck className="text-green-600 dark:text-green-400" size={16} />
                  <span className="text-gray-900 dark:text-white">White Label</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheck className="text-green-600 dark:text-green-400" size={16} />
                  <span className="text-gray-900 dark:text-white">Future Features</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiInfinity className="text-yellow-600 dark:text-yellow-400" size={16} />
                  <span className="text-gray-900 dark:text-white font-semibold">No Renewals</span>
                </li>
              </ul>
              <Button
                className="w-full bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600"
                variant={selectedPlan === 'max' ? 'default' : 'outline'}
                onClick={() => setSelectedPlan('max')}
              >
                Select Max
              </Button>
            </Card>
          </div>

          {/* Upgrade Button */}
          <div className="max-w-md mx-auto">
            <Card>
              <div className="text-center py-8">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => handleUpgrade(selectedPlan)}
                  isLoading={isProcessing}
                  disabled={!razorpayLoaded}
                >
                  {selectedPlan === 'pro' ? 'Upgrade to Pro - ₹149/month' : 'Upgrade to Max - ₹1,499 one-time'}
                </Button>
                {selectedPlan === 'pro' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Cancel anytime</p>
                )}
                {selectedPlan === 'max' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">One-time payment, lifetime access</p>
                )}
              </div>
            </Card>
          </div>

          {/* Personalized Plan */}
          <Card className="mt-12 max-w-2xl mx-auto border-2 border-purple-500 dark:border-purple-400">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="text-purple-600 dark:text-purple-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Need a Custom Solution?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Contact us for personalized pricing and features tailored to your business needs.
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

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiZap className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">No Ads</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enjoy an ad-free experience</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiFileText className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Multiple Templates</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Choose from 4 professional templates</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiDownload className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Excel Export</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Export all your data to Excel</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default function UpgradePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    }>
      <UpgradeContent />
    </Suspense>
  )
}
