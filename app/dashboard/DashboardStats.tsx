import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { FiFileText, FiUsers, FiPackage, FiDollarSign, FiTrendingUp } from 'react-icons/fi'
import { formatCurrency } from '@/lib/utils'

interface DashboardStatsProps {
  customerCount: number
  productCount: number
  invoiceCount: number
  totalRevenue: number
  paidInvoices: number
}

export function DashboardStats({
  customerCount,
  productCount,
  invoiceCount,
  totalRevenue,
  paidInvoices,
}: DashboardStatsProps) {
  const stats = [
    {
      name: 'Total Customers',
      value: customerCount,
      icon: FiUsers,
      href: '/customers',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      name: 'Total Products',
      value: productCount,
      icon: FiPackage,
      href: '/products',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      name: 'Total Invoices',
      value: invoiceCount,
      icon: FiFileText,
      href: '/invoices',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      name: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: FiDollarSign,
      href: '/invoices',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      name: 'Paid Invoices',
      value: paidInvoices,
      icon: FiTrendingUp,
      href: '/invoices?status=paid',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Link key={stat.name} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}

