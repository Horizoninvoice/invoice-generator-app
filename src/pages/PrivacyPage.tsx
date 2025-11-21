import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="p-8 prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Horizon Invoice Generator ("Horizon", "we", "our") is committed to protecting your privacy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Email address</li>
                <li>Business information (shop name, address, logo)</li>
                <li>Payment information (processed securely via Razorpay)</li>
                <li>Invoice, product, and customer data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>To provide invoicing services</li>
                <li>To manage your account and subscription</li>
                <li>To send necessary service notifications</li>
                <li>To improve platform performance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Data Storage</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                All data is securely stored on Supabase servers hosted in secure data centers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Payment Information</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We do not store any card or payment details. Payments are processed by Razorpay.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Cookies</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We use cookies for authentication and performance optimization.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Sharing of Data</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We do not sell or share personal data with third parties, except payment processors.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Data Security</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We use encryption and secure frameworks to protect your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Your Rights</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You may request deletion or export of your account data by emailing support.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Contact</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Email: <a href="mailto:horizoninvoicegen@gmail.com" className="text-primary-600 dark:text-primary-400 hover:underline">horizoninvoicegen@gmail.com</a>
              </p>
            </section>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
