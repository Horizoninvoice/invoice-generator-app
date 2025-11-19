'use client'

import { Invoice, Customer, InvoiceItem } from '@/lib/types'
import { ProfessionalTemplate } from '@/components/invoices/templates/ProfessionalTemplate'

interface TemplatePreviewProps {
  template: 'professional' | 'default' | 'modern' | 'classic' | 'minimal'
  isHovered?: boolean
}

const mockInvoice: Invoice = {
  id: '1',
  user_id: '1',
  invoice_number: 'INV-000001',
  customer_id: '1',
  issue_date: new Date().toISOString().split('T')[0],
  due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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

export function TemplatePreview({ template, isHovered = false }: TemplatePreviewProps) {
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  // Use Professional Template for professional template
  if (template === 'professional') {
    return (
      <div className={`transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'} transform origin-center`} style={{ transform: isHovered ? 'scale(0.75)' : 'scale(0.65)' }}>
        <ProfessionalTemplate
          invoice={mockInvoice}
          items={mockItems.slice(0, 2)}
          customer={mockCustomer}
          companyName="Horizon"
          companyEmail="info@horizon.com"
        />
      </div>
    )
  }

  const templateStyles = {
    default: {
      header: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
      accent: 'text-blue-600',
      border: 'border-blue-200',
      bg: 'bg-white',
    },
    modern: {
      header: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white',
      accent: 'text-purple-600',
      border: 'border-purple-200',
      bg: 'bg-gray-50',
    },
    classic: {
      header: 'bg-gradient-to-r from-gray-800 to-gray-900 text-white',
      accent: 'text-gray-800',
      border: 'border-gray-300',
      bg: 'bg-white',
    },
    minimal: {
      header: 'bg-gradient-to-r from-green-600 to-green-700 text-white',
      accent: 'text-green-600',
      border: 'border-green-200',
      bg: 'bg-white',
    },
  }

  const styles = templateStyles[template]

  return (
    <div className={`${styles.bg} rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${isHovered ? 'scale-105 shadow-2xl' : 'scale-100'}`}>
      {/* Header */}
      <div className={`${styles.header} p-6`}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-1">INVOICE</h2>
            <p className="text-sm opacity-90">Professional Invoice</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">#{mockInvoice.invoice_number}</p>
            <p className="text-xs opacity-90">{formatDate(mockInvoice.issue_date)}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Bill To */}
        <div>
          <h3 className={`text-sm font-semibold ${styles.accent} mb-2`}>Bill To:</h3>
          <p className="text-sm font-medium text-gray-900">{mockCustomer.name}</p>
          <p className="text-xs text-gray-600">{mockCustomer.address}</p>
          <p className="text-xs text-gray-600">{mockCustomer.city}, {mockCustomer.state} {mockCustomer.zip_code}</p>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={`${styles.header} text-white`}>
                <th className="text-left p-2">Description</th>
                <th className="text-center p-2">Qty</th>
                <th className="text-right p-2">Price</th>
                <th className="text-right p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {mockItems.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-2">{item.description}</td>
                  <td className="p-2 text-center">{item.quantity}</td>
                  <td className="p-2 text-right">{formatCurrency(item.unit_price)}</td>
                  <td className="p-2 text-right font-medium">{formatCurrency(item.line_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t-2 border-gray-200 pt-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatCurrency(mockInvoice.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax:</span>
            <span className="font-medium">{formatCurrency(mockInvoice.tax_amount)}</span>
          </div>
          <div className={`flex justify-between text-base font-bold ${styles.accent} pt-2 border-t ${styles.border}`}>
            <span>Total:</span>
            <span>{formatCurrency(mockInvoice.total_amount)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
