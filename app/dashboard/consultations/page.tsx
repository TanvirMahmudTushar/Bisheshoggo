import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ConsultationsContent } from "@/components/consultations/consultations-content"

export default async function ConsultationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch consultations based on user role
  let consultations
  if (profile?.role === "patient") {
    const { data } = await supabase
      .from("consultations")
      .select("*, provider:provider_id(id, full_name, avatar_url, role)")
      .eq("patient_id", user.id)
      .order("created_at", { ascending: false })
    consultations = data
  } else {
    const { data } = await supabase
      .from("consultations")
      .select("*, patient:patient_id(id, full_name, avatar_url, role)")
      .eq("provider_id", user.id)
      .order("created_at", { ascending: false })
    consultations = data
  }

  // Fetch available providers for booking
  const { data: providers } = await supabase
    .from("provider_profiles")
    .select("*, profiles!inner(id, full_name, avatar_url, role)")
    .eq("available_for_telemedicine", true)

  return (
    <ConsultationsContent
      userId={user.id}
      userRole={profile?.role || "patient"}
      consultations={consultations || []}
      providers={providers || []}
    />
  )
}
