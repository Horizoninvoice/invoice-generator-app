'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Download } from 'react-icons/fi'
import { formatCurrency, formatDate } from '@/lib/utils'
import { generateInvoicePDF } from '@/lib/pdf'
import type { Invoice, InvoiceItem, Customer } from '@/lib/types'

export function InvoiceView({ invoice, items }: { invoice: any; items: InvoiceItem[] }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownloadPDF = () => {
    setIsGenerating(true)
    try {
      const doc = generateInvoicePDF(invoice, invoice.customers as Customer, items)
      doc.save(`invoice-${invoice.invoice_number}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice #{invoice.invoice_number}</h1>
            <p className="text-gray-600 mt-1">
              {formatDate(invoice.issue_date)}
              {invoice.due_date && ` • Due: ${formatDate(invoice.due_date)}`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                invoice.status === 'paid'
                  ? 'bg-green-100 text-green-800'
                  : invoice.status === 'sent'
                  ? 'bg-blue-100 text-blue-800'
                  : invoice.status === 'overdue'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {invoice.status}
            </span>
            <Button onClick={handleDownloadPDF} isLoading={isGenerating}>
              <Download size={18} className="mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Bill To:</h3>
            {invoice.customers ? (
              <div className="text-gray-900">
                <p className="font-medium">{invoice.customers.name}</p>
                {invoice.customers.address && <p>{invoice.customers.address}</p>}
                {(invoice.customers.city || invoice.customers.state) && (
                  <p>
                    {invoice.customers.city}
                    {invoice.customers.city && invoice.customers.state && ', '}
                    {invoice.customers.state} {invoice.customers.zip_code}
                  </p>
                )}
                {invoice.customers.email && <p className="mt-1">{invoice.customers.email}</p>}
              </div>
            ) : (
              <p className="text-gray-500">No customer selected</p>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Invoice Details:</h3>
            <div className="text-gray-900 space-y-1">
              <p>
                <span className="text-gray-600">Invoice Number:</span> {invoice.invoice_number}
              </p>
              <p>
                <span className="text-gray-600">Issue Date:</span> {formatDate(invoice.issue_date)}
              </p>
              {invoice.due_date && (
                <p>
                  <span className="text-gray-600">Due Date:</span> {formatDate(invoice.due_date)}
                </p>
              )}
              <p>
                <span className="text-gray-600">Currency:</span> {invoice.currency}
              </p>
            </div>
          </div>
        </div>

        {items.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Quantity</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Unit Price</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Tax</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-900">{item.description}</td>
                      <td className="py-3 px-4 text-sm text-center text-gray-600">{item.quantity}</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-600">
                        {formatCurrency(item.unit_price)}
                      </td>
                      <td className="py-3 px-4 text-sm text-center text-gray-600">{item.tax_rate}%</td>
                      <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                        {formatCurrency(item.line_total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.tax_amount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">{formatCurrency(invoice.tax_amount)}</span>
              </div>
            )}
            {invoice.discount_amount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium">-{formatCurrency(invoice.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-gray-300">
              <span>Total:</span>
              <span>{formatCurrency(invoice.total_amount)}</span>
            </div>
          </div>
        </div>

        {(invoice.notes || invoice.terms) && (
          <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
            {invoice.notes && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes:</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Terms & Conditions:</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </>
  )
}

