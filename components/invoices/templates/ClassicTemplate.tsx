'use client'

import { formatCurrency, formatDate } from '@/lib/utils'
import type { Invoice, InvoiceItem, Customer } from '@/lib/types'

interface ClassicTemplateProps {
  invoice: Invoice
  items: InvoiceItem[]
  customer?: Customer
  companyName?: string
  theme?: 'gray' | 'slate' | 'zinc' | 'stone'
}

const themes = {
  gray: {
    header: 'bg-gray-800',
    accent: 'text-gray-800',
    border: 'border-gray-300',
    bg: 'bg-gray-50',
    tableHeader: 'bg-gray-800',
    divider: 'border-gray-400',
  },
  slate: {
    header: 'bg-slate-800',
    accent: 'text-slate-800',
    border: 'border-slate-300',
    bg: 'bg-slate-50',
    tableHeader: 'bg-slate-800',
    divider: 'border-slate-400',
  },
  zinc: {
    header: 'bg-zinc-800',
    accent: 'text-zinc-800',
    border: 'border-zinc-300',
    bg: 'bg-zinc-50',
    tableHeader: 'bg-zinc-800',
    divider: 'border-zinc-400',
  },
  stone: {
    header: 'bg-stone-800',
    accent: 'text-stone-800',
    border: 'border-stone-300',
    bg: 'bg-stone-50',
    tableHeader: 'bg-stone-800',
    divider: 'border-stone-400',
  },
}

export function ClassicTemplate({
  invoice,
  items,
  customer,
  companyName = 'Horizon',
  theme = 'gray',
}: ClassicTemplateProps) {
  const colors = themes[theme]

  return (
    <div className="bg-white text-gray-900 border-2 border-gray-300">
      {/* Traditional Two-Column Header */}
      <div className={`${colors.header} text-white px-8 py-6`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-wider">{companyName}</h1>
            <p className="text-sm mt-1 opacity-90">Business Invoice</p>
          </div>
          <div className="text-right border-l-2 border-white/20 pl-6">
            <p className="text-sm opacity-75 mb-1">Invoice Number</p>
            <p className="text-xl font-bold">{invoice.invoice_number}</p>
            <p className="text-sm mt-2 opacity-75">{formatDate(invoice.issue_date)}</p>
          </div>
        </div>
      </div>

      {/* Traditional Two-Column Body */}
      <div className="px-8 py-6">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Bill To */}
          <div>
            <h3 className={`text-sm font-bold ${colors.accent} uppercase mb-3 border-b-2 ${colors.divider} pb-2`}>
              Bill To
            </h3>
            <div className="space-y-1">
              <p className="font-bold text-lg text-gray-900">{customer?.name || 'Customer Name'}</p>
              {customer?.address && <p className="text-sm text-gray-700">{customer.address}</p>}
              {(customer?.city || customer?.state) && (
                <p className="text-sm text-gray-700">
                  {customer.city}, {customer.state} {customer.zip_code}
                </p>
              )}
              {customer?.phone && <p className="text-sm text-gray-700 mt-2">Phone: {customer.phone}</p>}
            </div>
          </div>

          {/* Right Column - Invoice Details */}
          <div>
            <h3 className={`text-sm font-bold ${colors.accent} uppercase mb-3 border-b-2 ${colors.divider} pb-2`}>
              Invoice Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice Date:</span>
                <span className="font-medium text-gray-900">{formatDate(invoice.issue_date)}</span>
              </div>
              {invoice.due_date && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-medium text-gray-900">{formatDate(invoice.due_date)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Currency:</span>
                <span className="font-medium text-gray-900">{invoice.currency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table - Traditional Style */}
        <div className="mb-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className={`${colors.tableHeader} text-white`}>
                <th className="border border-gray-300 text-left py-3 px-4 font-bold text-sm">Description</th>
                <th className="border border-gray-300 text-center py-3 px-4 font-bold text-sm">Qty</th>
                <th className="border border-gray-300 text-right py-3 px-4 font-bold text-sm">Unit Price</th>
                <th className="border border-gray-300 text-right py-3 px-4 font-bold text-sm">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : colors.bg}>
                  <td className="border border-gray-300 py-3 px-4 text-sm text-gray-900">{item.description}</td>
                  <td className="border border-gray-300 py-3 px-4 text-sm text-center text-gray-700">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 py-3 px-4 text-sm text-right text-gray-700">
                    {formatCurrency(item.unit_price, invoice.currency)}
                  </td>
                  <td className="border border-gray-300 py-3 px-4 text-sm text-right font-medium text-gray-900">
                    {formatCurrency(item.line_total, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary - Traditional Right Aligned */}
        <div className="flex justify-end">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-sm border-b border-gray-300 pb-2">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            {invoice.tax_amount > 0 && (
              <div className="flex justify-between text-sm border-b border-gray-300 pb-2">
                <span className="text-gray-700">Tax:</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(invoice.tax_amount, invoice.currency)}
                </span>
              </div>
            )}
            <div className={`flex justify-between text-lg font-bold ${colors.accent} pt-2 border-t-2 ${colors.divider}`}>
              <span>Total:</span>
              <span>{formatCurrency(invoice.total_amount, invoice.currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

