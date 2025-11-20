import { Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Plus } from 'lucide-react'

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <Link to="/products/create">
            <Button>
              <Plus size={18} className="mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
        <Card>
          <p className="text-gray-600 dark:text-gray-400">Product list coming soon...</p>
        </Card>
      </div>
    </div>
  )
}

