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
    const { symptoms, severity, duration, diagnosis, recommendations } = body

    // Insert symptom check with correct field names
    const { data, error } = await supabase
      .from("symptom_checks")
      .insert({
        user_id: user.id,
        symptoms: symptoms.split(", "), // Convert string to array
        severity,
        duration,
        additional_notes: recommendations,
        recommendations: diagnosis,
        suggested_conditions: [],
        synced: true,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Symptom check error:", error)
    return NextResponse.json({ error: "Failed to save symptom check" }, { status: 500 })
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
      .from("symptom_checks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("[v0] Database error:", error)
      throw error
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] Get symptom checks error:", error)
    return NextResponse.json({ error: "Failed to fetch symptom checks" }, { status: 500 })
  }
}
