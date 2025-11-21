import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { countries } from '@/lib/currency'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [country, setCountry] = useState('IN')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { signUp, signUpWithGoogle } = useAuth()
  const navigate = useNavigate()

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: '', color: '' }
    if (pwd.length < 6) return { strength: 1, label: 'Weak', color: 'text-red-500' }
    if (pwd.length < 10) return { strength: 2, label: 'Medium', color: 'text-yellow-500' }
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd)) {
      return { strength: 3, label: 'Strong', color: 'text-green-500' }
    }
    return { strength: 2, label: 'Medium', color: 'text-yellow-500' }
  }

  const passwordStrength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password, country)
      navigate('/auth/confirm-email', { state: { email } })
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    try {
      await signUpWithGoogle()
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up with Google')
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="w-full max-w-md">
          {/* Animated Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4">
            {/* Header with animation */}
            <div className="text-center mb-8">
              <div className="inline-block mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
                  <span className="text-3xl font-bold text-white">H</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-black dark:text-gray-100 mb-2 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Create Account
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Join Horizon and start creating invoices</p>
            </div>

            {/* Google Sign Up Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-6 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-medium text-black dark:text-gray-100 shadow-md hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span>{isGoogleLoading ? 'Signing up...' : 'Continue with Google'}</span>
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Input
                  label="Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="transition-all duration-300 focus:scale-[1.02]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="pr-10 transition-all duration-300 focus:scale-[1.02]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {password && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full transition-all duration-500 ${
                            passwordStrength.strength === 1
                              ? 'bg-red-500 w-1/3'
                              : passwordStrength.strength === 2
                              ? 'bg-yellow-500 w-2/3'
                              : 'bg-green-500 w-full'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength.color} transition-colors duration-300`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <div className={`flex items-center gap-1.5 text-xs transition-all duration-300 ${password.length >= 6 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                        {password.length >= 6 ? <CheckCircle2 size={14} className="animate-in zoom-in duration-300" /> : <XCircle size={14} />}
                        <span>6+ characters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 text-xs transition-all duration-300 ${/[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                        {/[A-Z]/.test(password) ? <CheckCircle2 size={14} className="animate-in zoom-in duration-300" /> : <XCircle size={14} />}
                        <span>Uppercase</span>
                      </div>
                      <div className={`flex items-center gap-1.5 text-xs transition-all duration-300 ${/[0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                        {/[0-9]/.test(password) ? <CheckCircle2 size={14} className="animate-in zoom-in duration-300" /> : <XCircle size={14} />}
                        <span>Number</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="pr-10 transition-all duration-300 focus:scale-[1.02]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-2 duration-300 flex items-center gap-1">
                    <XCircle size={14} />
                    Passwords do not match
                  </p>
                )}
                {confirmPassword && password === confirmPassword && password.length > 0 && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400 animate-in slide-in-from-top-2 duration-300 flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Passwords match
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-primary-400 dark:hover:border-primary-500"
                  required
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Currency will be automatically set based on your country
                </p>
              </div>
              <div className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-primary-300 dark:hover:border-primary-700">
                <input 
                  id="terms-checkbox"
                  type="checkbox" 
                  required 
                  className="mt-0.5 rounded w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 transition-all duration-200" 
                  aria-label="I agree to the Terms of Service and Privacy Policy"
                />
                <label htmlFor="terms-checkbox" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline font-medium transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline font-medium transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" 
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/auth/login" 
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold hover:underline transition-all duration-200"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
