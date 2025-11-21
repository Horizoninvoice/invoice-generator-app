import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import { Target, Users, Zap, Shield } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              About Horizon
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Professional invoice generation made simple.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-black dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                At Horizon, we believe that invoicing should be simple, fast, and professional. Our mission is to 
                empower businesses of all sizes to create beautiful, professional invoices without the complexity 
                of traditional accounting software.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                We're committed to providing a seamless experience that helps you focus on what matters most - 
                growing your business.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-black dark:text-white mb-4">What We Offer</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Horizon is a cloud-based invoice generator that combines powerful features with an intuitive interface. 
                Whether you're a freelancer, small business, or growing company, we have the tools you need to 
                manage your invoicing efficiently.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                From customizable templates to customer management and detailed reporting, we've built everything 
                you need to streamline your invoicing process.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-primary-600 dark:text-primary-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Focused</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We focus on making invoicing simple and efficient
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-600 dark:text-primary-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">User-Centric</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Built with your needs and feedback in mind
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-primary-600 dark:text-primary-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Fast</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Lightning-fast performance and real-time updates
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary-600 dark:text-primary-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Secure</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Your data is encrypted and protected
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

