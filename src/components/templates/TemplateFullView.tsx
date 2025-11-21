import InvoiceTemplateRenderer from '@/components/invoices/InvoiceTemplateRenderer'

interface TemplateFullViewProps {
  template: string
}

export default function TemplateFullView({ template }: TemplateFullViewProps) {
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
    tax_rate: 10,
    notes: 'Thank you for your business!',
    terms: 'Payment due within 30 days.',
    footer_message: 'Thank you for your business!',
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

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg overflow-auto max-h-[80vh]">
      <InvoiceTemplateRenderer
        template={template}
        invoice={sampleInvoice}
        items={sampleItems}
        customer={sampleCustomer}
        company={sampleCompany}
      />
    </div>
  )
}

