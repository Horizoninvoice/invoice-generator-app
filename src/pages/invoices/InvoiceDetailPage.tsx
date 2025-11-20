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
import InvoiceTemplateRenderer from '@/components/invoices/InvoiceTemplateRenderer'

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
    try {
      const { default: html2canvas } = await import('html2canvas')
      const { default: jsPDF } = await import('jspdf')
      
      toast('Generating PDF...', { icon: '⏳' })
      
      const element = document.getElementById('invoice-preview')
      if (!element) {
        toast.error('Invoice preview not found')
        return
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`invoice-${invoice.invoice_number}.pdf`)
      toast.success('PDF exported successfully!')
    } catch (error: any) {
      console.error('PDF export error:', error)
      toast.error('Failed to export PDF: ' + error.message)
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
        <div className="flex items-center justify-between mb-8 no-print">
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
        <Card className="mb-6 no-print">
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
          <div id="invoice-preview" className="p-8 print:p-0">
            <InvoiceTemplateRenderer
              template={invoice.template || 'professional'}
              invoice={invoice}
              items={items}
              customer={customer}
              company={profile}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
