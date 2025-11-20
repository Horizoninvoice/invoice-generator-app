import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { ArrowLeft, Edit, Trash2, FileText, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [product, setProduct] = useState<any>(null)
  const [usageCount, setUsageCount] = useState(0)
  const [relatedInvoices, setRelatedInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  useEffect(() => {
    if (user && id) {
      fetchProductData()
    }
  }, [user, id])

  const fetchProductData = async () => {
    try {
      setLoading(true)
      // Fetch product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('user_id', user!.id)
        .single()

      if (productError) throw productError
      setProduct(productData)

      // Fetch usage in invoices
      const { data: itemsData } = await supabase
        .from('invoice_items')
        .select('invoice_id, invoices(id, invoice_number, issue_date, total_amount, status, currency)')
        .eq('product_id', id)

      if (itemsData) {
        setUsageCount(itemsData.length)
        setRelatedInvoices(
          itemsData.map((item) => item.invoices).filter(Boolean) as any[]
        )
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch product data')
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id).eq('user_id', user!.id)
      if (error) throw error
      toast.success('Product deleted successfully')
      navigate('/products')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product')
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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <p className="text-gray-600 dark:text-gray-400">Product not found</p>
            <Link to="/products">
              <Button className="mt-4">Back to Products</Button>
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
            <Link to="/products">
              <Button variant="ghost">
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">Product Details</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/products/${id}/edit`}>
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
          {/* Product Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card title="Product Information">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Product Name</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</p>
                </div>
                {product.sku && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">SKU</p>
                    <p className="text-sm text-gray-900 dark:text-white">{product.sku}</p>
                  </div>
                )}
                {product.description && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Description</p>
                    <p className="text-sm text-gray-900 dark:text-white whitespace-pre-line">{product.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Unit</p>
                  <p className="text-sm text-gray-900 dark:text-white capitalize">{product.unit || 'unit'}</p>
                </div>
              </div>
            </Card>

            {/* Pricing */}
            <Card title="Pricing">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Unit Price</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(product.price, profile?.currency || 'INR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tax Rate</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{product.tax_rate || 0}%</p>
                </div>
              </div>
            </Card>

            {/* Usage Statistics */}
            <Card title="Usage Statistics">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Times Used</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{usageCount}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">in invoices</p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions">
              <Link to={`/invoices/create?product=${product.id}`}>
                <Button className="w-full">
                  <Plus size={18} className="mr-2" />
                  Add to Invoice
                </Button>
              </Link>
            </Card>
          </div>

          {/* Related Invoices */}
          <div className="lg:col-span-2">
            <Card title="Related Invoices">
              {relatedInvoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Invoice #</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatedInvoices.map((invoice: any) => (
                        <tr
                          key={invoice.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                            {invoice.invoice_number}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                            {new Date(invoice.issue_date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(invoice.total_amount, invoice.currency || profile?.currency || 'INR')}
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
                  <p className="text-gray-600 dark:text-gray-400 mb-4">This product hasn't been used in any invoices yet</p>
                  <Link to={`/invoices/create?product=${product.id}`}>
                    <Button>Add to Invoice</Button>
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
        title="Delete Product"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this product? This action cannot be undone.
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
