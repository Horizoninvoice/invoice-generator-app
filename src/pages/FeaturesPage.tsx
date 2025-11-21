import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import { FileText, Users, Package, DollarSign, Download, Mail, BarChart2, Palette, Shield, Zap } from 'lucide-react'

export default function FeaturesPage() {
  const features = [
    {
      icon: FileText,
      title: 'Professional Invoice Templates',
      description: 'Choose from multiple beautiful, customizable invoice templates that make a great impression on your clients.',
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Easily manage your customer database with detailed contact information and transaction history.',
    },
    {
      icon: Package,
      title: 'Product Catalog',
      description: 'Create and manage your product catalog for quick invoice item selection and consistent pricing.',
    },
    {
      icon: DollarSign,
      title: 'Multi-Currency Support',
      description: 'Generate invoices in any currency with automatic formatting based on your country settings.',
    },
    {
      icon: Download,
      title: 'Export & Share',
      description: 'Export invoices as PDF, Excel, or print directly. Share invoices via email with your clients.',
    },
    {
      icon: Mail,
      title: 'Email Integration',
      description: 'Send invoices directly to customers via email with professional formatting and branding.',
    },
    {
      icon: BarChart2,
      title: 'Reports & Analytics',
      description: 'Track your business performance with detailed reports and analytics (Pro/Max feature).',
    },
    {
      icon: Palette,
      title: 'Custom Branding',
      description: 'Add your company logo, customize colors, and personalize invoices with your brand identity.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. We never share your information with third parties.',
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Lightning-fast invoice generation with real-time preview. No waiting, no delays.',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">
              Powerful Features for Your Business
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto">
              Everything you need to create, manage, and track your invoices efficiently.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="text-primary-600 dark:text-primary-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

