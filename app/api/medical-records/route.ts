import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { record_type, title, description, diagnosis, prescriptions, attachments, provider_id, consultation_id } =
      body

    const { data, error } = await supabase
      .from("medical_records")
      .insert({
        patient_id: user.id,
        provider_id,
        consultation_id,
        record_type,
        title,
        description,
        diagnosis,
        prescriptions,
        attachments,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Create medical record error:", error)
    return NextResponse.json({ error: "Failed to create medical record" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("medical_records")
      .select(`
        *,
        provider:profiles!medical_records_provider_id_fkey(full_name)
      `)
      .eq("patient_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] Get medical records error:", error)
    return NextResponse.json({ error: "Failed to fetch medical records" }, { status: 500 })
  }
}
