import { formatCurrency } from '@/lib/currency'
import { formatDate } from '@/lib/utils'

interface DefaultTemplateProps {
  invoice: any
  items: any[]
  customer: any
  company: any
}

export default function DefaultTemplate({ invoice, items, customer, company }: DefaultTemplateProps) {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      {/* Simple Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company?.shop_name || 'Your Company'}</h1>
            {company?.shop_address && <p className="text-gray-600 text-sm mt-1">{company.shop_address}</p>}
            {company?.shop_email && <p className="text-gray-600 text-sm">{company.shop_email}</p>}
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900">Invoice</h2>
            <p className="text-gray-600 text-sm mt-1">#{invoice.invoice_number}</p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Bill To:</h3>
          <p className="text-gray-900">{customer?.name || 'N/A'}</p>
          {customer?.address && <p className="text-gray-600 text-sm">{customer.address}</p>}
          {customer?.email && <p className="text-gray-600 text-sm">{customer.email}</p>}
        </div>
        <div>
          <div className="mb-2">
            <span className="text-sm text-gray-600">Date: </span>
            <span className="text-sm font-medium">{formatDate(invoice.issue_date)}</span>
          </div>
          {invoice.due_date && (
            <div className="mb-2">
              <span className="text-sm text-gray-600">Due: </span>
              <span className="text-sm font-medium">{formatDate(invoice.due_date)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="mb-6">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 text-sm font-semibold">Item</th>
              <th className="text-right p-2 text-sm font-semibold">Qty</th>
              <th className="text-right p-2 text-sm font-semibold">Price</th>
              <th className="text-right p-2 text-sm font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{item.description}</td>
                <td className="p-2 text-right">{item.quantity}</td>
                <td className="p-2 text-right">{formatCurrency(item.unit_price, invoice.currency || 'INR')}</td>
                <td className="p-2 text-right">{formatCurrency(item.line_total, invoice.currency || 'INR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-56">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span>{formatCurrency(invoice.subtotal || 0, invoice.currency || 'INR')}</span>
          </div>
          {invoice.tax_amount > 0 && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax:</span>
              <span>{formatCurrency(invoice.tax_amount || 0, invoice.currency || 'INR')}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t-2 border-gray-900 font-bold">
            <span>Total:</span>
            <span>{formatCurrency(invoice.total_amount || 0, invoice.currency || 'INR')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

