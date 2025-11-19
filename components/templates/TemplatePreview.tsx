'use client'

import { Invoice, Customer, InvoiceItem } from '@/lib/types'
import { ProfessionalTemplate } from '@/components/invoices/templates/ProfessionalTemplate'
import { DefaultTemplate } from '@/components/invoices/templates/DefaultTemplate'
import { ModernTemplate } from '@/components/invoices/templates/ModernTemplate'
import { ClassicTemplate } from '@/components/invoices/templates/ClassicTemplate'
import { MinimalTemplate } from '@/components/invoices/templates/MinimalTemplate'

interface TemplatePreviewProps {
  template: 'professional' | 'default' | 'modern' | 'classic' | 'minimal'
  isHovered?: boolean
  theme?: string
}

// Set date to Nov 19, 2025
const mockDate = new Date('2025-11-19')

const mockInvoice: Invoice = {
  id: '1',
  user_id: '1',
  invoice_number: 'INV-000001',
  customer_id: '1',
  issue_date: mockDate.toISOString().split('T')[0],
  due_date: new Date(mockDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: 'sent',
  subtotal: 8530,
  tax_amount: 120.70,
  discount_amount: 0,
  total_amount: 8650.70,
  currency: 'USD',
  notes: 'Thank you for your business!',
  terms: 'Payment due within 30 days.',
  template: 'professional',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const mockCustomer: Customer = {
  id: '1',
  user_id: '1',
  name: 'JOHN SMITH',
  email: 'john@example.com',
  phone: '+55 12345678',
  address: '123 Street, Town/City',
  city: 'County',
  state: '',
  zip_code: '',
  country: 'USA',
  tax_id: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const mockItems: InvoiceItem[] = [
  {
    id: '1',
    invoice_id: '1',
    product_id: null,
    description: 'Web Design - Contrary to popular belief Lorem Ipsum simply random',
    quantity: 2,
    unit_price: 750,
    tax_rate: 0,
    line_total: 1500,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    invoice_id: '1',
    product_id: null,
    description: 'Branding Design - popular belief Lorem Ipsum not ipsum simply',
    quantity: 1,
    unit_price: 1300,
    tax_rate: 0,
    line_total: 1300,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    invoice_id: '1',
    product_id: null,
    description: 'Web Development - Contrary to popular belief Lorem Ipsum not',
    quantity: 4,
    unit_price: 300,
    tax_rate: 0,
    line_total: 1200,
    created_at: new Date().toISOString(),
  },
]

export function TemplatePreview({ template, isHovered = false, theme }: TemplatePreviewProps) {
  const scale = isHovered ? 0.75 : 0.65

  // Professional Template - Different layout with dark header
  if (template === 'professional') {
    const professionalTheme = (theme as 'yellow' | 'amber' | 'orange' | 'red') || 'yellow'
    return (
      <div
        className="transition-all duration-300 transform origin-center"
        style={{ transform: `scale(${scale})` }}
      >
        <ProfessionalTemplate
          invoice={mockInvoice}
          items={mockItems}
          customer={mockCustomer}
          companyName="Horizon"
          companyEmail="info@horizon.com"
          theme={professionalTheme}
        />
      </div>
    )
  }

  // Default Template - Sidebar layout
  if (template === 'default') {
    const defaultTheme = (theme as 'blue' | 'green' | 'purple' | 'orange') || 'blue'
    return (
      <div
        className="transition-all duration-300 transform origin-center"
        style={{ transform: `scale(${scale})` }}
      >
        <DefaultTemplate
          invoice={mockInvoice}
          items={mockItems}
          customer={mockCustomer}
          companyName="Horizon"
          theme={defaultTheme}
        />
      </div>
    )
  }

  // Modern Template - Centered layout
  if (template === 'modern') {
    const modernTheme = (theme as 'purple' | 'pink' | 'indigo' | 'teal') || 'purple'
    return (
      <div
        className="transition-all duration-300 transform origin-center"
        style={{ transform: `scale(${scale})` }}
      >
        <ModernTemplate
          invoice={mockInvoice}
          items={mockItems}
          customer={mockCustomer}
          companyName="Horizon"
          theme={modernTheme}
        />
      </div>
    )
  }

  // Classic Template - Traditional two-column
  if (template === 'classic') {
    const classicTheme = (theme as 'gray' | 'slate' | 'zinc' | 'stone') || 'gray'
    return (
      <div
        className="transition-all duration-300 transform origin-center"
        style={{ transform: `scale(${scale})` }}
      >
        <ClassicTemplate
          invoice={mockInvoice}
          items={mockItems}
          customer={mockCustomer}
          companyName="Horizon"
          theme={classicTheme}
        />
      </div>
    )
  }

  // Minimal Template - Clean minimal layout
  if (template === 'minimal') {
    const minimalTheme = (theme as 'green' | 'emerald' | 'lime' | 'cyan') || 'green'
    return (
      <div
        className="transition-all duration-300 transform origin-center"
        style={{ transform: `scale(${scale})` }}
      >
        <MinimalTemplate
          invoice={mockInvoice}
          items={mockItems}
          customer={mockCustomer}
          companyName="Horizon"
          theme={minimalTheme}
        />
      </div>
    )
  }

  return null
}
