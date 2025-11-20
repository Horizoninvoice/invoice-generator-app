'use client'

import { useMemo } from 'react'
import { ProfessionalTemplate } from './templates/ProfessionalTemplate'
import { DefaultTemplate } from './templates/DefaultTemplate'
import { ModernTemplate } from './templates/ModernTemplate'
import { ClassicTemplate } from './templates/ClassicTemplate'
import { MinimalTemplate } from './templates/MinimalTemplate'
import type { Invoice, InvoiceItem, Customer } from '@/lib/types'

interface InvoiceLivePreviewProps {
  formData: {
    invoice_number: string
    customer_id: string
    issue_date: string
    due_date: string
    status: string
    currency: string
    notes: string
    terms: string
    template: string
  }
  items: Array<{
    id: string
    description: string
    quantity: number
    unit_price: number
    tax_rate: number
    line_total: number
  }>
  customers: Array<{ id: string; name: string; email?: string; phone?: string; address?: string; city?: string; state?: string; zip_code?: string }>
  subtotal: number
  taxAmount: number
  total: number
}

export function InvoiceLivePreview({
  formData,
  items,
  customers,
  subtotal,
  taxAmount,
  total,
}: InvoiceLivePreviewProps) {
  const selectedCustomer = useMemo(() => {
    return customers.find(c => c.id === formData.customer_id)
  }, [customers, formData.customer_id])

  const mockInvoice: Invoice = useMemo(() => ({
    id: 'preview',
    user_id: 'preview',
    invoice_number: formData.invoice_number || 'INV-000001',
    customer_id: formData.customer_id || undefined,
    issue_date: formData.issue_date,
    due_date: formData.due_date || undefined,
    status: formData.status as any,
    subtotal,
    tax_amount: taxAmount,
    discount_amount: 0,
    total_amount: total,
    currency: formData.currency,
    notes: formData.notes,
    terms: formData.terms,
    template: formData.template,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }), [formData, subtotal, taxAmount, total])

  const mockItems: InvoiceItem[] = useMemo(() => {
    return items.map(item => ({
      id: item.id,
      invoice_id: 'preview',
      product_id: undefined,
      description: item.description || 'Item description',
      quantity: item.quantity || 1,
      unit_price: item.unit_price || 0,
      tax_rate: item.tax_rate || 0,
      line_total: item.line_total || 0,
      created_at: new Date().toISOString(),
    }))
  }, [items])

  const mockCustomer: Customer | undefined = selectedCustomer ? {
    id: selectedCustomer.id,
    user_id: 'preview',
    name: selectedCustomer.name,
    email: selectedCustomer.email,
    phone: selectedCustomer.phone,
    address: selectedCustomer.address,
    city: selectedCustomer.city,
    state: selectedCustomer.state,
    zip_code: selectedCustomer.zip_code,
    country: undefined,
    tax_id: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } : undefined

  const renderTemplate = () => {
    switch (formData.template) {
      case 'professional':
        return (
          <ProfessionalTemplate
            invoice={mockInvoice}
            items={mockItems}
            customer={mockCustomer}
            companyName="Horizon"
            companyEmail="info@horizon.com"
          />
        )
      case 'default':
        return (
          <DefaultTemplate
            invoice={mockInvoice}
            items={mockItems}
            customer={mockCustomer}
            companyName="Horizon"
          />
        )
      case 'modern':
        return (
          <ModernTemplate
            invoice={mockInvoice}
            items={mockItems}
            customer={mockCustomer}
            companyName="Horizon"
          />
        )
      case 'classic':
        return (
          <ClassicTemplate
            invoice={mockInvoice}
            items={mockItems}
            customer={mockCustomer}
            companyName="Horizon"
          />
        )
      case 'minimal':
        return (
          <MinimalTemplate
            invoice={mockInvoice}
            items={mockItems}
            customer={mockCustomer}
            companyName="Horizon"
          />
        )
      default:
        return (
          <ProfessionalTemplate
            invoice={mockInvoice}
            items={mockItems}
            customer={mockCustomer}
            companyName="Horizon"
            companyEmail="info@horizon.com"
          />
        )
    }
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-[800px] border border-gray-200 dark:border-gray-700">
      <div className="bg-white transform scale-[0.65] origin-top-left" style={{ width: '153.85%' }}>
        {renderTemplate()}
      </div>
    </div>
  )
}

