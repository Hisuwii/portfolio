import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isOwnerOnline } from '@/lib/presence'
import { getAIReply } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  const { session_id, content } = await req.json()

  if (!session_id || !content) {
    return NextResponse.json({ error: 'Missing session_id or content' }, { status: 400 })
  }

  const supabase = createClient()

  // Save visitor message
  const { error: insertError } = await supabase.from('messages').insert({
    session_id,
    role: 'visitor',
    content,
  })

  if (insertError) {
    console.error('[chat/send] ❌ Failed to save visitor message:', insertError)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }

  console.log('[chat/send] ✅ Visitor message saved')

  // Check presence
  const ownerOnline = await isOwnerOnline()
  console.log('[chat/send] Owner online:', ownerOnline)

  if (!ownerOnline) {
    try {
      const { data: history, error: histError } = await supabase
        .from('messages')
        .select('role, content')
        .eq('session_id', session_id)
        .order('created_at', { ascending: true })
        .limit(20)

      if (histError) console.error('[chat/send] ❌ History fetch error:', histError)
      console.log('[chat/send] 📜 History length:', history?.length)

      console.log('[chat/send] 🤖 Calling Groq...')
      const aiReply = await getAIReply(history ?? [])
      console.log('[chat/send] 🤖 Groq replied:', aiReply?.slice(0, 80))

      if (!aiReply?.trim()) {
        console.warn('[chat/send] ⚠️ Empty reply — saving fallback')
        await supabase.from('messages').insert({
          session_id,
          role: 'ai',
          content: "Ivan's a bit busy right now but he'll personally follow up with you soon!",
        })
        return NextResponse.json({ ok: true })
      }

      const { error: aiInsertError } = await supabase.from('messages').insert({
        session_id,
        role: 'ai',
        content: aiReply,
      })

      if (aiInsertError) {
        console.error('[chat/send] ❌ Failed to save AI reply:', aiInsertError)
      } else {
        console.log('[chat/send] ✅ AI reply saved')
      }
    } catch (err) {
      console.error('[chat/send] ❌ Groq error:', err)
      await supabase.from('messages').insert({
        session_id,
        role: 'ai',
        content: "Ivan's a bit busy right now but he'll personally follow up with you soon!",
      })
    }
  } else {
    console.log('[chat/send] ℹ️ Owner is online — skipping AI reply')
  }

  return NextResponse.json({ ok: true })
}
