import { formatCurrency } from '@/lib/currency'
import { formatDate } from '@/lib/utils'

interface ProfessionalTemplateProps {
  invoice: any
  items: any[]
  customer: any
  company: any
}

export default function ProfessionalTemplate({ invoice, items, customer, company }: ProfessionalTemplateProps) {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-4 border-primary-600 pb-6 mb-8">
        <div className="flex justify-between items-start">
              <div>
                {company?.logo_url && (
                  <img 
                    src={company.logo_url} 
                    alt="Company Logo" 
                    className="h-16 mb-4"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      // Hide image if it fails to load
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
                <h1 className="text-3xl font-bold text-black">{company?.shop_name || 'Your Company'}</h1>
            {company?.shop_address && (
              <p className="text-gray-600 mt-2">{company.shop_address}</p>
            )}
            {company?.shop_email && (
              <p className="text-gray-600">{company.shop_email}</p>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold text-primary-600 mb-2">INVOICE</h2>
            <p className="text-gray-600">#{invoice.invoice_number}</p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-black mb-2">Bill To:</h3>
          <p className="text-gray-700 font-medium">{customer?.name || 'N/A'}</p>
          {customer?.address && <p className="text-gray-600">{customer.address}</p>}
          {customer?.city && <p className="text-gray-600">{customer.city}, {customer.state} {customer.zip_code}</p>}
          {customer?.email && <p className="text-gray-600">{customer.email}</p>}
        </div>
        <div className="text-right md:text-left">
          <div className="mb-4">
            <span className="text-gray-600">Issue Date:</span>
            <span className="ml-2 font-medium">{formatDate(invoice.issue_date)}</span>
          </div>
          {invoice.due_date && (
            <div className="mb-4">
              <span className="text-gray-600">Due Date:</span>
              <span className="ml-2 font-medium">{formatDate(invoice.due_date)}</span>
            </div>
          )}
          <div>
            <span className="text-gray-600">Status:</span>
            <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
              invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
              invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {invoice.status?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8">
        <thead>
          <tr className="bg-primary-600 text-white">
            <th className="text-left p-3">Description</th>
            <th className="text-right p-3">Quantity</th>
            <th className="text-right p-3">Unit Price</th>
            <th className="text-right p-3">Tax</th>
            <th className="text-right p-3">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="p-3">{item.description}</td>
              <td className="p-3 text-right">{item.quantity}</td>
              <td className="p-3 text-right">{formatCurrency(item.unit_price, invoice.currency || 'INR')}</td>
              <td className="p-3 text-right">{item.tax_rate}%</td>
              <td className="p-3 text-right font-medium">
                {formatCurrency(item.line_total, invoice.currency || 'INR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatCurrency(invoice.subtotal || 0, invoice.currency || 'INR')}</span>
          </div>
          {invoice.tax_amount > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">{formatCurrency(invoice.tax_amount || 0, invoice.currency || 'INR')}</span>
            </div>
          )}
          {invoice.discount_amount > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Discount:</span>
              <span className="font-medium">-{formatCurrency(invoice.discount_amount || 0, invoice.currency || 'INR')}</span>
            </div>
          )}
          <div className="flex justify-between py-3 mt-2 bg-primary-50 rounded">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-bold text-lg text-primary-600">
              {formatCurrency(invoice.total_amount || 0, invoice.currency || 'INR')}
            </span>
          </div>
        </div>
      </div>

      {/* Notes and Terms */}
      {(invoice.notes || invoice.terms) && (
        <div className="border-t border-gray-200 pt-6">
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
      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>Thank you for your business!</p>
      </div>
    </div>
  )
}

