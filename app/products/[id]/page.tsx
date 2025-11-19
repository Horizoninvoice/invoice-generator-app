import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { EditProductForm } from './EditProductForm'

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <Link href="/products">
            <Button variant="outline">Back to Products</Button>
          </Link>
        </div>
        <Card>
          <EditProductForm product={product} />
        </Card>
      </div>
    </div>
  )
}

