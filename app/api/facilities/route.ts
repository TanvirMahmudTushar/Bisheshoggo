import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const district = searchParams.get("district")

    let query = supabase.from("medical_facilities").select("*").eq("is_active", true)

    if (type && type !== "all") {
      query = query.eq("facility_type", type)
    }

    if (district && district !== "all") {
      query = query.eq("district", district)
    }

    const { data, error } = await query.order("name")

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] Get facilities error:", error)
    return NextResponse.json({ error: "Failed to fetch facilities" }, { status: 500 })
  }
}
