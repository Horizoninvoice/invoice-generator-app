import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { AdSense } from '@/components/layout/AdSense'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ProductActions } from './ProductActions'

export default async function ProductsPage() {
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

  const { data: products } = await supabase
    .from('products')
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
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-2">Manage your product catalog</p>
          </div>
          <Link href="/products/new">
            <Button>
              <FiPlus size={18} className="mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {!isPro && <AdSense />}

        <Card>
          {products && products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tax Rate</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">SKU</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {product.description ? (
                          <span className="truncate block max-w-xs">{product.description}</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{product.tax_rate}%</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{product.sku || '—'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(product.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/products/${product.id}`}>
                            <Button variant="ghost" size="sm">
                              <FiEdit size={16} />
                            </Button>
                          </Link>
                          <ProductActions productId={product.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No products yet</p>
              <Link href="/products/new">
                <Button>
                  <FiPlus size={18} className="mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

