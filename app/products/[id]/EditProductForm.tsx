'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import type { Product } from '@/lib/types'
import toast from 'react-hot-toast'

export function EditProductForm({ product }: { product: Product }) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || '',
    price: product.price.toString(),
    tax_rate: product.tax_rate.toString(),
    unit: product.unit,
    sku: product.sku || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('products')
        .update({
          ...formData,
          price: parseFloat(formData.price),
          tax_rate: parseFloat(formData.tax_rate),
        })
        .eq('id', product.id)

      if (error) throw error

      toast.success('Product updated successfully!')
      router.push('/products')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Input
          label="Product Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="md:col-span-2"
        />
        <Textarea
          label="Description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="md:col-span-2"
        />
        <Input
          label="Price"
          type="number"
          step="0.01"
          required
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <Input
          label="Tax Rate (%)"
          type="number"
          step="0.01"
          value={formData.tax_rate}
          onChange={(e) => setFormData({ ...formData, tax_rate: e.target.value })}
        />
        <Input
          label="Unit"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
        />
        <Input
          label="SKU"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
        />
      </div>
      <div className="flex gap-4">
        <Button type="submit" isLoading={isLoading}>
          Update Product
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

