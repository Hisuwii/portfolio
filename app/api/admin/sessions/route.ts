import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('messages')
    .select('session_id, content, created_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ sessions: [] })

  // Group by session_id, keep only the latest message per session
  const map = new Map<string, { session_id: string; last_message: string; last_time: string }>()
  for (const row of data ?? []) {
    if (!map.has(row.session_id)) {
      map.set(row.session_id, {
        session_id: row.session_id,
        last_message: row.content,
        last_time: row.created_at,
      })
    }
  }

  return NextResponse.json({ sessions: Array.from(map.values()) })
}
