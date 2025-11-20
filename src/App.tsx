import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { lazy, Suspense } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const SignupPage = lazy(() => import('./pages/auth/SignupPage'))
const ConfirmEmailPage = lazy(() => import('./pages/auth/ConfirmEmailPage'))
const ResendConfirmationPage = lazy(() => import('./pages/auth/ResendConfirmationPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const InvoicesPage = lazy(() => import('./pages/invoices/InvoicesPage'))
const CreateInvoicePage = lazy(() => import('./pages/invoices/CreateInvoicePage'))
const InvoiceDetailPage = lazy(() => import('./pages/invoices/InvoiceDetailPage'))
const EditInvoicePage = lazy(() => import('./pages/invoices/EditInvoicePage'))
const CustomersPage = lazy(() => import('./pages/customers/CustomersPage'))
const CreateCustomerPage = lazy(() => import('./pages/customers/CreateCustomerPage'))
const CustomerDetailPage = lazy(() => import('./pages/customers/CustomerDetailPage'))
const EditCustomerPage = lazy(() => import('./pages/customers/EditCustomerPage'))
const ProductsPage = lazy(() => import('./pages/products/ProductsPage'))
const CreateProductPage = lazy(() => import('./pages/products/CreateProductPage'))
const ProductDetailPage = lazy(() => import('./pages/products/ProductDetailPage'))
const EditProductPage = lazy(() => import('./pages/products/EditProductPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'))
const ReportsPage = lazy(() => import('./pages/reports/ReportsPage'))
const PaymentSuccessPage = lazy(() => import('./pages/payment/PaymentSuccessPage'))
const PaymentCancelPage = lazy(() => import('./pages/payment/PaymentCancelPage'))

const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
)

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/confirm-email" element={<ConfirmEmailPage />} />
            <Route path="/auth/resend-confirmation" element={<ResendConfirmationPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <ProtectedRoute>
                  <InvoicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/create"
              element={
                <ProtectedRoute>
                  <CreateInvoicePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/:id"
              element={
                <ProtectedRoute>
                  <InvoiceDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/:id/edit"
              element={
                <ProtectedRoute>
                  <EditInvoicePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <CustomersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers/create"
              element={
                <ProtectedRoute>
                  <CreateCustomerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers/:id"
              element={
                <ProtectedRoute>
                  <CustomerDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers/:id/edit"
              element={
                <ProtectedRoute>
                  <EditCustomerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/create"
              element={
                <ProtectedRoute>
                  <CreateProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProtectedRoute>
                  <ProductDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id/edit"
              element={
                <ProtectedRoute>
                  <EditProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscription"
              element={
                <ProtectedRoute>
                  <SubscriptionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/success"
              element={
                <ProtectedRoute>
                  <PaymentSuccessPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/cancel"
              element={
                <ProtectedRoute>
                  <PaymentCancelPage />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

