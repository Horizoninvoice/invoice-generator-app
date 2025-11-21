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
              Terms & Conditions
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="p-8 prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. About the Service</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Horizon Invoice Generator ("Horizon") is an online invoicing platform that allows users to create, manage, and export invoices. The service is available under Free, Pro Monthly, and Max Lifetime plans.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Eligibility</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You must be at least 18 years old to use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. User Accounts</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You agree to provide accurate information during signup. You are responsible for maintaining the confidentiality of your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Subscription & Payments</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Paid plans (Pro & Max) are billed through Razorpay. Pricing is listed in INR on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Refund Policy</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Digital subscriptions are non-refundable once activated, except in cases of double charge or technical failure. See full <a href="/refund" className="text-primary-600 dark:text-primary-400 hover:underline">Refund Policy</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Usage Restrictions</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You agree not to misuse the platform, attempt unauthorized access, or engage in malicious activity.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Intellectual Property</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                All content, templates, branding, and platform features belong to Horizon Invoice Generator.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Termination</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We reserve the right to suspend or terminate accounts that violate policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Governing Law</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                These Terms are governed by the laws of India.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Contact</h2>
              <p className="text-gray-600 dark:text-gray-400">
                For support or queries, contact us at:{' '}
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
