import type { VercelRequest, VercelResponse } from '@vercel/node'
import Razorpay from 'razorpay'
import crypto from 'crypto'

// Initialize Razorpay only if keys are available
let razorpay: Razorpay | null = null
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check if Razorpay is configured
  if (!razorpay) {
    return res.status(503).json({ 
      error: 'Payment gateway not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.' 
    })
  }

  try {
    const { plan } = req.body

    if (!plan || (plan !== 'pro' && plan !== 'max')) {
      return res.status(400).json({ error: 'Invalid plan. Must be "pro" or "max"' })
    }

    // Extract user ID from request body
    // In production, you should verify the Supabase JWT token from Authorization header
    const userId = req.body.user_id
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    // Plan pricing in paise (smallest currency unit)
    const planAmounts = {
      pro: 14900, // ₹149.00 in paise
      max: 149900, // ₹1,499.00 in paise
    }

    const amount = planAmounts[plan as 'pro' | 'max']
    const currency = 'INR'

    // Create Razorpay order
    const options = {
      amount: amount,
      currency: currency,
      receipt: `receipt_${userId}_${Date.now()}`,
      notes: {
        plan: plan,
        user_id: userId,
      },
    }

    const order = await razorpay.orders.create(options)

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error: any) {
    console.error('Razorpay order creation error:', error)
    res.status(500).json({ error: error.message || 'Failed to create payment order' })
  }
}

