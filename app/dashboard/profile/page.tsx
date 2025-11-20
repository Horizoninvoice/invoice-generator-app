import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/ui/Card'
import { BackButton } from '@/components/ui/BackButton'

import { FiUser, FiMail, FiAward, FiCalendar, FiMapPin, FiBuilding, FiGlobe } from '@/lib/icons'
import { formatDate } from '@/lib/utils'
import { getCurrencyByCountry } from '@/lib/currency'

// Fallback component (kept outside for cleaner dynamic import)
const FormFallback = () => (
  <div className="text-center py-8 text-red-500">Failed to load form. Please refresh.</div>
)

const FormLoading = () => (
  <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading form...</div>
)

// Dynamically loaded client wrapper
const ProfileFormWrapper = dynamic(
  () =>
    import('@/components/profile/ProfileFormWrapper').catch(() => ({
      default: FormFallback,
    })),
  { ssr: false, loading: FormLoading }
)

/* ---------------------------------------------------------
  Helper to fetch user + profile (best practice)
--------------------------------------------------------- */
async function getUserProfile() {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()

  if (!auth?.user) return { user: null, profile: null }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', auth.user.id)
    .single()

  return { user: auth.user, profile }
}

/* ---------------------------------------------------------
  PAGE COMPONENT
--------------------------------------------------------- */
export default async function ProfilePage() {
  const { user, profile } = await getUserProfile()

  if (!user) redirect('/login')

  const displayName = profile?.shop_name || user.email?.split('@')[0] || 'User'
  const initials = user.email?.slice(0, 2)?.toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-center gap-4 mb-8">
          <BackButton href="/dashboard" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* ---------- Profile Card ---------- */}
          <Card className="md:col-span-1">
            <div className="text-center">
              {profile?.logo_url ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-200 dark:border-primary-800 mx-auto mb-4">
                  <Image
                    src={profile.logo_url}
                    alt="Shop Logo"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {initials}
                </div>
              )}

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {displayName}
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>

              {profile && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium">
                  <FiAward size={14} />
                  {profile.role === 'max'
                    ? 'Max Account'
                    : profile.role === 'pro'
                    ? 'Pro Account'
                    : 'Free Account'}
                </div>
              )}
            </div>
          </Card>

          {/* ---------- Account Details ---------- */}
          <Card className="md:col-span-2" title="Account Information">
            <div className="space-y-6">

              <InfoItem
                icon={<FiUser size={20} />}
                title="User ID"
                value={<span className="font-mono">{user.id}</span>}
              />

              <InfoItem
                icon={<FiMail size={20} />}
                title="Email Address"
                value={user.email}
              />

              {profile && (
                <>
                  <InfoItem
                    icon={<FiAward size={20} />}
                    title="Account Type"
                    value={profile.role === 'max' ? 'Max (Lifetime)' : profile.role === 'pro' ? 'Pro (Monthly)' : 'Free'}
                    sub={
                      profile.subscription_type &&
                      (profile.subscription_type === 'max_lifetime'
                        ? 'Lifetime Access'
                        : profile.subscription_type === 'pro_monthly'
                        ? 'Monthly Subscription'
                        : 'Free Plan')
                    }
                  />

                  <InfoItem
                    icon={<FiCalendar size={20} />}
                    title="Member Since"
                    value={formatDate(profile.created_at)}
                  />

                  {profile.shop_name && (
                    <InfoItem
                      icon={<FiBuilding size={20} />}
                      title="Shop Name"
                      value={profile.shop_name}
                    />
                  )}

                  {profile.shop_email && (
                    <InfoItem
                      icon={<FiMail size={20} />}
                      title="Shop Email"
                      value={profile.shop_email}
                    />
                  )}

                  {profile.shop_address && (
                    <InfoItem
                      icon={<FiMapPin size={20} />}
                      title="Shop Address"
                      value={profile.shop_address}
                    />
                  )}

                  {profile.country && (
                    <InfoItem
                      icon={<FiGlobe size={20} />}
                      title="Country & Currency"
                      value={
                        <>
                          {profile.country}
                          {profile.currency && (
                            <>
                              {' • '}
                              {getCurrencyByCountry(profile.country).symbol} {profile.currency}
                            </>
                          )}
                        </>
                      }
                    />
                  )}
                </>
              )}
            </div>
          </Card>
        </div>

        {/* ---------- Shop Settings ---------- */}
        <Card title="Shop Settings">
          <ProfileFormWrapper profile={profile ?? {}} />
        </Card>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------
  Reusable Information Block Component
--------------------------------------------------------- */
function InfoItem({ icon, title, value, sub }: { icon: React.ReactNode; title: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
        <div className="text-primary-600 dark:text-primary-400">{icon}</div>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{value}</p>
        {sub && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{sub}</p>
        )}
      </div>
    </div>
  )
}
