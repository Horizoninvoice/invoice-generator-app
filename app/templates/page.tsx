import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { FiFileText, FiAward } from 'react-icons/fi'

export default function TemplatesPage() {
  const templates = [
    {
      id: 'default',
      name: 'Default Template',
      description: 'Clean and professional design perfect for any business',
      preview: 'bg-gradient-to-br from-blue-500 to-blue-600',
      free: true,
    },
    {
      id: 'modern',
      name: 'Modern Template',
      description: 'Sleek and contemporary design with bold typography',
      preview: 'bg-gradient-to-br from-purple-500 to-purple-600',
      free: false,
    },
    {
      id: 'classic',
      name: 'Classic Template',
      description: 'Traditional design with elegant styling',
      preview: 'bg-gradient-to-br from-gray-700 to-gray-800',
      free: false,
    },
    {
      id: 'minimal',
      name: 'Minimal Template',
      description: 'Minimalist design focusing on clarity and simplicity',
      preview: 'bg-gradient-to-br from-green-500 to-green-600',
      free: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Invoice Templates</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Choose from professional invoice templates designed for every business
            </p>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`h-48 ${template.preview} flex items-center justify-center`}>
                <FiFileText className="text-white" size={64} />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                  {!template.free && (
                    <span className="flex items-center gap-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full">
                      <FiAward size={12} />
                      Pro
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{template.description}</p>
                {template.free ? (
                  <Button className="w-full" variant="outline" disabled>
                    Available
                  </Button>
                ) : (
                  <Link href="/upgrade" className="block">
                    <Button className="w-full">Upgrade to Pro</Button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 dark:bg-primary-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need More Templates?</h2>
          <p className="text-primary-100 mb-8">Upgrade to Pro to unlock all premium templates</p>
          <Link href="/upgrade">
            <Button size="lg" variant="secondary">Upgrade to Pro</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

