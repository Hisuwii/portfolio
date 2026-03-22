import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Keepalive endpoint — called by Vercel cron every 3 days to prevent Supabase from pausing
export async function GET() {
  const supabase = createClient()
  await supabase.from('owner_presence').select('id').eq('id', 1).single()
  return NextResponse.json({ ok: true })
}
