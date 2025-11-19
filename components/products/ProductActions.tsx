'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { FiTrash2 } from '@/lib/icons'
import toast from 'react-hot-toast'

export function ProductActions({ productId }: { productId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return

    setIsDeleting(true)
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId)

      if (error) throw error

      toast.success('Product deleted successfully')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} isLoading={isDeleting}>
      <FiTrash2 size={16} className="text-red-600" />
    </Button>
  )
}

