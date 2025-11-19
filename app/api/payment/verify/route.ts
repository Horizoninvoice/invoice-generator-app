import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    }

    // Verify payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Fetch order details
    const order = await razorpay.orders.fetch(razorpay_order_id)
    const userId = order.notes?.user_id
    const plan = order.notes?.plan

    if (userId !== user.id) {
      return NextResponse.json({ error: 'Order does not belong to user' }, { status: 403 })
    }

    // Verify payment status
    const payment = await razorpay.payments.fetch(razorpay_payment_id)
    
    if (payment.status !== 'captured') {
      return NextResponse.json({ error: 'Payment not captured' }, { status: 400 })
    }

    // Update user profile
    const updateData: any = {
      subscription_id: razorpay_payment_id,
      subscription_status: 'active',
    }

    if (plan === 'max') {
      updateData.role = 'max'
      updateData.subscription_type = 'max_lifetime'
    } else if (plan === 'pro') {
      updateData.role = 'pro'
      updateData.subscription_type = 'pro_monthly'
      updateData.subscription_end_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error updating user profile:', updateError)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    // Record payment in payments table
    await supabase.from('payments').insert({
      user_id: user.id,
      amount: payment.amount / 100, // Convert from paise to rupees
      status: 'completed',
      payment_method: 'razorpay',
      transaction_id: razorpay_payment_id,
      payment_date: new Date().toISOString().split('T')[0],
      notes: JSON.stringify({ order_id: razorpay_order_id, plan: plan, currency: payment.currency }),
    })

    return NextResponse.json({ 
      success: true, 
      plan,
      message: 'Payment verified and account upgraded successfully' 
    })
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return NextResponse.json({ error: error.message || 'Failed to verify payment' }, { status: 500 })
  }
}

