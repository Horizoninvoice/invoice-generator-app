// Payment API utilities
// Note: In a Vite app, API routes would typically be handled by a separate backend
// For now, we'll create placeholder functions that can be connected to your backend

export async function createPaymentOrder(plan: 'pro' | 'max', userId: string) {
  // Get API base URL - use Netlify Functions path
  const apiBaseUrl = import.meta.env.VITE_API_URL || window.location.origin
  const response = await fetch(`${apiBaseUrl}/.netlify/functions/payment/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, user_id: userId }),
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
  user_id: string
}) {
  // Get API base URL - use Netlify Functions path
  const apiBaseUrl = import.meta.env.VITE_API_URL || window.location.origin
  const response = await fetch(`${apiBaseUrl}/.netlify/functions/payment/verify`, {
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

