'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Trash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

export function CustomerActions({ customerId }: { customerId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this customer?')) return

    setIsDeleting(true)
    try {
      const { error } = await supabase.from('customers').delete().eq('id', customerId)

      if (error) throw error

      toast.success('Customer deleted successfully')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete customer')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} isLoading={isDeleting}>
      <Trash2 size={16} className="text-red-600" />
    </Button>
  )
}

