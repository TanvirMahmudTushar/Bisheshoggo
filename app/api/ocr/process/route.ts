import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { image } = await request.json()

    // In a production environment, you would use Tesseract.js or a cloud OCR service
    // For now, we'll simulate OCR processing with a mock response
    // In production, you could use: Google Cloud Vision, AWS Textract, or Tesseract.js

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock extracted data - in production this would come from actual OCR
    const extractedData = {
      doctorName: "Dr. Rahman Ahmed",
      date: new Date().toLocaleDateString("en-GB"),
      diagnosis: "Upper Respiratory Tract Infection",
      medicines: [
        {
          name: "Amoxicillin 500mg",
          dosage: "500mg",
          frequency: "3 times daily",
          duration: "7 days",
        },
        {
          name: "Paracetamol 500mg",
          dosage: "500mg",
          frequency: "As needed for fever",
          duration: "5 days",
        },
        {
          name: "Cetirizine 10mg",
          dosage: "10mg",
          frequency: "Once daily at bedtime",
          duration: "5 days",
        },
      ],
      rawText: `Dr. Rahman Ahmed
MBBS, MD (Medicine)
Reg. No: 12345

Date: ${new Date().toLocaleDateString("en-GB")}

Patient Name: [Patient Name]
Age: 35 years

Diagnosis: Upper Respiratory Tract Infection

Rx:
1. Tab Amoxicillin 500mg - 1+1+1 (After meals) - 7 days
2. Tab Paracetamol 500mg - SOS (for fever) - 5 days
3. Tab Cetirizine 10mg - 0+0+1 (At bedtime) - 5 days

General Instructions:
- Take medicines regularly
- Drink plenty of fluids
- Rest adequately
- Follow up if symptoms persist

Dr. Rahman Ahmed
Signature`,
    }

    return NextResponse.json(extractedData)
  } catch (error) {
    console.error("[v0] OCR processing error:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}
