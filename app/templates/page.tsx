'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { FiFileText, FiAward, FiCheck } from 'react-icons/fi'

// Dynamic imports for heavy components
const Footer = dynamic(() => import('@/components/layout/Footer').then(mod => ({ default: mod.Footer })), {
  ssr: true,
})

const TemplatePreview = dynamic(() => import('@/components/templates/TemplatePreview').then(mod => ({ default: mod.TemplatePreview })), {
  ssr: false,
  loading: () => <div className="w-full max-w-md h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />,
})

export default function TemplatesPage() {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  const templates = [
    {
      id: 'default',
      name: 'Default Template',
      description: 'Clean and professional design perfect for any business',
      preview: 'bg-gradient-to-br from-blue-500 to-blue-600',
      free: true,
      features: ['Professional layout', 'Clear typography', 'Easy to read'],
    },
    {
      id: 'modern',
      name: 'Modern Template',
      description: 'Sleek and contemporary design with bold typography',
      preview: 'bg-gradient-to-br from-purple-500 to-purple-600',
      free: false,
      features: ['Bold design', 'Modern aesthetics', 'Eye-catching'],
    },
    {
      id: 'classic',
      name: 'Classic Template',
      description: 'Traditional design with elegant styling',
      preview: 'bg-gradient-to-br from-gray-700 to-gray-800',
      free: false,
      features: ['Elegant style', 'Professional look', 'Timeless design'],
    },
    {
      id: 'minimal',
      name: 'Minimal Template',
      description: 'Minimalist design focusing on clarity and simplicity',
      preview: 'bg-gradient-to-br from-green-500 to-green-600',
      free: false,
      features: ['Clean design', 'Simple layout', 'Focus on content'],
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
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group"
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Template Preview */}
                <div className="relative bg-gray-100 dark:bg-gray-800 p-6 min-h-[500px] flex items-center justify-center">
                  <div className={`w-full max-w-md transition-all duration-500 ${
                    hoveredTemplate === template.id 
                      ? 'scale-110 opacity-100' 
                      : 'scale-100 opacity-90'
                  }`}>
                    <TemplatePreview 
                      template={template.id as 'default' | 'modern' | 'classic' | 'minimal'} 
                      isHovered={hoveredTemplate === template.id}
                    />
                  </div>
                  
                  {/* Animated Background Pattern */}
                  <div className={`absolute inset-0 opacity-5 transition-opacity duration-500 ${
                    hoveredTemplate === template.id ? 'opacity-10' : 'opacity-5'
                  }`}>
                    <div className={`absolute inset-0 ${template.preview} animate-pulse`}></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                  </div>

                  {/* Hover Overlay Effect */}
                  {hoveredTemplate === template.id && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent animate-pulse"></div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-6 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{template.name}</h3>
                    {!template.free && (
                      <span className="flex items-center gap-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full font-semibold animate-pulse">
                        <FiAward size={14} />
                        Pro Only
                      </span>
                    )}
                    {template.free && (
                      <span className="flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full font-semibold">
                        <FiCheck size={14} />
                        Free
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{template.description}</p>
                  
                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    {template.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className={`w-1.5 h-1.5 rounded-full ${template.preview} transition-all duration-300 ${
                          hoveredTemplate === template.id ? 'scale-150' : 'scale-100'
                        }`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {template.free ? (
                    <Button className="w-full" variant="outline" disabled>
                      Currently Using
                    </Button>
                  ) : (
                    <Link href="/upgrade" className="block">
                      <Button className="w-full group-hover:scale-105 transition-transform duration-300">
                        Upgrade to Pro
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Template Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900 dark:text-white">Feature</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-900 dark:text-white">Default</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-primary-600 dark:text-primary-400">Pro Templates</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">Professional Design</td>
                  <td className="py-4 px-4 text-center"><FiCheck className="mx-auto text-green-600" size={20} /></td>
                  <td className="py-4 px-4 text-center"><FiCheck className="mx-auto text-green-600" size={20} /></td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">Customizable Colors</td>
                  <td className="py-4 px-4 text-center"><span className="text-gray-400">—</span></td>
                  <td className="py-4 px-4 text-center"><FiCheck className="mx-auto text-green-600" size={20} /></td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">Multiple Styles</td>
                  <td className="py-4 px-4 text-center"><span className="text-gray-400">1</span></td>
                  <td className="py-4 px-4 text-center"><span className="text-primary-600 dark:text-primary-400 font-semibold">4+</span></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">Brand Customization</td>
                  <td className="py-4 px-4 text-center"><span className="text-gray-400">—</span></td>
                  <td className="py-4 px-4 text-center"><FiCheck className="mx-auto text-green-600" size={20} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Upgrade?</h2>
          <p className="text-primary-100 mb-8">Unlock all premium templates and take your invoices to the next level</p>
          <Link href="/upgrade">
            <Button size="lg" variant="secondary" className="animate-bounce hover:animate-none">
              Upgrade to Pro
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
