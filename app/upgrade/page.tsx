'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useUser } from '@/lib/hooks/useUser'
import { FiCrown, FiZap, FiShield, FiDownload, FiFileText } from 'react-icons/fi'
import toast from 'react-hot-toast'

declare global {
  interface Window {
    Razorpay: any
  }
}

function UpgradeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isPro, loading } = useUser()
  const [isProcessing, setIsProcessing] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Payment successful! Your account has been upgraded to Pro.')
      router.refresh()
    } else if (searchParams.get('failed') === 'true') {
      toast.error('Payment failed. Please try again.')
    }
  }, [searchParams, router])

  const handleUpgrade = async () => {
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
        body: JSON.stringify({ plan: 'pro' }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create payment order')
      }

      const { orderId, amount, currency, keyId } = await response.json()

      if (!orderId) {
        throw new Error('Failed to create payment order')
      }

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'InvoiceGen Pro',
        description: 'Pro subscription for InvoiceGen',
        order_id: orderId,
        handler: function (response: any) {
          // Payment successful
          if (response.razorpay_payment_id) {
            router.push('/upgrade?success=true')
          }
        },
        prefill: {
          email: user.email || '',
        },
        theme: {
          color: '#0ea5e9',
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (isPro) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <div className="text-center py-12">
              <FiCrown className="mx-auto text-primary-600 mb-4" size={64} />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">You're Already Pro!</h1>
              <p className="text-gray-600 mb-8">
                You have access to all Pro features. Thank you for your support!
              </p>
              <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <Crown className="mx-auto text-primary-600 mb-4" size={64} />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Upgrade to Pro</h1>
            <p className="text-xl text-gray-600">
              Unlock advanced features and take your invoicing to the next level
            </p>
          </div>

          <Card className="mb-8">
            <div className="text-center py-8">
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">₹999</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <Button size="lg" onClick={handleUpgrade} isLoading={isProcessing} disabled={!razorpayLoaded}>
                Upgrade Now
              </Button>
              <p className="text-sm text-gray-500 mt-4">Cancel anytime</p>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiZap className="text-primary-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">No Ads</h3>
                  <p className="text-sm text-gray-600">Enjoy an ad-free experience</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiFileText className="text-primary-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Unlimited Invoices</h3>
                  <p className="text-sm text-gray-600">Create as many invoices as you need</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiFileText className="text-primary-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Multiple Templates</h3>
                  <p className="text-sm text-gray-600">Choose from professional invoice templates</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiDownload className="text-primary-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Excel Export</h3>
                  <p className="text-sm text-gray-600">Export all your data to Excel</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiFileText className="text-primary-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Custom Logo</h3>
                  <p className="text-sm text-gray-600">Upload your company logo to invoices</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiShield className="text-primary-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Priority Support</h3>
                  <p className="text-sm text-gray-600">Get priority customer support</p>
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
      <div className="min-h-screen bg-gray-50">
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
