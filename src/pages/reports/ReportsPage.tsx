import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import { BarChart3, TrendingUp, DollarSign, FileText, Download, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'

export default function ReportsPage() {
  const { user, profile, isPro, isMax } = useAuth()
  const [dateRange, setDateRange] = useState('30')
  const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' })
  const [showCustomRange, setShowCustomRange] = useState(false)
  const [reports, setReports] = useState({
    totalRevenue: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    averageInvoiceValue: 0,
    revenueByMonth: [] as any[],
    topCustomers: [] as any[],
    invoiceStatusBreakdown: [] as any[],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && (isPro || isMax)) {
      fetchReports()
    }
  }, [user, isPro, isMax, dateRange, customDateRange.from, customDateRange.to])

  const fetchReports = async () => {
    try {
      setLoading(true)
      
      let startDateStr: string
      let endDateStr: string | undefined
      
      if (dateRange === 'custom' && customDateRange.from && customDateRange.to) {
        // Custom date range
        startDateStr = customDateRange.from
        endDateStr = customDateRange.to
      } else if (dateRange === 'today') {
        // Today only
        const today = new Date()
        startDateStr = today.toISOString().split('T')[0]
        endDateStr = today.toISOString().split('T')[0]
      } else {
        // Last N days
        const days = parseInt(dateRange)
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)
        startDateStr = startDate.toISOString().split('T')[0]
        endDateStr = undefined // No end date limit for "last N days"
      }

      // Build query
      let query = supabase
        .from('invoices')
        .select('*, customers(name)')
        .eq('user_id', user!.id)
        .gte('issue_date', startDateStr)
        .order('issue_date', { ascending: false })
      
      // Add end date filter if custom range or today
      if (endDateStr) {
        query = query.lte('issue_date', endDateStr)
      }

      const { data: invoices, error } = await query

      if (error) throw error

      // Calculate statistics
      const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0
      const totalInvoices = invoices?.length || 0
      const paidInvoices = invoices?.filter((inv) => inv.status === 'paid').length || 0
      const pendingInvoices = invoices?.filter((inv) => inv.status !== 'paid').length || 0
      const averageInvoiceValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0

      // Revenue by month
      const revenueByMonth: Record<string, number> = {}
      invoices?.forEach((inv) => {
        const month = new Date(inv.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
        revenueByMonth[month] = (revenueByMonth[month] || 0) + (inv.total_amount || 0)
      })

      // Top customers
      const customerRevenue: Record<string, { name: string; revenue: number; count: number }> = {}
      invoices?.forEach((inv) => {
        if (inv.customer_id && inv.customers) {
          const customerName = (inv.customers as any).name || 'Unknown'
          if (!customerRevenue[inv.customer_id]) {
            customerRevenue[inv.customer_id] = { name: customerName, revenue: 0, count: 0 }
          }
          customerRevenue[inv.customer_id].revenue += inv.total_amount || 0
          customerRevenue[inv.customer_id].count += 1
        }
      })

      // Invoice status breakdown
      const statusBreakdown: Record<string, number> = {}
      invoices?.forEach((inv) => {
        statusBreakdown[inv.status] = (statusBreakdown[inv.status] || 0) + 1
      })

      setReports({
        totalRevenue,
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        averageInvoiceValue,
        revenueByMonth: Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue })),
        topCustomers: Object.values(customerRevenue)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5),
        invoiceStatusBreakdown: Object.entries(statusBreakdown).map(([status, count]) => ({ status, count })),
      })
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch reports')
    } finally {
      setLoading(false)
    }
  }

  const handleDateRangeChange = (value: string) => {
    setDateRange(value)
    if (value !== 'custom') {
      setShowCustomRange(false)
      setCustomDateRange({ from: '', to: '' })
    } else {
      setShowCustomRange(true)
    }
  }

  const handleCustomDateApply = () => {
    if (!customDateRange.from || !customDateRange.to) {
      toast.error('Please select both from and to dates')
      return
    }
    if (new Date(customDateRange.from) > new Date(customDateRange.to)) {
      toast.error('From date cannot be after To date')
      return
    }
    fetchReports()
  }

  const handleTodayClick = () => {
    const today = new Date().toISOString().split('T')[0]
    setDateRange('today')
    setCustomDateRange({ from: today, to: today })
    setShowCustomRange(false)
  }

  const handleExportReport = () => {
    let periodLabel = ''
    if (dateRange === 'today') {
      periodLabel = 'Today'
    } else if (dateRange === 'custom') {
      periodLabel = `${customDateRange.from} to ${customDateRange.to}`
    } else {
      periodLabel = `Last ${dateRange} days`
    }
    
    const data = [
      ['Report Period', periodLabel],
      ['Total Revenue', formatCurrency(reports.totalRevenue, profile?.currency || 'INR')],
      ['Total Invoices', reports.totalInvoices],
      ['Paid Invoices', reports.paidInvoices],
      ['Pending Invoices', reports.pendingInvoices],
      ['Average Invoice Value', formatCurrency(reports.averageInvoiceValue, profile?.currency || 'INR')],
      [],
      ['Top Customers'],
      ['Customer', 'Revenue', 'Invoice Count'],
      ...reports.topCustomers.map((c) => [c.name, formatCurrency(c.revenue, profile?.currency || 'INR'), c.count]),
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Report')
    XLSX.writeFile(wb, `invoice-report-${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Report exported successfully')
  }

  if (!isPro && !isMax) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <div className="text-center py-12">
              <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reports & Analytics</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Advanced reporting and analytics are available for Pro and Max subscribers.
              </p>
              <Button onClick={() => window.location.href = '/subscription'}>
                Upgrade to Pro
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <div className="flex gap-2 items-center">
            <Select
              options={[
                { value: 'today', label: 'Today' },
                { value: '7', label: 'Last 7 days' },
                { value: '30', label: 'Last 30 days' },
                { value: '90', label: 'Last 90 days' },
                { value: '365', label: 'Last year' },
                { value: 'custom', label: 'Custom Range' },
              ]}
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="w-40"
            />
            
            {/* Custom Date Range Picker */}
            {showCustomRange && (
              <div className="flex gap-2 items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                <Calendar className="text-gray-400" size={18} />
                <Input
                  type="date"
                  value={customDateRange.from}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, from: e.target.value })}
                  className="w-36"
                  placeholder="From"
                />
                <span className="text-gray-400">to</span>
                <Input
                  type="date"
                  value={customDateRange.to}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, to: e.target.value })}
                  className="w-36"
                  placeholder="To"
                />
                <Button size="sm" onClick={handleCustomDateApply}>
                  Apply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowCustomRange(false)
                    setDateRange('30')
                    setCustomDateRange({ from: '', to: '' })
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
            
            <Button variant="outline" onClick={handleExportReport}>
              <Download size={18} className="mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(reports.totalRevenue, profile?.currency || 'INR')}
                </p>
              </div>
              <DollarSign className="text-green-500" size={32} />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.totalInvoices}</p>
              </div>
              <FileText className="text-blue-500" size={32} />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Paid Invoices</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{reports.paidInvoices}</p>
              </div>
              <TrendingUp className="text-green-500" size={32} />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Invoice Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(reports.averageInvoiceValue, profile?.currency || 'INR')}
                </p>
              </div>
              <BarChart3 className="text-purple-500" size={32} />
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Customers */}
          <Card title="Top Customers">
            {reports.topCustomers.length > 0 ? (
              <div className="space-y-4">
                {reports.topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{customer.count} invoices</p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(customer.revenue, profile?.currency || 'INR')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">No customer data available</p>
            )}
          </Card>

          {/* Status Breakdown */}
          <Card title="Invoice Status Breakdown">
            {reports.invoiceStatusBreakdown.length > 0 ? (
              <div className="space-y-3">
                {reports.invoiceStatusBreakdown.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {item.status}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${(item.count / reports.totalInvoices) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">No status data available</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

