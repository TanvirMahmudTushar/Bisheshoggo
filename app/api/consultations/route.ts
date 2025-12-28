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
    const { provider_id, consultation_type, scheduled_at, symptoms, notes } = body

    const { data, error } = await supabase
      .from("consultations")
      .insert({
        patient_id: user.id,
        provider_id,
        consultation_type,
        scheduled_at,
        symptoms,
        notes,
        status: "pending",
      })
      .select(`
        *,
        provider:provider_id(id, full_name, avatar_url, role)
      `)
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Create consultation error:", error)
    return NextResponse.json({ error: "Failed to create consultation" }, { status: 500 })
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
      .from("consultations")
      .select(`
        *,
        patient:patient_id(id, full_name, avatar_url, role),
        provider:provider_id(id, full_name, avatar_url, role)
      `)
      .or(`patient_id.eq.${user.id},provider_id.eq.${user.id}`)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Database error:", error)
      throw error
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] Get consultations error:", error)
    return NextResponse.json({ error: "Failed to fetch consultations" }, { status: 500 })
  }
}
