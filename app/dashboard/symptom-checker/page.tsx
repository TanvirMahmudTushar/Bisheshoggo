import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SymptomCheckerContent } from "@/components/symptom-checker/symptom-checker-content"

export default async function SymptomCheckerPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch symptom check history
  const { data: symptomHistory } = await supabase
    .from("symptom_checks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return <SymptomCheckerContent userId={user.id} symptomHistory={symptomHistory || []} />
}
