import type { VercelRequest, VercelResponse } from '@vercel/node'
import Razorpay from 'razorpay'

// Initialize Razorpay only if keys are available
let razorpay: Razorpay | null = null
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check if Razorpay is configured
  if (!razorpay) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    return res.status(503).json({
      error: 'Payment gateway not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.',
    })
  }

  try {
    console.log('Payment create function called')
    console.log('Request body:', req.body)
    console.log('Environment check:', {
      hasRazorpayKeyId: !!process.env.RAZORPAY_KEY_ID,
      hasRazorpayKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
    })
    
    const { plan, user_id } = req.body
    
    console.log('Parsed body:', { plan, user_id })

    if (!plan || (plan !== 'pro' && plan !== 'max')) {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Content-Type', 'application/json')
      return res.status(400).json({ error: 'Invalid plan. Must be "pro" or "max"' })
    }

    if (!user_id) {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Content-Type', 'application/json')
      return res.status(400).json({ error: 'User ID is required' })
    }

    // Plan pricing in paise (smallest currency unit)
    const planAmounts = {
      pro: 24900, // ₹249.00 in paise
      max: 149900, // ₹1,499.00 in paise
    }

    const amount = planAmounts[plan as 'pro' | 'max']
    const currency = 'INR'

    // Create Razorpay order
    // Receipt must be max 40 characters - use short format
    const shortUserId = user_id.substring(0, 8) // First 8 chars of user ID
    const timestamp = Date.now().toString().slice(-8) // Last 8 digits of timestamp
    const receipt = `${plan}_${shortUserId}_${timestamp}` // Format: pro_1b2465c1_37146148 (max 40 chars)
    
    const options = {
      amount: amount,
      currency: currency,
      receipt: receipt,
      notes: {
        plan: plan,
        user_id: user_id,
      },
    }

    console.log('Creating Razorpay order with options:', {
      amount,
      currency,
      receipt: options.receipt,
      key_id: process.env.RAZORPAY_KEY_ID?.substring(0, 10) + '...', // Log partial key for debugging
    })
    
    let order
    try {
      order = await razorpay.orders.create(options)
      console.log('Razorpay order created successfully:', {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
      })
    } catch (razorpayError: any) {
      console.error('Razorpay API error:', razorpayError)
      
      // Extract error message from Razorpay error object
      let errorMessage = 'Razorpay API error'
      if (razorpayError.error?.description) {
        errorMessage = razorpayError.error.description
      } else if (razorpayError.description) {
        errorMessage = razorpayError.description
      } else if (razorpayError.message) {
        errorMessage = razorpayError.message
      }
      
      console.error('Razorpay error details:', {
        message: razorpayError.message,
        description: razorpayError.description || razorpayError.error?.description,
        code: razorpayError.error?.code,
        field: razorpayError.field,
        source: razorpayError.source || razorpayError.error?.source,
        step: razorpayError.step || razorpayError.error?.step,
        reason: razorpayError.reason || razorpayError.error?.reason,
        metadata: razorpayError.metadata || razorpayError.error?.metadata,
        fullError: razorpayError,
      })
      
      throw new Error(errorMessage)
    }

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error: any) {
    console.error('Razorpay order creation error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      response: error.response?.data || error.response,
    })
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json({ 
      error: error.message || 'Failed to create payment order',
      details: error.response?.data || error.response || 'Unknown error',
    })
  }
}
