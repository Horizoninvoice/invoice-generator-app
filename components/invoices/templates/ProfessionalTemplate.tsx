'use client'

import { formatCurrency, formatDate } from '@/lib/utils'
import type { Invoice, InvoiceItem, Customer } from '@/lib/types'
import Image from 'next/image'

interface ProfessionalTemplateProps {
  invoice: Invoice
  items: InvoiceItem[]
  customer?: Customer
  companyName?: string
  companyPhone?: string
  companyEmail?: string
  companyWebsite?: string
  companyAddress?: string
  companyCity?: string
  companyState?: string
  companyZip?: string
  theme?: 'yellow' | 'amber' | 'orange' | 'red'
}

const professionalThemes = {
  yellow: {
    accent: 'bg-yellow-400',
    text: 'text-gray-900',
  },
  amber: {
    accent: 'bg-amber-400',
    text: 'text-gray-900',
  },
  orange: {
    accent: 'bg-orange-400',
    text: 'text-gray-900',
  },
  red: {
    accent: 'bg-red-400',
    text: 'text-gray-900',
  },
}

export function ProfessionalTemplate({
  invoice,
  items,
  customer,
  companyName = 'Horizon',
  companyPhone = '+999 123 456 789',
  companyEmail = 'info@horizon.com',
  companyWebsite = 'www.horizon.com',
  companyAddress = '123 Street Town',
  companyCity = 'Postal, County',
  theme = 'yellow',
}: ProfessionalTemplateProps) {
  const taxRate = invoice.tax_amount > 0 && invoice.subtotal > 0 
    ? ((invoice.tax_amount / invoice.subtotal) * 100).toFixed(0)
    : '0'
  const colors = professionalThemes[theme]

  return (
    <div className="bg-white text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header Section - Dark Grey Background */}
      <div className="bg-gray-800 text-white px-8 py-6">
        <div className="flex justify-between items-start">
          {/* Logo and Company Name */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${colors.accent} rounded-lg flex items-center justify-center`}>
              <span className={`${colors.text} font-bold text-xl`}>H</span>
            </div>
            <span className="text-2xl font-bold uppercase tracking-wider">{companyName}</span>
          </div>

          {/* Contact Information - Three Columns */}
          <div className="flex gap-8 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Phone</p>
              <p className="font-medium">{companyPhone}</p>
              <p className="font-medium">{companyPhone.replace('789', '555')}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Web</p>
              <p className="font-medium">{companyEmail}</p>
              <p className="font-medium">{companyWebsite}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Area</p>
              <p className="font-medium">{companyAddress}</p>
              <p className="font-medium">{companyCity}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wavy Line Separator */}
      <div className="relative h-4 bg-gray-200 overflow-hidden">
        <svg className="absolute bottom-0 w-full h-4" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path
            d="M0,20 Q300,0 600,20 T1200,20 L1200,40 L0,40 Z"
            fill="white"
            className="text-gray-200"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        {/* Bill To and Invoice Details */}
        <div className="flex justify-between mb-8">
          {/* Bill To Section */}
          <div>
            <p className="text-sm text-gray-600 mb-1">To:</p>
            <p className="text-xl font-bold mb-2 uppercase">{customer?.name || 'Customer Name'}</p>
            {customer?.address && (
              <p className="text-sm text-gray-700">{customer.address}</p>
            )}
            {(customer?.city || customer?.state) && (
              <p className="text-sm text-gray-700">
                {customer.city}
                {customer.city && customer.state && ', '}
                {customer.state} {customer.zip_code}
              </p>
            )}
            {customer?.phone && (
              <p className="text-sm text-gray-700 mt-1">Phone: {customer.phone}</p>
            )}
          </div>

          {/* Invoice Details */}
          <div className="text-right">
            <h1 className="text-4xl font-bold mb-4 uppercase">Invoice</h1>
            <div className="space-y-1 text-sm">
              <p className="text-gray-700">
                <span className="font-semibold">Invoice No :</span> {invoice.invoice_number}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Account No :</span> {invoice.id.slice(0, 11)}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Date :</span> {formatDate(invoice.issue_date)}
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={`${colors.accent} ${colors.text} text-left py-3 px-4 font-bold uppercase text-sm`}>
                  Item Description
                </th>
                <th className="bg-gray-800 text-white text-center py-3 px-4 font-bold uppercase text-sm">
                  Price
                </th>
                <th className="bg-gray-800 text-white text-center py-3 px-4 font-bold uppercase text-sm">
                  Qty
                </th>
                <th className="bg-gray-800 text-white text-right py-3 px-4 font-bold uppercase text-sm">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-gray-700">
                    {formatCurrency(item.unit_price, invoice.currency)}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-gray-700">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                    {formatCurrency(item.line_total, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-700 font-medium">Sub Total</span>
              <span className="text-gray-900 font-semibold">
                {formatCurrency(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            {invoice.tax_amount > 0 && (
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-700 font-medium">Tax Vat {taxRate}%</span>
                <span className="text-gray-900 font-semibold">
                  {formatCurrency(invoice.tax_amount, invoice.currency)}
                </span>
              </div>
            )}
            {invoice.discount_amount > 0 && (
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-700 font-medium">Discount</span>
                <span className="text-gray-900 font-semibold">
                  -{formatCurrency(invoice.discount_amount, invoice.currency)}
                </span>
              </div>
            )}
            <div className={`${colors.accent} ${colors.text} flex justify-between py-3 px-4 font-bold uppercase`}>
              <span>Grand Total</span>
              <span>{formatCurrency(invoice.total_amount, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="border-t-2 border-gray-200 pt-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Payment Info */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm">Payment Info</h3>
              <div className="space-y-1 text-sm text-gray-700">
                <p>Paypal: {companyEmail}</p>
                <p>Payment: Visa, Master Card</p>
                <p>We accept Cheque</p>
              </div>
            </div>

            {/* Thank You and Terms */}
            <div>
              <p className="text-lg font-bold text-gray-900 mb-2">Thank you for your business!</p>
              {invoice.terms && (
                <p className="text-xs text-gray-600 leading-relaxed">
                  <span className="font-semibold">TERMS: </span>
                  {invoice.terms}
                </p>
              )}
            </div>
          </div>

          {/* Signature Section */}
          <div className="mt-8 flex justify-end">
            <div className="text-right">
              <div className="mb-2">
                <p className="font-semibold text-gray-900">Accounting Manager</p>
                <p className="text-sm text-gray-700 mt-1">Horizon Invoice System</p>
              </div>
              <div className="mt-4 pt-2 border-t border-gray-300">
                <p className="text-sm text-gray-600 italic">Digital Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

