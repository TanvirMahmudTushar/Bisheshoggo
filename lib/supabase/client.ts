/**
 * Legacy Supabase client - now using FastAPI backend
 * This file is kept for backward compatibility but returns null
 */

// Export null since we're now using FastAPI backend
export const supabase = null

export function createClient() {
  console.warn("Supabase client is deprecated. Use the FastAPI backend via lib/api/client.ts")
  return null
}
