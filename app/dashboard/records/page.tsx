import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MedicalRecordsContent } from "@/components/records/medical-records-content"

export default async function MedicalRecordsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch medical records
  const { data: records } = await supabase
    .from("medical_records")
    .select("*, provider:provider_id(full_name)")
    .eq("patient_id", user.id)
    .order("record_date", { ascending: false })

  return <MedicalRecordsContent userId={user.id} records={records || []} />
}
