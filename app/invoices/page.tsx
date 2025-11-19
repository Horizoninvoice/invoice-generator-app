import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { AdSense } from '@/components/layout/AdSense'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { FiPlus, FiFileText, FiDownload } from 'react-icons/fi'
import { formatCurrency, formatDate } from '@/lib/utils'
import { InvoiceActions } from './InvoiceActions'
import { ExportButton } from './ExportButton'

export default async function InvoicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, customers(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const isPro = profile?.role === 'pro'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-2">Manage and track your invoices</p>
          </div>
          <div className="flex gap-4">
            {isPro && invoices && invoices.length > 0 && (
              <ExportButton invoices={invoices as any} />
            )}
            <Link href="/invoices/new">
              <Button>
                <FiPlus size={18} className="mr-2" />
                Create Invoice
              </Button>
            </Link>
          </div>
        </div>

        {!isPro && <AdSense />}

        <Card>
          {invoices && invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Invoice #</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Issue Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Due Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice: any) => (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {invoice.invoice_number}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {invoice.customers?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(invoice.issue_date)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {invoice.due_date ? formatDate(invoice.due_date) : '—'}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.total_amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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
                      </td>
                      <td className="py-3 px-4">
                        <InvoiceActions invoice={invoice} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FiFileText className="mx-auto text-gray-400" size={48} />
              <p className="text-gray-600 mb-4 mt-4">No invoices yet</p>
              <Link href="/invoices/new">
                <Button>
                  <FiPlus size={18} className="mr-2" />
                  Create Your First Invoice
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

