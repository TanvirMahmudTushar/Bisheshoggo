import { createGroq } from "@ai-sdk/groq"
import { streamText, convertToCoreMessages } from "ai"
import { createServerClient } from "@/lib/supabase/server"

export const maxDuration = 30

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    const { messages } = await req.json()

    console.log("[v0] AI Chat - Starting stream with Groq", {
      messageCount: messages.length,
      userId: user.id,
    })

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: `You are a compassionate and knowledgeable medical assistant for MediConnect, a healthcare platform serving rural areas in Bangladesh's Hill Tracts. 

Your responsibilities:
- Provide accurate, easy-to-understand medical information
- Help users understand symptoms and when to seek emergency care
- Offer guidance on medication, treatments, and preventive care
- Be culturally sensitive and consider limited healthcare access
- ALWAYS recommend professional medical consultation for serious symptoms
- Provide health statistics and insights when analyzing user health data

Important guidelines:
- Use simple language suitable for users with limited medical knowledge
- Consider rural context and limited access to healthcare facilities
- Emphasize when immediate medical attention is needed
- Provide practical home remedies for minor ailments
- Be empathetic and supportive

When asked about health data or patterns, provide insights with statistics.`,
      messages: convertToCoreMessages(messages),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] AI Chat Error:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
