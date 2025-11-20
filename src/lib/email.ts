// Email utility functions
import { supabase } from './supabase'

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// For now, we'll use a simple approach with mailto links
// In production, you'd use a service like SendGrid, Resend, or Supabase Edge Functions
export async function sendInvoiceEmail(
  invoiceId: string,
  customerEmail: string,
  invoiceNumber: string
): Promise<boolean> {
  try {
    // Get invoice data
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*, customers(email, name)')
      .eq('id', invoiceId)
      .single()

    if (invoiceError || !invoice) {
      throw new Error('Invoice not found')
    }

    // Create email subject and body
    const subject = `Invoice #${invoiceNumber} from ${invoice.customers?.name || 'Your Company'}`
    const body = `Please find attached invoice #${invoiceNumber}.\n\nThank you for your business!`

    // For now, open mailto link
    // In production, implement server-side email sending
    const mailtoLink = `mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink)

    // Update invoice status to 'sent'
    await supabase
      .from('invoices')
      .update({ status: 'sent' })
      .eq('id', invoiceId)

    return true
  } catch (error) {
    console.error('Email error:', error)
    return false
  }
}

// Future: Implement with server-side email service
export async function sendInvoiceEmailViaAPI(
  invoiceId: string,
  customerEmail: string,
  pdfUrl?: string
): Promise<boolean> {
  // This would call your API endpoint that uses SendGrid, Resend, etc.
  try {
    const response = await fetch('/api/email/send-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoice_id: invoiceId,
        to: customerEmail,
        pdf_url: pdfUrl,
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Email API error:', error)
    return false
  }
}

