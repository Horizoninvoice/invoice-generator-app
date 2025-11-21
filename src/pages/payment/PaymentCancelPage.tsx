import { Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { XCircle, Mail, HelpCircle } from 'lucide-react'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">Payment Cancelled</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your payment was cancelled. You can try again anytime or contact support if you need assistance.
          </p>

          {/* Support Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <HelpCircle className="text-gray-400" size={18} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Need Help?</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              If you're experiencing issues with payment, please contact our support team.
            </p>
            <a href="mailto:horizoninvoicegen@gmail.com" className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
              <Mail size={14} className="inline mr-1" />
              horizoninvoicegen@gmail.com
            </a>
          </div>

          <div className="flex gap-4 justify-center">
            <Link to="/subscription">
              <Button>Try Again</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

