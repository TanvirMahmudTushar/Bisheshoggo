import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileContent } from "@/components/profile/profile-content"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch role-specific profile
  let roleProfile = null
  if (profile?.role === "patient") {
    const { data } = await supabase.from("patient_profiles").select("*").eq("id", user.id).single()
    roleProfile = data
  } else if (profile?.role === "doctor" || profile?.role === "community_health_worker") {
    const { data } = await supabase.from("provider_profiles").select("*").eq("id", user.id).single()
    roleProfile = data
  }

  return <ProfileContent user={user} profile={profile} roleProfile={roleProfile} />
}
