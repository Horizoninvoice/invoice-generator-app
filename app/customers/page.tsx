import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { AdSense } from '@/components/layout/AdSense'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'react-icons/fi'
import { formatDate } from '@/lib/utils'
import { CustomerActions } from './CustomerActions'

export default async function CustomersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const isPro = profile?.role === 'pro'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-2">Manage your customer database</p>
          </div>
          <Link href="/customers/new">
            <Button>
              <Plus size={18} className="mr-2" />
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
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Phone</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">City</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{customer.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{customer.email || '—'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{customer.phone || '—'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{customer.city || '—'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(customer.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/customers/${customer.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit size={16} />
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
                  <Plus size={18} className="mr-2" />
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

