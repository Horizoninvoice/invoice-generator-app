import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Download, ArrowLeft } from 'react-icons/fi'
import { formatCurrency, formatDate } from '@/lib/utils'
import { InvoiceView } from './InvoiceView'

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, customers(*)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!invoice) {
    notFound()
  }

  const { data: items } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', invoice.id)
    .order('created_at', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/invoices">
            <Button variant="outline">
              <ArrowLeft size={18} className="mr-2" />
              Back to Invoices
            </Button>
          </Link>
          <InvoiceView invoice={invoice} items={items || []} />
        </div>
      </div>
    </div>
  )
}

