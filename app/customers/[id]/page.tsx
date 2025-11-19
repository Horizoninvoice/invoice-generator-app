import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/ui/Card'
import { BackButton } from '@/components/ui/BackButton'
import { EditCustomerForm } from './EditCustomerForm'

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!customer) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <BackButton href="/customers" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Customer</h1>
        </div>
        <Card>
          <EditCustomerForm customer={customer} />
        </Card>
      </div>
    </div>
  )
}

