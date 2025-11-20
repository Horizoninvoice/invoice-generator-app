import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { ArrowLeft, Edit, Copy, Download, Printer, Trash2, Share2, Mail } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [invoice, setInvoice] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (user && id) {
      fetchInvoice()
    }
  }, [user, id])

  const fetchInvoice = async () => {
    try {
      setLoading(true)
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .eq('user_id', user!.id)
        .single()

      if (invoiceError) throw invoiceError
      setInvoice(invoiceData)

      // Fetch customer
      if (invoiceData.customer_id) {
        const { data: customerData } = await supabase
          .from('customers')
          .select('*')
          .eq('id', invoiceData.customer_id)
          .single()
        setCustomer(customerData)
      }

      // Fetch items
      const { data: itemsData, error: itemsError } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', id)
        .order('created_at')

      if (itemsError) throw itemsError
      setItems(itemsData || [])
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch invoice')
      navigate('/invoices')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('user_id', user!.id)

      if (error) throw error
      setInvoice({ ...invoice, status: newStatus })
      toast.success('Invoice status updated')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status')
    }
  }

  const handleDuplicate = () => {
    navigate('/invoices/create', {
      state: {
        duplicate: {
          ...invoice,
          invoice_number: '',
          issue_date: new Date().toISOString().split('T')[0],
          due_date: '',
          status: 'draft',
        },
        items,
      },
    })
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this invoice?')) return

    setIsDeleting(true)
    try {
      const { error } = await supabase.from('invoices').delete().eq('id', id).eq('user_id', user!.id)
      if (error) throw error
      toast.success('Invoice deleted successfully')
      navigate('/invoices')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete invoice')
    } finally {
      setIsDeleting(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = async () => {
    // TODO: Implement PDF export with react-pdf
    toast.info('PDF export coming soon')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
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

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <p className="text-gray-600 dark:text-gray-400">Invoice not found</p>
            <Link to="/invoices">
              <Button className="mt-4">Back to Invoices</Button>
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
            <Link to="/invoices">
              <Button variant="ghost">
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{invoice.invoice_number}</h1>
              <p className="text-gray-600 dark:text-gray-400">Invoice Details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded ${getStatusColor(invoice.status)}`}>
              {invoice.status}
            </span>
          </div>
        </div>

        {/* Action Toolbar */}
        <Card className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/invoices/${id}/edit`}>
              <Button variant="outline">
                <Edit size={18} className="mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" onClick={handleDuplicate}>
              <Copy size={18} className="mr-2" />
              Duplicate
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <Download size={18} className="mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer size={18} className="mr-2" />
              Print
            </Button>
            <Button variant="outline">
              <Share2 size={18} className="mr-2" />
              Share
            </Button>
            <Button variant="outline">
              <Mail size={18} className="mr-2" />
              Email
            </Button>
            <div className="flex-1"></div>
            <Select
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'sent', label: 'Sent' },
                { value: 'paid', label: 'Paid' },
                { value: 'overdue', label: 'Overdue' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              value={invoice.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-40"
            />
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
              <Trash2 size={18} className="mr-2" />
              Delete
            </Button>
          </div>
        </Card>

        {/* Invoice Preview */}
        <Card>
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {profile?.shop_name || 'Horizon Invoice Generator'}
                </h2>
                {profile?.shop_address && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{profile.shop_address}</p>
                )}
                {profile?.shop_email && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{profile.shop_email}</p>
                )}
              </div>
              <div className="text-right">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">INVOICE</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Invoice #: {invoice.invoice_number}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date: {formatDate(invoice.issue_date)}</p>
                {invoice.due_date && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">Due: {formatDate(invoice.due_date)}</p>
                )}
              </div>
            </div>

            {/* Customer Info */}
            {customer && (
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bill To:</h4>
                <p className="text-gray-900 dark:text-white font-medium">{customer.name}</p>
                {customer.email && <p className="text-gray-600 dark:text-gray-400 text-sm">{customer.email}</p>}
                {customer.phone && <p className="text-gray-600 dark:text-gray-400 text-sm">{customer.phone}</p>}
                {customer.address && <p className="text-gray-600 dark:text-gray-400 text-sm">{customer.address}</p>}
                {customer.city && customer.state && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {customer.city}, {customer.state} {customer.zip_code}
                  </p>
                )}
              </div>
            )}

            {/* Items Table */}
            <div className="mb-8 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Description</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Unit Price</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Tax</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{item.description}</td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{item.quantity}</td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                        {formatCurrency(item.unit_price, invoice.currency)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{item.tax_rate}%</td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.line_total, invoice.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(invoice.subtotal, invoice.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(invoice.tax_amount, invoice.currency)}
                  </span>
                </div>
                {invoice.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      -{formatCurrency(invoice.discount_amount, invoice.currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatCurrency(invoice.total_amount, invoice.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            {(invoice.notes || invoice.terms) && (
              <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                {invoice.notes && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Notes:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{invoice.notes}</p>
                  </div>
                )}
                {invoice.terms && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Terms & Conditions:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{invoice.terms}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
