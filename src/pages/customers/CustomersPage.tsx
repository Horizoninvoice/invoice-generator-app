import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { Plus, Search, Edit, Trash2, Eye, Download, Mail, Phone, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'

export default function CustomersPage() {
  const { user } = useAuth()
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchCustomers()
    }
  }, [user])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      // Explicitly select columns to avoid issues with missing 'notes' column
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, email, phone, address, city, state, zip_code, country, tax_id, user_id, created_at, updated_at')
        .eq('user_id', user!.id)
        .order('name')

      if (error) {
        // If error is about missing column, try with notes included
        if (error.message?.includes('notes') || error.code === 'PGRST116') {
          console.warn('Notes column not found, fetching without it')
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('customers')
            .select('*')
            .eq('user_id', user!.id)
            .order('name')
          
          if (fallbackError) throw fallbackError
          setCustomers(fallbackData || [])
          return
        }
        throw error
      }
      setCustomers(data || [])
    } catch (error: any) {
      console.error('Error fetching customers:', error)
      toast.error(error.message || 'Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!customerToDelete) return

    try {
      const { error } = await supabase.from('customers').delete().eq('id', customerToDelete).eq('user_id', user!.id)
      if (error) throw error
      toast.success('Customer deleted successfully')
      setDeleteModalOpen(false)
      setCustomerToDelete(null)
      fetchCustomers()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete customer')
    }
  }

  const handleExport = () => {
    const dataToExport = filteredCustomers.map((customer) => ({
      Name: customer.name,
      Email: customer.email || '',
      Phone: customer.phone || '',
      Address: customer.address || '',
      City: customer.city || '',
      State: customer.state || '',
      'Zip Code': customer.zip_code || '',
      Country: customer.country || '',
      'Tax ID': customer.tax_id || '',
    }))

    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Customers')
    XLSX.writeFile(wb, `customers-${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Customers exported successfully')
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm)
  )

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download size={18} className="mr-2" />
              Export
            </Button>
            <Link to="/customers/create">
              <Button>
                <Plus size={18} className="mr-2" />
                Add Customer
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Customers Grid */}
        {filteredCustomers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{customer.name}</h3>
                    {customer.tax_id && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tax ID: {customer.tax_id}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Link to={`/customers/${customer.id}`}>
                      <button className="p-1.5 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">
                        <Eye size={16} />
                      </button>
                    </Link>
                    <Link to={`/customers/${customer.id}/edit`}>
                      <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <Edit size={16} />
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        setCustomerToDelete(customer.id)
                        setDeleteModalOpen(true)
                      }}
                      className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {customer.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail size={14} />
                      <span>{customer.email}</span>
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone size={14} />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin size={14} className="mt-0.5" />
                      <span>
                        {customer.address}
                        {customer.city && `, ${customer.city}`}
                        {customer.state && `, ${customer.state}`}
                        {customer.zip_code && ` ${customer.zip_code}`}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link to={`/invoices/create?customer=${customer.id}`}>
                    <Button variant="outline" className="w-full" size="sm">
                      Create Invoice
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? 'No customers match your search' : 'No customers yet'}
              </p>
              {!searchTerm && (
                <Link to="/customers/create">
                  <Button>Add Your First Customer</Button>
                </Link>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setCustomerToDelete(null)
        }}
        title="Delete Customer"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this customer? This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setDeleteModalOpen(false)
              setCustomerToDelete(null)
            }}
          >
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
