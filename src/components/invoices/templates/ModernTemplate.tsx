import { formatCurrency } from '@/lib/currency'
import { formatDate } from '@/lib/utils'

interface ModernTemplateProps {
  invoice: any
  items: any[]
  customer: any
  company: any
}

export default function ModernTemplate({ invoice, items, customer, company }: ModernTemplateProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white p-8 max-w-4xl mx-auto">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-t-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            {company?.logo_url && (
              <img 
                src={company.logo_url} 
                alt="Company Logo" 
                className="h-14 mb-2 bg-white/20 p-1 rounded"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <h1 className="text-3xl font-bold mb-2">{company?.shop_name || 'Your Company'}</h1>
            <p className="text-primary-100 text-sm">{company?.shop_email || ''}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <p className="text-primary-100 text-sm mt-1">#{invoice.invoice_number}</p>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Customer and Date Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Bill To</h3>
            <p className="text-lg font-semibold text-black">{customer?.name || 'N/A'}</p>
            {customer?.address && <p className="text-gray-600 text-sm mt-1">{customer.address}</p>}
            {customer?.email && <p className="text-gray-600 text-sm">{customer.email}</p>}
          </div>
          <div>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-gray-500">Issue Date</span>
                <p className="font-medium">{formatDate(invoice.issue_date)}</p>
              </div>
              {invoice.due_date && (
                <div>
                  <span className="text-xs text-gray-500">Due Date</span>
                  <p className="font-medium">{formatDate(invoice.due_date)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-primary-600">
                <th className="text-left py-3 text-sm font-semibold text-gray-700">Description</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-700">Qty</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-700">Rate</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3">{item.description}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">{formatCurrency(item.unit_price, invoice.currency || 'INR')}</td>
                  <td className="py-3 text-right font-medium">
                    {formatCurrency(item.line_total, invoice.currency || 'INR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(invoice.subtotal || 0, invoice.currency || 'INR')}</span>
            </div>
            {invoice.tax_amount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>{formatCurrency(invoice.tax_amount || 0, invoice.currency || 'INR')}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t-2 border-primary-600 font-bold text-lg">
              <span>Total</span>
              <span className="text-primary-600">
                {formatCurrency(invoice.total_amount || 0, invoice.currency || 'INR')}
              </span>
            </div>
          </div>
        </div>

        {/* Notes and Terms */}
        {(invoice.notes || invoice.terms) && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            {invoice.notes && (
              <div className="mb-4">
                <h4 className="font-semibold text-black mb-2">Notes:</h4>
                <p className="text-gray-600 whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <h4 className="font-semibold text-black mb-2">Terms & Conditions:</h4>
                <p className="text-gray-600 whitespace-pre-line text-sm">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  )
}

