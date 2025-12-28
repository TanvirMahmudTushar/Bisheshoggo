import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FacilitiesContent } from "@/components/facilities/facilities-content"

export default async function FacilitiesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch all medical facilities
  const { data: facilities } = await supabase.from("medical_facilities").select("*").order("name")

  return <FacilitiesContent facilities={facilities || []} />
}
