import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { AdSense } from '@/components/layout/AdSense'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { FileText, Users, Package, DollarSign, TrendingUp } from 'react-icons/fi'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get stats
  const [customersResult, productsResult, invoicesResult, paymentsResult] = await Promise.all([
    supabase.from('customers').select('id', { count: 'exact' }).eq('user_id', user.id),
    supabase.from('products').select('id', { count: 'exact' }).eq('user_id', user.id),
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your business.</p>
        </div>

        {!isPro && <AdSense />}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{customerCount}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="text-primary-600" size={24} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{productCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="text-green-600" size={24} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{invoiceCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-yellow-600" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/invoices/new">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                  <FileText className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Create Invoice</h3>
                  <p className="text-sm text-gray-600">Generate a new invoice</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/customers">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manage Customers</h3>
                  <p className="text-sm text-gray-600">View and edit customers</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/products">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Package className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manage Products</h3>
                  <p className="text-sm text-gray-600">View and edit products</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Recent Invoices */}
        <Card title="Recent Invoices">
          {recentInvoices && recentInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Invoice #</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice: any) => (
                    <tr key={invoice.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-900">{invoice.invoice_number}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {invoice.customers?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(invoice.issue_date)}
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
                        <Link href={`/invoices/${invoice.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto text-gray-400" size={48} />
              <p className="mt-4 text-gray-600">No invoices yet</p>
              <Link href="/invoices/new" className="mt-4 inline-block">
                <Button>Create Your First Invoice</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

