import { createBrowserClient } from "@supabase/ssr"

let clientInstance: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
  // Return existing instance if available
  if (clientInstance) {
    return clientInstance
  }

  // Only create on client-side
  if (typeof window === "undefined") {
    throw new Error("createClient should only be called on the client side")
  }

  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  // Create and cache the client instance
  clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)

  return clientInstance
}

export const supabase = typeof window !== "undefined" ? createClient() : null
