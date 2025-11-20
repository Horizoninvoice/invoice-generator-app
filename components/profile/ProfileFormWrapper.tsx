'use client'

import { EditProfileForm } from './EditProfileForm'

interface ProfileFormWrapperProps {
  profile: {
    logo_url?: string
    shop_name?: string
    shop_address?: string
    shop_email?: string
    country?: string
    currency?: string
  }
}

export function ProfileFormWrapper({ profile }: ProfileFormWrapperProps) {
  return <EditProfileForm profile={profile} />
}

