"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/api/auth-context"
import { ProfileContent } from "@/components/profile/profile-content"
import { profileApi } from "@/lib/api/client"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [roleProfile, setRoleProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
      return
    }

    if (user) {
      // Fetch profile data from FastAPI backend
      const fetchProfile = async () => {
        try {
          const response = await profileApi.getProfile()
          // The API returns { profile: User, additionalData: any }
          setProfile(response.profile || response)
          setRoleProfile(response.additionalData || response.profile || response)
        } catch (error) {
          console.error("Error fetching profile:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchProfile()
    }
  }, [user, isLoading, router])

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <ProfileContent user={user} profile={profile} roleProfile={roleProfile} />
}
