import { Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { CheckCircle } from 'lucide-react'

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Payment Successful!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your subscription has been activated. You now have access to all premium features.
          </p>
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}

