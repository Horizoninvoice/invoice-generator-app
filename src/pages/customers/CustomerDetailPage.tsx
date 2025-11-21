import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, FileText, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function CustomerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [customer, setCustomer] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingAmount: 0,
    totalAmount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  useEffect(() => {
    if (user && id) {
      fetchCustomerData()
    }
  }, [user, id])

  const fetchCustomerData = async () => {
    try {
      setLoading(true)
      // Fetch customer
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .eq('user_id', user!.id)
        .single()

      if (customerError) throw customerError
      setCustomer(customerData)

      // Fetch customer invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .eq('customer_id', id)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (invoicesError) throw invoicesError
      setInvoices(invoicesData || [])

      // Calculate stats
      const totalInvoices = invoicesData?.length || 0
      const paidInvoices = invoicesData?.filter((inv) => inv.status === 'paid').length || 0
      const totalAmount = invoicesData?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0
      const pendingAmount =
        invoicesData?.reduce(
          (sum, inv) => sum + (inv.status !== 'paid' ? inv.total_amount || 0 : 0),
          0
        ) || 0

      setStats({
        totalInvoices,
        paidInvoices,
        pendingAmount,
        totalAmount,
      })
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch customer data')
      navigate('/customers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('customers').delete().eq('id', id).eq('user_id', user!.id)
      if (error) throw error
      toast.success('Customer deleted successfully')
      navigate('/customers')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete customer')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
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

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <p className="text-gray-600 dark:text-gray-400">Customer not found</p>
            <Link to="/customers">
              <Button className="mt-4">Back to Customers</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/customers">
              <Button variant="ghost">
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">{customer.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">Customer Details</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/customers/${id}/edit`}>
              <Button variant="outline">
                <Edit size={18} className="mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
              <Trash2 size={18} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Customer Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card title="Contact Information">
              <div className="space-y-4">
                {customer.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="text-gray-400 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Email</p>
                      <p className="text-sm text-black dark:text-white">{customer.email}</p>
                    </div>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="text-gray-400 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Phone</p>
                      <p className="text-sm text-black dark:text-white">{customer.phone}</p>
                    </div>
                  </div>
                )}
                {(customer.address || customer.city || customer.state) && (
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Address</p>
                      <p className="text-sm text-black dark:text-white">
                        {customer.address}
                        {customer.city && `, ${customer.city}`}
                        {customer.state && `, ${customer.state}`}
                        {customer.zip_code && ` ${customer.zip_code}`}
                        {customer.country && `, ${customer.country}`}
                      </p>
                    </div>
                  </div>
                )}
                {customer.tax_id && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Tax ID</p>
                    <p className="text-sm text-black dark:text-white">{customer.tax_id}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Business Metrics */}
            <Card title="Business Metrics">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Invoices</p>
                  <p className="text-2xl font-bold text-black dark:text-white">{stats.totalInvoices}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Paid Invoices</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.paidInvoices}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-black dark:text-white">
                    {formatCurrency(stats.totalAmount, profile?.currency || 'INR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Outstanding</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {formatCurrency(stats.pendingAmount, profile?.currency || 'INR')}
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions">
              <Link to={`/invoices/create?customer=${customer.id}`}>
                <Button className="w-full">
                  <Plus size={18} className="mr-2" />
                  Create Invoice
                </Button>
              </Link>
            </Card>
          </div>

          {/* Invoice History */}
          <div className="lg:col-span-2">
            <Card
              title="Invoice History"
              actions={
                <Link to={`/invoices/create?customer=${customer.id}`}>
                  <Button size="sm">
                    <Plus size={16} className="mr-2" />
                    New Invoice
                  </Button>
                </Link>
              }
            >
              {invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Invoice #</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr
                          key={invoice.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="py-3 px-4 text-sm font-medium text-black dark:text-white">
                            {invoice.invoice_number}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(invoice.issue_date)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                            {invoice.due_date ? formatDate(invoice.due_date) : 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-black dark:text-white">
                            {formatCurrency(invoice.total_amount, invoice.currency || profile?.currency || 'INR')}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(invoice.status)}`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Link to={`/invoices/${invoice.id}`}>
                              <button className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
                                View
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No invoices for this customer yet</p>
                  <Link to={`/invoices/create?customer=${customer.id}`}>
                    <Button>Create First Invoice</Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Customer"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this customer? This will also delete all associated invoices. This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
