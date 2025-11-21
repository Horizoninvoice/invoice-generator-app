import { formatCurrency } from '@/lib/currency'
import { formatDate } from '@/lib/utils'

interface ClassicTemplateProps {
  invoice: any
  items: any[]
  customer: any
  company: any
}

export default function ClassicTemplate({ invoice, items, customer, company }: ClassicTemplateProps) {
  return (
    <div className="bg-white p-10 max-w-4xl mx-auto border-2 border-gray-300">
      {/* Classic Header with Border */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            {company?.logo_url && (
              <img 
                src={company.logo_url} 
                alt="Company Logo" 
                className="h-16 mb-3"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <h1 className="text-3xl font-serif text-gray-900 mb-2">{company?.shop_name || 'Your Company'}</h1>
            {company?.shop_address && <p className="text-gray-700 text-sm">{company.shop_address}</p>}
          </div>
          <div className="text-right border-l-2 border-gray-800 pl-4">
            <h2 className="text-3xl font-serif text-gray-900">INVOICE</h2>
            <p className="text-gray-700 mt-1">#{invoice.invoice_number}</p>
          </div>
        </div>
      </div>

      {/* Classic Layout */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="border-r-2 border-gray-300 pr-6">
          <h3 className="font-serif text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Bill To:
          </h3>
          <p className="text-gray-900 font-medium">{customer?.name || 'N/A'}</p>
          {customer?.address && <p className="text-gray-700 text-sm mt-1">{customer.address}</p>}
          {customer?.city && <p className="text-gray-700 text-sm">{customer.city}, {customer.state}</p>}
        </div>
        <div>
          <div className="mb-3">
            <span className="text-gray-700">Invoice Date: </span>
            <span className="font-semibold">{formatDate(invoice.issue_date)}</span>
          </div>
          {invoice.due_date && (
            <div className="mb-3">
              <span className="text-gray-700">Due Date: </span>
              <span className="font-semibold">{formatDate(invoice.due_date)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Classic Table */}
      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="border border-gray-600 p-3 text-left font-serif">Description</th>
            <th className="border border-gray-600 p-3 text-center font-serif">Qty</th>
            <th className="border border-gray-600 p-3 text-right font-serif">Price</th>
            <th className="border border-gray-600 p-3 text-right font-serif">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b border-gray-300">
              <td className="border border-gray-300 p-3">{item.description}</td>
              <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
              <td className="border border-gray-300 p-3 text-right">{formatCurrency(item.unit_price, invoice.currency || 'INR')}</td>
              <td className="border border-gray-300 p-3 text-right font-semibold">
                {formatCurrency(item.line_total, invoice.currency || 'INR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Classic Totals */}
      <div className="flex justify-end">
        <div className="w-64 border-2 border-gray-800 p-4">
          <div className="flex justify-between mb-2 pb-2 border-b border-gray-300">
            <span className="font-serif">Subtotal:</span>
            <span className="font-semibold">{formatCurrency(invoice.subtotal || 0, invoice.currency || 'INR')}</span>
          </div>
          {invoice.tax_amount > 0 && (
            <div className="flex justify-between mb-2 pb-2 border-b border-gray-300">
              <span className="font-serif">Tax:</span>
              <span className="font-semibold">{formatCurrency(invoice.tax_amount || 0, invoice.currency || 'INR')}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 font-serif text-lg font-bold">
            <span>Total:</span>
            <span>{formatCurrency(invoice.total_amount || 0, invoice.currency || 'INR')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

