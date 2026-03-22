import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  const supabase = createClient()
  const { error } = await supabase.from('contacts').insert({ name, email, message })

  if (error) {
    return NextResponse.json({ error: 'Failed to save contact' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
