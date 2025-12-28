"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/api/auth-context"
import { EmergencyContent } from "@/components/emergency/emergency-content"
import { profileApi, emergencyApi } from "@/lib/api/client"

export default function EmergencyPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [patientProfile, setPatientProfile] = useState<any>(null)
  const [activeEmergencies, setActiveEmergencies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
      return
    }

    if (user) {
      const fetchData = async () => {
        try {
          // Fetch profile
          const response = await profileApi.getProfile()
          const profileData = response.profile || response
          setProfile(profileData)
          setPatientProfile(response.additionalData || profileData)

          // Fetch active emergencies
          const emergencyData = await emergencyApi.getAll()
          const emergencies = emergencyData.data || []
          const active = emergencies.filter(
            (e: any) => e.status === "active" || e.status === "responded"
          )
          setActiveEmergencies(active)
        } catch (error) {
          console.error("Error fetching data:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
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

  return (
    <EmergencyContent
      userId={user.id}
      profile={profile}
      patientProfile={patientProfile}
      activeEmergencies={activeEmergencies}
    />
  )
}
