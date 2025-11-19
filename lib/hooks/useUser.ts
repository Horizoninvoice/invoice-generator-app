'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
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

// Cache user data to prevent unnecessary re-fetches
let cachedUser: User | null = null
let cachedProfile: UserProfile | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 5000 // 5 seconds

export function useUser() {
  const [user, setUser] = useState<User | null>(cachedUser)
  const [profile, setProfile] = useState<UserProfile | null>(cachedProfile)
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => getSupabaseClient(), [])

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    const getUser = async () => {
      try {
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (mounted) {
            setLoading(false)
          }
        }, 3000) // Max 3 seconds loading

        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (!mounted) {
          clearTimeout(timeoutId)
          return
        }
        
        if (error) {
          // If error, user is not authenticated
          setUser(null)
          setProfile(null)
          cachedUser = null
          cachedProfile = null
          setLoading(false)
          clearTimeout(timeoutId)
          return
        }
        
        setUser(user)
        cachedUser = user

        if (user) {
          // Only select needed fields for better performance
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('role, subscription_status, subscription_type, country, currency')
              .eq('user_id', user.id)
              .single()

            if (!mounted) {
              clearTimeout(timeoutId)
              return
            }

            if (profileError) {
              // Profile might not exist yet, that's okay
              console.warn('Profile not found:', profileError.message)
              setProfile(null)
              cachedProfile = null
            } else {
              setProfile(profileData)
              cachedProfile = profileData
            }
          } catch (profileErr) {
            console.warn('Error fetching profile:', profileErr)
            if (mounted) {
              setProfile(null)
              cachedProfile = null
            }
          }
        } else {
          setProfile(null)
          cachedProfile = null
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        if (mounted) {
          setUser(null)
          setProfile(null)
          cachedUser = null
          cachedProfile = null
        }
      } finally {
        if (mounted) {
          clearTimeout(timeoutId)
          setLoading(false)
        }
      }
    }

    // Check if we have cached data that's still fresh
    const now = Date.now()
    if (cachedUser && (now - cacheTimestamp) < CACHE_DURATION) {
      setLoading(false)
    } else {
      getUser()
      cacheTimestamp = now
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        if (session?.user) {
          setUser(session.user)
          cachedUser = session.user
          cacheTimestamp = Date.now()
          
          try {
            const { data: profileData } = await supabase
              .from('user_profiles')
              .select('role, subscription_status, subscription_type, country, currency')
              .eq('user_id', session.user.id)
              .single()
            
            if (mounted) {
              setProfile(profileData || null)
              cachedProfile = profileData || null
            }
          } catch (err) {
            if (mounted) {
              setProfile(null)
              cachedProfile = null
            }
          }
        } else {
          setUser(null)
          setProfile(null)
          cachedUser = null
          cachedProfile = null
          cacheTimestamp = 0
        }
        if (mounted) {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [supabase])

  const isPro = useMemo(() => profile?.role === 'pro' || profile?.role === 'max', [profile?.role])
  const isMax = useMemo(() => profile?.role === 'max', [profile?.role])

  return { user, profile, loading, isPro, isMax }
}
