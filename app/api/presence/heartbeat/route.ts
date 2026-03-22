import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@/auth'

export async function POST() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const { error } = await supabase
    .from('owner_presence')
    .update({ status: 'online', last_seen: new Date().toISOString() })
    .eq('id', 1)

  if (error) {
    return NextResponse.json({ error: 'Failed to update presence' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
