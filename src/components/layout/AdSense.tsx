import { useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export default function AdSense() {
  const { isPro, isMax, loading } = useAuth()
  const adsenseId = import.meta.env.VITE_GOOGLE_ADSENSE_ID
  const adRef = useRef<HTMLDivElement>(null)
  const adLoaded = useRef(false)

  useEffect(() => {
    // Load AdSense script if not already loaded
    if (!document.querySelector('script[src*="adsbygoogle"]')) {
      const script = document.createElement('script')
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + adsenseId
      script.async = true
      script.crossOrigin = 'anonymous'
      document.head.appendChild(script)
    }
  }, [adsenseId])

  useEffect(() => {
    if (!isPro && !isMax && !loading && adsenseId && window.adsbygoogle && adRef.current && !adLoaded.current) {
      try {
        window.adsbygoogle.push({})
        adLoaded.current = true
      } catch (e) {
        console.error('AdSense error:', e)
      }
    }
  }, [isPro, isMax, loading, adsenseId])

  if (isPro || isMax || loading || !adsenseId) return null

  return (
    <div ref={adRef} className="w-full flex justify-center my-4 min-h-[100px]">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '320px', minHeight: '100px' }}
        data-ad-client={adsenseId}
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

