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
    <Button 
      variant="outline" 
      onClick={handleClick} 
      className="flex items-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium"
    >
      <FiArrowLeft size={18} />
      {label}
    </Button>
  )
}

