import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { CheckCircle, Download, Award } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const { profile, refreshProfile } = useAuth()

  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  const plan = searchParams.get('plan') || 'pro'
  const amount = searchParams.get('amount') || '0'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">Payment Successful!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your subscription has been activated. You now have access to all premium features.
          </p>

          {/* Payment Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-black dark:text-white mb-4">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                <span className="font-medium text-black dark:text-white">
                  {plan === 'max' ? 'Max (Lifetime)' : 'Pro (Monthly)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <span className="font-medium text-black dark:text-white">
                  {formatCurrency(parseFloat(amount) / 100, profile?.currency || 'INR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="font-medium text-green-600 dark:text-green-400">Completed</span>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          {profile && (
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Award className="text-primary-600 dark:text-primary-400" size={20} />
                <span className="text-primary-700 dark:text-primary-300 font-medium">
                  {profile.role === 'max' ? 'Max Account' : 'Pro Account'} Active
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Link to="/dashboard">
              <Button>
                Go to Dashboard
              </Button>
            </Link>
            <Button variant="outline">
              <Download size={18} className="mr-2" />
              Download Receipt
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

