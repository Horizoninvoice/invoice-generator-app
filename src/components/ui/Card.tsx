import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  actions?: ReactNode
}

export default function Card({ children, className, title, actions }: CardProps) {
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700', className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}

