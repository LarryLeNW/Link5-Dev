import accountApiRequest from '@/apiRequests/account'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import ProfileForm from '@/app/(main-layout)/me/profile-form'

export const metadata: Metadata = {
  title: 'Hồ sơ người dùng'
}

export default async function MeProfile() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')
  // Vì dùng cookie nên api này không được cached trên server
  // https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#opting-out-of-data-caching

  const result = await accountApiRequest.me(sessionToken?.value ?? '')
  console.log("🚀 ~ MeProfile ~ result:", result)
  return (
    <div>
      <h1>Profile</h1>
      <ProfileForm profile={result.payload.data} />
    </div>
  )
}
