import { useEffect, useState, startTransition } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import AdSense from '@/components/layout/AdSense'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { FileText, Users, Package, DollarSign, Plus, ArrowRight, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import { formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({
    invoices: 0,
    customers: 0,
    products: 0,
    revenue: 0,
  })
  const [recentInvoices, setRecentInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    } else {
      // If no user, don't show loading
      setLoading(false)
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const [invoicesResult, customersResult, productsResult, paymentsResult] = await Promise.all([
        supabase.from('invoices').select('id, total_amount, status', { count: 'exact' }).eq('user_id', user!.id),
        supabase.from('customers').select('id', { count: 'exact', head: true }).eq('user_id', user!.id),
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('user_id', user!.id),
        supabase.from('payments').select('amount').eq('user_id', user!.id).eq('status', 'completed'),
      ])

      const invoiceCount = invoicesResult.count || 0
      const customerCount = customersResult.count || 0
      const productCount = productsResult.count || 0
      const revenue = paymentsResult.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

      // Fetch recent invoices
      const { data: invoices } = await supabase
        .from('invoices')
        .select('id, invoice_number, total_amount, status, issue_date, customers(name)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5)

      startTransition(() => {
        setStats({
          invoices: invoiceCount,
          customers: customerCount,
          products: productCount,
          revenue,
        })
        setRecentInvoices(invoices || [])
        setLoading(false)
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      startTransition(() => {
        setLoading(false)
      })
    }
  }

  const { isPro, isMax } = useAuth()

  // Show skeleton instead of full loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-gray-100 mb-2">
            Welcome back, {profile?.shop_name || user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Here's an overview of your business</p>
        </div>

        {/* Upgrade Prompt for Free Users */}
        {!isPro && !isMax && (
          <Card className="mb-6 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-gray-100 mb-1">Upgrade to Pro</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unlock all features, remove ads, and get access to all invoice templates.
                </p>
              </div>
              <Link to="/subscription">
                <Button>Upgrade Now</Button>
              </Link>
            </div>
          </Card>
        )}

        {/* AdSense for Free Users */}
        {!isPro && !isMax && <AdSense />}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Invoices</p>
                <p className="text-2xl font-bold text-black dark:text-gray-100">{stats.invoices}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <FileText className="text-primary-600 dark:text-primary-400" size={24} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Customers</p>
                <p className="text-2xl font-bold text-black dark:text-gray-100">{stats.customers}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Users className="text-primary-600 dark:text-primary-400" size={24} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Products</p>
                <p className="text-2xl font-bold text-black dark:text-gray-100">{stats.products}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Package className="text-primary-600 dark:text-primary-400" size={24} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-black dark:text-gray-100">
                  {formatCurrency(stats.revenue, profile?.currency || 'INR')}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <TrendingUp size={12} />
                  All time
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="text-primary-600 dark:text-primary-400" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link to="/invoices/create">
            <Button className="w-full" size="lg">
              <Plus size={20} className="mr-2" />
              Create Invoice
            </Button>
          </Link>
          <Link to="/customers/create">
            <Button className="w-full" size="lg" variant="outline">
              <Plus size={20} className="mr-2" />
              Add Customer
            </Button>
          </Link>
          <Link to="/products/create">
            <Button className="w-full" size="lg" variant="outline">
              <Plus size={20} className="mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Recent Invoices */}
        <Card title="Recent Invoices">
          {recentInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Invoice #</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4 text-sm text-black dark:text-gray-100">{invoice.invoice_number}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {invoice.customers?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(invoice.issue_date)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-black dark:text-gray-100">
                        {formatCurrency(invoice.total_amount, profile?.currency || 'INR')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : invoice.status === 'sent'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link to={`/invoices/${invoice.id}`}>
                          <ArrowRight size={16} className="text-primary-600 dark:text-primary-400" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No invoices yet</p>
              <Link to="/invoices/create">
                <Button>Create Your First Invoice</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

