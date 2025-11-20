import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { AdSense } from '@/components/layout/AdSense'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BackButton } from '@/components/ui/BackButton'
import Link from 'next/link'
import { FiPlus, FiFileText, FiDownload } from '@/lib/icons'
import { formatCurrency, formatDate } from '@/lib/utils'
import { InvoiceActions } from '@/components/invoices/InvoiceActions'
import { ExportButton } from '@/components/invoices/ExportButton'

export default async function InvoicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  const { data: invoices } = await supabase
    .from('invoices')
    .select('id, invoice_number, issue_date, due_date, total_amount, status, customers(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const isPro = profile?.role === 'pro'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <BackButton href="/dashboard" />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Invoices</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and track your invoices</p>
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
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Invoice #</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Issue Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Due Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice: any) => (
                    <tr key={invoice.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
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

