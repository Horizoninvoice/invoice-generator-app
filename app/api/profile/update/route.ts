import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrencyByCountry } from '@/lib/currency'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { shop_name, shop_address, shop_email, country } = body

    // Auto-update currency based on country
    let updateData: any = {
      shop_name,
      shop_address,
      shop_email,
      country,
    }

    if (country) {
      const currency = getCurrencyByCountry(country)
      updateData.currency = currency.code
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key]
      }
    })

    // Update or insert profile
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existingProfile) {
      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', user.id)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          ...updateData,
          role: 'free',
        })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 })
  }
}

