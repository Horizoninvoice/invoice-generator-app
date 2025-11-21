import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Initialize Razorpay only if keys are available
let razorpay: Razorpay | null = null
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user_id } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing payment verification data' }),
      }
    }

    // Verify the signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(text)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid payment signature' }),
      }
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id)

    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Payment not successful' }),
      }
    }

    // Determine plan from amount
    const amount = payment.amount
    let plan = 'free'
    let subscriptionType = 'free'
    let role = 'user'

    if (amount === 14900) {
      // Pro monthly - ₹149
      plan = 'pro'
      subscriptionType = 'pro_monthly'
      role = 'pro'
    } else if (amount === 149900) {
      // Max lifetime - ₹1,499
      plan = 'max'
      subscriptionType = 'max_lifetime'
      role = 'max'
    }

    // Update user profile in Supabase
    if (user_id) {
      const subscriptionEndDate =
        subscriptionType === 'pro_monthly'
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          : null // Lifetime for max

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          role: role,
          subscription_type: subscriptionType,
          subscription_end_date: subscriptionEndDate,
        })
        .eq('user_id', user_id)

      if (updateError) {
        console.error('Error updating user profile:', updateError)
        // Don't fail the verification if profile update fails
      }

      // Record payment in payments table (if it exists)
      try {
        await supabase.from('payments').insert({
          user_id: user_id,
          razorpay_order_id: razorpay_order_id,
          razorpay_payment_id: razorpay_payment_id,
          amount: amount / 100, // Convert from paise to rupees
          currency: payment.currency,
          status: payment.status,
          plan: plan,
          created_at: new Date().toISOString(),
        })
      } catch (error) {
        // Payments table might not exist, that's okay
        console.log('Payments table not found or error inserting:', error)
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Payment verified and account upgraded successfully',
        payment_id: razorpay_payment_id,
        plan: plan,
      }),
    }
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message || 'Failed to verify payment' }),
    }
  }
}

