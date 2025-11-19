import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { FiFileText, FiUsers, FiPackage, FiDollarSign, FiTrendingUp } from 'react-icons/fi'
import { formatCurrency, formatDate } from '@/lib/utils'

// Dynamic imports for heavy components
const AdSense = dynamic(() => import('@/components/layout/AdSense').then(mod => ({ default: mod.AdSense })), {
  ssr: false,
})

// Split dashboard into smaller components
import { DashboardStats } from './DashboardStats'
import { RecentInvoices } from './RecentInvoices'

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

  const isPro = profile?.role === 'pro' || profile?.role === 'max'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <AdSense />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's what's happening with your business.</p>
        </div>

        <DashboardStats
          customerCount={customerCount}
          productCount={productCount}
          invoiceCount={invoiceCount}
          totalRevenue={totalRevenue}
          paidInvoices={paidInvoices}
        />

        <RecentInvoices invoices={recentInvoices || []} />
      </div>
    </div>
  )
}
