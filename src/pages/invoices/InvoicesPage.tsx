import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Plus, Search, Filter, Download, Trash2, Edit, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'

export default function InvoicesPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const itemsPerPage = 10

  useEffect(() => {
    if (user) {
      fetchInvoices()
    }
  }, [user, statusFilter])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('invoices')
        .select('*, customers(name, email)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setInvoices(data || [])
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return

    try {
      const { error } = await supabase.from('invoices').delete().eq('id', id).eq('user_id', user!.id)
      if (error) throw error
      toast.success('Invoice deleted successfully')
      fetchInvoices()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete invoice')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedInvoices.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedInvoices.length} invoice(s)?`)) return

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .in('id', selectedInvoices)
        .eq('user_id', user!.id)

      if (error) throw error
      toast.success(`${selectedInvoices.length} invoice(s) deleted successfully`)
      setSelectedInvoices([])
      fetchInvoices()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete invoices')
    }
  }

  const handleExport = () => {
    const dataToExport = filteredInvoices.map((inv) => ({
      'Invoice Number': inv.invoice_number,
      'Customer': inv.customers?.name || 'N/A',
      'Date': formatDate(inv.issue_date),
      'Due Date': inv.due_date ? formatDate(inv.due_date) : 'N/A',
      'Status': inv.status,
      'Amount': inv.total_amount,
      'Currency': inv.currency,
    }))

    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Invoices')
    XLSX.writeFile(wb, `invoices-${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Invoices exported successfully')
  }

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customers?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage)

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <Link to="/invoices/create">
            <Button>
              <Plus size={18} className="mr-2" />
              Create Invoice
            </Button>
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search by invoice number, customer..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
            />
            <div className="flex gap-2">
              {selectedInvoices.length > 0 && (
                <Button variant="danger" onClick={handleBulkDelete}>
                  <Trash2 size={18} className="mr-2" />
                  Delete ({selectedInvoices.length})
                </Button>
              )}
              <Button variant="outline" onClick={handleExport}>
                <Download size={18} className="mr-2" />
                Export
              </Button>
            </div>
          </div>
        </Card>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {statusOptions.slice(1).map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setStatusFilter(option.value)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Invoices Table */}
        <Card>
          {paginatedInvoices.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.length === paginatedInvoices.length && paginatedInvoices.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedInvoices(paginatedInvoices.map((inv) => inv.id))
                            } else {
                              setSelectedInvoices([])
                            }
                          }}
                          className="rounded"
                        />
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Invoice #</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedInvoices.includes(invoice.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedInvoices([...selectedInvoices, invoice.id])
                              } else {
                                setSelectedInvoices(selectedInvoices.filter((id) => id !== invoice.id))
                              }
                            }}
                            className="rounded"
                          />
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                          {invoice.invoice_number}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {invoice.customers?.name || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(invoice.issue_date)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {invoice.due_date ? formatDate(invoice.due_date) : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(invoice.total_amount, invoice.currency || profile?.currency || 'INR')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Link to={`/invoices/${invoice.id}`}>
                              <button className="p-1 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">
                                <Eye size={16} />
                              </button>
                            </Link>
                            <Link to={`/invoices/${invoice.id}/edit`}>
                              <button className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                <Edit size={16} />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(invoice.id)}
                              className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredInvoices.length)} of{' '}
                    {filteredInvoices.length} invoices
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter !== 'all' ? 'No invoices match your filters' : 'No invoices yet'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link to="/invoices/create">
                  <Button>Create Your First Invoice</Button>
                </Link>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
