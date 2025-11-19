'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '@/lib/types'

// Cache Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient()
  }
  return supabaseClient
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => getSupabaseClient(), [])

  useEffect(() => {
    let mounted = true

    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (!mounted) return
        
        if (error) throw error
        
        setUser(user)

        if (user) {
          // Only select needed fields for better performance
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('role, subscription_status')
            .eq('user_id', user.id)
            .single()

          if (mounted) {
            setProfile(profileData)
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        if (session?.user) {
          setUser(session.user)
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('role, subscription_status')
            .eq('user_id', session.user.id)
            .single()
          if (mounted) {
            setProfile(profileData)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
        if (mounted) {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const isPro = useMemo(() => profile?.role === 'pro', [profile?.role])

  return { user, profile, loading, isPro }
}

