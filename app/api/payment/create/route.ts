import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

const PLAN_PRICES = {
  pro: 14900, // ₹149.00 in paise
  max: 149900, // ₹1,499.00 in paise
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await request.json()

    if (plan !== 'pro' && plan !== 'max') {
      return NextResponse.json({ error: 'Invalid plan. Must be "pro" or "max"' }, { status: 400 })
    }

    // Get user's country and currency
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('country, currency')
      .eq('user_id', user.id)
      .single()

    const currency = profile?.currency || 'INR'
    const amount = PLAN_PRICES[plan as keyof typeof PLAN_PRICES]

    // Create Razorpay order
    const options = {
      amount: amount,
      currency: currency,
      receipt: `${plan}_${user.id}_${Date.now()}`,
      notes: {
        user_id: user.id,
        plan: plan,
        subscription_type: plan === 'pro' ? 'pro_monthly' : 'max_lifetime',
      },
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 })
  }
}
