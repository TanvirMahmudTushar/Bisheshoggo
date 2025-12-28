/**
 * Legacy Supabase server client - now using FastAPI backend
 * This file is kept for backward compatibility but returns null
 */

export async function createServerClient() {
  console.warn("Supabase server client is deprecated. Use the FastAPI backend via lib/api/client.ts")
  return null
}

export async function createClient() {
  return createServerClient()
}
