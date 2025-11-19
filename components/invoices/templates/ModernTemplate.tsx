'use client'

import { formatCurrency, formatDate } from '@/lib/utils'
import type { Invoice, InvoiceItem, Customer } from '@/lib/types'

interface ModernTemplateProps {
  invoice: Invoice
  items: InvoiceItem[]
  customer?: Customer
  companyName?: string
  theme?: 'purple' | 'pink' | 'indigo' | 'teal'
}

const themes = {
  purple: {
    header: 'bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800',
    accent: 'text-purple-600',
    border: 'border-purple-300',
    card: 'bg-purple-50',
    tableHeader: 'bg-purple-600',
  },
  pink: {
    header: 'bg-gradient-to-br from-pink-600 via-pink-700 to-pink-800',
    accent: 'text-pink-600',
    border: 'border-pink-300',
    card: 'bg-pink-50',
    tableHeader: 'bg-pink-600',
  },
  indigo: {
    header: 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800',
    accent: 'text-indigo-600',
    border: 'border-indigo-300',
    card: 'bg-indigo-50',
    tableHeader: 'bg-indigo-600',
  },
  teal: {
    header: 'bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800',
    accent: 'text-teal-600',
    border: 'border-teal-300',
    card: 'bg-teal-50',
    tableHeader: 'bg-teal-600',
  },
}

export function ModernTemplate({
  invoice,
  items,
  customer,
  companyName = 'Horizon',
  theme = 'purple',
}: ModernTemplateProps) {
  const colors = themes[theme]

  return (
    <div className="bg-white text-gray-900">
      {/* Centered Header Layout - Different Structure */}
      <div className={`${colors.header} text-white py-8 px-8`}>
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 uppercase tracking-wide">{companyName}</h1>
          <p className="text-lg opacity-90">INVOICE</p>
        </div>
        <div className="flex justify-center gap-8 text-sm">
          <div>
            <p className="opacity-75">Invoice #</p>
            <p className="font-semibold">{invoice.invoice_number}</p>
          </div>
          <div>
            <p className="opacity-75">Date</p>
            <p className="font-semibold">{formatDate(invoice.issue_date)}</p>
          </div>
        </div>
      </div>

      {/* Main Content - Centered Layout */}
      <div className="px-8 py-6">
        {/* Customer and Company Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className={`${colors.card} p-4 rounded-lg border ${colors.border}`}>
            <h3 className={`text-sm font-semibold ${colors.accent} mb-2 uppercase`}>Bill To</h3>
            <p className="font-bold text-gray-900">{customer?.name || 'Customer Name'}</p>
            {customer?.address && <p className="text-sm text-gray-600">{customer.address}</p>}
            {(customer?.city || customer?.state) && (
              <p className="text-sm text-gray-600">
                {customer.city}, {customer.state} {customer.zip_code}
              </p>
            )}
          </div>
          <div className={`${colors.card} p-4 rounded-lg border ${colors.border}`}>
            <h3 className={`text-sm font-semibold ${colors.accent} mb-2 uppercase`}>From</h3>
            <p className="font-bold text-gray-900">{companyName}</p>
            <p className="text-sm text-gray-600">Professional Services</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className={`${colors.tableHeader} text-white`}>
                <th className="text-left py-4 px-6 font-bold text-sm">Item</th>
                <th className="text-center py-4 px-6 font-bold text-sm">Quantity</th>
                <th className="text-right py-4 px-6 font-bold text-sm">Unit Price</th>
                <th className="text-right py-4 px-6 font-bold text-sm">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : colors.card}>
                  <td className="py-4 px-6 text-sm text-gray-900 font-medium">{item.description}</td>
                  <td className="py-4 px-6 text-sm text-center text-gray-700">{item.quantity}</td>
                  <td className="py-4 px-6 text-sm text-right text-gray-700">
                    {formatCurrency(item.unit_price, invoice.currency)}
                  </td>
                  <td className="py-4 px-6 text-sm text-right font-bold text-gray-900">
                    {formatCurrency(item.line_total, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary - Right Aligned with Card */}
        <div className="flex justify-end">
          <div className={`w-80 ${colors.card} p-6 rounded-lg border ${colors.border}`}>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              {invoice.tax_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(invoice.tax_amount, invoice.currency)}
                  </span>
                </div>
              )}
              <div className={`flex justify-between text-xl font-bold ${colors.accent} pt-3 border-t-2 ${colors.border}`}>
                <span>Total</span>
                <span>{formatCurrency(invoice.total_amount, invoice.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

