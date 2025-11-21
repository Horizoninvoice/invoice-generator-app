import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import Razorpay from 'razorpay'

// Initialize Razorpay only if keys are available
let razorpay: Razorpay | null = null
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  // Check if Razorpay is configured
  if (!razorpay) {
    return {
      statusCode: 503,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Payment gateway not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.',
      }),
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const { plan, user_id } = body

    if (!plan || (plan !== 'pro' && plan !== 'max')) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid plan. Must be "pro" or "max"' }),
      }
    }

    if (!user_id) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'User ID is required' }),
      }
    }

    // Plan pricing in paise (smallest currency unit)
    const planAmounts = {
      pro: 24900, // ₹249.00 in paise
      max: 149900, // ₹1,499.00 in paise
    }

    const amount = planAmounts[plan as 'pro' | 'max']
    const currency = 'INR'

    // Create Razorpay order
    const options = {
      amount: amount,
      currency: currency,
      receipt: `receipt_${user_id}_${Date.now()}`,
      notes: {
        plan: plan,
        user_id: user_id,
      },
    }

    const order = await razorpay.orders.create(options)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      }),
    }
  } catch (error: any) {
    console.error('Razorpay order creation error:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message || 'Failed to create payment order' }),
    }
  }
}

