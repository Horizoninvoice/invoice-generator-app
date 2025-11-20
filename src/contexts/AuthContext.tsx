import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { getCurrencyByCountry } from '@/lib/currency'
import toast from 'react-hot-toast'

interface UserProfile {
  id: string
  user_id: string
  role: 'free' | 'pro' | 'max'
  subscription_type: string
  subscription_status?: string
  subscription_end_date?: string
  country?: string
  currency?: string
  logo_url?: string
  shop_name?: string
  shop_address?: string
  shop_email?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, country: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  isPro: boolean
  isMax: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      // Check if error is due to unconfirmed email
      if (error.message?.includes('email') && error.message?.includes('confirm')) {
        throw new Error('Please confirm your email before signing in. Check your inbox for the confirmation link.')
      }
      throw error
    }
    
    // Check if email is confirmed
    if (data.user && !data.user.email_confirmed_at) {
      throw new Error('Please confirm your email before signing in. Check your inbox for the confirmation link.')
    }
    
    toast.success('Logged in successfully!')
  }

  const signUp = async (email: string, password: string, country: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    
    // Profile will be created by database trigger, but we can update country
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const currency = getCurrencyByCountry(country)
      await supabase.from('user_profiles').update({ country, currency: currency.code }).eq('user_id', user.id)
    }
    
    toast.success('Account created! Please check your email to verify your account.')
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
    toast.success('Logged out successfully!')
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  const isPro = profile?.role === 'pro' || profile?.role === 'max'
  const isMax = profile?.role === 'max'

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        isPro,
        isMax,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

