'use client'

import { useUser } from '@/lib/hooks/useUser'
import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export function AdSense() {
  const { isPro, loading } = useUser()

  useEffect(() => {
    if (!isPro && !loading && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({})
      } catch (e) {
        console.error('AdSense error:', e)
      }
    }
  }, [isPro, loading])

  if (isPro || loading) return null

  return (
    <div className="w-full flex justify-center my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

