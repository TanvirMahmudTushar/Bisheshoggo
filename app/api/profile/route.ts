import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (profileError) throw profileError

    // Get additional data based on user type
    let additionalData = null
    if (profile.user_type === "patient") {
      const { data } = await supabase.from("patients").select("*").eq("user_id", user.id).single()
      additionalData = data
    } else if (profile.user_type === "doctor" || profile.user_type === "community_health_worker") {
      const { data } = await supabase.from("healthcare_providers").select("*").eq("user_id", user.id).single()
      additionalData = data
    }

    return NextResponse.json({ profile, additionalData })
  } catch (error) {
    console.error("[v0] Get profile error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { profile, patientData, providerData } = body

    // Update profile
    const { error: profileError } = await supabase.from("profiles").update(profile).eq("user_id", user.id)

    if (profileError) throw profileError

    // Update type-specific data
    if (patientData) {
      const { error } = await supabase.from("patients").upsert({ user_id: user.id, ...patientData })

      if (error) throw error
    }

    if (providerData) {
      const { error } = await supabase.from("healthcare_providers").upsert({ user_id: user.id, ...providerData })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update profile error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
