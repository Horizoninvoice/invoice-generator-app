import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { Plus, Search, Edit, Trash2, Eye, Download, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'

export default function ProductsPage() {
  const { user, profile } = useAuth()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user!.id)
        .order('name')

      if (error) throw error
      setProducts(data || [])
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!productToDelete) return

    try {
      const { error } = await supabase.from('products').delete().eq('id', productToDelete).eq('user_id', user!.id)
      if (error) throw error
      toast.success('Product deleted successfully')
      setDeleteModalOpen(false)
      setProductToDelete(null)
      fetchProducts()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product')
    }
  }

  const handleExport = () => {
    const dataToExport = filteredProducts.map((product) => ({
      Name: product.name,
      Description: product.description || '',
      SKU: product.sku || '',
      Price: product.price,
      'Tax Rate (%)': product.tax_rate || 0,
      Unit: product.unit || 'unit',
    }))

    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Products')
    XLSX.writeFile(wb, `products-${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Products exported successfully')
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-black dark:text-gray-100">Products</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download size={18} className="mr-2" />
              Export
            </Button>
            <Link to="/products/create">
              <Button>
                <Plus size={18} className="mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search products by name, description, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Products Grid/Table */}
        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="text-primary-600 dark:text-primary-400" size={20} />
                      <h3 className="text-lg font-semibold text-black dark:text-gray-100">{product.name}</h3>
                    </div>
                    {product.sku && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">SKU: {product.sku}</p>
                    )}
                    {product.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Link to={`/products/${product.id}`}>
                      <button className="p-1.5 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">
                        <Eye size={16} />
                      </button>
                    </Link>
                    <Link to={`/products/${product.id}/edit`}>
                      <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <Edit size={16} />
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        setProductToDelete(product.id)
                        setDeleteModalOpen(true)
                      }}
                      className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</p>
                      <p className="text-xl font-bold text-black dark:text-gray-100">
                        {formatCurrency(product.price, profile?.currency || 'INR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tax Rate</p>
                      <p className="text-sm font-medium text-black dark:text-gray-100">{product.tax_rate || 0}%</p>
                    </div>
                  </div>
                  {product.unit && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Unit: {product.unit}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? 'No products match your search' : 'No products yet'}
              </p>
              {!searchTerm && (
                <Link to="/products/create">
                  <Button>Add Your First Product</Button>
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
          setProductToDelete(null)
        }}
        title="Delete Product"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setDeleteModalOpen(false)
              setProductToDelete(null)
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
