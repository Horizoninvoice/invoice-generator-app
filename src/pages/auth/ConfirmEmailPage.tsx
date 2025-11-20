import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { CheckCircle, XCircle, Mail, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    const type = searchParams.get('type')
    const tokenHash = searchParams.get('token_hash')

    if (!token && !tokenHash) {
      // Check if user is already confirmed
      if (user) {
        checkEmailConfirmation()
      } else {
        setStatus('error')
        setMessage('Invalid confirmation link. Please check your email and try again.')
      }
      return
    }

    // Handle email confirmation
    handleEmailConfirmation(token, type, tokenHash)
  }, [searchParams, user])

  const checkEmailConfirmation = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (currentUser?.email_confirmed_at) {
        setStatus('success')
        setMessage('Your email has already been confirmed!')
        setTimeout(() => navigate('/dashboard'), 2000)
      } else {
        setStatus('error')
        setMessage('Please check your email for the confirmation link.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Failed to verify email status.')
    }
  }

  const handleEmailConfirmation = async (token: string | null, type: string | null, tokenHash: string | null) => {
    try {
      if (tokenHash && type === 'email') {
        // Verify the email with token_hash
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'email',
        })

        if (error) throw error

        if (data.user) {
          setStatus('success')
          setMessage('Email confirmed successfully! Redirecting to dashboard...')
          toast.success('Email confirmed successfully!')
          setTimeout(() => navigate('/dashboard'), 2000)
        }
      } else if (token) {
        // Alternative method with token
        const { data, error } = await supabase.auth.verifyOtp({
          token: token,
          type: 'email',
        })

        if (error) {
          if (error.message.includes('expired') || error.message.includes('invalid')) {
            setStatus('expired')
            setMessage('This confirmation link has expired. Please request a new one.')
          } else {
            throw error
          }
        } else if (data.user) {
          setStatus('success')
          setMessage('Email confirmed successfully! Redirecting to dashboard...')
          toast.success('Email confirmed successfully!')
          setTimeout(() => navigate('/dashboard'), 2000)
        }
      } else {
        setStatus('error')
        setMessage('Invalid confirmation link.')
      }
    } catch (error: any) {
      console.error('Email confirmation error:', error)
      if (error.message?.includes('expired') || error.message?.includes('invalid')) {
        setStatus('expired')
        setMessage('This confirmation link has expired or is invalid. Please request a new confirmation email.')
      } else {
        setStatus('error')
        setMessage(error.message || 'Failed to confirm email. Please try again.')
      }
    }
  }

  const handleResendConfirmation = async () => {
    try {
      const email = searchParams.get('email') || user?.email
      if (!email) {
        toast.error('Email address not found')
        return
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      if (error) throw error

      toast.success('Confirmation email sent! Please check your inbox.')
      setMessage('A new confirmation email has been sent. Please check your inbox.')
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend confirmation email')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center">
          {status === 'loading' && (
            <>
              <Loader className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Confirming Your Email</h2>
              <p className="text-gray-600 dark:text-gray-400">Please wait while we verify your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Email Confirmed!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Confirmation Failed</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={handleResendConfirmation}>
                  <Mail size={18} className="mr-2" />
                  Resend Confirmation Email
                </Button>
                <Link to="/auth/login">
                  <Button>Go to Login</Button>
                </Link>
              </div>
            </>
          )}

          {status === 'expired' && (
            <>
              <XCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Link Expired</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={handleResendConfirmation}>
                  <Mail size={18} className="mr-2" />
                  Resend Confirmation Email
                </Button>
                <Link to="/auth/login">
                  <Button variant="outline">Go to Login</Button>
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

