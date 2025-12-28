import { createGroq } from "@ai-sdk/groq"
import { generateObject } from "ai"
import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const medicineSuggestionSchema = z.object({
  suggestions: z.array(
    z.object({
      medicine: z.string(),
      reason: z.string(),
      alternatives: z.array(z.string()),
      precautions: z.array(z.string()),
      interactions: z.array(z.string()),
      effectiveness: z.enum(["high", "moderate", "low"]),
    }),
  ),
  overallRecommendation: z.string(),
  warnings: z.array(z.string()),
})

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prescriptions, diagnosis, patientHistory } = await request.json()

    const { data: consultations } = await supabase
      .from("consultations")
      .select("diagnosis, prescription, symptoms")
      .eq("patient_id", user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(5)

    const { data: medicalRecords } = await supabase
      .from("medical_records")
      .select("title, description, record_type")
      .eq("patient_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)

    const consultationHistory = consultations
      ?.map(
        (c) =>
          `Diagnosis: ${c.diagnosis || "N/A"}\nSymptoms: ${c.symptoms || "N/A"}\nPrescription: ${c.prescription || "N/A"}`,
      )
      .join("\n\n")

    const recordHistory = medicalRecords
      ?.map((r) => `${r.record_type || "Record"}: ${r.title || ""}\n${r.description || ""}`)
      .join("\n\n")

    const historyContext = [consultationHistory, recordHistory].filter(Boolean).join("\n\n---\n\n")

    const prompt = `As a medical AI assistant, analyze the following prescription and provide detailed medicine suggestions.

Current Prescription:
${JSON.stringify(prescriptions, null, 2)}

Diagnosis: ${diagnosis || "Not specified"}

Patient Medical History:
${historyContext || "No previous records"}

Patient Information:
${patientHistory || "Not provided"}

Please provide:
1. Analysis of each prescribed medicine
2. Alternative medicine options (generic/local availability)
3. Important precautions and side effects
4. Potential drug interactions
5. Effectiveness assessment
6. Overall recommendations for rural Bangladesh context
7. Any warnings or concerns

Consider:
- Availability in rural Bangladesh
- Cost-effective alternatives
- Common side effects
- Drug interactions
- Suitable for limited medical facilities`

    const { object } = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: medicineSuggestionSchema,
      prompt,
    })

    return Response.json(object)
  } catch (error) {
    console.error("[v0] AI medicine suggestion error:", error)
    return Response.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}
