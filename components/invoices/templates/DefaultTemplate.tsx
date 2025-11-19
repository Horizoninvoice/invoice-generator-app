'use client'

import { formatCurrency, formatDate } from '@/lib/utils'
import type { Invoice, InvoiceItem, Customer } from '@/lib/types'

interface DefaultTemplateProps {
  invoice: Invoice
  items: InvoiceItem[]
  customer?: Customer
  companyName?: string
  theme?: 'blue' | 'green' | 'purple' | 'orange'
}

const themes = {
  blue: {
    header: 'bg-gradient-to-r from-blue-600 to-blue-700',
    accent: 'text-blue-600',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    tableHeader: 'bg-blue-600',
  },
  green: {
    header: 'bg-gradient-to-r from-green-600 to-green-700',
    accent: 'text-green-600',
    border: 'border-green-200',
    bg: 'bg-green-50',
    tableHeader: 'bg-green-600',
  },
  purple: {
    header: 'bg-gradient-to-r from-purple-600 to-purple-700',
    accent: 'text-purple-600',
    border: 'border-purple-200',
    bg: 'bg-purple-50',
    tableHeader: 'bg-purple-600',
  },
  orange: {
    header: 'bg-gradient-to-r from-orange-600 to-orange-700',
    accent: 'text-orange-600',
    border: 'border-orange-200',
    bg: 'bg-orange-50',
    tableHeader: 'bg-orange-600',
  },
}

export function DefaultTemplate({
  invoice,
  items,
  customer,
  companyName = 'Horizon',
  theme = 'blue',
}: DefaultTemplateProps) {
  const colors = themes[theme]

  return (
    <div className="bg-white text-gray-900">
      {/* Sidebar Layout - Different from Professional */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className={`w-48 ${colors.header} text-white p-6 flex flex-col justify-between`}>
          <div>
            <h1 className="text-3xl font-bold mb-2 uppercase">{companyName}</h1>
            <div className="mt-8 space-y-2 text-sm">
              <p className="opacity-90">Invoice #{invoice.invoice_number}</p>
              <p className="opacity-90">{formatDate(invoice.issue_date)}</p>
            </div>
          </div>
          <div className="text-xs opacity-75">
            <p>Professional Invoice</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Top Section - Invoice Details Right Aligned */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className={`text-sm font-semibold ${colors.accent} mb-3`}>Bill To:</h2>
              <p className="text-lg font-bold text-gray-900">{customer?.name || 'Customer Name'}</p>
              {customer?.address && <p className="text-sm text-gray-600">{customer.address}</p>}
              {(customer?.city || customer?.state) && (
                <p className="text-sm text-gray-600">
                  {customer.city}, {customer.state} {customer.zip_code}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className={`inline-block ${colors.bg} px-4 py-2 rounded-lg`}>
                <p className="text-xs text-gray-600">Total Amount</p>
                <p className={`text-2xl font-bold ${colors.accent}`}>
                  {formatCurrency(invoice.total_amount, invoice.currency)}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className={`${colors.tableHeader} text-white`}>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Description</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm">Qty</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Price</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : colors.bg}>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.description}</td>
                    <td className="py-3 px-4 text-sm text-center text-gray-700">{item.quantity}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-700">
                      {formatCurrency(item.unit_price, invoice.currency)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                      {formatCurrency(item.line_total, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary - Left Aligned */}
          <div className="flex justify-start">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              {invoice.tax_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(invoice.tax_amount, invoice.currency)}
                  </span>
                </div>
              )}
              <div className={`flex justify-between text-lg font-bold ${colors.accent} pt-2 border-t-2 ${colors.border}`}>
                <span>Total:</span>
                <span>{formatCurrency(invoice.total_amount, invoice.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

