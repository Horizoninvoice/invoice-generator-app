import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import { ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    tax_rate: 0,
    unit: 'unit',
    sku: '',
  })

  const unitOptions = [
    { value: 'unit', label: 'Unit' },
    { value: 'hour', label: 'Hour' },
    { value: 'day', label: 'Day' },
    { value: 'month', label: 'Month' },
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'lb', label: 'Pound (lb)' },
    { value: 'piece', label: 'Piece' },
    { value: 'box', label: 'Box' },
    { value: 'package', label: 'Package' },
    { value: 'service', label: 'Service' },
  ]

  useEffect(() => {
    if (user && id) {
      fetchProduct()
    }
  }, [user, id])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('user_id', user!.id)
        .single()

      if (error) throw error
      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        tax_rate: data.tax_rate || 0,
        unit: data.unit || 'unit',
        sku: data.sku || '',
      })
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch product')
      navigate('/products')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('products')
        .update(formData)
        .eq('id', id)
        .eq('user_id', user!.id)

      if (error) throw error
      toast.success('Product updated successfully!')
      navigate(`/products/${id}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to={`/products/${id}`}>
            <Button variant="ghost">
              <ArrowLeft size={18} className="mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-black dark:text-white">Edit Product</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <div className="space-y-6">
              {/* Product Information */}
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Product Information</h3>
                <div className="space-y-4">
                  <Input
                    label="Product Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                  <Textarea
                    label="Description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Product description"
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="SKU"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="Stock keeping unit"
                    />
                    <Select
                      label="Unit of Measurement"
                      options={unitOptions}
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Pricing</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Unit Price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                  <Input
                    label="Tax Rate (%)"
                    type="number"
                    step="0.01"
                    value={formData.tax_rate}
                    onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button type="submit" isLoading={isLoading} className="flex-1">
                  <Save size={18} className="mr-2" />
                  Update Product
                </Button>
                <Link to={`/products/${id}`}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  )
}

