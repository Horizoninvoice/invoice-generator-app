import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import TemplatePreview from '@/components/templates/TemplatePreview'
import TemplateFullView from '@/components/templates/TemplateFullView'
import { FileText, Palette, Sparkles, Eye } from 'lucide-react'

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const templates = [
    {
      name: 'Professional',
      description: 'Clean and modern design with a bold header. Perfect for professional services and businesses.',
      category: 'Free',
      color: 'blue',
    },
    {
      name: 'Default',
      description: 'Simple and straightforward layout. Great for quick invoices and everyday use.',
      category: 'Free',
      color: 'gray',
    },
    {
      name: 'Modern',
      description: 'Contemporary design with gradient accents. Ideal for creative agencies and modern businesses.',
      category: 'Pro',
      color: 'purple',
    },
    {
      name: 'Classic',
      description: 'Traditional layout with elegant borders. Perfect for established businesses and formal invoices.',
      category: 'Pro',
      color: 'amber',
    },
    {
      name: 'Minimal',
      description: 'Ultra-clean design with minimal elements. Best for minimalist brands and modern aesthetics.',
      category: 'Pro',
      color: 'green',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Beautiful Invoice Templates
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose from our collection of professionally designed invoice templates. Each template is fully customizable with your branding.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <FileText className="text-primary-600 dark:text-primary-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {template.name}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        template.category === 'Free'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                      }`}>
                        {template.category}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {template.description}
                </p>
                
                {/* Template Preview */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye size={16} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Preview</span>
                  </div>
                  <TemplatePreview 
                    template={template.name.toLowerCase()} 
                    name={template.name}
                    onClick={() => setSelectedTemplate(template.name.toLowerCase())}
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Palette size={16} />
                  <span>Fully Customizable</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-16">
            <Card className="p-8 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Customize Your Templates
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    All templates support custom branding including your logo, company colors, and personalized styling. 
                    Make every invoice uniquely yours.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />

      {/* Template Preview Modal */}
      <Modal
        isOpen={selectedTemplate !== null}
        onClose={() => setSelectedTemplate(null)}
        title={selectedTemplate ? templates.find(t => t.name.toLowerCase() === selectedTemplate)?.name + ' Template Preview' : ''}
        size="xl"
      >
        {selectedTemplate && <TemplateFullView template={selectedTemplate} />}
      </Modal>
    </div>
  )
}

