import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EmergencyContent } from "@/components/emergency/emergency-content"

export default async function EmergencyPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch patient profile for emergency contact info
  let patientProfile = null
  if (profile?.role === "patient") {
    const { data } = await supabase.from("patient_profiles").select("*").eq("id", user.id).single()
    patientProfile = data
  }

  // Fetch active emergency SOS
  const { data: activeEmergencies } = await supabase
    .from("emergency_sos")
    .select("*")
    .eq("patient_id", user.id)
    .in("status", ["active", "responded"])
    .order("created_at", { ascending: false })

  return (
    <EmergencyContent
      userId={user.id}
      profile={profile}
      patientProfile={patientProfile}
      activeEmergencies={activeEmergencies || []}
    />
  )
}
