import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { AdSense } from '@/components/layout/AdSense'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { FiFileText, FiUsers, FiPackage, FiDollarSign, FiTrendingUp } from 'react-icons/fi'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile - only select needed fields
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  // Get stats - optimized queries with parallel execution
  const [customersResult, productsResult, invoicesResult, paymentsResult] = await Promise.all([
    supabase.from('customers').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('invoices').select('id, total_amount, status', { count: 'exact' }).eq('user_id', user.id),
    supabase.from('payments').select('amount').eq('user_id', user.id).eq('status', 'completed'),
  ])

  const customerCount = customersResult.count || 0
  const productCount = productsResult.count || 0
  const invoiceCount = invoicesResult.count || 0
  const totalRevenue = paymentsResult.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
  const paidInvoices = invoicesResult.data?.filter(i => i.status === 'paid').length || 0

  // Get recent invoices
  const { data: recentInvoices } = await supabase
    .from('invoices')
    .select('id, invoice_number, total_amount, status, issue_date, customers(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const isPro = profile?.role === 'pro'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's an overview of your business.</p>
        </div>

        {!isPro && <AdSense />}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-primary-600 dark:bg-primary-700 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-100">Total Customers</p>
                <p className="text-2xl font-bold text-white mt-1">{customerCount}</p>
              </div>
              <div className="w-12 h-12 bg-primary-500 dark:bg-primary-600 rounded-lg flex items-center justify-center">
                <FiUsers className="text-white" size={24} />
              </div>
            </div>
          </Card>

          <Card className="bg-green-600 dark:bg-green-700 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-100">Total Products</p>
                <p className="text-2xl font-bold text-white mt-1">{productCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center">
                <FiPackage className="text-white" size={24} />
              </div>
            </div>
          </Card>

          <Card className="bg-blue-600 dark:bg-blue-700 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Total Invoices</p>
                <p className="text-2xl font-bold text-white mt-1">{invoiceCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center">
                <FiFileText className="text-white" size={24} />
              </div>
            </div>
          </Card>

          <Card className="bg-yellow-600 dark:bg-yellow-700 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-100">Total Revenue</p>
                <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 dark:bg-yellow-600 rounded-lg flex items-center justify-center">
                <FiDollarSign className="text-white" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/invoices/new">
            <Card className="bg-primary-600 dark:bg-primary-700 border-0 hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-500 dark:bg-primary-600 rounded-lg flex items-center justify-center">
                  <FiFileText className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Create Invoice</h3>
                  <p className="text-sm text-primary-100">Generate a new invoice</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/customers">
            <Card className="bg-green-600 dark:bg-green-700 border-0 hover:bg-green-700 dark:hover:bg-green-600 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center">
                  <FiUsers className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Manage Customers</h3>
                  <p className="text-sm text-green-100">View and edit customers</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/products">
            <Card className="bg-blue-600 dark:bg-blue-700 border-0 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center">
                  <FiPackage className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Manage Products</h3>
                  <p className="text-sm text-blue-100">View and edit products</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Recent Invoices */}
        <Card title="Recent Invoices" className="bg-primary-600 dark:bg-primary-700 border-0">
          {recentInvoices && recentInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary-500 dark:border-primary-600">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">Invoice #</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice: any) => (
                    <tr key={invoice.id} className="border-b border-primary-500/30 dark:border-primary-600/30">
                      <td className="py-3 px-4 text-sm text-white">{invoice.invoice_number}</td>
                      <td className="py-3 px-4 text-sm text-primary-100">
                        {invoice.customers?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-primary-100">
                        {formatDate(invoice.issue_date)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-white">
                        {formatCurrency(invoice.total_amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            invoice.status === 'paid'
                              ? 'bg-green-500 text-white'
                              : invoice.status === 'sent'
                              ? 'bg-blue-500 text-white'
                              : invoice.status === 'overdue'
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-500 text-white'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/invoices/${invoice.id}`}>
                          <Button variant="secondary" size="sm">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FiFileText className="mx-auto text-primary-200 dark:text-primary-300" size={48} />
              <p className="mt-4 text-primary-100 dark:text-primary-200">No invoices yet</p>
              <Link href="/invoices/new" className="mt-4 inline-block">
                <Button variant="secondary">Create Your First Invoice</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

