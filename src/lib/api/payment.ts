// Payment API utilities
// Note: In a Vite app, API routes would typically be handled by a separate backend
// For now, we'll create placeholder functions that can be connected to your backend

export async function createPaymentOrder(plan: 'pro' | 'max') {
  // This should call your backend API
  // For now, return a mock response structure
  const response = await fetch('/api/payment/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create payment order')
  }

  return response.json()
}

export async function verifyPayment(paymentData: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}) {
  const response = await fetch('/api/payment/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Payment verification failed')
  }

  return response.json()
}

