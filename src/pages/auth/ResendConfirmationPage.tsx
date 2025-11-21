import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Mail, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResendConfirmationPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      if (error) throw error

      setSent(true)
      toast.success('Confirmation email sent! Please check your inbox.')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send confirmation email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <div className="text-center mb-6">
            <Mail className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Resend Confirmation Email</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your email address and we'll send you a new confirmation link.
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleResend} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
              <Button type="submit" isLoading={isLoading} className="w-full">
                <Mail size={18} className="mr-2" />
                Send Confirmation Email
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-200 text-sm">
                  Confirmation email sent! Please check your inbox and click the confirmation link.
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/auth/login" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Login
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSent(false)
                    setEmail('')
                  }}
                >
                  Send Another
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <Link to="/auth/login" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

