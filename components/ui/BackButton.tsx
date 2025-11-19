'use client'

import { useRouter } from 'next/navigation'
import { FiArrowLeft } from '@/lib/icons'
import { Button } from './Button'

interface BackButtonProps {
  href?: string
  label?: string
}

export function BackButton({ href, label = 'Back' }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <Button variant="ghost" onClick={handleClick} className="flex items-center gap-2">
      <FiArrowLeft size={18} />
      {label}
    </Button>
  )
}

