import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="p-8 prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                By accessing and using Horizon Invoice Generator ("the Service"), you accept and agree to be bound 
                by the terms and provision of this agreement. If you do not agree to these terms, please do not use 
                the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Use License</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Permission is granted to temporarily use the Service for personal or commercial invoicing purposes. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose without explicit permission</li>
                <li>Attempt to reverse engineer any software contained in the Service</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Account Terms</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Maintaining the security of your account and password</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Subscription and Payment</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Subscription fees are charged in advance on a monthly or one-time basis. All fees are non-refundable 
                except as required by law. We reserve the right to change our pricing with 30 days notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Service Availability</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We strive to maintain high availability but do not guarantee uninterrupted access. The Service may 
                be unavailable due to maintenance, updates, or circumstances beyond our control.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                In no event shall Horizon Invoice Generator or its suppliers be liable for any damages arising out 
                of the use or inability to use the Service, even if we have been notified of the possibility of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Changes to Terms</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any material changes 
                via email or through the Service. Continued use after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Contact Information</h2>
              <p className="text-gray-600 dark:text-gray-400">
                For questions about these Terms of Service, please contact us at:{' '}
                <a href="mailto:horizoninvoicegen@gmail.com" className="text-primary-600 dark:text-primary-400 hover:underline">
                  horizoninvoicegen@gmail.com
                </a>
              </p>
            </section>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

