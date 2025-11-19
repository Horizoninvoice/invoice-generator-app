'use client'

import { formatCurrency, formatDate } from '@/lib/utils'
import type { Invoice, InvoiceItem, Customer } from '@/lib/types'

interface MinimalTemplateProps {
  invoice: Invoice
  items: InvoiceItem[]
  customer?: Customer
  companyName?: string
  theme?: 'green' | 'emerald' | 'lime' | 'cyan'
}

const themes = {
  green: {
    accent: 'text-green-600',
    border: 'border-green-200',
    divider: 'border-green-300',
  },
  emerald: {
    accent: 'text-emerald-600',
    border: 'border-emerald-200',
    divider: 'border-emerald-300',
  },
  lime: {
    accent: 'text-lime-600',
    border: 'border-lime-200',
    divider: 'border-lime-300',
  },
  cyan: {
    accent: 'text-cyan-600',
    border: 'border-cyan-200',
    divider: 'border-cyan-300',
  },
}

export function MinimalTemplate({
  invoice,
  items,
  customer,
  companyName = 'Horizon',
  theme = 'green',
}: MinimalTemplateProps) {
  const colors = themes[theme]

  return (
    <div className="bg-white text-gray-900">
      {/* Minimal Header - Just Top Border */}
      <div className="border-t-4 border-b border-gray-200 py-6 px-8">
        <div className="flex justify-between items-baseline">
          <div>
            <h1 className="text-2xl font-light text-gray-900">{companyName}</h1>
            <p className="text-xs text-gray-500 mt-1">Invoice</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">#{invoice.invoice_number}</p>
            <p className="text-xs text-gray-500 mt-1">{formatDate(invoice.issue_date)}</p>
          </div>
        </div>
      </div>

      {/* Minimal Content - Clean Spacing */}
      <div className="px-8 py-8">
        {/* Single Column Layout - Very Clean */}
        <div className="mb-10">
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Bill To</p>
            <p className="text-lg font-medium text-gray-900">{customer?.name || 'Customer Name'}</p>
            {customer?.address && <p className="text-sm text-gray-600 mt-1">{customer.address}</p>}
            {(customer?.city || customer?.state) && (
              <p className="text-sm text-gray-600">
                {customer.city}, {customer.state} {customer.zip_code}
              </p>
            )}
          </div>
        </div>

        {/* Minimal Table - No Backgrounds */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className={`border-b-2 ${colors.divider}`}>
                <th className="text-left py-4 px-2 text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Description
                </th>
                <th className="text-center py-4 px-2 text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Qty
                </th>
                <th className="text-right py-4 px-2 text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Price
                </th>
                <th className="text-right py-4 px-2 text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className={`border-b ${colors.border}`}>
                  <td className="py-4 px-2 text-sm text-gray-900">{item.description}</td>
                  <td className="py-4 px-2 text-sm text-center text-gray-600">{item.quantity}</td>
                  <td className="py-4 px-2 text-sm text-right text-gray-600">
                    {formatCurrency(item.unit_price, invoice.currency)}
                  </td>
                  <td className="py-4 px-2 text-sm text-right font-medium text-gray-900">
                    {formatCurrency(item.line_total, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Minimal Summary - Simple List */}
        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
            </div>
            {invoice.tax_amount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">{formatCurrency(invoice.tax_amount, invoice.currency)}</span>
              </div>
            )}
            <div className={`flex justify-between text-lg font-medium ${colors.accent} pt-3 border-t ${colors.divider}`}>
              <span>Total</span>
              <span>{formatCurrency(invoice.total_amount, invoice.currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

