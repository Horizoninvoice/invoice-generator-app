import { formatCurrency } from '@/lib/currency'
import { formatDate } from '@/lib/utils'

interface MinimalTemplateProps {
  invoice: any
  items: any[]
  customer: any
  company: any
}

export default function MinimalTemplate({ invoice, items, customer, company }: MinimalTemplateProps) {
  return (
    <div className="bg-white p-12 max-w-3xl mx-auto">
      {/* Minimal Header */}
      <div className="mb-12">
        <div className="flex justify-between items-baseline border-b border-gray-200 pb-4">
          <div>
            {company?.logo_url && (
              <img 
                src={company.logo_url} 
                alt="Company Logo" 
                className="h-10 mb-2"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <h1 className="text-2xl font-light text-black">{company?.shop_name || 'Your Company'}</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Invoice #{invoice.invoice_number}</p>
          </div>
        </div>
      </div>

      {/* Minimal Details */}
      <div className="mb-12 space-y-8">
        <div>
          <p className="text-xs text-gray-400 mb-1">Bill To</p>
          <p className="text-black">{customer?.name || 'N/A'}</p>
          {customer?.email && <p className="text-sm text-gray-500 mt-1">{customer.email}</p>}
        </div>
        <div className="flex gap-8 text-sm">
          <div>
            <p className="text-xs text-gray-400 mb-1">Date</p>
            <p className="text-black">{formatDate(invoice.issue_date)}</p>
          </div>
          {invoice.due_date && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Due</p>
              <p className="text-black">{formatDate(invoice.due_date)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Minimal Items */}
      <div className="mb-12 space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-start border-b border-gray-100 pb-4">
            <div className="flex-1">
              <p className="text-black">{item.description}</p>
              <p className="text-xs text-gray-400 mt-1">
                {item.quantity} × {formatCurrency(item.unit_price, invoice.currency || 'INR')}
              </p>
            </div>
            <p className="text-black font-medium">
              {formatCurrency(item.line_total, invoice.currency || 'INR')}
            </p>
          </div>
        ))}
      </div>

      {/* Minimal Totals */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-end">
          <div className="w-48 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-black">{formatCurrency(invoice.subtotal || 0, invoice.currency || 'INR')}</span>
            </div>
            {invoice.tax_amount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-black">{formatCurrency(invoice.tax_amount || 0, invoice.currency || 'INR')}</span>
              </div>
            )}
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <span className="font-medium">Total</span>
              <span className="font-medium text-lg">
                {formatCurrency(invoice.total_amount || 0, invoice.currency || 'INR')}
              </span>
            </div>
            
          </div>
        </div>
      </div>

      {/* Notes and Terms */}
      {(invoice.notes || invoice.terms) && (
        <div className="border-t border-gray-200 pt-8 mt-8">
          {invoice.notes && (
            <div className="mb-6">
              <h4 className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Notes:</h4>
              <p className="text-gray-600 whitespace-pre-line text-sm">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <h4 className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Terms & Conditions:</h4>
              <p className="text-gray-600 whitespace-pre-line text-xs">{invoice.terms}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 text-xs">
        <p>Thank you for your business!</p>
      </div>
    </div>
  )
}

