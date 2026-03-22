import { createClient } from '@/lib/supabase/server'

const TIMEOUT_MS = parseInt(process.env.PRESENCE_TIMEOUT_MS ?? '120000')

export async function isOwnerOnline(): Promise<boolean> {
  const supabase = createClient()
  const { data } = await supabase
    .from('owner_presence')
    .select('last_seen, status')
    .eq('id', 1)
    .single()

  if (!data) return false

  const lastSeen = new Date(data.last_seen).getTime()
  const now = Date.now()
  const diff = now - lastSeen
  console.log(`[presence] last_seen ${Math.round(diff / 1000)}s ago, timeout ${TIMEOUT_MS / 1000}s`)
  return diff < TIMEOUT_MS
}
