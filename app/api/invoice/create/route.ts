import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Generate invoice number if not provided
    let invoiceNumber = body.invoice_number
    if (!invoiceNumber) {
      const { count } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
      invoiceNumber = `INV-${String((count || 0) + 1).padStart(6, '0')}`
    }

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        ...body,
        invoice_number: invoiceNumber,
        user_id: user.id,
      })
      .select()
      .single()

    if (invoiceError) throw invoiceError

    // Insert invoice items if provided
    if (body.items && body.items.length > 0) {
      const invoiceItems = body.items.map((item: any) => ({
        ...item,
        invoice_id: invoice.id,
      }))

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItems)

      if (itemsError) throw itemsError
    }

    return NextResponse.json({ invoice })
  } catch (error: any) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

