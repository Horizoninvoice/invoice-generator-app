import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/ui/Card'
import { BackButton } from '@/components/ui/BackButton'
import { FiUser, FiMail, FiAward, FiCalendar, FiMapPin, FiBuilding, FiGlobe } from '@/lib/icons'
import { formatDate } from '@/lib/utils'
import { getCurrencyByCountry } from '@/lib/currency'
import Image from 'next/image'

// Dynamically import client component
const EditProfileForm = dynamic(
  () => import('@/components/profile/EditProfileForm'),
  { 
    ssr: false,
    loading: () => <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading form...</div>
  }
)

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const userInitials = user.email
    ? user.email.substring(0, 2).toUpperCase()
    : 'U'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <BackButton href="/dashboard" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <div className="text-center">
              {profile?.logo_url ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-200 dark:border-primary-800 mx-auto mb-4 bg-white dark:bg-gray-800">
                  <Image
                    src={profile.logo_url}
                    alt="Shop Logo"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {userInitials}
                </div>
              )}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {profile?.shop_name || user.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>
              {profile && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium">
                  <FiAward size={14} />
                  {profile.role === 'max' ? 'Max Account' : profile.role === 'pro' ? 'Pro Account' : 'Free Account'}
                </div>
              )}
            </div>
          </Card>

          {/* Account Details */}
          <Card className="md:col-span-2" title="Account Information">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <FiUser className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">User ID</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{user.id}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email Address</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              </div>

              {profile && (
                <>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <FiAward className="text-primary-600 dark:text-primary-400" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Account Type</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {profile.role === 'max' ? 'Max (Lifetime)' : profile.role === 'pro' ? 'Pro (Monthly)' : 'Free'}
                      </p>
                      {profile.subscription_type && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {profile.subscription_type === 'max_lifetime' ? 'Lifetime Access' : 
                           profile.subscription_type === 'pro_monthly' ? 'Monthly Subscription' : 
                           'Free Plan'}
                        </p>
                      )}
                      {profile.subscription_status && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Status: {profile.subscription_status}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <FiCalendar className="text-primary-600 dark:text-primary-400" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Member Since</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(profile.created_at)}
                      </p>
                    </div>
                  </div>

                  {profile.shop_name && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                        <FiBuilding className="text-primary-600 dark:text-primary-400" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Shop Name</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{profile.shop_name}</p>
                      </div>
                    </div>
                  )}

                  {profile.shop_email && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                        <FiMail className="text-primary-600 dark:text-primary-400" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Shop Email</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{profile.shop_email}</p>
                      </div>
                    </div>
                  )}

                  {profile.shop_address && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                        <FiMapPin className="text-primary-600 dark:text-primary-400" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Shop Address</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{profile.shop_address}</p>
                      </div>
                    </div>
                  )}

                  {profile.country && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                        <FiGlobe className="text-primary-600 dark:text-primary-400" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Country & Currency</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {profile.country}
                          {profile.currency && (
                            <> • {getCurrencyByCountry(profile.country).symbol} {profile.currency}</>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Shop Settings */}
        <Card title="Shop Settings">
          <EditProfileForm profile={profile || {}} />
        </Card>
      </div>
    </div>
  )
}

