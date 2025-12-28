import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const specialization = searchParams.get("specialization")

    let query = supabase
      .from("healthcare_providers")
      .select(`
        *,
        profile:profiles(full_name, email, phone_number, avatar_url)
      `)
      .eq("is_available", true)

    if (specialization && specialization !== "all") {
      query = query.eq("specialization", specialization)
    }

    const { data, error } = await query.order("profile(full_name)")

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] Get providers error:", error)
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 })
  }
}
