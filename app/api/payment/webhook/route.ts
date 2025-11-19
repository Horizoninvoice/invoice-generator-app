import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-razorpay-signature')!

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    console.error('Webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    const event = JSON.parse(body)

    switch (event.event) {
      case 'payment.captured': {
        const payment = event.payload.payment.entity
        const orderId = payment.order_id

        // Get order to extract user_id and plan from order notes
        try {
          const order = await razorpay.orders.fetch(orderId)
          const userId = order.notes?.user_id
          const plan = order.notes?.plan
          const subscriptionType = order.notes?.subscription_type

          if (userId) {
            const updateData: any = {
              subscription_id: payment.id,
              subscription_status: 'active',
            }

            if (plan === 'max') {
              // Max is lifetime, no end date
              updateData.role = 'max'
              updateData.subscription_type = 'max_lifetime'
            } else if (plan === 'pro') {
              // Pro is monthly, set end date to 30 days from now
              updateData.role = 'pro'
              updateData.subscription_type = 'pro_monthly'
              updateData.subscription_end_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }

            await supabase
              .from('user_profiles')
              .update(updateData)
              .eq('user_id', userId)
          }
        } catch (error) {
          console.error('Error fetching order details:', error)
        }
        break
      }

      case 'payment.failed': {
        console.log('Payment failed:', event.payload.payment.entity)
        break
      }

      case 'subscription.cancelled': {
        const subscription = event.payload.subscription.entity
        const userId = subscription.notes?.user_id

        if (userId) {
          const endedAt = subscription.ended_at ? subscription.ended_at * 1000 : Date.now()
          await supabase
            .from('user_profiles')
            .update({
              subscription_status: 'canceled',
              subscription_end_date: new Date(endedAt).toISOString(),
            })
            .eq('user_id', userId)

          // Downgrade to free after subscription ends
          const endDate = new Date(endedAt)
          if (endDate <= new Date()) {
            await supabase
              .from('user_profiles')
              .update({ 
                role: 'free',
                subscription_type: 'free',
              })
              .eq('user_id', userId)
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.event}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
