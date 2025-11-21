import { formatCurrency } from '@/lib/currency'
import { formatDate } from '@/lib/utils'

interface TemplatePreviewProps {
  template: string
  name: string
}

export default function TemplatePreview({ template, name }: TemplatePreviewProps) {
  // Sample data for preview
  const sampleInvoice = {
    invoice_number: 'INV-001',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft',
    currency: 'INR',
    subtotal: 5000,
    tax_amount: 500,
    discount_amount: 0,
    total_amount: 5500,
    notes: '',
    terms: '',
  }

  const sampleItems = [
    {
      description: 'Web Development Services',
      quantity: 10,
      unit_price: 500,
      tax_rate: 10,
      line_total: 5500,
    },
    {
      description: 'Design Consultation',
      quantity: 5,
      unit_price: 300,
      tax_rate: 10,
      line_total: 1650,
    },
  ]

  const sampleCustomer = {
    name: 'John Doe',
    address: '123 Business Street',
    city: 'New York',
    state: 'NY',
    zip_code: '10001',
    email: 'john@example.com',
  }

  const sampleCompany = {
    shop_name: 'Horizon Invoice',
    shop_address: '123 Company Ave, Business City',
    shop_email: 'contact@horizon.com',
    logo_url: '/letter-h.ico',
  }

  const renderTemplate = () => {
    switch (template) {
      case 'professional':
        return (
          <div className="bg-white p-4 max-w-sm mx-auto shadow-lg transform scale-[0.6] origin-top">
            <div className="border-b-4 border-primary-600 pb-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  {sampleCompany.logo_url && (
                    <img src={sampleCompany.logo_url} alt="Logo" className="h-12 mb-2" />
                  )}
                  <h1 className="text-2xl font-bold text-gray-900">{sampleCompany.shop_name}</h1>
                  <p className="text-sm text-gray-600">{sampleCompany.shop_address}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-bold text-primary-600 mb-1">INVOICE</h2>
                  <p className="text-sm text-gray-600">#{sampleInvoice.invoice_number}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <h3 className="font-semibold mb-1">Bill To:</h3>
                <p className="text-gray-700">{sampleCustomer.name}</p>
                <p className="text-gray-600 text-xs">{sampleCustomer.address}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Issue Date: {formatDate(sampleInvoice.issue_date)}</p>
                <p className="text-gray-600 text-xs">Status: <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">{sampleInvoice.status.toUpperCase()}</span></p>
              </div>
            </div>
            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="bg-primary-600 text-white">
                  <th className="text-left p-2">Description</th>
                  <th className="text-right p-2">Qty</th>
                  <th className="text-right p-2">Price</th>
                  <th className="text-right p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {sampleItems.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{item.description}</td>
                    <td className="p-2 text-right">{item.quantity}</td>
                    <td className="p-2 text-right">{formatCurrency(item.unit_price, sampleInvoice.currency)}</td>
                    <td className="p-2 text-right">{formatCurrency(item.line_total, sampleInvoice.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end">
              <div className="w-48 text-sm">
                <div className="flex justify-between py-1">
                  <span>Total:</span>
                  <span className="font-bold">{formatCurrency(sampleInvoice.total_amount, sampleInvoice.currency)}</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 'default':
        return (
          <div className="bg-white p-4 max-w-sm mx-auto shadow-lg transform scale-[0.6] origin-top">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  {sampleCompany.logo_url && (
                    <img src={sampleCompany.logo_url} alt="Logo" className="h-10 mb-2" />
                  )}
                  <h1 className="text-xl font-bold text-gray-900">{sampleCompany.shop_name}</h1>
                  <p className="text-xs text-gray-600">{sampleCompany.shop_address}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-gray-900">Invoice</h2>
                  <p className="text-xs text-gray-600">#{sampleInvoice.invoice_number}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div>
                <h3 className="font-semibold mb-1">Bill To:</h3>
                <p className="text-gray-900">{sampleCustomer.name}</p>
                <p className="text-gray-600">{sampleCustomer.address}</p>
              </div>
              <div>
                <p className="text-gray-600">Date: {formatDate(sampleInvoice.issue_date)}</p>
              </div>
            </div>
            <table className="w-full text-xs mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-1">Item</th>
                  <th className="text-right p-1">Qty</th>
                  <th className="text-right p-1">Price</th>
                  <th className="text-right p-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {sampleItems.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-1">{item.description}</td>
                    <td className="p-1 text-right">{item.quantity}</td>
                    <td className="p-1 text-right">{formatCurrency(item.unit_price, sampleInvoice.currency)}</td>
                    <td className="p-1 text-right">{formatCurrency(item.line_total, sampleInvoice.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end">
              <div className="w-40 text-xs">
                <div className="flex justify-between py-1 border-t-2 border-gray-900 font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(sampleInvoice.total_amount, sampleInvoice.currency)}</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 'modern':
        return (
          <div className="bg-white p-4 max-w-sm mx-auto shadow-lg transform scale-[0.6] origin-top">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-3 rounded-t-lg mb-3">
              <div className="flex justify-between items-center">
                <div>
                  {sampleCompany.logo_url && (
                    <img src={sampleCompany.logo_url} alt="Logo" className="h-10 mb-2 bg-white/20 p-1 rounded" />
                  )}
                  <h1 className="text-2xl font-bold mb-1">{sampleCompany.shop_name}</h1>
                  <p className="text-primary-100 text-xs">{sampleCompany.shop_email}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold">INVOICE</h2>
                  <p className="text-primary-100 text-xs">#{sampleInvoice.invoice_number}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-sm">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <h3 className="font-semibold mb-1">Bill To:</h3>
                  <p className="text-gray-900">{sampleCustomer.name}</p>
                  <p className="text-gray-600 text-xs">{sampleCustomer.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Date: {formatDate(sampleInvoice.issue_date)}</p>
                </div>
              </div>
              <table className="w-full text-xs mb-3">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-1">Item</th>
                    <th className="text-right p-1">Qty</th>
                    <th className="text-right p-1">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleItems.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-1">{item.description}</td>
                      <td className="p-1 text-right">{item.quantity}</td>
                      <td className="p-1 text-right">{formatCurrency(item.line_total, sampleInvoice.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end">
                <div className="w-40 text-xs">
                  <div className="flex justify-between py-1 font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(sampleInvoice.total_amount, sampleInvoice.currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'classic':
        return (
          <div className="bg-white p-4 max-w-sm mx-auto shadow-lg border-2 border-gray-300 transform scale-[0.6] origin-top">
            <div className="border-b-2 border-gray-800 pb-3 mb-3">
              <div className="flex justify-between items-start">
                <div>
                  {sampleCompany.logo_url && (
                    <img src={sampleCompany.logo_url} alt="Logo" className="h-12 mb-2" />
                  )}
                  <h1 className="text-2xl font-serif text-gray-900 mb-1">{sampleCompany.shop_name}</h1>
                  <p className="text-gray-700 text-xs">{sampleCompany.shop_address}</p>
                </div>
                <div className="text-right border-l-2 border-gray-800 pl-3">
                  <h2 className="text-2xl font-serif text-gray-900">INVOICE</h2>
                  <p className="text-gray-700 text-xs">#{sampleInvoice.invoice_number}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3 text-xs border-r-2 border-gray-300 pr-3">
              <div>
                <h3 className="font-semibold mb-1">Bill To:</h3>
                <p className="text-gray-900">{sampleCustomer.name}</p>
                <p className="text-gray-600">{sampleCustomer.address}</p>
              </div>
            </div>
            <table className="w-full text-xs mb-3">
              <thead>
                <tr className="border-b-2 border-gray-800">
                  <th className="text-left p-1">Item</th>
                  <th className="text-right p-1">Qty</th>
                  <th className="text-right p-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {sampleItems.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-1">{item.description}</td>
                    <td className="p-1 text-right">{item.quantity}</td>
                    <td className="p-1 text-right">{formatCurrency(item.line_total, sampleInvoice.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end">
              <div className="w-40 text-xs">
                <div className="flex justify-between py-1 border-t-2 border-gray-800 font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(sampleInvoice.total_amount, sampleInvoice.currency)}</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 'minimal':
        return (
          <div className="bg-white p-4 max-w-sm mx-auto shadow-lg transform scale-[0.6] origin-top">
            <div className="mb-3">
              <div className="flex justify-between items-baseline border-b border-gray-200 pb-2">
                <div>
                  {sampleCompany.logo_url && (
                    <img src={sampleCompany.logo_url} alt="Logo" className="h-8 mb-1" />
                  )}
                  <h1 className="text-xl font-light text-gray-900">{sampleCompany.shop_name}</h1>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Invoice #{sampleInvoice.invoice_number}</p>
                </div>
              </div>
            </div>
            <div className="mb-4 text-xs">
              <p className="text-gray-400 mb-0.5">Bill To</p>
              <p className="text-gray-900">{sampleCustomer.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{sampleCustomer.email}</p>
            </div>
            <div className="space-y-2 mb-4 text-xs">
              {sampleItems.map((item, idx) => (
                <div key={idx} className="flex justify-between border-b border-gray-100 pb-1">
                  <div>
                    <p className="text-gray-900">{item.description}</p>
                    <p className="text-gray-500">{item.quantity} × {formatCurrency(item.unit_price, sampleInvoice.currency)}</p>
                  </div>
                  <p className="text-gray-900 font-medium">{formatCurrency(item.line_total, sampleInvoice.currency)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <div className="w-40 text-xs">
                <div className="flex justify-between py-2 border-t-2 border-gray-900 font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(sampleInvoice.total_amount, sampleInvoice.currency)}</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="h-72 overflow-y-auto preview-scrollbar flex items-center justify-center">
        {renderTemplate()}
      </div>
    </div>
  )
}

