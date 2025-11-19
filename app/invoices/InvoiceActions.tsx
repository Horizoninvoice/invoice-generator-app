'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { FiEye, FiTrash2 } from 'react-icons/fi'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export function InvoiceActions({ invoice }: { invoice: any }) {
  const router = useRouter()
  const supabase = createClient()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this invoice?')) return

    setIsDeleting(true)
    try {
      const { error } = await supabase.from('invoices').delete().eq('id', invoice.id)

      if (error) throw error

      toast.success('Invoice deleted successfully')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete invoice')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/invoices/${invoice.id}`}>
        <Button variant="ghost" size="sm">
          <FiEye size={16} />
        </Button>
      </Link>
      <Button variant="ghost" size="sm" onClick={handleDelete} isLoading={isDeleting}>
        <FiTrash2 size={16} className="text-red-600" />
      </Button>
    </div>
  )
}

