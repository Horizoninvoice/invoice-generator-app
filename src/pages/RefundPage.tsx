import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Refund & Cancellation Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="p-8 prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">1. Subscription Refunds</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                All subscriptions (Pro Monthly & Max Lifetime) are digital services and are generally non-refundable once activated.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Refunds are only allowed in the following cases:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Duplicate payment</li>
                <li>Payment charged but subscription not activated</li>
                <li>Technical issues preventing access to service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">2. Cancellation Policy</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Pro Monthly subscription can be cancelled anytime. After cancellation, access remains active until the end of the billing cycle.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Max Lifetime purchase is a one-time payment and cannot be cancelled once processed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">3. How to Request a Refund</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Email us at <a href="mailto:horizoninvoicegen@gmail.com" className="text-primary-600 dark:text-primary-400 hover:underline">horizoninvoicegen@gmail.com</a> with:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Payment ID</li>
                <li>Registered email</li>
                <li>Issue details</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Refunds are processed within 7–10 business days after verification.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">4. No Shipping Policy</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Horizon Invoice Generator is a digital SaaS product. No physical items are shipped.
              </p>
            </section>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

