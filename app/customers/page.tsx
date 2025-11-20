import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { AdSense } from '@/components/layout/AdSense'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BackButton } from '@/components/ui/BackButton'
import Link from 'next/link'
import { FiPlus, FiEdit, FiTrash2 } from '@/lib/icons'
import { formatDate } from '@/lib/utils'
import { CustomerActions } from '@/components/customers/CustomerActions'

export default async function CustomersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  const { data: customers } = await supabase
    .from('customers')
    .select('id, name, email, phone, city, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const isPro = profile?.role === 'pro'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <BackButton href="/dashboard" />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Customers</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your customer database</p>
          </div>
        </div>
        <div className="flex items-center justify-end mb-8">
          <Link href="/customers/new">
            <Button>
              <FiPlus size={18} className="mr-2" />
              Add Customer
            </Button>
          </Link>
        </div>

        {!isPro && <AdSense />}

        <Card>
          {customers && customers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Phone</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">City</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Created</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{customer.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{customer.email || '—'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{customer.phone || '—'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{customer.city || '—'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(customer.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/customers/${customer.id}`}>
                            <Button variant="ghost" size="sm">
                              <FiEdit size={16} />
                            </Button>
                          </Link>
                          <CustomerActions customerId={customer.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No customers yet</p>
              <Link href="/customers/new">
                <Button>
                  <FiPlus size={18} className="mr-2" />
                  Add Your First Customer
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

