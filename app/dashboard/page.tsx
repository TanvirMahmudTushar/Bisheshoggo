import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch patient profile if user is a patient
  let patientProfile = null
  if (profile?.role === "patient") {
    const { data } = await supabase.from("patient_profiles").select("*").eq("id", user.id).single()
    patientProfile = data
  }

  // Fetch recent symptom checks
  const { data: recentSymptomChecks } = await supabase
    .from("symptom_checks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  // Fetch upcoming consultations
  const { data: upcomingConsultations } = await supabase
    .from("consultations")
    .select("*, provider:provider_id(full_name, avatar_url)")
    .eq("patient_id", user.id)
    .in("status", ["pending", "accepted", "in_progress"])
    .order("scheduled_at", { ascending: true })
    .limit(3)

  // Fetch medical records count
  const { count: recordsCount } = await supabase
    .from("medical_records")
    .select("*", { count: "exact", head: true })
    .eq("patient_id", user.id)

  return (
    <DashboardContent
      user={user}
      profile={profile}
      patientProfile={patientProfile}
      recentSymptomChecks={recentSymptomChecks || []}
      upcomingConsultations={upcomingConsultations || []}
      recordsCount={recordsCount || 0}
    />
  )
}
