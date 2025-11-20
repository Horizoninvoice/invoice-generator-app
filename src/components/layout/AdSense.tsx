import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export default function AdSense() {
  const { isPro, isMax, loading } = useAuth()
  const adsenseId = import.meta.env.VITE_GOOGLE_ADSENSE_ID

  useEffect(() => {
    if (!isPro && !isMax && !loading && adsenseId && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({})
      } catch (e) {
        console.error('AdSense error:', e)
      }
    }
  }, [isPro, isMax, loading, adsenseId])

  if (isPro || isMax || loading || !adsenseId) return null

  return (
    <div className="w-full flex justify-center my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseId}
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

