import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { session_id, content } = await req.json()
  if (!session_id || !content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = createClient()
  const { error } = await supabase.from('messages').insert({
    session_id,
    role: 'owner',
    content,
  })

  if (error) return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
