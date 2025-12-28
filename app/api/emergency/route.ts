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
    const { location, latitude, longitude, emergency_type, description, status } = body

    const { data, error } = await supabase
      .from("emergency_sos")
      .insert({
        patient_id: user.id,
        emergency_type: emergency_type || "medical",
        location_latitude: latitude,
        location_longitude: longitude,
        location_address: location,
        description: description || "",
        status: status || "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Emergency SOS error:", error)
    return NextResponse.json({ error: "Failed to create emergency alert" }, { status: 500 })
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
      .from("emergency_sos")
      .select(`
        *,
        patient:patient_id(id, full_name, phone, avatar_url)
      `)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("[v0] Database error:", error)
      throw error
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] Get emergencies error:", error)
    return NextResponse.json({ error: "Failed to fetch emergencies" }, { status: 500 })
  }
}
